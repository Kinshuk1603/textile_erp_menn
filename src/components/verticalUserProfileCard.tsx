// src/components/UserProfileCard.tsx

import React from 'react';
import { Button, Divider } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import Image from 'next/image'; // Import Next.js Image component

interface UserProfileCardProps {
  name: string;
  title: string;
  email: string;
  profileImage: string;
  additionalInfo: string;
  date: string;
  time: string;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  name,
  title,
  email,
  profileImage,
  additionalInfo,
  date,
  time,
}) => {
  return (
    <div className="pl-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Profile Picture */}
        <div className="flex items-center mb-4">
          <Image
            src={profileImage}
            alt="Profile"
            className="rounded-full border-4 border-gray-300 mr-8 h-52 w-40"
            width={128} // 32 * 4 for a 32px width image
            height={260} // 40 * 4 for a 40px height image
          />
          <div className="ml-4">
            <h2 className="text-xl text-gray-900 font-semibold">{name}</h2>
            <p className="text-gray-700">{title}</p>
            <p className="text-gray-500 flex items-center">
              <MailIcon className="mr-1" fontSize="small" />
              <a href={`mailto:${email}`} className="hover:text-gray-700">
                {email}
              </a>
            </p>
            <p className="text-gray-600 mt-3 mb-2">{additionalInfo}</p>
            <Button
              variant="contained"
              color="primary"
              className="hover:bg-blue-600 rounded-lg"
            >
              Check Performance
            </Button>
          </div>
        </div>

        {/* Divider */}
        <Divider className="my-4" />

        {/* Date and Time */}
        <div className="flex justify-between text-gray-700">
          <p className="text-sm">Date - {date}</p>
          <p className="text-sm">Time - {time}</p>
        </div>
      </div>

      {/* Additional Content Below Card (if needed) */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-xl text-gray-700 font-semibold mb-4">Additional Information</h2>
        <p className='text-gray-500'>{additionalInfo}</p>
      </div>
    </div>
  );
};

export default UserProfileCard;
