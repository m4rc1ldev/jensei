import React from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon } from '../constants.jsx';
import OptimizedImage from './OptimizedImage.jsx';

const LogoSection = ({ isCollapsed, toggleCollapse, isDarkMode, isMobile, closeMobileMenu, logoSize }) => (
  <div className={`flex items-center justify-between w-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'flex-col gap-2' : 'justify-between'}`}>
    <div className={`flex gap-2 items-center transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'flex-col' : ''}`}>
      {/* Collapse button when collapsed - smooth fade in/out */}
      <div 
        className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isCollapsed 
            ? 'max-h-6 opacity-100' 
            : 'max-h-0 opacity-0'
        }`}
      >
        <button 
          onClick={toggleCollapse}
          className="w-5 h-5 shrink-0 cursor-pointer hover:opacity-70 transition-all duration-300 ease-out hover:scale-110 active:scale-95"
          aria-label="Expand sidebar"
        >
          <MenuIcon isDarkMode={isDarkMode} />
        </button>
      </div>
      
      {/* Logo - always visible, smoothly transitions size and position */}
      <Link 
        to="/" 
        className={`shrink-0 cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${logoSize}`}
        onClick={isMobile ? closeMobileMenu : undefined}
      >
        <OptimizedImage
          src="/jensei-favicon.svg"
          alt="Logo"
          className="w-full h-full object-contain"
          loading="eager"
          isDarkMode={isDarkMode}
        />
      </Link>
      
      {/* Text logo - only when expanded, with smooth fade */}
      <div 
        className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          !isCollapsed 
            ? 'max-h-12 opacity-100' 
            : 'max-h-0 opacity-0'
        }`}
      >
        {!isCollapsed && (
        <Link 
          to="/" 
          className="h-11 w-18 relative cursor-pointer block"
          onClick={isMobile ? closeMobileMenu : undefined}
        >
          <OptimizedImage
            src="/jensei-logo.png"
            alt="Jensei"
            className="w-full h-full object-contain"
            loading="lazy"
            isDarkMode={isDarkMode}
          />
        </Link>
        )}
      </div>
    </div>
    
    {/* Expand button when expanded - smooth fade in/out */}
    <div 
      className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        !isCollapsed 
          ? 'max-h-6 opacity-100' 
          : 'max-h-0 opacity-0'
      }`}
    >
      {!isCollapsed && (
        <button 
          onClick={toggleCollapse}
          className="w-5 h-5 shrink-0 cursor-pointer hover:opacity-70 transition-all duration-300 ease-out hover:scale-110 active:scale-95"
          aria-label="Collapse sidebar"
        >
          <MenuIcon isDarkMode={isDarkMode} />
        </button>
      )}
    </div>
  </div>
);

export default LogoSection;
