import { memo, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import { useSidebar } from '../../../contexts/SidebarContext';
import { clearAuth } from '../../../utils/auth';

// Hooks
import useUserData from './hooks/useUserData';
import useThreads from './hooks/useThreads';
import useSidebarState from './hooks/useSidebarState';

// Components
import LogoSection from './components/LogoSection';
import NavigationItems from './components/NavigationItems';
import BottomSection from './components/BottomSection';

/**
 * SideNavigation - Main orchestrator component for the collapsible sidebar
 * Manages:
 * - User authentication state
 * - Chat threads
 * - Sidebar collapse/expand state
 * - Mobile overlay behavior
 * - Dark/Light mode toggle
 * - Navigation and logout
 */
const SideNavigation = () => {
  const navigate = useNavigate();
  const clickTimeoutRef = useRef(null);
  const prevCollapsedRef = useRef(false);
  
  const { isCollapsed, toggleCollapse, isMobileMenuOpen, closeMobileMenu, isMobile } = useSidebar();
  const { isDarkMode, toggleTheme } = useTheme();
  
  // Custom hooks for data and state management
  const { user, loadingUser, userName, userPlan, userPicture } = useUserData();
  const { threads } = useThreads();
  const { 
    isDoctorExpanded, 
    isRecentExpanded, 
    toggleDoctorExpanded, 
    toggleRecentExpanded 
  } = useSidebarState(isCollapsed, prevCollapsedRef, clickTimeoutRef);

  // Handle user logout
  const handleLogout = async () => {
    try {
      await clearAuth();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate even if clearAuth fails
      navigate('/');
    }
  };

  // Mobile behavior: hide sidebar by default, show as overlay when open
  const isVisible = isMobile ? isMobileMenuOpen : true;
  const isOverlay = isMobile && isMobileMenuOpen;

  // Memoized class names for better performance
  const sidebarClasses = useMemo(() => 
    `${isDarkMode ? 'bg-[#111111] border-r border-[rgba(255,255,255,0.1)]' : 'bg-[#f8f8f8] border-r border-[rgba(0,0,0,0.06)]'} flex flex-col h-screen items-center transition-[background-color,border-color] duration-100 ease-out shrink-0 fixed left-0 top-0 z-50 overflow-hidden ${
      isCollapsed ? 'px-6 py-6 w-[80px]' : 'px-4 sm:px-6 py-6 sm:py-8 w-56 sm:w-64'
    } ${
      isMobile 
        ? (isVisible ? 'translate-x-0' : '-translate-x-full') 
        : ''
    }`, [isCollapsed, isMobile, isVisible, isDarkMode]
  );

  const logoSize = useMemo(() => isCollapsed ? 'w-6 h-6' : 'w-7 h-7', [isCollapsed]);

  return (
    <>
      {/* Backdrop for mobile overlay */}
      {isOverlay && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div 
        className={sidebarClasses}
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          height: '100vh',
          maxHeight: '100vh',
          minHeight: '100vh',
          zIndex: 50,
          overflow: 'hidden',
          flexGrow: 0,
          flexShrink: 0,
        }}
      >
        {/* Top Section - Logo and collapse/expand controls */}
        <LogoSection
          isCollapsed={isCollapsed}
          isDarkMode={isDarkMode}
          toggleCollapse={toggleCollapse}
          closeMobileMenu={closeMobileMenu}
          isMobile={isMobile}
          logoSize={logoSize}
        />

        {/* Middle Section - Navigation items (New Chat, Doctor, Lab Test, Recent) */}
        <NavigationItems
          isCollapsed={isCollapsed}
          isDarkMode={isDarkMode}
          isDoctorExpanded={isDoctorExpanded}
          isRecentExpanded={isRecentExpanded}
          toggleDoctorExpanded={toggleDoctorExpanded}
          toggleRecentExpanded={toggleRecentExpanded}
          threads={threads}
          navigate={navigate}
          closeMobileMenu={closeMobileMenu}
          isMobile={isMobile}
        />

        {/* Bottom Section - Private Mode, Dark Mode, User Profile, Logout */}
        <BottomSection
          isCollapsed={isCollapsed}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          loadingUser={loadingUser}
          userName={userName}
          userPlan={userPlan}
          userPicture={userPicture}
          handleLogout={handleLogout}
          navigate={navigate}
        />
      </div>
    </>
  );
};

export default memo(SideNavigation);
