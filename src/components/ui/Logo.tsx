import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  imgClassName?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '', imgClassName = 'h-10 md:h-12 w-auto' }) => {
  return (
    <Link to="/" className={`flex items-center group cursor-pointer ${className}`} style={{ textDecoration: 'none' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
  <img src="/Aarly_logo.png" alt="Aarly Logo" className={imgClassName + ' h-16 w-16'} />
    </Link>
  );
};

export default Logo;