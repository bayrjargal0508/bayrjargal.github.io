// utils/filter.ts
export const isBlockedUrl = (url: string): boolean => {
  const blockedDomains = ['example-porn.com', 'socialmedia.com'];
  return blockedDomains.some(domain => url.includes(domain));
};
