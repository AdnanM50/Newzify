import React from 'react';

interface Props {
  // add your props here
}

const Footer: React.FC<Props> = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-16">
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
              <li><a href="#" className="text-gray-300 hover:text-white">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Advertise</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">Facebook</a>
              <a href="#" className="text-gray-300 hover:text-white">Twitter</a>
              <a href="#" className="text-gray-300 hover:text-white">Instagram</a>
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