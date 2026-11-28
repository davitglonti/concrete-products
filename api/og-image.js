const FALLBACK_OG_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&fm=webp&w=1200&q=80";

function getStr(field) {
  return field?.stringValue || "";
}

function getArrStrings(field) {
  const values = field?.arrayValue?.values;
  if (!Array.isArray(values)) return [];
  return values.map((v) => v?.stringValue).filter(Boolean);
}

export default async function handler(req, res) {
  const { id } = req.query;
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID || "concreteproducts-46cf3";

  if (!id) {
    return res.redirect(302, FALLBACK_OG_IMAGE);
  }

  try {
    const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
      projectId
    )}/databases/(default)/documents/products/${encodeURIComponent(id)}`;
    const response = await fetch(url, { headers: { Accept: "application/json" } });

    if (!response.ok) {
      return res.redirect(302, FALLBACK_OG_IMAGE);
    }

    const doc = await response.json();
    const fields = doc.fields || {};

    const metaImage = getStr(fields.metaImage);
    const cardImage = getStr(fields.cardImage);
    const images = getArrStrings(fields.images);
    const mainImage = getStr(fields.image);

    // Prefer real product photo or metaImage/cardImage
    const targetImage = metaImage || images[0] || mainImage || cardImage;

    if (!targetImage) {
      return res.redirect(302, FALLBACK_OG_IMAGE);
    }

    // If base64 data URI, decode and serve as real HTTPS image
    if (targetImage.startsWith("data:image/")) {
      const match = targetImage.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1];
        const buffer = Buffer.from(match[2], "base64");
        res.setHeader("Content-Type", mimeType);
        res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");
        return res.status(200).send(buffer);
      }
      return res.redirect(302, FALLBACK_OG_IMAGE);
    }

    // Otherwise redirect to the external HTTPS image URL
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.redirect(302, targetImage);
  } catch (err) {
    console.error("og-image error:", err);
    return res.redirect(302, FALLBACK_OG_IMAGE);
  }
}
