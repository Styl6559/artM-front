import React from 'react';
import { Star } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'glass' | 'gradient';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = true,
  onClick,
  variant = 'default'
}) => {
  const baseStyles = 'relative rounded-xl border transition-all duration-300';
  
  const variants = {
    default: 'bg-gray-800 border-gray-700 hover:border-gray-600',
    glass: 'bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10',
    gradient: 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:from-gray-700 hover:to-gray-800'
  };

  const hoverStyles = hover ? 'hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1' : '';

  return (
    <div 
      className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;