'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';

interface OTPFormInputs {
  otp: string;
}

const OTPPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<OTPFormInputs>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  // Retrieve email from localStorage on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // Redirect to login if email is not available
      router.push('/login');
    }
  }, [router]);

  const onSubmit = async (data: OTPFormInputs) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: data.otp,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        // Store the JWT token in local storage
        localStorage.setItem('token', result.token);
        
        // OTP verified successfully, redirect to home page
        router.push('/'); 
      } else {
        setErrorMessage(result.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      className="flex flex-col items-center justify-center h-screen bg-gray-900"
      sx={{
        '@media (min-width: 768px)': {
          padding: '2rem',
        },
      }}
    >
      <Box
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        sx={{
          backgroundColor: '#fff',
        }}
      >
        <Typography
          variant="h4"
          className="text-center mb-4"
          sx={{
            fontWeight: 'bold',
            color: '#333',
          }}
        >
          Enter Your OTP
        </Typography>

        {errorMessage && (
          <Typography className="text-red-500 mb-4">{errorMessage}</Typography>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <TextField
            fullWidth
            id="otp"
            label="OTP"
            variant="outlined"
            {...register('otp', { required: 'OTP is required', minLength: 6, maxLength: 6 })}
            error={!!errors.otp}
            helperText={errors.otp ? 'OTP must be 6 digits' : ''}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f9f9f9', // Default background
                '&.Mui-focused': {
                  backgroundColor: 'white', // Change background when focused
                },
                '& input:not(:placeholder-shown)': {
                  backgroundColor: 'white', // Change background when user enters data
                },
              },
              '& .MuiInputLabel-root': {
                color: 'gray', // Default label color
                '&.Mui-focused': {
                  color: 'green', // Focused label color
                },
              },
              '& .MuiFormHelperText-root': {
                color: '#e57373', // Helper text color (for error)
              },
            }}
            InputLabelProps={{
              sx: {
                color: 'gray',
                '&.Mui-focused': {
                  color: 'green',
                },
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="w-full py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
            disabled={isSubmitting}
            sx={{
              position: 'relative',
              fontWeight: 'bold',
              height: '48px',
            }}
          >
            {isSubmitting ? (
              <CircularProgress
                size={24}
                sx={{
                  color: 'white',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            ) : (
              'Submit OTP'
            )}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default OTPPage;
