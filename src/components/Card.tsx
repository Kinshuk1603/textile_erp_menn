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


// use this later
// src/components/RectangularCard.tsx

// import React from 'react';
// import { Add as AddIcon } from '@mui/icons-material';
// import { MoreVert as MoreVertIcon } from '@mui/icons-material';
// import Link from 'next/link'; // Use Link from Next.js

// interface RectangularCardProps {
//   link: string; // Prop to receive the URL for the link
//   linkText: string; // Prop to receive the text for the link
// }

// const RectangularCard: React.FC<RectangularCardProps> = ({ link, linkText }) => {
//   return (
//     <Link
//       href={link} // Use Next.js Link
//       className="w-full h-40 bg-white rounded-lg shadow-md relative flex flex-col items-center justify-center p-4 transition-transform transform hover:scale-105 hover:shadow-lg"
//       style={{ textDecoration: 'none' }} // Remove underline
//     >
//       {/* Three Dot Icon */}
//       <div className="absolute top-2 right-2">
//         <MoreVertIcon className="text-gray-500" fontSize="small" />
//       </div>

//       {/* Plus Icon */}
//       <AddIcon className="text-blue-500 mb-4" style={{ fontSize: '48px' }} /> {/* Bigger Plus Icon */}

//       {/* Link Text at the Bottom */}
//       <span className="text-gray-700 uppercase text-lg hover:text-blue-600 transition-colors">
//         {linkText}
//       </span>
//     </Link>
//   );
// };

// export default RectangularCard;
