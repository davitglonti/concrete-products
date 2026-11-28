const BASE_URL = "https://naketobebi.ge";

const escapeHtml = (str) =>
  String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function getStr(field) {
  return field?.stringValue || "";
}

function getNum(field) {
  if (!field) return "";
  return field.integerValue || field.doubleValue || field.stringValue || "";
}

export default async function handler(req, res) {
  const { id } = req.query;
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID || "concreteproducts-46cf3";
  const host = req.headers.host || "naketobebi.ge";
  const origin = `https://${host}`;

  let title = "Naketobebi.ge — არქიტექტურული ბეტონის ნაკეთობები";
  let description =
    "უმაღლესი ხარისხის არქიტექტურული და დეკორატიული ბეტონის ნაკეთობები საქართველოში.";
  let price = "";
  let brandName = "Naketobebi.GE";

  try {
    const [prodRes, settingsRes] = await Promise.all([
      id
        ? fetch(
            `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
              projectId
            )}/databases/(default)/documents/products/${encodeURIComponent(id)}`,
            { headers: { Accept: "application/json" } }
          )
        : Promise.resolve(null),
      fetch(
        `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
          projectId
        )}/databases/(default)/documents/site_settings/general`,
        { headers: { Accept: "application/json" } }
      ).catch(() => null),
    ]);

    if (settingsRes && settingsRes.ok) {
      const sDoc = await settingsRes.json();
      const sFields = sDoc.fields || {};
      const bName = getStr(sFields.brandName);
      const bSuffix = getStr(sFields.brandSuffix);
      if (bName) brandName = `${bName}${bSuffix}`;
    }

    if (prodRes && prodRes.ok) {
      const pDoc = await prodRes.json();
      const fields = pDoc.fields || {};
      const name = getStr(fields.name);
      const metaTitle = getStr(fields.metaTitle);
      const metaDesc = getStr(fields.metaDescription);
      const shortDesc = getStr(fields.shortDesc);
      const fullDesc = getStr(fields.description);
      const dimensions = getStr(fields.dimensions);
      const priceUnit = getStr(fields.priceUnit) || "₾";
      price = getNum(fields.price);

      if (name) {
        const priceLabel = price ? `${price} ${priceUnit}` : "";
        title = metaTitle || `${name}${priceLabel ? ` — ${priceLabel}` : ""} | ${brandName}`;

        const specs = [
          priceLabel ? `ფასი: ${priceLabel}` : "",
          dimensions ? `ზომები: ${dimensions}` : "",
        ]
          .filter(Boolean)
          .join(" • ");

        description =
          metaDesc ||
          [shortDesc || fullDesc, specs].filter(Boolean).join(" — ") ||
          `${name} — ${brandName}`;
      }
    }
  } catch (err) {
    console.error("product-og error:", err);
  }

  const pageUrl = `${BASE_URL}/products/${encodeURIComponent(id || "")}`;
  const ogImageUrl = `${origin}/api/og-image?id=${encodeURIComponent(id || "")}`;

  const html = `<!doctype html>
<html lang="ka">
  <head>
    <meta charset="UTF-8" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="product" />
    <meta property="og:locale" content="ka_GE" />
    <meta property="og:site_name" content="${escapeHtml(brandName)}" />
    <meta property="og:url" content="${escapeHtml(pageUrl)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(ogImageUrl)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(ogImageUrl)}" />
    <meta property="og:image:width" content="900" />
    <meta property="og:image:height" content="675" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(ogImageUrl)}" />
  </head>
  <body>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(description)}</p>
    <img src="${escapeHtml(ogImageUrl)}" alt="${escapeHtml(title)}" />
  </body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
  return res.status(200).send(html);
}
