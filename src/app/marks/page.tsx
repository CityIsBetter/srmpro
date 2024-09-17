"use client";
import { useEffect, useState } from 'react';

interface TestPerformance {
  testName: string;
  testScore: string;
}

interface MarkDetail {
  courseCode: string;
  courseType: string;
  testPerformance: TestPerformance[];
}

const MarksPage = () => {
  const [marksDetails, setMarksDetails] = useState<MarkDetail[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        // Check if cookie is present
        const cookie = document.cookie.split('; ').find(row => row.startsWith('marksDetails='));
        const cookieValue = cookie ? decodeURIComponent(cookie.split('=')[1]) : null;

        if (cookieValue) {
          // Parse and set data from cookie
          setMarksDetails(JSON.parse(cookieValue));
        } else {
          // Fetch from API if cookie is not present
          const response = await fetch('/api/getMarks');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setMarksDetails(data.marksDetails);
        }
      } catch (err: any) {
        setError('Failed to fetch marks.');
        console.error(err);
      }
    };

    fetchMarks();
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;

  const parseTestPerformance = (performance: string) => {
    // Split by '/' and get the second part if it exists
    const parts = performance.split('/');
    return parts.length > 1 ? { testName: parts[0], testScore: parts[1] } : { testName: 'N/A', testScore: 'N/A' };
  };

  const renderMarksDetail = (detail: MarkDetail, index: number) => {
    return (
      <div className="flex items-center space-x-6 bg-gray-200 dark:bg-gray-900 rounded-xl p-4 border-2 border-gray-300 dark:border-gray-700" key={index}>
        <div className="flex flex-col flex-1 space-y-6">
          <div className="flex items-center space-x-4">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{detail.courseCode}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{detail.courseType}</p>
          </div>
          <div className="space-y-2">
            {detail.testPerformance.map((test, i) => {
              const { testName, testScore } = parseTestPerformance(test.testScore);
              return (
                <div key={i} className="flex justify-between bg-gray-300 dark:bg-gray-800 p-2 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">{testName}</span>
                  <span className="text-gray-900 dark:text-gray-100">{testScore}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const theoryCourses = marksDetails?.filter((course) => course.courseType === 'Theory') || [];
  const practicalCourses = marksDetails?.filter((course) => course.courseType === 'Practical') || [];

  return (
    <div className="min-h-screen max-h-screen overflow-y-auto bg-gray-100 dark:bg-gray-800 flex flex-col items-center p-4 w-full">
      <div className="flex justify-center items-center space-x-4 mb-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-200">Marks Details</h1>
      </div>

      {marksDetails ? (
        <div className="w-full max-w-4xl space-y-8">
          {/* Theory Section */}
          {theoryCourses.length > 0 && (
            <div className='bg-gray-300 dark:bg-gray-950 p-4 rounded-xl'>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Theory Courses</h2>
                <p className='text-sm dark:text-gray-100'>Test Performance</p>
              </div>
              <div className="space-y-4">
                {theoryCourses.map((detail, index) => renderMarksDetail(detail, index))}
              </div>
            </div>
          )}

          {/* Practical Section */}
          {practicalCourses.length > 0 && (
            <div className='bg-gray-300 dark:bg-gray-950 p-4 rounded-xl'>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Practical Courses</h2>
                <p className='text-sm dark:text-gray-100'>Test Performance</p>
              </div>
              <div className="space-y-4">
                {practicalCourses.map((detail, index) => renderMarksDetail(detail, index))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-gray-900 dark:text-gray-100">Loading...</div>
      )}
    </div>
  );
};

export default MarksPage;
