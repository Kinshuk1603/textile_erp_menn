'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Snackbar,
  CircularProgress,
  IconButton,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import SearchIcon from '@mui/icons-material/Search';
import Navbar from '../../../../components/Navbar';

type FormData = {

  millName: string;
};

type MillData = {
  _id: string;
  millName: string;
  createdAt: string;
  updatedAt: string;
  // Add any other fields that your API might return
};
// Create API utility function to connect to your backend
const createMill = async (data: { millName: string }) => {
  const response = await fetch('http://localhost:5000/api/mills', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create mill');
  }

  return await response.json(); // Return the created mill data
};

// Get all mills API function
const getMills = async (page: number, limit: number, search: string) => {
  const response = await fetch(`http://localhost:5000/api/mills?page=${page}&limit=${limit}&search=${search}`);

  if (!response.ok) {
    throw new Error('Failed to fetch mills');
  }

  return await response.json(); // Return the list of mills
};


const ColorPage: React.FC = () => {
  const { register, handleSubmit, reset, setError, clearErrors, formState: { errors } } = useForm<FormData>();
  const [submittedData, setSubmittedData] = useState<MillData[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; success: boolean } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalMills, setTotalMills] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  console.log(`Total Mills: ${totalMills}`);

  const fetchMills = useCallback(async () => {
    setLoading(true); // Start loading
    try {
      const data = await getMills(page + 1, rowsPerPage, searchTerm); // Use the getMills function

      console.log('Fetched mills:', data); // Log the parsed data

      // Check if data has the expected structure
      if (data && Array.isArray(data.mills)) {
        setSubmittedData(data.mills); // Set state with the mills array
        setTotalMills(data.totalMills); // Update total mills
        setTotalPages(data.totalPages); // Update total pages
      } else {
        console.error('Fetched data is not valid:', data);
        setNotification({ message: 'Error fetching mills', success: false });
      }
    } catch (error) {
      console.error('Error fetching mills:', error);
      setNotification({ message: 'Error fetching mills', success: false });
    } finally {
      setLoading(false); // Stop loading
    }
  }, [page, rowsPerPage, searchTerm]); // Add any dependencies the function uses

  useEffect(() => {
    fetchMills();
  }, [fetchMills]); // Add fetchMills to dependencies Refetch when page or searchTerm changes





  // const onSubmit: SubmitHandler<FormData> = async (data) => {
  //   setLoading(true); // Start loading

  //   // Simulating async operation (e.g., API call)
  //   await new Promise((resolve) => setTimeout(resolve, 500)); // Shortened delay

  //   // Check for empty input
  //   if (!data.millName) {
  //     setError('millName', {
  //       type: 'manual',
  //       message: 'Mill Name is required',
  //     });
  //     setNotification(null); // Clear notification
  //   } else if (submittedData.some((entry) => entry.millName.toUpperCase() === data.millName.toUpperCase())) {
  //     setNotification({ message: 'Mill name already exists', success: false });
  //   } else {
  //     setSubmittedData([...submittedData, { millName: data.millName.toUpperCase() }]);
  //     reset(); // Clear the input field
  //     setNotification({ message: 'Mill added successfully', success: true });
  //     clearErrors(); // Clear errors dynamically after successful submission
  //   }

  //   setLoading(false); // Stop loading
  // };
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true); // Start loading

    // Check for empty input
    if (!data.millName) {
      setError('millName', {
        type: 'manual',
        message: 'Mill Name is required',
      });
      setLoading(false);
      return; // Exit early
    } else if (submittedData.some((entry) => entry.millName.toUpperCase() === data.millName.toUpperCase())) {
      setNotification({ message: 'Mill name already exists', success: false });
      setLoading(false);
      return; // Exit early
    }

    try {
      // Call the API to create a new mill
      const newMill = await createMill({ millName: data.millName.toUpperCase() });
      setSubmittedData((prev) => [...prev, newMill]); // Add new mill to state
      reset(); // Clear the input field
      setNotification({ message: 'Mill added successfully', success: true });
      clearErrors(); // Clear errors dynamically after successful submission
    } catch (error) {
      console.error('Error creating mill:', error);
      setNotification({ message: 'Error adding mill', success: false });
    }

    setLoading(false); // Stop loading
  };

  const filteredData = submittedData.filter((entry) =>
    entry.millName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Calculate the start and end indices for pagination
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  // Use filteredData for slicing to get the current page's mills
  const currentMills = filteredData.slice(startIndex, endIndex);
  return (
    <>
      <Navbar />

      {/* Notification Snackbar */}
      <Snackbar
        open={!!notification}
        autoHideDuration={1500} // Decreased duration for the Snackbar
        onClose={() => setNotification(null)}
        message={
          <span className="flex items-center text-white">
            {notification?.success ? (
              <CheckCircleIcon className="mr-2" />
            ) : (
              <ErrorOutlineIcon className="mr-2" />
            )}
            {notification?.message}
          </span>
        }
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        ContentProps={{
          style: {
            backgroundColor: notification?.success ? '#4caf50' : '#f44336', // Ensured correct colors
            color: 'white',
            padding: '16px',
            fontSize: '16px',
            minWidth: '300px',
            borderRadius: '4px',
          },
        }}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={() => setNotification(null)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />

      {/* Main Container */}
      <div className="flex flex-col md:flex-row justify-center items-start py-8 px-16 gap-7 w-full mx-auto max-w-screen-2xl"> {/* Set max width here */}
        {/* Left container (40%) */}
        <div className="md:w-2/5 w-full bg-white p-6 rounded-3xl shadow-2xl">
          <Typography variant="h5" className="font-bold mb-4">Mill Info</Typography>

          {/* React Hook Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 items-start">
            {/* Mill Name Field */}
            <div className="relative">
              <TextField
                label="Enter Mill Name"
                variant="outlined"
                size="small"
                fullWidth
                {...register('millName')}
                inputProps={{ style: { textTransform: 'capitalize' } }}
                onChange={() => clearErrors('millName')} // Clear errors on change
              />
              {/* Error Displayed Below TextField with Icon */}
              {errors.millName && (
                <div className="mt-4 flex items-center text-red-500">
                  <ErrorOutlineIcon className="mr-2" />
                  <p>{errors.millName.message}</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="rounded-full px-6 py-2 bg-blue-300 mt-0 hover:bg-blue-400"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          </form>
        </div>

        {/* Right container (60%) - Table */}
        <div className="md:w-3/5 w-full bg-white p-6 rounded-3xl shadow-md">
          <Typography variant="h5" className="font-bold mb-4">Mill Info</Typography>

          <TableContainer component={Paper} style={{ maxHeight: '60vh', overflowY: 'auto' }} className='rounded-2xl border-2 border-black'>
            <Table>
              <TableHead>
                <TableRow className="bg-blue-300">
                  <TableCell colSpan={2}>
                    <div className="flex items-center">
                      <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Search Mill"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='bg-white rounded-3xl border-none outline-none uppercase' // Removed default border
                        InputProps={{
                          startAdornment: <SearchIcon className='text-blue-300' style={{ marginRight: 8 }} />,
                        }}
                        style={{ width: '100%', margin: '0 auto' }} // Full width for search bar
                      />
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow className="bg-blue-300">
                  <TableCell align="center" className="text-sm md:text-lg font-semibold capitalize">Serial No.</TableCell>
                  <TableCell align="center" className="text-sm md:text-lg font-semibold capitalize">Mill Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentMills.length > 0 ? (
                  currentMills.map((data, index) => (
                    <TableRow
                      key={data._id} // Use unique ID for the key
                      className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-100'}`}
                      style={{ height: '30px', borderBottom: '1px solid #000' }}
                    >
                      <TableCell align="left" className="text-sm md:text-lg border-r-2 border-r-black capitalize">{startIndex + index + 1}</TableCell>
                      <TableCell align="left" className="text-sm md:text-lg capitalize">{data.millName}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="text-center py-4" colSpan={2}>
                      No mill added.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              className="flex items-center rounded-full md:w-auto h-10 w-8" // Rounded full on medium and larger screens, fixed size on smaller screens
              startIcon={<ChevronLeft />}
            >
              <span className="hidden md:inline">Previous</span>
            </Button>

            <Typography variant="body2" className="hidden md:block text-center">
              Page {page + 1} of {totalPages || 1} {/* Use totalPages from state */}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
              disabled={page >= totalPages - 1} // Disable if on the last page
              className="flex items-center rounded-full"
              endIcon={<ChevronRight />}
            >
              <span className="hidden md:inline">Next</span>
            </Button>
            {/* Loading Indicator */}
            {loading && (
              <CircularProgress className="absolute top-2 right-2" />
            )}
          </div>
        </div>
      </div>
    </>
  );
};


export default ColorPage;
