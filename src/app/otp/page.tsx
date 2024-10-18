'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import SnackbarNotification from '../../components/SnackbarNotification'; // Import your SnackbarNotification component

interface OTPFormInputs {
  otp: string;
}

const OTPPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<OTPFormInputs>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar open state
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success'); // Snackbar severity
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
    setSnackbarOpen(false); // Reset snackbar state

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

      // Show spinner for 500ms to simulate the loading time
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (response.ok) {
        // Store the JWT token in local storage
        localStorage.setItem('token', result.token);

        // Show success notification
        setSnackbarMessage('OTP verified successfully! Redirecting...');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);

        // Continue showing spinner after OTP verification
        setTimeout(() => {
          // Redirect to home page after a delay of 2 seconds
          router.push('/');
        }, 2000); // 2 seconds delay
      } else {
        // Show error notification
        setSnackbarMessage(result.message || 'Invalid OTP');
        setSnackbarSeverity('error'); // Set severity to error
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error(error);
      // Show error notification
      setSnackbarMessage('Something went wrong. Please try again.');
      setSnackbarSeverity('error'); // Set severity to error
      setSnackbarOpen(true);
    } finally {
      // Stop showing spinner after the API call
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
          position: 'relative', // To position the snackbar above the spinner
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
            {...register('otp', { required: 'OTP is required', minLength: { value: 6, message: 'OTP must be 6 digits' }, maxLength: { value: 6, message: 'OTP must be 6 digits' } })}
            error={!!errors.otp}
            helperText={errors.otp ? errors.otp.message : ''}
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
        {isSubmitting && (
          <Box
            className="fixed inset-0 flex items-center justify-center"
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // Black overlay with opacity
              backdropFilter: 'blur(5px)', // Blurry background
              zIndex: 1000,
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>

      {snackbarOpen && (
        <SnackbarNotification
          open={snackbarOpen}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
          severity={snackbarSeverity} // Pass severity to Snackbar
          sx={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }} // Position the snackbar above the spinner
        />
      )}
    </Box>
  );
};

export default OTPPage;
