import React, { useState } from 'react';
import { Download, FileText, Film, Globe, Check } from 'lucide-react';
import ProgressSteps from '../components/ProgressSteps';

interface VideoData {
  file: File;
  fileName: string;
  url: string;
  style: {
    font: string;
    size: string;
    color: string;
    backgroundColor: string;
    position: string;
  };
  subtitles: {
    id: number;
    start: number;
    end: number;
    text: string;
  }[];
  currentLanguage: string;
  languages: string[];
}

interface ExportProps {
  videoData: VideoData;
}

const Export: React.FC<ExportProps> = ({ videoData }) => {
  const [exportType, setExportType] = useState<'video' | 'srt' | 'vtt'>('video');
  const [isExporting, setIsExporting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const exportOptions = [
    { 
      id: 'video', 
      label: 'Video with Subtitles', 
      description: 'Embeds subtitles directly into the video file.',
      icon: <Film className="w-10 h-10" />,
      format: 'MP4'
    },
    { 
      id: 'srt', 
      label: 'SRT File', 
      description: 'Standard subtitle format supported by most video players.',
      icon: <FileText className="w-10 h-10" />,
      format: 'SRT'
    },
    { 
      id: 'vtt', 
      label: 'WebVTT File', 
      description: 'Web Video Text Tracks format, optimal for online videos.',
      icon: <Globe className="w-10 h-10" />,
      format: 'VTT'
    }
  ];

  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    
    // Simulate export process
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          setIsComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const formatTime = (seconds: number, format: 'srt' | 'vtt') => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    
    if (format === 'srt') {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  const generateSRTContent = () => {
    return videoData.subtitles.map((subtitle, index) => {
      return `${index + 1}\n${formatTime(subtitle.start, 'srt')} --> ${formatTime(subtitle.end, 'srt')}\n${subtitle.text}\n`;
    }).join('\n');
  };

  const generateVTTContent = () => {
    let content = 'WEBVTT\n\n';
    
    return content + videoData.subtitles.map((subtitle, index) => {
      return `${index + 1}\n${formatTime(subtitle.start, 'vtt')} --> ${formatTime(subtitle.end, 'vtt')}\n${subtitle.text}\n`;
    }).join('\n');
  };

  const downloadFile = () => {
    let content = '';
    let fileName = '';
    let mimeType = '';
    
    switch (exportType) {
      case 'srt':
        content = generateSRTContent();
        fileName = `${videoData.fileName.split('.')[0]}_${videoData.currentLanguage}.srt`;
        mimeType = 'text/plain';
        break;
      case 'vtt':
        content = generateVTTContent();
        fileName = `${videoData.fileName.split('.')[0]}_${videoData.currentLanguage}.vtt`;
        mimeType = 'text/vtt';
        break;
      case 'video':
        // In a real app, this would trigger server-side video processing
        // For now, we'll just simulate it
        fileName = `${videoData.fileName.split('.')[0]}_with_subtitles.mp4`;
        break;
    }
    
    if (exportType !== 'video') {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // For demo purposes, we'll just download the original video
      // In a real app, this would download a processed video with embedded subtitles
      const a = document.createElement('a');
      a.href = videoData.url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Export Your Video</h1>
      
      <ProgressSteps currentStep="export" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Export Options */}
        <div className="md:col-span-2">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Choose Export Format</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {exportOptions.map((option) => (
                <div 
                  key={option.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    exportType === option.id 
                      ? 'border-blue-500 bg-blue-900 bg-opacity-20' 
                      : 'border-gray-700 bg-gray-800 hover:border-gray-500'
                  }`}
                  onClick={() => setExportType(option.id as 'video' | 'srt' | 'vtt')}
                >
                  <div className="flex justify-center mb-3 text-blue-400">
                    {option.icon}
                  </div>
                  <h3 className="font-medium text-center mb-2">{option.label}</h3>
                  <p className="text-xs text-gray-400 text-center">{option.description}</p>
                  <div className="mt-3 text-center">
                    <span className="inline-block px-2 py-1 bg-gray-700 text-xs rounded">
                      {option.format}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-3">Export Details</h3>
              
              <div className="bg-gray-900 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Format:</span>
                  <span>{exportType === 'video' ? 'MP4 with embedded subtitles' : exportType.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Language:</span>
                  <span>{videoData.currentLanguage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Video duration:</span>
                  <span>{Math.floor(videoData.duration / 60)}:{(videoData.duration % 60).toString().padStart(2, '0')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtitle count:</span>
                  <span>{videoData.subtitles.length}</span>
                </div>
              </div>
              
              {exportType === 'video' && (
                <p className="mt-4 text-sm text-yellow-400 bg-yellow-400 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-md p-3">
                  Note: Exporting video with embedded subtitles may take longer depending on the video length and quality.
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Export Action */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-6">Ready to Export</h2>
          
          <div className="flex-grow mb-6">
            <div className="bg-gray-900 rounded-lg p-4 text-center mb-6">
              <div className="text-5xl text-blue-500 font-light mb-2">
                {videoData.subtitles.length}
              </div>
              <div className="text-sm text-gray-400">Subtitles in {videoData.currentLanguage}</div>
            </div>
            
            {isExporting && (
              <div>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${exportProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-center text-gray-400">
                  {exportProgress < 100 ? 'Processing...' : 'Export complete'}
                </p>
              </div>
            )}
            
            {isComplete && (
              <div className="text-center mt-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500 bg-opacity-20 text-green-400 mb-2">
                  <Check className="w-6 h-6" />
                </div>
                <p className="text-sm text-gray-300">Your export is ready to download!</p>
              </div>
            )}
          </div>
          
          <button
            className={`w-full py-3 rounded-lg font-medium flex items-center justify-center ${
              isExporting 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : isComplete 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
            } transition-colors duration-200`}
            disabled={isExporting}
            onClick={isComplete ? downloadFile : handleExport}
          >
            <Download className="w-5 h-5 mr-2" />
            {isComplete ? 'Download Now' : 'Export'}
          </button>
        </div>
      </div>
      
      <div className="mt-8 bg-blue-900 bg-opacity-20 border border-blue-800 rounded-lg p-6">
        <h3 className="font-semibold mb-3 flex items-center">
          <Check className="w-5 h-5 text-blue-400 mr-2" />
          Preview Your Subtitles
        </h3>
        <div className="max-h-60 overflow-y-auto custom-scrollbar pr-2">
          <code className="text-sm font-mono block whitespace-pre-wrap text-gray-300">
            {exportType === 'srt' 
              ? generateSRTContent() 
              : exportType === 'vtt' 
                ? generateVTTContent()
                : 'Video with embedded subtitles preview not available.'}
          </code>
        </div>
      </div>
    </div>
  );
};

export default Export;