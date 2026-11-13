import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://greencampus.edu';

  const routes = [
    '',
    '/calculator',
    '/labs',
    '/ewaste',
    '/leaderboard',
    '/reports',
    '/dashboard',
    '/about',
    '/sdg',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));
}
