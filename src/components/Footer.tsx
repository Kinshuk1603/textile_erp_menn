// src/components/Footer.tsx

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-300 text-white p-4 my-auto w-full">
      <div className="flex flex-row justify-around container my-auto text-center">
        <p className="text-white mb-2">
          <a href="mailto:info@yourcompany.com" className="hover:text-gray-700">
            info@conceptcreations.com
          </a>
        </p>
        <p className="text-white mb-2">Noorwala, Panipat, Haryana</p>
        <p className="text-2xl">© {new Date().getFullYear()} CONCEPT CREATIONS</p>
        <p className="text-white mb-4">
          <a href="tel:+1234567890" className="hover:text-gray-700">
            +91 567-890-1429
          </a>
        </p>
        <a href="/terms-and-conditions" className="text-white hover:text-gray-700">
          Terms and Conditions
        </a>
      </div>
    </footer>
  );
};

export default Footer;
