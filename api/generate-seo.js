const MODELS = ["gemini-3.8-flash", "gemini-3.8-flash-lite"];

async function callGemini(apiKey, model, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
    apiKey
  )}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`Gemini ${model} HTTP ${response.status}: ${errText.slice(0, 200)}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return JSON.parse(rawText);
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
  } = req.body || {};

  if (!name || !String(name).trim()) {
    return res.status(400).json({ success: false, message: "Product name is required." });
  }

  const brand = brandName || "Naketobebi.GE";
  const prompt = `შენ ხარ ქართველი SEO სპეციალისტი და არქიტექტურული ბეტონის საწარმოს (${brand}) კოპირაიტერი.
მოცემული პროდუქტის მონაცემებზე დაყრდნობით დააგენერირე უნიკალური, მაღალკონვერსიული SEO მეტა-ტეგები და აღწერა ქართულ ენაზე.

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

  let lastError = null;
  for (const model of MODELS) {
    try {
      const result = await callGemini(apiKey, model, prompt);
      const cleanTitle = String(result.metaTitle || "").trim().slice(0, 60);
      let cleanDesc = String(result.metaDescription || "").trim();
      if (cleanDesc.length > 160) {
        cleanDesc = cleanDesc.slice(0, 157).trim() + "...";
      }

      return res.status(200).json({
        success: true,
        model,
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
