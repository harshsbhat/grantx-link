'use client';

import { useState, useEffect } from 'react';
import { grantx, createKey } from 'grantx_sdk';
import Modal from 'react-modal';

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Copy');
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    // Initialize grantx with rootKey from .env
    const rootKey = process.env.NEXT_PUBLIC_GRANTX_ROOT_KEY; // Replace with your actual environment variable name
    grantx(rootKey);
  }, []);

  const handleShortenUrl = async () => {
    try {
      const response = await fetch('/api/createUrl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to shorten URL');
      }

      const data = await response.json();
      setShortUrl(data.shortUrl);
      setError('');
    } catch (error) {
      console.error('Error shortening URL:', error);
      setError('Failed to shorten URL');
    }
  };

  const handleCreateApiKey = async () => {
    try {
      const applicationId = process.env.NEXT_PUBLIC_APPLICATION_ID; // Replace with your actual environment variable name
      const data = await createKey(applicationId); 
      const key = data.apiKey.key;
      console.log('API key created:', data.apiKey.key)
      setApiKey(key);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error creating API key:', error);
      setError('Failed to create API key');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCopyCurl = () => {
    const curlCommand = `curl -X POST http://grantx-link.vercel.app/api/shortenUrl \\
  -H "Content-Type: application/json" \\
  -d '{"originalUrl": "${originalUrl}", "apiKey": "${apiKey}"}' \\
  -L`;
    navigator.clipboard.writeText(curlCommand).then(() => {
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus('Copy'), 3000);
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-black">
      <div className="border border-neutral-600 bg-black shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">URL Shortener</h1>
        <input
          type="text"
          placeholder="Enter URL to shorten"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className="border border-neutral-700 outline-none p-3 rounded mb-4 w-full bg-black text-white placeholder-gray-400 focus:outline-none"
        />
        <button
          onClick={handleShortenUrl}
          className="bg-white text-black p-3 rounded w-full hover:bg-gray-300 transition duration-200"
        >
          Shorten URL
        </button>
        <button
          onClick={handleCreateApiKey}
          className="mt-2 border border-white bg-neutral-900 text-white p-3 rounded w-full hover:bg-neutral-700 transition duration-200"
        >
          Create API key
        </button>
        {error && (
          <div className="mt-4 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        {shortUrl && (
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold text-white">Shortened URL:</p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline break-words"
            >
              {shortUrl}
            </a>
          </div>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="cURL Command"
        className="fixed inset-0 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-neutral-900 p-6 rounded-lg max-w-lg w-full">
          <h2 className="text-2xl font-bold mb-4 text-white">cURL Command</h2>
          <pre className="bg-neutral-800 p-3 rounded mb-4 whitespace-pre-wrap break-all text-white">{`curl -X POST http://grantx-link.vercel.app/api/createUrl \\n-H "Content-Type: application/json" \ \n-d '{"originalUrl": "${originalUrl}", "apiKey": "${apiKey}"}'\\n -L`}</pre>
          <button
            onClick={handleCopyCurl}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
          >
            {copyStatus}
          </button>
          <button
            onClick={handleCloseModal}
            className="ml-4 bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition duration-200"
          >
            Close
          </button>
        </div>
      </Modal>
    </main>
  );
}
