import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Star } from 'lucide-react';
import { Button } from './Button';

export interface RatingProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value = 0,
  onChange,
  max = 5,
  readonly = false,
  size = 'md',
  className = '',
}) => {
  const [hoverValue, setHoverValue] = useState(0);
  
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`flex gap-1 ${className}`}>
      {Array.from({ length: max }).map((_, index) => {
        const ratingValue = index + 1;
        const isFilled = readonly ? ratingValue <= value : ratingValue <= (hoverValue || value);
        
        return (
          <button
            key={index}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(ratingValue)}
            onMouseEnter={() => !readonly && setHoverValue(ratingValue)}
            onMouseLeave={() => !readonly && setHoverValue(0)}
            className={`text-[#E5E1DC] hover:scale-110 transition-transform ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <Star 
              className={`${sizes[size]} ${isFilled ? 'fill-[#D97706] text-[#D97706]' : 'text-[#E5E1DC]'}`} 
            />
          </button>
        );
      })}
    </div>
  );
};

export interface FeedbackProps {
  onSubmit?: (feedback: 'positive' | 'negative', comment?: string) => void;
  className?: string;
}

export const Feedback: React.FC<FeedbackProps> = ({
  onSubmit,
  className = '',
}) => {
  const [selected, setSelected] = useState<'positive' | 'negative' | null>(null);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (selected) {
      onSubmit?.(selected, comment || undefined);
      setSelected(null);
      setComment('');
    }
  };

  return (
    <div className={`bg-white border-2 border-[#263D5B] rounded-[12px] p-4 ${className}`}>
      <p className="font-['Comfortaa', cursive] text-[#263D5B] mb-3">
        Was this helpful?
      </p>
      <div className="flex gap-3 mb-3">
        <button
          onClick={() => setSelected('positive')}
          className={`
            p-2 border-2 rounded-[8px] transition-all
            ${selected === 'positive' 
              ? 'bg-[#ECFDF5] border-[#16A34A]' 
              : 'border-[#263D5B] hover:bg-[#F8F6F3]'
            }
          `}
        >
          <ThumbsUp className={`w-5 h-5 ${selected === 'positive' ? 'text-[#16A34A]' : 'text-[#263D5B]'}`} />
        </button>
        <button
          onClick={() => setSelected('negative')}
          className={`
            p-2 border-2 rounded-[8px] transition-all
            ${selected === 'negative' 
              ? 'bg-[#FEF2F2] border-[#DC2626]' 
              : 'border-[#263D5B] hover:bg-[#F8F6F3]'
            }
          `}
        >
          <ThumbsDown className={`w-5 h-5 ${selected === 'negative' ? 'text-[#DC2626]' : 'text-[#263D5B]'}`} />
        </button>
      </div>
      {selected && (
        <>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Additional comment (optional)"
            className="
              w-full px-3 py-2 mb-3
              border-2 border-[#263D5B] rounded-[8px]
              font-['Comfortaa', cursive] text-sm
              outline-none focus:border-[#49B6E5]
            "
            rows={2}
          />
          <Button size="sm" onClick={handleSubmit}>
            Submit
          </Button>
        </>
      )}
    </div>
  );
};

export default Rating;