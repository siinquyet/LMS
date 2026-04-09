import React from 'react';
import { Check } from 'lucide-react';

export interface Step {
  id: string;
  title: string;
  description?: string;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
  className = '',
}) => {
  const isCompleted = (index: number) => index < currentStep;
  const isCurrent = (index: number) => index === currentStep;

  return (
    <div className={`
      ${orientation === 'horizontal' ? 'flex items-center' : 'flex flex-col'}
      ${className}
    `}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div 
            onClick={() => onStepClick?.(index)}
            className={`
              flex items-center gap-3
              ${orientation === 'horizontal' ? 'flex-col' : 'flex-row'}
              ${onStepClick ? 'cursor-pointer' : ''}
            `}
          >
            <div className={`
              w-10 h-10 rounded-full border-2 border-[#263D5B]
              flex items-center justify-center
              font-['Comfortaa', cursive] text-base
              transition-all duration-150
              ${isCompleted(index) 
                ? 'bg-[#16A34A] text-white border-[#16A34A]' 
                : isCurrent(index)
                  ? 'bg-[#49B6E5] text-white border-[#49B6E5]'
                  : 'bg-white text-[#6B7280]'
              }
            `}>
              {isCompleted(index) ? (
                <Check className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </div>
            <div className={`
              ${orientation === 'horizontal' ? 'text-center' : 'text-left'}
            `}>
              <span className={`
                font-['Comfortaa', cursive] text-base
                ${isCurrent(index) ? 'text-[#263D5B]' : 'text-[#6B7280]'}
              `}>
                {step.title}
              </span>
              {step.description && (
                <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">
                  {step.description}
                </p>
              )}
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className={`
              flex-1
              ${orientation === 'horizontal' 
                ? 'h-0.5 w-8 mx-2 bg-[#E5E1DC]' 
                : 'w-0.5 h-8 mx-4 bg-[#E5E1DC]'
              }
            `}>
              <div className={`
                h-full bg-[#49B6E5]
                transition-all duration-300
                ${isCompleted(index) ? 'w-full' : 'w-0'}
              `} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stepper;