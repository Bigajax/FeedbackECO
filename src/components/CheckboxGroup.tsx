import React from 'react';

interface Option {
  label: string;
  value: string;
}

interface CheckboxGroupProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  selectedValues,
  onChange
}) => {
  const handleChange = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 w-full">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`px-4 py-2 rounded-full border transition-all duration-300 ${
            selectedValues.includes(option.value)
              ? 'border-blue-500 bg-blue-500 bg-opacity-10 text-blue-700'
              : 'border-gray-300 hover:border-gray-400 text-gray-700'
          }`}
          onClick={() => handleChange(option.value)}
          aria-pressed={selectedValues.includes(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default CheckboxGroup;