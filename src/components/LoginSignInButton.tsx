'use client';

import React, { useState } from 'react';
import LoginForm from '../components/Login';
import SignUpForm from '../components/Signup';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { Button } from '@mui/material';

const LoginSignInPage: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true); // To toggle between Login and Signup

  const handleToggleMode = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  return (
    <div>
      {isLoginMode ? (
        <>
          <LoginForm />
          <div className='absolute top-4 right-4 flex flex-col items-end justify-center gap-y-3'>
            <p className="text-center text-gray-300 mt-4">
             {` Don't have an account?`}{' '}
            </p>
              <Button
                variant="contained"
                color="primary"
                onClick={handleToggleMode}
                className="gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                <HowToRegIcon className="text-white" />
                Sign Up
              </Button>
          </div>
        </>
      ) : (
        <>
          <SignUpForm />
          <div className="absolute top-4 right-4 flex flex-col items-end justify-center gap-y-3">
            <p className="text-center text-gray-300 mt-4">
              Already have an account?{' '}
            </p>
            <Button
              variant="contained"
              color="primary"
              onClick={handleToggleMode}
              className="gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              <LoginIcon className="text-white" />
              Log In
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginSignInPage;


