import React from 'react';

interface QuestionCardProps {
  children: React.ReactNode;
  title: string;
  className?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  children,
  title,
  className = ''
}) => {
  return (
    <div className={`bg-white bg-opacity-70 backdrop-blur-md rounded-2xl p-6 shadow-lg w-full max-w-md mx-auto ${className}`}>
      <h2 className="text-xl font-medium mb-6 text-gray-800">{title}</h2>
      {children}
    </div>
  );
};

export default QuestionCard;