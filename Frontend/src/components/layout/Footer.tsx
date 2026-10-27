import React from 'react';
import { Link } from '@tanstack/react-router';
import { useFetch } from '../../helpers/hooks';
import { getPageSettings } from '../../helpers/backend';
import { DEFAULT_SOCIAL_LINKS, getSocialIcon, type SocialLink } from '../../helpers/social';

interface Props {
  // add your props here
}

const Footer: React.FC<Props> = () => {
  const hideForReporter = typeof window !== 'undefined' && window.location.pathname.startsWith('/reporter')
  if (hideForReporter) return null

  const { data: pageSettings } = useFetch<any>("page-settings", getPageSettings);

  const socialLinks: SocialLink[] = 
    pageSettings?.socialLinks && pageSettings.socialLinks.length > 0 
      ? pageSettings.socialLinks 
      : DEFAULT_SOCIAL_LINKS;

  return (
    <footer className="bg-gray-800 text-white py-8 ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-4 font-serif">THE VOICE OF NEWZIFY</h3>
            <p className="text-gray-300 text-sm">
              Your trusted source for breaking news and in-depth analysis.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Sections</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-white">Politics</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">World News</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Business</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Sports</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">About</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link from="/" to="/blog" params={{}} className="text-gray-300 hover:text-white">
                  Blogs
                </Link>
              </li>
              <li><a href="#" className="text-gray-300 hover:text-white">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Follow Us</h4>
            <div className="flex flex-wrap items-center gap-2.5">
              {socialLinks.map((s, idx) => (
                <a
                  key={idx}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.name}
                  className="w-8 h-8 rounded-full bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                >
                  {getSocialIcon(s.name, "w-4 h-4")}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; 2024 The Voice of newzify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;