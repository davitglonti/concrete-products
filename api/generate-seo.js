const MODELS = [
  "gemini-flash-lite-latest",
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-3.8-flash",
];

async function resolveImagePart(image) {
  if (!image || typeof image !== "string") return null;

  // Base64 Data URI (e.g. data:image/webp;base64,...)
  if (image.startsWith("data:image/")) {
    const match = image.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (match && match[2].length < 4_000_000) {
      return {
        inlineData: {
          mimeType: match[1],
          data: match[2],
        },
      };
    }
    return null;
  }

  // External HTTPS URL
  if (image.startsWith("https://") || image.startsWith("http://")) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    try {
      const res = await fetch(image, { signal: controller.signal });
      if (!res.ok) return null;
      const contentType = res.headers.get("content-type") || "image/jpeg";
      if (!contentType.startsWith("image/")) return null;
      const arrayBuf = await res.arrayBuffer();
      if (arrayBuf.byteLength > 3_000_000) return null;
      return {
        inlineData: {
          mimeType: contentType.split(";")[0],
          data: Buffer.from(arrayBuf).toString("base64"),
        },
      };
    } catch {
      return null;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return null;
}

async function callGemini(apiKey, model, parts) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
    apiKey
  )}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      throw new Error(`Gemini ${model} HTTP ${response.status}: ${errText.slice(0, 150)}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return JSON.parse(rawText);
  } finally {
    clearTimeout(timeoutId);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      success: false,
      message: "GEMINI_API_KEY is not configured in Vercel Environment Variables.",
    });
  }

  const {
    name,
    categoryLabel,
    dimensions,
    concreteGrade,
    frostResistance,
    surface,
    price,
    priceUnit,
    brandName,
    image,
  } = req.body || {};

  if (!name || !String(name).trim()) {
    return res.status(400).json({ success: false, message: "Product name is required." });
  }

  const imagePart = await resolveImagePart(image);
  const brand = brandName || "Naketobebi.GE";

  const prompt = `შენ ხარ ქართველი SEO სპეციალისტი და არქიტექტურული ბეტონის საწარმოს (${brand}) კოპირაიტერი.
მოცემული პროდუქტის მონაცემებზე${imagePart ? " და თანდართულ ფოტოზე" : ""} დაყრდნობით დააგენერირე უნიკალური, მაღალკონვერსიული SEO მეტა-ტეგები და აღწერა ქართულ ენაზე.
${imagePart ? "\nყურადღებით დაათვალიერე პროდუქტის ფოტო (ფორმა, ფერი, ფაქტურა, სტილი, დანიშნულება) და ბუნებრივად ასახე რეალური ვიზუალური დეტალები აღწერაში.\n" : ""}
პროდუქტის მონაცემები:
- დასახელება: ${name}
- კატეგორია: ${categoryLabel || "ბეტონის ნაკეთობა"}
- ზომები: ${dimensions || "სტანდარტული"}
- ბეტონის მარკა: ${concreteGrade || "B35"}
- ყინვაგამძლეობა: ${frostResistance || "F300"}
- ზედაპირი: ${surface || "არქიტექტურული"}
- ფასი: ${price ? `${price} ${priceUnit || "₾"}` : "შეთანხმებით"}
- ბრენდი: ${brand}

დააბრუნე მხოლოდ JSON ობიექტი შემდეგი ველებით:
{
  "metaTitle": "Google-ის სათაური ქართულად, მკაცრად 45-დან 60 სიმბოლომდე (ბოლოში | ${brand})",
  "metaDescription": "Google-ის აღწერა ქართულად, მკაცრად 130-დან 158 სიმბოლომდე. ახსენე ხარისხი, ფასი/მარკა და მიწოდება საქართველოში.",
  "metaKeywords": "7-9 საკვანძო სიტყვა მძიმით გამოყოფილი ქართულად (მაგ: დასახელება ფასი, თბილისი, საქართველო, არქიტექტურული ბეტონი)",
  "shortDesc": "მოკლე 1-წინადადებიანი აღწერა ბარათისთვის (70-115 სიმბოლო)",
  "description": "2-3 წინადადებიანი სრული, მიმზიდველი პროფესიონალური აღწერა პროდუქტის გვერდისთვის."
}`;

  const parts = imagePart ? [imagePart, { text: prompt }] : [{ text: prompt }];

  let lastError = null;
  for (const model of MODELS) {
    try {
      const result = await callGemini(apiKey, model, parts);
      const cleanTitle = String(result.metaTitle || "").trim().slice(0, 60);
      let cleanDesc = String(result.metaDescription || "").trim();
      if (cleanDesc.length > 160) {
        cleanDesc = cleanDesc.slice(0, 157).trim() + "...";
      }

      return res.status(200).json({
        success: true,
        model,
        usedVision: Boolean(imagePart),
        data: {
          metaTitle: cleanTitle,
          metaDescription: cleanDesc,
          metaKeywords: String(result.metaKeywords || "").trim(),
          shortDesc: String(result.shortDesc || "").trim(),
          description: String(result.description || "").trim(),
        },
      });
    } catch (err) {
      lastError = err;
    }
  }

  return res.status(502).json({
    success: false,
    message: lastError?.message || "Gemini API error",
  });
}
