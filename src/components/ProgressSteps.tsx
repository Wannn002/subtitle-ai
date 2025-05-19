import React from 'react';
import { Check, Upload, Edit, Download } from 'lucide-react';

type Step = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

interface ProgressStepsProps {
  currentStep: string;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep }) => {
  const steps: Step[] = [
    { id: 'upload', label: 'Upload', icon: <Upload className="w-5 h-5" /> },
    { id: 'editor', label: 'Edit', icon: <Edit className="w-5 h-5" /> },
    { id: 'export', label: 'Export', icon: <Download className="w-5 h-5" /> }
  ];

  const currentIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="w-full py-6">
      <div className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step */}
            <div className="relative flex flex-col items-center">
              <div 
                className={`flex items-center justify-center rounded-full w-10 h-10 transition-colors duration-200 ${
                  index < currentIndex 
                    ? 'bg-green-500' 
                    : index === currentIndex 
                      ? 'bg-blue-500' 
                      : 'bg-gray-700'
                }`}
              >
                {index < currentIndex ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <div className="text-white">{step.icon}</div>
                )}
              </div>
              <div className="text-xs mt-2">{step.label}</div>
            </div>
            
            {/* Line between steps */}
            {index < steps.length - 1 && (
              <div 
                className={`flex-auto border-t-2 transition-colors duration-200 ${
                  index < currentIndex ? 'border-green-500' : 'border-gray-700'
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;