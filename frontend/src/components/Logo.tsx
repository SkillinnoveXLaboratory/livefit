import React from 'react';
import { useLocation } from 'react-router-dom';

const Logo = ({ className = "" }: { className?: string }) => {
  const location = useLocation();
  const isWorkfit = location.pathname.startsWith('/workfit') || location.pathname.startsWith('/solutions');

  return (
    <div className={`flex items-center cursor-pointer ${className}`}>
      <img 
        src={isWorkfit ? "/images/workfitlogo.webp" : "/images/logo.webp"} 
        alt={isWorkfit ? "WorkFit Logo" : "LiveFit Logo"} 
        className="w-auto h-12 sm:h-16 md:h-20 lg:h-24 object-contain mix-blend-multiply transition-all duration-300 hover:scale-105"
      />
    </div>
  );
};

export default Logo;

