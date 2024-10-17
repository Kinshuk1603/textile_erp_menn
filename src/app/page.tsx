'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import Banner from '../components/Banner';
import Card from '../components/Card';
import UserProfileCard from '../components/verticalUserProfileCard';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    console.log('Logged out');
    router.push('./signup'); // Redirect to login page after logout
  };

  const formattedDate = new Date().toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
  const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase(); // Ensure time is in lowercase "am/pm"
  // Sample card titles with links
  const cardTitles = [
    { title: 'Master', link: "/navigatLinks/master/color" },
    { title: 'Buyer Order', link: "/navigatLinks/buyerOrder/buyerOrder" },
    { title: 'Purchase Order', link: "/navigatLinks/purchaseOrder/yarnOrder" },
    { title: 'Production', link: "/navigatLinks/production/createEmployee" },
    { title: 'Product Inventory', link: "/navigatLinks/productInventory/goodsInwards" },
    { title: 'Admin', link: "/navigatLinks/admin/approveBO" },
  ];

  console.log(JSON.stringify(cardTitles, null, 2)); 

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Banner />

      <div className="flex justify-end p-4 absolute right-3 top-4">
        <IconButton onClick={handleLogout} className="hover:text-red-500 bg-blue-200">
          <LogoutIcon />
        </IconButton>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 w-[50%] ml-10"> {/* 70% for cards */}
          {cardTitles.map((card, index) => (
            <Card key={index} title={card.title} link={card.link} /> // Pass title and link
          ))}
        </div>
        <div className="w-[50%] mr-10"> {/* 30% for user profile card */}
          <UserProfileCard
            name="John Doe"
            title="Software Engineer"
            email="john.doe@example.com"
            profileImage="https://i.pravatar.cc/300" // Placeholder image
            additionalInfo="Some additional information about the user."
            date={formattedDate} // Consistent date format
            time={formattedTime} // Consistent time format
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
