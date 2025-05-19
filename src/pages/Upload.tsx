import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, X, FileVideo, Clock, CheckCircle } from 'lucide-react';
import ProgressSteps from '../components/ProgressSteps';

interface UploadProps {
  setVideoData: (data: any) => void;
}

const Upload: React.FC<UploadProps> = ({ setVideoData }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateFile = (file: File): boolean => {
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    const maxSize = 200 * 1024 * 1024; // 200MB

    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a video file (MP4, WebM, OGG, or MOV).');
      return false;
    }

    if (file.size > maxSize) {
      setError('File is too large. Maximum size is 200MB.');
      return false;
    }

    return true;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // This function simulates the AI processing the video and generating subtitles
  const processVideo = () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    // Simulate processing with progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Create mock video data with subtitles
          const mockVideoData = {
            file,
            url: URL.createObjectURL(file),
            fileName: file.name,
            duration: 120, // Mock duration in seconds
            subtitles: [
              { id: 1, start: 0, end: 3, text: "Hello and welcome to this video." },
              { id: 2, start: 4, end: 7, text: "Today we're going to talk about AI." },
              { id: 3, start: 8, end: 12, text: "Artificial Intelligence is changing the world." },
              { id: 4, start: 13, end: 16, text: "Let me show you how it works." },
              { id: 5, start: 17, end: 22, text: "First, we gather data from various sources." },
              { id: 6, start: 23, end: 28, text: "Then, we process this data using algorithms." },
              { id: 7, start: 29, end: 35, text: "Finally, we use machine learning to improve accuracy." },
              { id: 8, start: 36, end: 40, text: "This is just a simple example of AI in action." },
              { id: 9, start: 41, end: 45, text: "Thank you for watching this demonstration." },
            ],
            languages: ["English"],
            currentLanguage: "English",
            style: {
              font: "Arial",
              size: "medium",
              color: "#FFFFFF",
              backgroundColor: "#000000AA",
              position: "bottom",
            }
          };
          
          setTimeout(() => {
            setVideoData(mockVideoData);
            setIsProcessing(false);
            navigate('/editor');
          }, 500);
          
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Upload Your Video</h1>
      
      <ProgressSteps currentStep="upload" />
      
      <div className="mb-8">
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors duration-200 ${
            isDragging 
              ? 'border-blue-500 bg-blue-50 bg-opacity-10' 
              : 'border-gray-600 hover:border-blue-400 hover:bg-blue-50 hover:bg-opacity-5'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {!file ? (
            <>
              <UploadIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg mb-2">Drag and drop your video here</p>
              <p className="text-sm text-gray-400 mb-4">or click to browse files</p>
              <p className="text-xs text-gray-500">Supported formats: MP4, WebM, OGG, MOV (max 200MB)</p>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <FileVideo className="w-16 h-16 mx-auto text-blue-500 mb-4" />
              <p className="text-lg font-medium mb-2">{file.name}</p>
              <p className="text-sm text-gray-400 mb-4">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <button
                className="flex items-center text-red-400 hover:text-red-500 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
              >
                <X className="w-4 h-4 mr-1" />
                Remove
              </button>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/mp4,video/webm,video/ogg,video/quicktime"
            className="hidden"
          />
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-900 bg-opacity-20 border border-red-700 text-red-400 rounded-md">
            {error}
          </div>
        )}
      </div>
      
      {file && !isProcessing && (
        <div className="text-center">
          <button
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
            onClick={processVideo}
          >
            Generate Subtitles
          </button>
          <p className="mt-2 text-sm text-gray-400">
            Our AI will analyze your video and generate subtitles automatically
          </p>
        </div>
      )}
      
      {isProcessing && (
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <Clock className="w-6 h-6 text-blue-500 mr-3 animate-pulse" />
            <h3 className="text-xl font-semibold">Processing Video</h3>
          </div>
          
          <div className="mb-4">
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">Analyzing audio</span>
              <span className="text-xs text-gray-400">{Math.round(progress)}%</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-300 space-y-2">
            <div className="flex items-center">
              {progress >= 30 ? (
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              ) : (
                <div className="w-4 h-4 mr-2"></div>
              )}
              <span className={progress >= 30 ? "text-gray-300" : "text-gray-500"}>
                Analyzing audio
              </span>
            </div>
            <div className="flex items-center">
              {progress >= 60 ? (
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              ) : (
                <div className="w-4 h-4 mr-2"></div>
              )}
              <span className={progress >= 60 ? "text-gray-300" : "text-gray-500"}>
                Generating transcription
              </span>
            </div>
            <div className="flex items-center">
              {progress >= 90 ? (
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              ) : (
                <div className="w-4 h-4 mr-2"></div>
              )}
              <span className={progress >= 90 ? "text-gray-300" : "text-gray-500"}>
                Finalizing subtitles
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;