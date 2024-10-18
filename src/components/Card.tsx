// src/components/Card.tsx

import React from 'react';
import { Add as AddIcon } from '@mui/icons-material'; // Importing Material UI icon
import Link from 'next/link'; // Import Link for navigation

interface CardProps {
  title: string; // Text to display at the bottom of the card
  link: string; // URL for navigation
  
}

const Card: React.FC<CardProps> = ({ title, link }) => {
  return (
    <Link href={link} passHref className="relative bg-white rounded-lg shadow-lg flex flex-col justify-between items-center p-4 m-2 h-[200px] w-[170px] transition-transform transform hover:scale-110">
      {/* Top Right Dots */}
      <div className="absolute top-4 right-4 flex space-x-1">
        <div className="w-1 h-1 rounded-full bg-gray-400"></div>
        <div className="w-1 h-1 rounded-full bg-gray-400"></div>
        <div className="w-1 h-1 rounded-full bg-gray-400"></div>
      </div>

      {/* Plus Icon in the Center */}
      <div className="flex-grow flex items-center justify-center">
        <AddIcon className="text-blue-400 w-[120px] h-[100px]" />
      </div>

      {/* Text at the Bottom */}
      <p className="text-md text-gray-700 font-semibold text-center">{title}</p>
    </Link>
  );
};

export default Card;
