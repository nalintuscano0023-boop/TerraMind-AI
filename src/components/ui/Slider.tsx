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

  return (
    <div className={`relative w-full py-2 select-none ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}>
      {/* Outer alignment box with horizontal inset padding for thumb bounds */}
      <div className="relative w-full h-7 flex items-center px-[11px] box-border">
        {/* Background Track - 8px height */}
        <div className="absolute inset-x-2.5 h-2 rounded-full bg-[#0a1628]/95 border border-sky-500/20 overflow-hidden pointer-events-none shadow-inner">
          {/* Filled Progress Bar */}
          <div
            className={`h-full rounded-full ${isDragging ? '' : 'transition-[width] duration-150 ease-out'}`}
            style={{
              width: `${percentage}%`,
              background: accentColor
                ? `linear-gradient(90deg, ${accentColor}, var(--secondary))`
                : 'linear-gradient(90deg, #00E5A8 0%, #38BDF8 100%)',
              boxShadow: '0 0 10px rgba(0, 229, 168, 0.4)',
            }}
          />
        </div>

        {/* Inner Track Area for 0% to 100% position calculations */}
        <div className="relative w-full h-full pointer-events-none">
          {/* Visual Thumb - Strictly centered at top: 50%, left: percentage%, translate(-50%, -50%) */}
          <div
            className={`absolute pointer-events-none rounded-full bg-white flex items-center justify-center border-2 shadow-[0_0_12px_rgba(0,229,168,0.5),0_2px_6px_rgba(0,0,0,0.6)] ${
              isFocused ? 'ring-2 ring-[#00E5A8]/60 ring-offset-2 ring-offset-[#040d1a]' : ''
            } ${isDragging ? 'shadow-[0_0_20px_rgba(0,229,168,0.9),0_0_30px_rgba(56,189,248,0.6)]' : 'transition-[left,box-shadow] duration-150 ease-out'}`}
            style={{
              left: `${percentage}%`,
              top: '50%',
              transform: `translate(-50%, -50%) scale(${isDragging ? 1.25 : 1})`,
              width: `${THUMB_SIZE}px`,
              height: `${THUMB_SIZE}px`,
              borderColor: accentColor || '#00E5A8',
              margin: 0,
              padding: 0,
              boxSizing: 'border-box',
            }}
          >
            {/* Subtle inner core dot */}
            <div className="w-1.5 h-1.5 rounded-full bg-[#040d1a]" />
          </div>
        </div>

        {/* Accessible Native Range Input Overlay - Full Overlay Reset */}
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
          className="absolute inset-0 w-full h-full opacity-0 cursor-grab active:cursor-grabbing z-20 m-0 p-0 border-none outline-none appearance-none"
          style={{
            WebkitAppearance: 'none',
            MozAppearance: 'none',
          }}
          aria-label={ariaLabel || label || 'Slider'}
        />
      </div>
    </div>
  );
};

export default Slider;
