import { useEffect } from "react";

/**
 * Universal SEO component that dynamically manages page Title, Meta Description,
 * Meta Keywords, OpenGraph (Facebook/WhatsApp/Telegram), Twitter Cards, Canonical URL,
 * and Schema.org JSON-LD Structured Data for search engines (Googlebot).
 */
export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  jsonLd,
}) {
  useEffect(() => {
    const brandName = "MONOLITH.GE";
    const defaultTitle = "MONOLITH.GE — არქიტექტურული ბეტონის ნაკეთობები საქართველოში";
    const fullTitle = title
      ? title.includes(brandName)
        ? title
        : `${title} | ${brandName}`
      : defaultTitle;

    // 1. Update Document Title
    document.title = fullTitle;

    // Helper: update or create <meta> tag
    const setMeta = (attrName, attrValue, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // 2. Standard Meta Tags
    if (description) {
      setMeta("name", "description", description);
    }
    if (keywords) {
      setMeta("name", "keywords", keywords);
    }

    const currentUrl = url || window.location.href;

    // 3. OpenGraph Tags (Facebook, Messenger, WhatsApp, Viber, LinkedIn)
    setMeta("property", "og:title", fullTitle);
    if (description) setMeta("property", "og:description", description);
    setMeta("property", "og:type", type);
    setMeta("property", "og:url", currentUrl);
    if (image) {
      setMeta("property", "og:image", image);
    }

    // 4. Twitter Card Tags
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    if (description) setMeta("name", "twitter:description", description);
    if (image) setMeta("name", "twitter:image", image);

    // 5. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", currentUrl.split("?")[0]); // clean canonical without query params

    // 6. Schema.org JSON-LD Structured Data
    const scriptId = "dynamic-page-jsonld";
    let scriptTag = document.getElementById(scriptId);
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.id = scriptId;
        scriptTag.type = "application/ld+json";
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    // Cleanup on unmount
    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) existingScript.remove();
    };
  }, [title, description, keywords, image, url, type, jsonLd]);

  return null;
}
