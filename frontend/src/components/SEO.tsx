import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEO({
  title = "Mystic Tarot | Professional Tarot Reading Services",
  description = "Get professional tarot readings for love, career, and life guidance. Expert tarot reader Dimple Chettri offers personalized insights via email. Book your reading today!",
  keywords = "tarot reading, love tarot, career guidance, life path reading, yes/no reading, remedy for healing, professional tarot reader, Dimple Chettri, tarot card reading, spiritual guidance",
  image = "/og-image.jpg",
  url = "https://tarotreader777.com",
  type = "website"
}: SEOProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Mystic Tarot",
    "description": description,
    "url": url,
    "telephone": "+91-98765-43210",
    "email": "scdcacademy@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Mumbai",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "19.0760",
      "longitude": "72.8777"
    },
    "openingHours": "Mo-Su 00:00-23:59",
    "serviceType": [
      "Love Tarot Reading",
      "Career Guidance",
      "Yes/No Reading",
      "Life Path Reading",
      "Custom Question",
      "Remedy for Healing"
    ],
    "provider": {
      "@type": "Person",
      "name": "Dimple Chettri",
      "jobTitle": "Professional Tarot Reader",
      "description": "Experienced tarot reader with over 10 years of experience providing spiritual guidance and insights.",
      "sameAs": [
        "https://www.instagram.com/tarot_reader_777",
        "https://youtube.com/@tarotreade"
      ]
    },
    "priceRange": "₹199-₹499",
    "paymentAccepted": "UPI, Bank Transfer",
    "currenciesAccepted": "INR"
  };

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        if (name.startsWith('og:') || name.startsWith('twitter:')) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic Meta Tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', 'Dimple Chettri');
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('language', 'English');
    updateMetaTag('geo.region', 'IN-MH');
    updateMetaTag('geo.placename', 'Mumbai');
    updateMetaTag('geo.position', '19.0760;72.8777');
    updateMetaTag('ICBM', '19.0760,72.8777');

    // Open Graph / Facebook
    updateMetaTag('og:type', type);
    updateMetaTag('og:url', url);
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', image);
    updateMetaTag('og:image:width', '1200');
    updateMetaTag('og:image:height', '630');
    updateMetaTag('og:site_name', 'Mystic Tarot');
    updateMetaTag('og:locale', 'en_IN');

    // Twitter
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:url', url);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:creator', '@tarot_reader_777');

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // Update hreflang links
    const updateHrefLang = (lang: string, href: string) => {
      let link = document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'alternate';
        (link as any).hreflang = lang;
        document.head.appendChild(link);
      }
      link.href = href;
    };

    updateHrefLang('en', url);
    updateHrefLang('x-default', url);

    // Update structured data
    let structuredDataScript = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      (structuredDataScript as any).type = 'application/ld+json';
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(structuredData);

    // Theme
    updateMetaTag('theme-color', '#D4AF37');
    updateMetaTag('msapplication-TileColor', '#D4AF37');

    return () => {
      // Cleanup if needed
    };
  }, [title, description, keywords, image, url, type, structuredData]);

  return null; // This component doesn't render anything
}
