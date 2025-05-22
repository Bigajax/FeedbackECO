import React from 'react';

interface Option {
  label: string;
  value: string;
}

interface RadioGroupProps {
  options: Option[];
  name: string;
  value: string;
  onChange: (value: string) => void;
  layout?: 'horizontal' | 'vertical';
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  name,
  value,
  onChange,
  layout = 'horizontal'
}) => {
  return (
    <div className={`flex ${layout === 'vertical' ? 'flex-col space-y-4' : 'flex-row justify-between'} w-full`}>
      {options.map((option) => (
        <div key={option.value} className="flex flex-col items-center">
          <button
            type="button"
            className={`w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
              value === option.value
                ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => onChange(option.value)}
            aria-checked={value === option.value}
            role="radio"
          >
            {value === option.value && (
              <div className="w-5 h-5 rounded-full bg-blue-500 animate-scale"></div>
            )}
          </button>
          <label className="mt-2 text-sm text-center">{option.label}</label>
        </div>
      ))}
    </div>
  );
};

export default RadioGroup;