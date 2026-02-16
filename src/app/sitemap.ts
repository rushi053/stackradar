import type { MetadataRoute } from 'next';
import { getAllDomains, getAllComparisons, getAllAlternatives } from '@/data/seo-pages';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://stackradar.rushiraj.me';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // Homepage
  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  // Stack pages
  const stackPages = getAllDomains().map((domain) => ({
    url: `${SITE_URL}/stack/${domain}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Comparison pages
  const comparisonPages = getAllComparisons().map((slug) => ({
    url: `${SITE_URL}/compare/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Alternative pages
  const alternativePages = getAllAlternatives().map((tool) => ({
    url: `${SITE_URL}/alternatives/${tool}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...stackPages, ...comparisonPages, ...alternativePages];
}
