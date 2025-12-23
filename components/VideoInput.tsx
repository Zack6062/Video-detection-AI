
import React, { useState } from 'react';

interface VideoInputProps {
  onVideoSelect: (url: string) => void;
}

const VideoInput: React.FC<VideoInputProps> = ({ onVideoSelect }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    // Basic validation for URL
    try {
      new URL(url);
      onVideoSelect(url);
      setError('');
    } catch (e) {
      setError('Please enter a valid video URL');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        setError('Video file is too large (max 100MB)');
        return;
      }
      const localUrl = URL.createObjectURL(file);
      onVideoSelect(localUrl);
      setError('');
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-2xl space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Select Video Source
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">Direct Video URL / Social Link</label>
          <form onSubmit={handleUrlSubmit} className="flex gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="YouTube, Insta, or direct .mp4 link"
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Load
            </button>
          </form>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">Local Video Upload</label>
          <div className="relative">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="bg-gray-900 border border-dashed border-gray-700 rounded-lg px-3 py-2 text-sm text-center text-gray-400 hover:border-blue-500 transition-colors">
              Click to browse files (.mp4, .webm)
            </div>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm animate-pulse">{error}</p>
      )}

      <div className="pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-500">
          Note: Cross-origin restrictions apply to social links. For best results, use direct video URLs or local files.
        </p>
      </div>
    </div>
  );
};

export default VideoInput;
