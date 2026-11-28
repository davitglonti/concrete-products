const BASE_URL = "https://naketobebi.ge";

const STATIC_ROUTES = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/products", changefreq: "daily", priority: "0.95" },
  { path: "/portfolio", changefreq: "weekly", priority: "0.85" },
  { path: "/about", changefreq: "monthly", priority: "0.85" },
  { path: "/contact", changefreq: "monthly", priority: "0.85" },
  { path: "/calculator", changefreq: "weekly", priority: "0.85" },
  { path: "/faq", changefreq: "weekly", priority: "0.8" },
  { path: "/blog", changefreq: "weekly", priority: "0.85" },
];

const BLOG_SLUGS = [
  "how-to-choose-exterior-concrete-steps",
  "concrete-maintenance-and-hydrophobization",
  "m500-concrete-fiber-reinforcement",
  "large-format-pavers-landscape-design",
];

const FALLBACK_PRODUCT_IDS = [
  "prod-1",
  "prod-2",
  "prod-3",
  "prod-4",
  "prod-5",
  "prod-6",
  "prod-7",
  "prod-8",
  "prod-9",
  "prod-10",
  "prod-11",
];

const escapeXml = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

async function fetchFirestoreCollection(projectId, collectionName) {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
      projectId
    )}/databases/(default)/documents/${collectionName}?pageSize=200`;
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return [];
    const data = await response.json();
    if (!Array.isArray(data.documents)) return [];
    return data.documents
      .map((doc) => {
        const id = doc.name ? doc.name.split("/").pop() : null;
        const lastmod = doc.updateTime
          ? doc.updateTime.split("T")[0]
          : new Date().toISOString().split("T")[0];
        return id ? { id, lastmod } : null;
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

export default async function handler(req, res) {
  const projectId =
    process.env.VITE_FIREBASE_PROJECT_ID || "concreteproducts-46cf3";
  const today = new Date().toISOString().split("T")[0];

  const [remoteProducts, remoteProjects] = await Promise.all([
    fetchFirestoreCollection(projectId, "products"),
    fetchFirestoreCollection(projectId, "projects"),
  ]);

  const productItems =
    remoteProducts.length > 0
      ? remoteProducts
      : FALLBACK_PRODUCT_IDS.map((id) => ({ id, lastmod: today }));

  const urls = [];

  for (const route of STATIC_ROUTES) {
    urls.push({
      loc: `${BASE_URL}${route.path}`,
      lastmod: today,
      changefreq: route.changefreq,
      priority: route.priority,
    });
  }

  for (const prod of productItems) {
    urls.push({
      loc: `${BASE_URL}/products/${encodeURIComponent(prod.id)}`,
      lastmod: prod.lastmod || today,
      changefreq: "weekly",
      priority: "0.9",
    });
  }

  for (const proj of remoteProjects) {
    urls.push({
      loc: `${BASE_URL}/portfolio/${encodeURIComponent(proj.id)}`,
      lastmod: proj.lastmod || today,
      changefreq: "monthly",
      priority: "0.8",
    });
  }

  for (const slug of BLOG_SLUGS) {
    urls.push({
      loc: `${BASE_URL}/blog/${slug}`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.8",
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${escapeXml(u.lastmod)}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );
  res.status(200).send(xml);
}
