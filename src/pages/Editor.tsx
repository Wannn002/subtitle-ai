import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Type, Palette, Languages, AlignCenter, Save, ArrowRight } from 'lucide-react';
import ProgressSteps from '../components/ProgressSteps';

interface Subtitle {
  id: number;
  start: number;
  end: number;
  text: string;
}

interface VideoStyle {
  font: string;
  size: string;
  color: string;
  backgroundColor: string;
  position: string;
}

interface VideoData {
  file: File;
  url: string;
  fileName: string;
  duration: number;
  subtitles: Subtitle[];
  languages: string[];
  currentLanguage: string;
  style: VideoStyle;
}

interface EditorProps {
  videoData: VideoData;
  setVideoData: React.Dispatch<React.SetStateAction<any>>;
}

const Editor: React.FC<EditorProps> = ({ videoData, setVideoData }) => {
  const [currentTab, setCurrentTab] = useState<'subtitles' | 'style'>('subtitles');
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(-1);
  const [editingSubtitle, setEditingSubtitle] = useState<Subtitle | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const subtitlesRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const fontOptions = ['Arial', 'Helvetica', 'Georgia', 'Verdana', 'Tahoma', 'Trebuchet MS'];
  const sizeOptions = ['small', 'medium', 'large'];
  const positionOptions = ['top', 'middle', 'bottom'];
  const languageOptions = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        videoRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [videoData]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      
      // Find current subtitle
      const index = videoData.subtitles.findIndex(
        sub => time >= sub.start && time <= sub.end
      );
      
      setCurrentSubtitleIndex(index);
      
      // Scroll to current subtitle in the editor
      if (index !== -1 && subtitlesRef.current) {
        const subtitleElement = document.getElementById(`subtitle-${index}`);
        if (subtitleElement) {
          subtitlesRef.current.scrollTop = subtitleElement.offsetTop - subtitlesRef.current.offsetTop - 100;
        }
      }
    }
  };

  const updateSubtitle = (index: number, updatedSubtitle: Subtitle) => {
    const updatedSubtitles = [...videoData.subtitles];
    updatedSubtitles[index] = updatedSubtitle;
    
    setVideoData({
      ...videoData,
      subtitles: updatedSubtitles
    });
  };

  const handleStyleChange = (property: keyof VideoStyle, value: string) => {
    setVideoData({
      ...videoData,
      style: {
        ...videoData.style,
        [property]: value
      }
    });
  };

  const handleLanguageChange = (language: string) => {
    // In a real app, this would trigger a translation API call
    setVideoData({
      ...videoData,
      currentLanguage: language
    });
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  const parseTime = (timeString: string): number => {
    const [minSec, ms] = timeString.split('.');
    const [min, sec] = minSec.split(':');
    
    return parseInt(min) * 60 + parseInt(sec) + parseInt(ms) / 1000;
  };

  const handleStartEditing = (subtitle: Subtitle) => {
    setEditingSubtitle({ ...subtitle });
    // Seek to subtitle start time
    if (videoRef.current) {
      videoRef.current.currentTime = subtitle.start;
      videoRef.current.pause();
    }
  };

  const handleSaveSubtitle = () => {
    if (editingSubtitle) {
      const index = videoData.subtitles.findIndex(s => s.id === editingSubtitle.id);
      if (index !== -1) {
        updateSubtitle(index, editingSubtitle);
      }
      setEditingSubtitle(null);
    }
  };

  const handleContinue = () => {
    navigate('/export');
  };

  const getSubtitleStyle = () => {
    const { font, size, color, backgroundColor, position } = videoData.style;
    
    const sizeMap = {
      small: '16px',
      medium: '24px',
      large: '32px'
    };
    
    const positionMap = {
      top: 'top: 10%; bottom: auto;',
      middle: 'top: 50%; transform: translateY(-50%);',
      bottom: 'bottom: 10%; top: auto;'
    };
    
    return {
      fontFamily: font,
      fontSize: sizeMap[size as keyof typeof sizeMap],
      color: color,
      backgroundColor: backgroundColor,
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '8px 16px',
      borderRadius: '4px',
      maxWidth: '80%',
      textAlign: 'center' as const,
      ...positionMap[position as keyof typeof positionMap]
    };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Edit & Customize Subtitles</h1>
      
      <ProgressSteps currentStep="editor" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Video Preview */}
        <div className="lg:col-span-2 bg-gray-800 rounded-lg p-4 shadow-lg">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full rounded"
              src={videoData.url}
              controls
            />
            
            {currentSubtitleIndex !== -1 && (
              <div 
                className="subtitle-display"
                style={{
                  ...getSubtitleStyle(),
                  position: 'absolute',
                  zIndex: 10,
                }}
              >
                {videoData.subtitles[currentSubtitleIndex].text}
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <div className="flex space-x-2 text-sm text-gray-300">
              <span>Current time: {formatTime(currentTime)}</span>
              <span>|</span>
              <span>Duration: {formatTime(videoData.duration)}</span>
            </div>
          </div>
        </div>
        
        {/* Editor Panel */}
        <div className="bg-gray-800 rounded-lg shadow-lg flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button
              className={`flex-1 py-3 flex justify-center items-center space-x-1 ${
                currentTab === 'subtitles' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              onClick={() => setCurrentTab('subtitles')}
            >
              <Edit className="w-4 h-4" />
              <span>Subtitles</span>
            </button>
            <button
              className={`flex-1 py-3 flex justify-center items-center space-x-1 ${
                currentTab === 'style' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              onClick={() => setCurrentTab('style')}
            >
              <Type className="w-4 h-4" />
              <span>Style</span>
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="p-4 flex-grow">
            {currentTab === 'subtitles' && (
              <div className="h-full flex flex-col">
                <div className="mb-4 flex items-center space-x-2">
                  <Languages className="w-5 h-5 text-gray-400" />
                  <select
                    className="bg-gray-700 text-white border-0 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={videoData.currentLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                  >
                    {languageOptions.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                
                <div 
                  ref={subtitlesRef}
                  className="flex-grow overflow-y-auto space-y-2 pr-2 custom-scrollbar"
                  style={{ maxHeight: '400px' }}
                >
                  {videoData.subtitles.map((subtitle, index) => (
                    <div 
                      key={subtitle.id}
                      id={`subtitle-${index}`}
                      className={`p-3 rounded ${
                        currentSubtitleIndex === index 
                          ? 'bg-blue-900 bg-opacity-40 border border-blue-700' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      } transition-colors duration-200`}
                    >
                      {editingSubtitle && editingSubtitle.id === subtitle.id ? (
                        <div className="space-y-2">
                          <div className="flex space-x-2">
                            <div>
                              <label className="text-xs text-gray-400 block mb-1">Start Time</label>
                              <input
                                type="text"
                                value={formatTime(editingSubtitle.start)}
                                onChange={(e) => setEditingSubtitle({
                                  ...editingSubtitle,
                                  start: parseTime(e.target.value)
                                })}
                                className="bg-gray-900 text-white border border-gray-600 rounded px-2 py-1 text-sm w-24"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-400 block mb-1">End Time</label>
                              <input
                                type="text"
                                value={formatTime(editingSubtitle.end)}
                                onChange={(e) => setEditingSubtitle({
                                  ...editingSubtitle,
                                  end: parseTime(e.target.value)
                                })}
                                className="bg-gray-900 text-white border border-gray-600 rounded px-2 py-1 text-sm w-24"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 block mb-1">Text</label>
                            <textarea
                              value={editingSubtitle.text}
                              onChange={(e) => setEditingSubtitle({
                                ...editingSubtitle,
                                text: e.target.value
                              })}
                              className="bg-gray-900 text-white border border-gray-600 rounded px-3 py-2 text-sm w-full"
                              rows={2}
                            />
                          </div>
                          <div className="flex justify-end">
                            <button
                              onClick={handleSaveSubtitle}
                              className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                            >
                              <Save className="w-4 h-4 inline mr-1" />
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="cursor-pointer" 
                          onClick={() => handleStartEditing(subtitle)}
                        >
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>{formatTime(subtitle.start)} - {formatTime(subtitle.end)}</span>
                            <span>{(subtitle.end - subtitle.start).toFixed(1)}s</span>
                          </div>
                          <p className="text-sm">{subtitle.text}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {currentTab === 'style' && (
              <div className="space-y-6">
                <div>
                  <label className="flex items-center text-sm text-gray-300 mb-2">
                    <Type className="w-4 h-4 mr-2" />
                    Font
                  </label>
                  <select
                    className="bg-gray-700 text-white border-0 rounded w-full px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={videoData.style.font}
                    onChange={(e) => handleStyleChange('font', e.target.value)}
                  >
                    {fontOptions.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="flex items-center text-sm text-gray-300 mb-2">
                    <AlignCenter className="w-4 h-4 mr-2" />
                    Size
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {sizeOptions.map(size => (
                      <button
                        key={size}
                        className={`py-2 px-3 rounded capitalize ${
                          videoData.style.size === size 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        onClick={() => handleStyleChange('size', size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center text-sm text-gray-300 mb-2">
                    <Palette className="w-4 h-4 mr-2" />
                    Colors
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">
                        Text Color
                      </label>
                      <input
                        type="color"
                        value={videoData.style.color}
                        onChange={(e) => handleStyleChange('color', e.target.value)}
                        className="w-full h-10 rounded border-0 bg-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">
                        Background
                      </label>
                      <input
                        type="color"
                        value={videoData.style.backgroundColor.slice(0, 7)}
                        onChange={(e) => handleStyleChange('backgroundColor', `${e.target.value}AA`)}
                        className="w-full h-10 rounded border-0 bg-transparent"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center text-sm text-gray-300 mb-2">
                    <AlignCenter className="w-4 h-4 mr-2" />
                    Position
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {positionOptions.map(position => (
                      <button
                        key={position}
                        className={`py-2 px-3 rounded capitalize ${
                          videoData.style.position === position 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        onClick={() => handleStyleChange('position', position)}
                      >
                        {position}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Action Button */}
          <div className="p-4 border-t border-gray-700">
            <button
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
              onClick={handleContinue}
            >
              Continue to Export
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;