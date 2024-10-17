'use client';


import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { TextField, Button, InputAdornment, MenuItem, Select, InputLabel, FormControl, FormHelperText, IconButton, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Importing Image from next/image for optimization

interface AuthFormInputs {
  email: string;
  password: string;
  role: string; // Add role field
}

interface AuthFormProps {
  isSignUp: boolean; // true for signup, false for login
}

const AuthForm: React.FC<AuthFormProps> = ({ isSignUp }) => {
  const { register, handleSubmit, watch, formState: { errors }, setValue, trigger } = useForm<AuthFormInputs>();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState('');
  const [currentNameIndex, setCurrentNameIndex] = useState(0);
  const [currentNumberIndex, setCurrentNumberIndex] = useState(0);

  const names = ['Kinshuk Majoka', 'Mohit Singla', 'Manish Jain']; // Array of names
  const phoneNumbers = ['+91 1234567890', '+91 9876543210', '+91 5555555555']; // Array of phone numbers
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentNameIndex((prevIndex) => (prevIndex + 1) % names.length); // Cycle through names
      setCurrentNumberIndex((prevIndex) => (prevIndex + 1) % phoneNumbers.length); // Cycle through phone numbers
    }, 1500); // 3 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []); // Only run once, no need to add names.length or phoneNumbers.length  

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const password = watch('password', '');

  const criteria = [
    { regex: /^(?=.*[A-Z])/, message: 'At least 1 uppercase letter' },
    { regex: /^(?=.*\d)/, message: 'At least 1 number' },
    { regex: /^(?=.*[@$!%*?&])/, message: 'At least 1 special character' },
  ];

  const fulfilledCriteria = criteria.map(({ regex, message }) => ({
    message,
    fulfilled: regex.test(password),
  }));

  const onSubmit: SubmitHandler<AuthFormInputs> = async (data) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const endpoint = isSignUp ? 'signup' : 'login';
      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || `Failed to ${isSignUp ? 'sign up' : 'log in'}`);
      }

      console.log(`${isSignUp ? 'Signed up' : 'Logged in'} successfully:`, result);
      localStorage.setItem('email', data.email); // Store email in localStorage
      router.push(`/otp`); // Navigate to OTP page without email in URL
    } catch (error) {
      setErrorMessage((error as Error).message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-screen items-center justify-center h-full bg-gray-900">
      <h1 className="text-3xl text-center text-gray-100 font-bold mb-5">
        {isSignUp ? 'Create an Account' : 'Welcome Back!'}
      </h1>
      <div className='bg-white flex gap-14 items-start justify-between w-[50%] p-8 rounded-lg shadow-lg'>
        <div className="h-full w-[60%] relative">
          <div className="h-[20%] flex items-center">
            <Image
              src="/textile_erp_black.png" // Leading slash for images in the 'public' folder
              alt="Logo"
              width={60} // Adjust width
              height={60} // Adjust height
              className="mr-2"
            />
            <h1 className="text-3xl text-blue-500 font-bold">Textile ERP</h1> {/* Add your app name here */}
          </div>
          <div className="flex flex-col gap-1 items-start justify-center mx-7 h-[80%]">
            <p className="text-lg text-gray-800">Access Your Workspace</p>

            <Image
              src="/signature.png" // Leading slash for images in the 'public' folder
              alt="signature"
              width={140} // Adjust width
              height={150} // Adjust height
              className="mr-2"
            />

            <p className="text-lg text-gray-800">Signature For Authentication</p>
          </div>
        </div>
        <div className='w-[40%] flex flex-col gap-5 items-end justify-end mr-3'>
          <div className="w-full relative">
            <div className="top-0 right-0 p-3 text-gray-800 text-right">
              <h2 className="text-lg font-bold transition-opacity duration-500 ease-in-out">{names[currentNameIndex]}</h2>
              <p className="text-md transition-opacity duration-500 ease-in-out">{phoneNumbers[currentNumberIndex]}</p>
            </div>
          </div>
          <div>
            <h1 className="text-3xl text-center self-center text-gray-600 font-bold mb-8">{isSignUp ? 'Sign Up' : 'Log In'}</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-80">
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: 'Invalid email format',
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 4, message: 'Password must be at least 4 characters' },
                  maxLength: { value: 15, message: 'Password must not exceed 15 characters' },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" className='mr-4'>
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                className="mb-0" // Add a smaller margin-bottom to reduce spacing
              />

              {password && (
                <ul className="list-disc list-inside text-red-500">
                  {fulfilledCriteria.map(({ message, fulfilled }, index) => (
                    !fulfilled && <li key={index}>{message}</li>
                  ))}
                </ul>
              )}


              <FormControl variant="outlined" error={!!errors.role} className='mt-0'>
                <InputLabel>Role</InputLabel>
                <Select
                  label="Role"
                  className="bg-white"
                  {...register('role', { required: 'Role is required' })} // Use register for validation and handle input
                  value={role} // Control the value from state
                  onChange={(event) => {
                    const selectedRole = event.target.value as string;
                    setRole(selectedRole); // Update local state
                    setValue('role', selectedRole); // Update form state
                    trigger('role'); // Trigger validation for role
                  }}
                >
                  <MenuItem value="">Select Role</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                </Select>
                {errors.role && <FormHelperText>{errors.role?.message}</FormHelperText>}
              </FormControl>

              {errorMessage && <div className="text-red-500">{errorMessage}</div>}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} sx={{ position: 'relative', top: '4px' }} />
                ) : isSignUp ? 'Sign Up' : 'Log In'}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {isSubmitting && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-10 flex items-center justify-center backdrop-blur-sm">
          <CircularProgress size={80} color="inherit" />
        </div>
      )}
    </div>
  );
};

export default AuthForm;
