import React from 'react';
import { Link } from 'react-router-dom';
import { Subtitles, Languages, SlidersHorizontal as SliderHorizontal, Upload } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Subtitles className="w-10 h-10 text-blue-500" />,
      title: 'Automatic Subtitling',
      description: 'Our AI technology automatically transcribes your videos with high accuracy, saving you hours of manual work.'
    },
    {
      icon: <Languages className="w-10 h-10 text-blue-500" />,
      title: 'Multiple Languages',
      description: 'Support for over 50 languages with automatic language detection and translation capabilities.'
    },
    {
      icon: <SliderHorizontal className="w-10 h-10 text-blue-500" />,
      title: 'Customization',
      description: 'Customize your subtitles with different fonts, sizes, colors, and positions to match your brand style.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          AI-Powered Video Subtitles
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Automatically generate, customize, and download high-quality subtitles for your videos in minutes, not hours.
        </p>
        <Link 
          to="/upload" 
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Upload className="w-5 h-5 mr-2" />
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose SubtitleAI</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gray-800 rounded-xl p-6 shadow-lg transform hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 md:space-x-4">
          <div className="flex flex-col items-center text-center max-w-xs">
            <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload Your Video</h3>
            <p className="text-gray-300">Upload your video file in any common format (MP4, AVI, MOV, etc.).</p>
          </div>
          
          <div className="flex flex-col items-center text-center max-w-xs">
            <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Processing</h3>
            <p className="text-gray-300">Our AI automatically transcribes the audio and generates accurate subtitles.</p>
          </div>
          
          <div className="flex flex-col items-center text-center max-w-xs">
            <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Edit & Customize</h3>
            <p className="text-gray-300">Review, edit, and customize your subtitles with our intuitive editor.</p>
          </div>
          
          <div className="flex flex-col items-center text-center max-w-xs">
            <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl font-bold">4</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Download</h3>
            <p className="text-gray-300">Download your video with embedded subtitles or as separate subtitle files.</p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of content creators who save time and reach wider audiences with our AI-powered subtitle generator.</p>
        <Link 
          to="/upload" 
          className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <Upload className="w-5 h-5 mr-2" />
          Try SubtitleAI Now
        </Link>
      </section>
    </div>
  );
};

export default Home;