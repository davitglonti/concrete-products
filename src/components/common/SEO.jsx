import { useEffect } from "react";
import { useData } from "../../context/DataContext";

/**
 * Universal SEO component that dynamically manages page Title, Meta Description,
 * Meta Keywords, OpenGraph, Twitter Cards, Canonical URL, Google Verification,
 * and Schema.org JSON-LD Structured Data, reading overrides directly from Site Settings.
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
  const { siteSettings } = useData();
  const seoConfig = siteSettings?.seo || {};

  useEffect(() => {
    const brandName = siteSettings?.brandName || "MONOLITH.GE";
    const defaultTitle =
      seoConfig.siteTitle || `${brandName} — არქიტექტურული ბეტონის ნაკეთობები საქართველოში`;
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

    const finalDesc = description || seoConfig.siteDescription;
    const finalKeywords = keywords || seoConfig.keywords;
    const finalImage = image || seoConfig.ogImage;

    // 2. Standard Meta Tags
    if (finalDesc) setMeta("name", "description", finalDesc);
    if (finalKeywords) setMeta("name", "keywords", finalKeywords);

    // Google Search Console Verification Meta Tag
    if (seoConfig.googleVerification) {
      setMeta("name", "google-site-verification", seoConfig.googleVerification);
    }

    const currentUrl = url || window.location.href;

    // 3. OpenGraph Tags (Facebook, Messenger, WhatsApp, Viber, Telegram, LinkedIn)
    setMeta("property", "og:title", fullTitle);
    if (finalDesc) setMeta("property", "og:description", finalDesc);
    setMeta("property", "og:type", type);
    setMeta("property", "og:url", currentUrl);
    if (finalImage) setMeta("property", "og:image", finalImage);

    // 4. Twitter Card Tags
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    if (finalDesc) setMeta("name", "twitter:description", finalDesc);
    if (finalImage) setMeta("name", "twitter:image", finalImage);

    // 5. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", currentUrl.split("?")[0]);

    // 6. Google Analytics gtag injection if provided
    if (seoConfig.googleAnalyticsId && !document.getElementById("google-gtag-script")) {
      const gtagScript = document.createElement("script");
      gtagScript.id = "google-gtag-script";
      gtagScript.async = true;
      gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${seoConfig.googleAnalyticsId}`;
      document.head.appendChild(gtagScript);

      const inlineScript = document.createElement("script");
      inlineScript.id = "google-gtag-inline";
      inlineScript.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${seoConfig.googleAnalyticsId}');
      `;
      document.head.appendChild(inlineScript);
    }

    // 7. Schema.org JSON-LD Structured Data
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
  }, [title, description, keywords, image, url, type, jsonLd, siteSettings, seoConfig]);

  return null;
}
