import React from 'react';

// Step indicator for multi-step booking
const StepIndicator = ({ currentStep, totalSteps }) => (
  <div className="flex items-center justify-center gap-2 mb-6">
    {[...Array(totalSteps)].map((_, i) => (
      <React.Fragment key={i}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
          i + 1 <= currentStep
            ? 'bg-gradient-to-r from-[#796bff] to-[#4c9eff] text-white'
            : 'bg-gray-100 text-gray-400'
        }`}>
          {i + 1 < currentStep ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            i + 1
                )}
              </div>
        {i < totalSteps - 1 && (
          <div className={`h-0.5 w-8 rounded transition-all duration-300 ${
            i + 1 < currentStep ? 'bg-[#4c9eff]' : 'bg-gray-200'
          }`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

export default StepIndicator;
