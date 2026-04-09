import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from './Button';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  image?: React.ReactNode;
}

export interface OnboardingProps {
  steps: OnboardingStep[];
  onComplete?: () => void;
  onSkip?: () => void;
  className?: string;
}

export const Onboarding: React.FC<OnboardingProps> = ({
  steps,
  onComplete,
  onSkip,
  className = '',
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const goNext = () => {
    if (isLastStep) {
      onComplete?.();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className={`bg-white border-2 border-[#263D5B] rounded-[16px] p-8 ${className}`}>
      <div className="flex justify-center mb-6">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`
              w-3 h-3 rounded-full mx-1
              border-2 border-[#263D5B]
              transition-all duration-150
              ${index === currentStep ? 'bg-[#49B6E5]' : index < currentStep ? 'bg-[#16A34A]' : 'bg-white'}
            `}
          />
        ))}
      </div>

      <div className="text-center mb-8">
        {steps[currentStep].image && (
          <div className="mb-6 flex justify-center">
            {steps[currentStep].image}
          </div>
        )}
        <h2 className="font-['Comfortaa', cursive] text-2xl text-[#263D5B] mb-2">
          {steps[currentStep].title}
        </h2>
        <p className="font-['Comfortaa', cursive] text-[#6B7280]">
          {steps[currentStep].description}
        </p>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onSkip}
        >
          Skip
        </Button>
        <div className="flex gap-3">
          {!isFirstStep && (
            <Button variant="secondary" onClick={goPrev}>
              <ChevronLeft className="w-4 h-4" /> Prev
            </Button>
          )}
          <Button variant="primary" onClick={goNext}>
            {isLastStep ? (
              <>Complete <Check className="w-4 h-4" /></>
            ) : (
              <>Next <ChevronRight className="w-4 h-4" /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;