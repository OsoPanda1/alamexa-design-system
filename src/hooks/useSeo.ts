import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getRouteByPath, type RouteMeta } from '@/config/routes';

export function useSeo(customMeta?: Partial<RouteMeta['seo']>) {
  const location = useLocation();
  const route = getRouteByPath(location.pathname);

  useEffect(() => {
    const seo = customMeta || route?.seo;
    if (!seo) return;

    // Update document title
    if (seo.title) {
      document.title = seo.title;
    }

    // Update meta description
    const descriptionMeta = document.querySelector<HTMLMetaElement>("meta[name='description']");
    if (descriptionMeta && seo.description) {
      descriptionMeta.content = seo.description;
    } else if (seo.description) {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = seo.description;
      document.head.appendChild(meta);
    }

    // Update meta keywords
    const keywordsMeta = document.querySelector<HTMLMetaElement>("meta[name='keywords']");
    if (keywordsMeta && seo.keywords) {
      keywordsMeta.content = seo.keywords.join(', ');
    } else if (seo.keywords) {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = seo.keywords.join(', ');
      document.head.appendChild(meta);
    }

    // Update canonical URL
    let canonicalLink = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (seo.canonical) {
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = seo.canonical;
    }

    // Update Open Graph tags
    updateOgTag('og:title', seo.title);
    updateOgTag('og:description', seo.description);
    if (seo.canonical) {
      updateOgTag('og:url', seo.canonical);
    }
  }, [location.pathname, customMeta, route]);

  return route;
}

function updateOgTag(property: string, content?: string) {
  if (!content) return;
  
  let ogTag = document.querySelector<HTMLMetaElement>(`meta[property='${property}']`);
  if (!ogTag) {
    ogTag = document.createElement('meta');
    ogTag.setAttribute('property', property);
    document.head.appendChild(ogTag);
  }
  ogTag.content = content;
}

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
