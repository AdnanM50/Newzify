import { Facebook, Twitter, Instagram, Youtube, Linkedin, Globe } from 'lucide-react';

export interface SocialLink {
  name: string;
  link: string;
}

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { name: 'Facebook', link: 'https://facebook.com/newzify' },
  { name: 'Twitter', link: 'https://x.com/newzify' },
  { name: 'Instagram', link: 'https://instagram.com/newzify' },
  { name: 'Youtube', link: 'https://youtube.com/@newzify' },
];

export const getSocialIcon = (name: string, className = "w-4 h-4") => {
  const lower = (name || '').toLowerCase();
  if (lower.includes('face')) return <Facebook className={className} />;
  if (lower.includes('twit') || lower.includes('x')) return <Twitter className={className} />;
  if (lower.includes('insta')) return <Instagram className={className} />;
  if (lower.includes('you') || lower.includes('tube')) return <Youtube className={className} />;
  if (lower.includes('link')) return <Linkedin className={className} />;
  return <Globe className={className} />;
};
