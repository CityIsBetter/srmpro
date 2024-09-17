"use client";
import { useEffect, useState } from "react";
import { IoIosRefresh } from "react-icons/io";

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
  const [isLoading, setIsLoading] = useState(false);

  const fetchMarks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("marksDetails="));
      const cookieValue = cookie ? decodeURIComponent(cookie.split("=")[1]) : null;

      if (cookieValue) {
        setMarksDetails(JSON.parse(cookieValue));
      } else {
        const response = await fetch("/api/getMarks");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMarksDetails(data.marksDetails);
        console.log(data.marksDetails);
      }
    } catch (err: any) {
      setError("Failed to fetch marks.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarks();
  }, []);

  // Function to extract total marks from testName and calculate total score
  const calculateTotalMarks = (testPerformance: TestPerformance[]) => {
    let totalScored = 0;
    let totalPossible = 0;

    testPerformance.forEach((test) => {
      const [testName, totalMarksString] = test.testName.split("/");

      // Parse the test score and total marks
      const totalMarks = parseFloat(totalMarksString);
      const testScore = parseFloat(test.testScore);

      totalScored += testScore;
      totalPossible += totalMarks;
    });

    // Calculate percentage
    const percentage = (totalScored / totalPossible) * 100;

    // Determine if total is above 50%
    const isAbove50 = percentage >= 50;

    return { totalScored, totalPossible, isAbove50 };
  };

  const renderMarksDetail = (detail: MarkDetail, index: number) => {
    const { totalScored, totalPossible, isAbove50 } = calculateTotalMarks(
      detail.testPerformance
    );

    return (
      <div
        className='flex items-center space-x-6 rounded-xl p-4 border-2 border-gray-400 dark:border-gray-700 hover:scale-[.99] transition bg-gray-200 dark:bg-gray-900'
        key={index}
      >
        <div className="flex flex-col flex-1 space-y-6">
          <div className="flex items-center space-x-4">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {detail.courseCode}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {detail.courseType}
            </p>
          </div>
          <div className="space-y-2">
            {detail.testPerformance.map((test, i) => {
              const [cleanedTestName, totalMarks] = test.testName.split("/");

              return (
                <div
                  key={i}
                  className="flex justify-between bg-gray-300 dark:bg-gray-800 p-2 rounded-lg"
                >
                  <span className="text-gray-700 dark:text-gray-300">
                    {cleanedTestName} {/* Display testName without total marks */}
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {test.testScore}/{totalMarks}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Total Marks */}
          <div className="flex items-center justify-end p-2 gap-4">
            <span className="text-gray-700 dark:text-gray-300 font-semibold">Total Marks:</span>
            <span className={`text-gray-900 dark:text-gray-100 rounded-lg px-2 py-1 bg-gray-300 dark:bg-gray-800`}>
              {totalScored}/{totalPossible} <span className={`px-2 py-1 rounded-lg ${isAbove50 ? "bg-green-400 dark:bg-green-600" : "bg-red-400 dark:bg-red-500"}`}>{((totalScored / totalPossible) * 100).toFixed(2)}%</span> 
            </span>
          </div>
        </div>
      </div>
    );
  };

  const theoryCourses = marksDetails?.filter(
    (course) => course.courseType === "Theory"
  ) || [];
  const practicalCourses = marksDetails?.filter(
    (course) => course.courseType === "Practical"
  ) || [];

  return (
    <div className="min-h-screen max-h-screen overflow-y-auto bg-gray-100 dark:bg-gray-800 flex flex-col items-center p-4 w-full">
      <div className="flex gap-2 justify-center items-center w-full max-w-4xl mb-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-200">
          Marks Details
        </h1>
        {/* Refresh Button */}
        <button
          onClick={fetchMarks}
          className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full transition"
          title="Refresh"
        >
          <IoIosRefresh size={18} />
        </button>
      </div>

      {isLoading ? (
        <div className="text-gray-900 dark:text-gray-100">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="w-full max-w-4xl space-y-8">
          {/* Theory Section */}
          {theoryCourses.length > 0 && (
            <div className="bg-gray-300 dark:bg-gray-950 p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  Theory Courses
                </h2>
                <p className="text-sm dark:text-gray-100">Test Performance</p>
              </div>
              <div className="space-y-4">
                {theoryCourses.map((detail, index) => renderMarksDetail(detail, index))}
              </div>
            </div>
          )}

          {/* Practical Section */}
          {practicalCourses.length > 0 && (
            <div className="bg-gray-300 dark:bg-gray-950 p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  Practical Courses
                </h2>
                <p className="text-sm dark:text-gray-100">Test Performance</p>
              </div>
              <div className="space-y-4">
                {practicalCourses.map((detail, index) => renderMarksDetail(detail, index))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarksPage;
