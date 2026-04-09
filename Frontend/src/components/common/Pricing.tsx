import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from './Button';

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period?: string;
  description?: string;
  features: string[];
  notIncluded?: string[];
  highlighted?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
}

export interface PricingProps {
  plans: PricingPlan[];
  className?: string;
}

export const Pricing: React.FC<PricingProps> = ({
  plans,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`
            relative
            bg-white
            border-2 border-[#263D5B]
            rounded-[16px]
            p-6
            transition-all duration-150
            ${plan.highlighted 
              ? 'shadow-[4px_4px_0px_#49B6E5] transform scale-105' 
              : 'shadow-[3px_3px_0px_#E5E1DC] hover:shadow-[4px_4px_0px_#E5E1DC] hover:-translate-y-1'
            }
          `}
        >
          {plan.highlighted && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#49B6E5] text-white font-['Comfortaa', cursive] text-sm rounded-full">
              Popular
            </div>
          )}
          
          <h3 className="font-['Comfortaa', cursive] text-xl text-[#263D5B] text-center mb-2">
            {plan.name}
          </h3>
          
          <div className="text-center mb-4">
            <span className="font-['Comfortaa', cursive] text-4xl text-[#263D5B]">
              {plan.price.toLocaleString()}₫
            </span>
            {plan.period && (
              <span className="font-['Comfortaa', cursive] text-[#6B7280]">
                /{plan.period}
              </span>
            )}
          </div>
          
          {plan.description && (
            <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280] text-center mb-4">
              {plan.description}
            </p>
          )}
          
          <div className="space-y-2 mb-6">
            {plan.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#16A34A]" />
                <span className="font-['Comfortaa', cursive] text-sm text-[#263D5B]">
                  {feature}
                </span>
              </div>
            ))}
            {plan.notIncluded?.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 opacity-50">
                <X className="w-4 h-4 text-[#DC2626]" />
                <span className="font-['Comfortaa', cursive] text-sm text-[#6B7280] line-through">
                  {feature}
                </span>
              </div>
            ))}
          </div>
          
          <Button
            variant={plan.highlighted ? 'primary' : 'secondary'}
            className="w-full"
            onClick={plan.onButtonClick}
          >
            {plan.buttonText || 'Get Started'}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Pricing;