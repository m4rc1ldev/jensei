import { memo } from 'react';
import OptimizedImage from './OptimizedImage';

/**
 * BottomSection - Bottom fixed section with Private Mode, Dark Mode toggle, User Profile, Logout
 * @param {Object} props
 * @param {boolean} props.isCollapsed - Whether sidebar is collapsed
 * @param {boolean} props.isDarkMode - Whether dark mode is enabled
 * @param {Function} props.toggleTheme - Function to toggle theme
 * @param {boolean} props.loadingUser - Whether user data is loading
 * @param {string} props.userName - User's display name
 * @param {string} props.userPlan - User's plan name
 * @param {string} props.userPicture - User's avatar URL
 * @param {Function} props.handleLogout - Logout handler
 * @param {Function} props.navigate - Navigation function from useNavigate
 */
const BottomSection = ({
  isCollapsed,
  isDarkMode,
  toggleTheme,
  loadingUser,
  userName,
  userPlan,
  userPicture,
  handleLogout,
  navigate,
}) => {
  return (
    <div className={`flex flex-col gap-3 items-center justify-center w-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex-shrink-0 mt-auto ${isCollapsed ? 'gap-9' : ''}`}>
      {/* Private Mode */}
      <div onClick={() => navigate('/private', { replace: true })} className={`flex gap-2 items-center justify-center px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ease-out ${
        isCollapsed 
          ? 'w-5 h-5 p-0 border-0' 
          : `w-full border ${
              isDarkMode 
                ? 'bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.1)] hover:shadow-[0_2px_8px_rgba(255,255,255,0.1)]' 
                : 'bg-[#f8f8f8] border-[rgba(0,0,0,0.08)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
            }`
      }`}>
        <div className={`shrink-0 ${isCollapsed ? 'w-5 h-5' : 'w-5 h-5'}`}>
          <OptimizedImage
            src="/doctors-listing/a15ebe8edc9e3a75a9dc9f38418a63e8d1164028.svg"
            alt="Private Mode"
            className="w-full h-full object-contain"
            loading="lazy"
            isDarkMode={isDarkMode}
          />
        </div>
        {!isCollapsed && (
          <p className={`font-medium text-sm text-center whitespace-nowrap transition-[opacity,color] duration-100 ease-out ${
            isDarkMode ? 'text-white' : 'text-[rgba(0,0,0,0.8)]'
          }`}>Private Mode</p>
        )}
      </div>

      {/* Dark Mode / Sun Icon (shown when collapsed) */}
      {isCollapsed && (
        <button 
          onClick={toggleTheme}
          className="w-6 h-6 shrink-0 cursor-pointer hover:opacity-70 transition-opacity duration-200"
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <OptimizedImage
            src="/doctors-listing/89a062784942952e8419eb87a5269cf1d6553597.svg"
            alt={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            className="w-full h-full object-contain"
            loading="lazy"
            isDarkMode={isDarkMode}
          />
        </button>
      )}

      {/* Separator */}
      {!isCollapsed && (
        <div className={`h-px w-full transition-[background-color,opacity] duration-100 ${isDarkMode ? 'bg-[rgba(255,255,255,0.1)]' : 'bg-[rgba(0,0,0,0.08)]'}`}></div>
      )}

      {/* User Profile */}
      <div className={`flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'w-9 h-9' : 'w-full'}`}>
        {isCollapsed ? (
          <div className="w-9 h-9 shrink-0 rounded-full overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
            {loadingUser ? (
              <div className={`w-full h-full animate-pulse ${isDarkMode ? 'bg-[rgba(255,255,255,0.1)]' : 'bg-[rgba(0,0,0,0.05)]'}`} />
            ) : (
              <OptimizedImage
                src={userPicture}
                alt={userName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
          </div>
        ) : (
          <>
            <div className="flex gap-2.5 items-center">
              <div className="w-9 h-9 shrink-0 rounded-full overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
                {loadingUser ? (
                  <div className={`w-full h-full animate-pulse ${isDarkMode ? 'bg-[rgba(255,255,255,0.1)]' : 'bg-[rgba(0,0,0,0.05)]'}`} />
                ) : (
                  <OptimizedImage
                    src={userPicture}
                    alt={userName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="flex flex-col gap-0.5 justify-center transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
                <p className={`font-medium text-sm leading-tight ${isDarkMode ? 'text-white' : 'text-[rgba(0,0,0,0.8)]'}`}>
                  {loadingUser ? 'Loading...' : userName}
                </p>
                <p className={`font-normal text-xs leading-tight ${isDarkMode ? 'text-white' : 'text-[rgba(0,0,0,0.8)]'}`}>
                  {loadingUser ? '...' : userPlan}
                </p>
              </div>
            </div>
            <button 
              onClick={toggleTheme}
              className={`bg-[#d9d9d9] flex h-4.5 items-center px-0 py-0.5 rounded-3xl w-10 cursor-pointer transition-[justify-content,transform] duration-100 ease-out ${
                isDarkMode ? 'justify-start' : 'justify-end'
              }`}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <div className="bg-white flex items-center justify-center p-0.5 rounded-2xl w-5 h-5 transition-transform duration-300">
                <div className={`w-4 h-4 transition-all duration-300 ${isDarkMode ? 'rotate-0 scale-100' : 'rotate-180 scale-110'}`}>
                  {isDarkMode ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-opacity duration-300">
                      <path d="M8 14C6.33333 14 4.91667 13.4167 3.75 12.25C2.58333 11.0833 2 9.66667 2 8C2 6.33333 2.58333 4.91667 3.75 3.75C4.91667 2.58333 6.33333 2 8 2C8.15556 2 8.30844 2.00556 8.45867 2.01667C8.60889 2.02778 8.756 2.04444 8.9 2.06667C8.44444 2.38889 8.08044 2.80844 7.808 3.32533C7.53556 3.84222 7.39956 4.40044 7.4 5C7.4 6 7.75 6.85 8.45 7.55C9.15 8.25 10 8.6 11 8.6C11.6111 8.6 12.1722 8.46378 12.6833 8.19133C13.1944 7.91889 13.6111 7.55511 13.9333 7.1C13.9556 7.24444 13.9722 7.39156 13.9833 7.54133C13.9944 7.69111 14 7.844 14 8C14 9.66667 13.4167 11.0833 12.25 12.25C11.0833 13.4167 9.66667 14 8 14ZM8 12.6667C8.97778 12.6667 9.85556 12.3971 10.6333 11.858C11.4111 11.3189 11.9778 10.6162 12.3333 9.75C12.1111 9.80556 11.8889 9.85 11.6667 9.88333C11.4444 9.91667 11.2222 9.93333 11 9.93333C9.63333 9.93333 8.46933 9.45267 7.508 8.49133C6.54667 7.53 6.06622 6.36622 6.06667 5C6.06667 4.77778 6.08333 4.55556 6.11667 4.33333C6.15 4.11111 6.19444 3.88889 6.25 3.66667C5.38333 4.02222 4.68044 4.58889 4.14133 5.36667C3.60222 6.14444 3.33289 7.02222 3.33333 8C3.33333 9.28889 3.78889 10.3889 4.7 11.3C5.61111 12.2111 6.71111 12.6667 8 12.6667Z" fill="rgba(0,0,0,0.8)"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-opacity duration-300">
                      <circle cx="8" cy="8" r="3" stroke="rgba(0,0,0,0.8)" strokeWidth="1.5"/>
                      <path d="M8 1V2M8 14V15M1 8H2M14 8H15M2.93 2.93L3.64 3.64M12.36 12.36L13.07 13.07M2.93 13.07L3.64 12.36M12.36 3.64L13.07 2.93" stroke="rgba(0,0,0,0.8)" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>
              </div>
            </button>
          </>
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className={`flex gap-2.5 items-center justify-center px-3 py-2 rounded-xl cursor-pointer transition-[background-color,color] duration-100 mt-2 ${
          isCollapsed ? 'w-10 h-10 p-0' : 'w-full'
        } ${isDarkMode ? 'hover:bg-[rgba(255,255,255,0.1)]' : 'hover:bg-[rgba(0,0,0,0.05)]'}`}
        aria-label="Logout"
      >
        <div className="w-5 h-5 shrink-0">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5M13.3333 14.1667L17.5 10M17.5 10L13.3333 5.83333M17.5 10H7.5"
              stroke={isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {!isCollapsed && (
          <p className={`font-normal text-base whitespace-nowrap transition-[color,opacity] duration-100 ease-out ${isDarkMode ? 'text-white' : 'text-[rgba(0,0,0,0.8)]'}`}>Logout</p>
        )}
      </button>
    </div>
  );
};

export default memo(BottomSection);
