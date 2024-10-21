'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../../../../components/Navbar';
import { useForm, SubmitHandler } from 'react-hook-form';
import { TextField, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';
import SnackbarNotification from '@/src/components/SnackbarNotification';

// Define the form input types
type ColorFormInputs = {
  color: string;
};

type ColorData = {
  id: string; // Assuming the id is a string
  name: string; // Adjust according to your API response
};

const ColorPage: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ColorFormInputs>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [colors, setColors] = useState<ColorData[]>([]); // State to store colors
  const [loadingColors, setLoadingColors] = useState(true); // State to manage loading state
  const [userId, setUserId] = useState<string | null>(null); // State to store the user ID
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');

  // Function to get the current user's ID
  const getCurrentUserId = () => {
    // Replace this with your method of getting the logged-in user's ID
    const storedUserId = localStorage.getItem('userId'); // Example using local storage
    return storedUserId; // or however you manage user sessions
  };

  useEffect(() => {
    // Retrieve user ID on component mount
    const id = getCurrentUserId();
    setUserId(id);

    const fetchColors = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/colors'); // Adjusted URL
        if (!response.ok) throw new Error('Failed to fetch colors');

        const data = await response.json();
        setColors(data); // Assuming the data is an array of color objects
      } catch (error) {
        console.error('Error fetching colors:', error);
      } finally {
        setLoadingColors(false);
      }
    };

    fetchColors();
  }, []);

  // Form submission handler
  const onSubmit: SubmitHandler<ColorFormInputs> = async (data) => {
    setIsSubmitting(true);
    console.log('Submitted Data:', {
      name: data.color,
      createdBy: userId, // Dynamically set the user ID
      createdAt: new Date().toISOString(), // Automatically set current time
    });

    try {
      const response = await fetch('http://localhost:5000/api/colors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.color,
          createdBy: userId, // Dynamically set the user ID
          createdAt: new Date().toISOString(), // Automatically set current time
        }),
      });

      // Parse the response
      const responseData = await response.json();

      if (response.ok) {
        console.log('Color added successfully');
        reset(); // Clear the form after successful submission
        const newColor = responseData; // Assuming the response contains the newly created color
        setColors((prev) => [...prev, newColor]);
        setSnackbarMessage('Color added successfully!');
        setSnackbarSeverity('success');
      } else {
        console.log('Failed to add color', responseData);
        setSnackbarMessage('Failed to add color.');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Error while adding color:', error);
      setSnackbarMessage('An error occurred while adding color.');
      setSnackbarSeverity('error');
    } finally {
      setIsSubmitting(false);
      setSnackbarOpen(true);
    }
  };

  // Snackbar close handler
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className='w-screen bg-gray-200'>
      <Navbar />
      <div className='flex w-full px-10 gap-10 mt-5'>
        {/* Left Section - 40% with form */}
        <div className='w-2/5 bg-white p-6 shadow-lg rounded-2xl h-[240px]'>
          <h2 className='text-xl font-semibold mb-4'>Add Color</h2>
          {/* Form for adding color */}
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            <div className='relative'>
              <TextField
                fullWidth
                label="Add Color"
                {...register('color', { required: 'Color name is required' })}
                variant="outlined"
                size="small"
                error={!!errors.color} // Sets error state
                InputLabelProps={{
                  style: {
                    color: errors.color ? 'red' : undefined, // Red label if error
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: errors.color ? 'red' : undefined, // Red border if error
                    },
                    '&:hover fieldset': {
                      borderColor: errors.color ? 'red' : undefined, // Hover state
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: errors.color ? 'red' : undefined, // Focus state
                    },
                  },
                }}
              />
              {errors.color && (
                <div className="flex items-center mt-2 p-2 space-x-2">
                  <ErrorIcon className="text-red-500" />
                  <span className="text-red-600">{errors.color.message}</span>
                </div>
              )}
            </div>

            <div className='self-start'>
              <Button
                type='submit'
                variant='contained'
                className='!bg-indigo-600 !text-white !py-2 !rounded-lg !hover:bg-indigo-700'
                style={{ width: 'fit-content' }}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Add Color'}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Section - 60% with Color List */}
        <div className='w-3/5 bg-white p-6 shadow-lg rounded-2xl h-[450px]'>
          <h2 className='text-xl font-semibold mb-4'>Color List</h2>
          {/* Table for displaying color data */}
          {loadingColors ? (
            <div className="flex justify-center items-center h-40">
              <CircularProgress />
            </div>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: '16px', overflow: 'scroll-y' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Color Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {colors.map((color, index) => (
                    <TableRow key={color.id} sx={{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff', '&:hover': { backgroundColor: '#e0e0e0' } }}>
                      <TableCell>{color.id}</TableCell>
                      <TableCell>{color.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>

      {/* Snackbar for success/error messages */}
      <SnackbarNotification
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </div>
  );
};

export default ColorPage;
{/* Pagination */ }
//  <div className="flex justify-between items-center mt-2">
//  <Button
//    variant="contained"
//    color="primary"
//    onClick={() => setPage(page - 1)}
//    disabled={page === 0}
//    className="flex items-center"
//    startIcon={<ChevronLeft style={{ color: '#007BFF' }} />}
//  >
//    Previous
//  </Button>
//  <Typography variant="body2" className="text-center">
//    Page {page + 1} of {Math.ceil(filteredData.length / rowsPerPage) || 1}
//  </Typography>
//  <Button
//    variant="contained"
//    color="primary"
//    onClick={() => setPage(page + 1)}
//    disabled={page >= Math.ceil(filteredData.length / rowsPerPage) - 1}
//    className="flex items-center"
//    endIcon={<ChevronRight />}
//  >
//    Next
//  </Button>
// </div>
//  <div className="flex items-center">
//  <TextField
//    variant="outlined"
//    size="small"
//    placeholder="Search Mill"
//    value={searchTerm}
//    onChange={(e) => setSearchTerm(e.target.value)}
//    InputProps={{
//      startAdornment: <SearchIcon position="start" />,
//    }}
//    style={{ width: '100%' }} // Full width for search bar
//  />
// </div>


{/* <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Search Mill"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                          startAdornment: <SearchIcon style={{ marginRight: 8 }} />, // Proper usage without position prop
                        }}
                        style={{ width: '100%' }} // Full width for search bar
                      /> */}