'use client';
import { useEffect, useState } from 'react';

export default function Redirect() {
  const  shortId  = window.location.pathname;
  const [error, setError] = useState('');

  useEffect(() => {
    if (shortId) {
      const fetchOriginalUrl = async () => {
        try {
          const response = await fetch(`/api/${shortId}`);
          const data = await response.json();

          if (response.status === 200) {
            window.location.href = data.url;
          } else {
            setError(data.message || 'URL not found');
          }
        } catch (error) {
          console.error('Error fetching original URL:', error);
          setError('Server error');
        }
      };

      fetchOriginalUrl();
    }
  }, [shortId]);

  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-black">
      <div className="border border-neutral-600 bg-black shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Wait a minute.</h1>
        {error && (
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold text-red-500">{error}</p>
          </div>
        )}
      </div>
    </main>
  );
}
