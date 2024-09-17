// pages/details.tsx
"use client";
import { useState, useEffect } from 'react';
import { FaUser, FaGraduationCap, FaBook, FaChalkboardTeacher, FaIdCard, FaBuilding, FaCalendar  } from "react-icons/fa";

export default function DetailsPage() {
  const [registrationDetails, setRegistrationDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const useremail = window.localStorage.getItem('user-email')

  const fetchDetails = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch data from API
      const response = await fetch('/api/getDetails', {
        method: 'GET',
      });

      const data = await response.json();
      if (response.ok) {
        setRegistrationDetails(data.registrationDetails);
        // Set cookie in browser
        document.cookie = `registrationDetails=${JSON.stringify(data.registrationDetails)}; expires=${new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString()}; path=/`;
      } else {
        setError(data.error || 'Failed to fetch registration details.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if registrationDetails cookie exists
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
      const [name, value] = cookie.split('=');
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);

    if (cookies.registrationDetails) {
      setRegistrationDetails(JSON.parse(cookies.registrationDetails));
    } else {
      fetchDetails();
    }
  }, []);

  return (
    <div className="min-h-screen overflow-y-auto bg-gray-100 dark:bg-gray-800 flex flex-col items-center p-4 w-full transition">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {registrationDetails && (
        <div className="flex flex-col items-center justify-center space-y-4">
          <FaUser className='text-[196px] border-4 border-gray-800 dark:border-gray-200 rounded-full p-2 dark:text-gray-200 transition' />
          <p className='text-4xl font-bold text-black dark:text-gray-200'>{registrationDetails.name}</p>
          <p className='text-md font-light text-black dark:text-gray-400'>{useremail}</p>
          <div className="grid grid-cols-3 space-x-6">
            <div className="bg-red-400 rounded-xl px-6 py-12 text-xl flex flex-col items-center justify-center hover:scale-[.99] transition">
              <FaGraduationCap className='text-7xl' />
              <p className='text-xl font-bold'>{registrationDetails.program}</p>                  
            </div>
            <div className="bg-green-400 rounded-xl px-6 py-12 text-xl flex flex-col items-center justify-center hover:scale-[.99] transition">
              <FaBook  className='text-7xl' />
              <p className='text-xl font-bold'>{registrationDetails.specialization}</p>           
            </div>
            <div className="bg-blue-400 rounded-xl px-6 py-12 text-xl flex flex-col items-center justify-center hover:scale-[.99] transition">
              <FaIdCard className='text-7xl' />
              <p className='text-xl font-bold'>{registrationDetails.registrationNumber}</p>
            </div>
          </div>
          <div className="flex flex-col w-1/2 p-6 bg-white dark:bg-gray-700 rounded-xl hover:scale-[.99] transition">
            <div className="flex flex-row justify-between items-center p-4 dark:text-gray-200">
              <div className="flex items-center gap-2">
                <FaBuilding className='text-3xl'/>
                <p className='text-xl'>Department</p>
              </div>
              <p className='text-xl font-bold'>{registrationDetails.department}</p>
            </div>
            <div className="flex flex-row justify-between items-center p-4 dark:text-gray-200 ">
              <div className="flex items-center gap-2">
                <FaChalkboardTeacher className='text-3xl'/>
                <p className='text-xl'>Semester</p>
              </div>
              <p className='text-xl font-bold'>{registrationDetails.semester}</p>
            </div>
            <div className="flex flex-row justify-between items-center p-4 dark:text-gray-200">
              <div className="flex items-center gap-2">
                <FaCalendar className='text-3xl'/>
                <p className='text-xl'>batch</p>
              </div>
              <p className='text-xl font-bold'>{registrationDetails.batch}</p>
            </div>
          </div>
        </div>
        
      )}
    </div>
  );
}
