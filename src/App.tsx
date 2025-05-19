import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Editor from './pages/Editor';
import Export from './pages/Export';
import NotFound from './pages/NotFound';

function App() {
  const [videoData, setVideoData] = useState(null);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/upload" 
            element={<Upload setVideoData={setVideoData} />} 
          />
          <Route 
            path="/editor" 
            element={
              videoData ? <Editor videoData={videoData} setVideoData={setVideoData} /> : <Navigate to="/upload" />
            } 
          />
          <Route 
            path="/export" 
            element={
              videoData ? <Export videoData={videoData} /> : <Navigate to="/upload" />
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;