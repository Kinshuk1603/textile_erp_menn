"use client";  // Add this line

import { useEffect, useState } from 'react';

const Home = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/')
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => console.error('Error fetching message:', err));
  }, []);

  return (
    <div className='flex justify-center items-center h-screen flex-col gap-4'>
      <h1>Hello World from Next.js with TypeScript!</h1>
      <p>{message}</p>
    </div>
  );
};

export default Home;
