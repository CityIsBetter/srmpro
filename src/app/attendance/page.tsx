"use client";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { IoIosRefresh } from "react-icons/io";
import 'react-circular-progressbar/dist/styles.css';
import { useState, useEffect } from 'react';

export default function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAttendance = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/getAttendance', {
        method: 'POST',
      });

      const data = await response.json();
      if (response.ok) {
        setAttendanceData(data.courseDetails);
        document.cookie = `courseDetails=${JSON.stringify(data.courseDetails)}; expires=${new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString()}; path=/`;
      } else {
        setError(data.error || 'Failed to fetch attendance details.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
      const [name, value] = cookie.split('=');
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);

    if (cookies.courseDetails) {
      setAttendanceData(JSON.parse(cookies.courseDetails));
    } else {
      fetchAttendance();
    }
  }, []);

  const calculateBunksLeft = (conducted: number, attended: number) => {
    const marginPercentage = 75;
    const currentPercentage = (attended / conducted) * 100;

    if (currentPercentage >= marginPercentage) {
      let bunksLeft = 0;
      let totalClasses = conducted;

      while ((attended / totalClasses) * 100 >= marginPercentage) {
        bunksLeft++;
        totalClasses++;
      }

      return bunksLeft - 1;
    } else {
      const classesToAttend = Math.ceil((marginPercentage * conducted / 100 - attended) / (1 - marginPercentage / 100));
      return -classesToAttend;
    }
  };

  const renderCourse = (course: any, index: number) => {
    const conducted = course.hoursConducted;
    const attended = conducted - course.hoursAbsent;
    const attendancePercentage = (attended / conducted) * 100;
    const marginStatus = calculateBunksLeft(conducted, attended);

    return (
      <div className={`flex items-center space-x-6 bg-gray-200 dark:bg-gray-900 rounded-xl p-4 border-2 ${marginStatus > 0 ? "border-gray-300 dark:border-gray-700": "border-red-400"}  `} key={index}>
        <div className="flex flex-col flex-1 space-y-6">
          <div className="flex items-center space-x-4">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{course.courseTitle}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{course.courseCode}</p>
          </div>
          <p className="text-base text-gray-700 dark:text-gray-300">{course.facultyName}</p>
        </div>
        {/* <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{typeof marginStatus === 'number' ? `Bunks left: ${marginStatus}` : marginStatus}</p> */}
        <div className="flex flex-col gap-1 items-center">
          <div className="flex gap-2">
            <p className={`${marginStatus > 0 ? "": "text-red-400"} text-black dark:text-gray-200`}>{marginStatus > 0 ? "margin: " : "required:"}</p>
            <p className={`${marginStatus > 0 ? "text-green-600": "text-red-400"} font-bold`}>{marginStatus > 0 ? marginStatus : -marginStatus}</p>
          </div>
          <p className='bg-gray-300 dark:bg-gray-800 px-2 py-1 rounded-full text-sm dark:text-gray-200'> <span className='text-red-500 dark:text-red-400'>{course.hoursAbsent}</span>/<span className='text-green-600 dark:text-green-400'>{conducted}</span></p>
        </div>
        <div className="flex-shrink-0 w-24 h-24 flex flex-col items-center justify-center space-y-2">
          <div className="w-24 h-24">
            <CircularProgressbar
              value={attendancePercentage}
              text={`${Math.round(attendancePercentage)}%`}
              styles={buildStyles({
                textColor: attendancePercentage >= 75 ? '#4CAF50' : '#F44336',
                pathColor: attendancePercentage >= 75 ? '#4CAF50' : '#F44336',
                trailColor: 'rgba(0, 0, 0, 0.1)', // Adjust trail color for dark mode
              })}
            />
          </div>
        </div>
      </div>
    );
  };

  const theoryCourses = attendanceData.filter((course) => course.courseCategory === 'Theory');
  const practicalCourses = attendanceData.filter((course) => course.courseCategory === 'Practical');

  return (
    <div className="min-h-screen max-h-screen overflow-y-auto bg-gray-100 dark:bg-gray-800 flex flex-col items-center p-4 w-full">
      <div className="flex justify-center items-center space-x-4 mb-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-200">Attendance</h1>
        <button
          onClick={fetchAttendance}
          className="bg-gray-300 hover:bg-gray-400 text-black p-1 mt-2 rounded-full disabled:bg-blue-300 transition"
          disabled={loading}
        >
          <IoIosRefresh className='text-lg'/>
        </button>
      </div>


      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        attendanceData.length > 0 && (
          <div className="w-full max-w-4xl space-y-8">
            {/* Theory Section */}
            {theoryCourses.length > 0 && (
              <div className=' bg-gray-300 dark:bg-gray-950 p-4 rounded-xl'>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Theory Courses</h2>
                  <p className='text-sm dark:text-gray-100 mr-36'>absent/toal</p>
                </div>
                <div className="space-y-4">
                  {theoryCourses.map((course, index) => renderCourse(course, index))}
                </div>
              </div>
            )}

            {/* Practical Section */}
            {practicalCourses.length > 0 && (
              <div className=' bg-gray-300 dark:bg-gray-950 p-4 rounded-xl'>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Practical Courses</h2>
                  <p className='text-sm dark:text-gray-100 mr-36'>absent/toal</p>
                </div>
                <div className="space-y-4">
                  {practicalCourses.map((course, index) => renderCourse(course, index))}
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
