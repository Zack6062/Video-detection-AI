
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import VideoPlayer from './components/VideoPlayer';
import VideoInput from './components/VideoInput';
import ObjectCard from './components/ObjectCard';
import AuthForm from './components/Auth';
import { User, AuthView, DetectedObject } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AuthView>(AuthView.LOGIN);
  const [user, setUser] = useState<User | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [results, setResults] = useState<DetectedObject[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);

  // Persistence logic (mock)
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView(AuthView.DASHBOARD);
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
    setView(AuthView.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setView(AuthView.LOGIN);
    setVideoUrl(null);
    setResults([]);
  };

  const handleDetectionResults = (newObjects: DetectedObject[]) => {
    setResults(newObjects);
  };

  const renderContent = () => {
    if (view === AuthView.LOGIN || view === AuthView.SIGNUP) {
      return (
        <div className="flex-1 flex items-center justify-center p-4">
          <AuthForm 
            isSignup={view === AuthView.SIGNUP} 
            onSuccess={handleLogin}
            onToggle={() => setView(view === AuthView.SIGNUP ? AuthView.LOGIN : AuthView.SIGNUP)}
          />
        </div>
      );
    }

    return (
      <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left Panel: Video & Input */}
        <div className="flex-1 space-y-8">
          {!videoUrl ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-12 text-center lg:text-left">
                <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
                  Shop What You <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">See.</span>
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl">
                  Pause any video, click detect, and find the exact product across major shopping platforms instantly.
                </p>
              </div>
              <VideoInput onVideoSelect={setVideoUrl} />
            </div>
          ) : (
            <div className="space-y-6">
              <button 
                onClick={() => setVideoUrl(null)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-semibold"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                Change Video
              </button>
              <VideoPlayer 
                url={videoUrl} 
                onDetect={handleDetectionResults} 
                results={results}
                isDetecting={isDetecting}
                setIsDetecting={setIsDetecting}
              />
            </div>
          )}
        </div>

        {/* Right Panel: Results */}
        <div className="w-full lg:w-96 flex flex-col gap-6">
          <div className="bg-gray-800 rounded-xl border border-gray-700 h-full flex flex-col shadow-xl overflow-hidden min-h-[500px]">
            <div className="p-4 border-b border-gray-700 bg-gray-800/50 flex items-center justify-between">
              <h2 className="font-bold text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Detected Results
              </h2>
              <span className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded-full border border-gray-700">
                {results.length} found
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {results.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-6">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4 opacity-50">
                    <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <h3 className="text-white font-semibold mb-1">No items detected yet</h3>
                  <p className="text-sm text-gray-500">
                    Pause the video at any frame and click the detect button to see product results here.
                  </p>
                </div>
              ) : (
                results.map((obj) => (
                  <ObjectCard key={obj.id} object={obj} />
                ))
              )}
            </div>
            
            {results.length > 0 && (
              <div className="p-4 border-t border-gray-700 bg-gray-900/30">
                <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest font-bold">
                  Powered by Gemini Vision AI
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header user={user} onViewChange={setView} onLogout={handleLogout} />
      {renderContent()}
      
      <footer className="py-12 border-t border-gray-800 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-white/40 tracking-tighter uppercase italic">VideoLens</span>
            <p className="text-gray-600 text-sm">© 2024 Intelligent Shopping Platform</p>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
