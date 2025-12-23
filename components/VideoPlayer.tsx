
import React, { useRef, useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { DetectedObject } from '../types';

interface VideoPlayerProps {
  url: string;
  onDetect: (objects: DetectedObject[]) => void;
  results: DetectedObject[];
  isDetecting: boolean;
  setIsDetecting: (val: boolean) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, onDetect, results, isDetecting, setIsDetecting }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showBoxes, setShowBoxes] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        setShowBoxes(false);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seek = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const handleManualDetection = async () => {
    if (!videoRef.current || !canvasRef.current || isDetecting) return;

    setIsDetecting(true);
    setShowBoxes(false);
    
    videoRef.current.pause();
    setIsPlaying(false);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
      
      try {
        const results = await geminiService.detectObjects(base64Image);
        onDetect(results);
        setShowBoxes(true);
      } catch (err) {
        alert("Failed to detect objects. Please try again.");
      } finally {
        setIsDetecting(false);
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handlePlay = () => {
      setIsPlaying(true);
      setShowBoxes(false);
    };
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    
    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Video Frame Container */}
      <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl group border border-gray-800 ring-1 ring-white/5">
        <div className="relative w-full aspect-video">
          <video
            ref={videoRef}
            src={url}
            crossOrigin="anonymous"
            className="w-full h-full cursor-pointer object-contain"
            onClick={togglePlay}
            playsInline
          />

          {/* Bounding Box Overlay */}
          {showBoxes && !isDetecting && results.length > 0 && (
            <div className="absolute inset-0 pointer-events-none z-10">
              {results.map((obj) => {
                const [ymin, xmin, ymax, xmax] = obj.boundingBox;
                return (
                  <div
                    key={obj.id}
                    className="absolute border-2 border-blue-400 rounded shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-in zoom-in duration-300"
                    style={{
                      top: `${ymin / 10}%`,
                      left: `${xmin / 10}%`,
                      width: `${(xmax - xmin) / 10}%`,
                      height: `${(ymax - ymin) / 10}%`,
                    }}
                  >
                    <div className="absolute -top-7 left-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap">
                      {obj.brand} {obj.name}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Hidden Canvas for Frame Capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Loading Overlay */}
        {isDetecting && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center z-20 transition-all">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-blue-400 font-bold tracking-widest uppercase text-xs animate-pulse">Analyzing frame...</p>
          </div>
        )}

        {/* Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity z-30">
          <div className="flex flex-col gap-3">
            {/* Progress Bar */}
            <div className="group/progress relative w-full bg-gray-700/50 h-1.5 rounded-full overflow-hidden cursor-pointer">
              <div 
                className="absolute h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] transition-all duration-300" 
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
              <input 
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={currentTime}
                onChange={(e) => {
                  if (videoRef.current) videoRef.current.currentTime = parseFloat(e.target.value);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Play/Pause */}
                <button onClick={togglePlay} className="text-white hover:text-blue-500 transition-colors transform hover:scale-110 active:scale-95">
                  {isPlaying ? (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                  ) : (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  )}
                </button>

                {/* Seek Back 10s */}
                <button onClick={() => seek(-10)} className="text-gray-300 hover:text-white transition-colors" title="Seek back 10s">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                  </svg>
                </button>

                {/* Seek Forward 10s */}
                <button onClick={() => seek(10)} className="text-gray-300 hover:text-white transition-colors" title="Seek forward 10s">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.934 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 005 8v8a1 1 0 001.6.8l5.334-4zM19.934 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.334-4z" />
                  </svg>
                </button>

                <span className="text-xs font-mono text-gray-300 bg-black/40 px-2 py-1 rounded">
                  {Math.floor(currentTime)}s / {Math.floor(duration)}s
                </span>
              </div>

              <div className="flex items-center gap-6">
                {/* Volume Control */}
                <div className="flex items-center gap-2 group/volume">
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    {volume === 0 ? (
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3z" />
                    ) : (
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    )}
                  </svg>
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* Playback Speed */}
                <select 
                  value={playbackRate}
                  onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                  className="bg-black/40 border border-gray-700 text-gray-300 text-[10px] font-bold px-2 py-1 rounded focus:outline-none hover:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value="0.5">0.5x</option>
                  <option value="1">1.0x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2.0x</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detection Button Outside the Frame */}
      <div className="flex justify-center">
        <button
          onClick={handleManualDetection}
          disabled={isDetecting}
          className="group relative flex items-center gap-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-gray-700 disabled:to-gray-800 text-white font-extrabold py-4 px-10 rounded-2xl shadow-[0_10px_30px_-10px_rgba(37,99,235,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-50"
        >
          <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 transition-transform ${isDetecting ? 'animate-pulse' : 'group-hover:rotate-12'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="tracking-tight text-lg">
            {isDetecting ? 'Detecting Products...' : 'Detect Objects in Current Frame'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
