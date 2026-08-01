import React, { useState } from 'react';

interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
  accentColor?: string;
  'aria-label'?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  label,
  className = '',
  disabled = false,
  accentColor,
  'aria-label': ariaLabel,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Compute percentage (clamped between 0 and 100)
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  // Thumb diameter in px
  const THUMB_SIZE = 22;

  // Calculate exact left offset so thumb never clips edges at 0% or 100%
  // Formula: left = calc(P% - (P / 100) * THUMB_SIZE px)
  const thumbLeft = `calc(${percentage}% - ${(percentage / 100) * THUMB_SIZE}px)`;

  return (
    <div className={`relative w-full py-1.5 select-none ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}>
      {/* Container for alignment */}
      <div className="relative w-full h-6 flex items-center">
        {/* Background Track - 8px height */}
        <div className="absolute inset-x-0 h-2 rounded-full bg-[#0a1628]/90 border border-sky-500/15 overflow-hidden pointer-events-none shadow-inner">
          {/* Filled Progress Bar - 8px height matching track */}
          <div
            className={`h-full rounded-full ${isDragging ? '' : 'transition-[width] duration-200 ease-out'}`}
            style={{
              width: `${percentage}%`,
              background: accentColor
                ? `linear-gradient(90deg, ${accentColor}, var(--secondary))`
                : 'linear-gradient(90deg, #00E5A8 0%, #38BDF8 100%)',
              boxShadow: '0 0 10px rgba(0, 229, 168, 0.4)',
            }}
          />
        </div>

        {/* Visual Thumb - 22px x 22px */}
        <div
          className={`absolute pointer-events-none rounded-full bg-white flex items-center justify-center border-2 border-[#00E5A8] shadow-[0_0_12px_rgba(0,229,168,0.5),0_2px_6px_rgba(0,0,0,0.6)] ${
            isDragging
              ? 'scale-125 border-[#00FFB9] shadow-[0_0_20px_rgba(0,229,168,0.8),0_0_30px_rgba(56,189,248,0.5)]'
              : 'group-hover:scale-110'
          } ${isFocused ? 'ring-2 ring-[#00E5A8]/50 ring-offset-2 ring-offset-[#040d1a]' : ''} ${
            isDragging ? '' : 'transition-[left,transform,box-shadow] duration-200 ease-out'
          }`}
          style={{
            left: thumbLeft,
            width: `${THUMB_SIZE}px`,
            height: `${THUMB_SIZE}px`,
            top: '50%',
            transform: `translateY(-50%) ${isDragging ? 'scale(1.2)' : 'scale(1)'}`,
            borderColor: accentColor || '#00E5A8',
          }}
        >
          {/* Subtle inner core dot */}
          <div className="w-1.5 h-1.5 rounded-full bg-[#040d1a]" />
        </div>

        {/* Accessible Native Range Input Overlay */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-grab active:cursor-grabbing z-20 appearance-none margin-0 padding-0"
          aria-label={ariaLabel || label || 'Slider'}
        />
      </div>
    </div>
  );
};

export default Slider;
