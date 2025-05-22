import React, { useState, useRef, useEffect } from 'react';

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  showLabels?: boolean;
}

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  value,
  onChange,
  showLabels = true
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!trackRef.current) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newValue = Math.round(min + percentage * (max - min));
    onChange(newValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full px-1">
      <div
        ref={trackRef}
        className="relative h-6 flex items-center cursor-pointer"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="w-full h-1 bg-gray-200 rounded-full"></div>
        <div
          className="absolute h-1 left-0 bg-blue-500 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
        <div
          className="absolute w-6 h-6 bg-white border border-gray-200 rounded-full shadow-md transition-transform transform -translate-y-0 -translate-x-3 hover:scale-110"
          style={{ left: `${percentage}%` }}
        ></div>
      </div>
      
      {showLabels && (
        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-500">{min}</span>
          <span className="text-sm text-gray-500">{max}</span>
        </div>
      )}
    </div>
  );
};

export default Slider;