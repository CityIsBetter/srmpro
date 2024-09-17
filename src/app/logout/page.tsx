// app/logout/page.tsx
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Clear localStorage item
        localStorage.removeItem('user-email');

        // Make an API call to logout, where cookies will be cleared on the server
        const response = await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (response.ok) {
          // After successful logout, redirect to home page
          router.push('/');
        } else {
          alert(data.error || 'Logout failed');
        }
      } catch (error) {
        console.error('An error occurred during logout:', error);
        alert('An error occurred during logout');
      }
    };

    handleLogout();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded-md">
        <p className="text-lg">Logging out...</p>
      </div>
    </div>
  );
}
