import { useEffect } from 'react';
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME } from '../seo/site';
import type { JsonLd } from '../seo/schema';

export type SEOConfig = {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  jsonLd?: JsonLd;
  pageType?: 'website' | 'profile' | 'project' | 'service' | 'research' | 'article';
};

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let meta = document.head.querySelector<HTMLMetaElement>(selector);
  if (!meta) {
    meta = document.createElement('meta');
    document.head.appendChild(meta);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    meta?.setAttribute(key, value);
  });
}

function upsertLink(rel: string, href: string) {
  let link = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function upsertJsonLd(jsonLd?: JsonLd) {
  const id = 'route-json-ld';
  let script = document.getElementById(id) as HTMLScriptElement | null;

  if (!jsonLd) {
    script?.remove();
    return;
  }

  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(jsonLd).replaceAll('<', '\\u003c');
}

export function useSEO({ title, description, path, image, noindex = false, jsonLd, pageType = 'website' }: SEOConfig) {
  useEffect(() => {
    document.title = title;

    const canonicalUrl = absoluteUrl(path);
    const imageUrl = absoluteUrl(image ?? DEFAULT_OG_IMAGE);
    const ogType = pageType === 'article' ? 'article' : 'website';

    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertLink('canonical', canonicalUrl);
    upsertMeta('meta[name="robots"]', { name: 'robots', content: noindex ? 'noindex,nofollow' : 'index,follow' });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: ogType });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: imageUrl });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: imageUrl });
    upsertJsonLd(jsonLd);
  }, [description, image, jsonLd, noindex, pageType, path, title]);
}
