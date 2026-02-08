import { memo } from 'react';

// Memoized SVG Icons for better performance
export const MenuIcon = memo(({ isDarkMode = false }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 5H17.5M2.5 10H17.5M2.5 15H17.5" stroke={isDarkMode ? 'rgba(255,255,255,0.9)' : 'currentColor'} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
));
MenuIcon.displayName = 'MenuIcon';

export const DoctorIcon = memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M6 21C6 17 9 14 12 14C15 14 18 17 18 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
));
DoctorIcon.displayName = 'DoctorIcon';

export const ChevronDownIcon = memo(() => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
));
ChevronDownIcon.displayName = 'ChevronDownIcon';
