import React from 'react';

interface TextInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({
  placeholder,
  value,
  onChange
}) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
    />
  );
};

export default TextInput;