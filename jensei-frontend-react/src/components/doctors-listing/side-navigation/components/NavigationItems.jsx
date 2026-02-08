import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DoctorIcon, ChevronDownIcon } from '../constants.jsx';

const NavigationItems = ({
  isCollapsed,
  isDarkMode,
  isDoctorsPage,
  isDoctorExpanded,
  isRecentExpanded,
  toggleDoctorExpanded,
  toggleRecentExpanded,
  threads,
}) => {
  const navigate = useNavigate();
  const params = useParams();

  return (
    <div 
      className={`flex flex-col gap-2 items-center w-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-y-auto flex-1 min-h-0 ${isCollapsed ? 'gap-6 px-0' : 'items-start'}`} 
      style={{ 
        scrollbarWidth: 'thin',
        paddingTop: isCollapsed ? '0.5rem' : '0',
        paddingBottom: isCollapsed ? '0.5rem' : '0',
        overflowX: 'hidden'
      }}
    >
      {/* New Chat */}
      <div onClick={() => navigate('/chat', { replace: true })}>
      {!isCollapsed ? (
        <button className={`relative flex gap-2 items-center px-3 py-2 rounded-lg w-full cursor-pointer transition-all duration-200 ease-out border border-transparent hover:shadow-[0_2px_8px_${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}] active:scale-[0.98] ${
          isDarkMode 
            ? 'bg-[rgba(255,255,255,0.06)] text-white' 
            : 'bg-[#f8f8f8] text-[#22212c]'
        }`}>
          <div className={`w-5 h-5 shrink-0 transition-colors duration-100 ${isDarkMode ? 'text-white' : 'text-[#22212c]'}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <p className={`font-medium text-sm whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-[#22212c]'}`}>New Chat</p>
        </button>
      ) : (
        <div className="flex items-center justify-center w-full py-2">
          <div className="w-5 h-5 cursor-pointer flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke={isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      )}
      </div>

      {/* Doctor Section */}
      {!isCollapsed ? (
        <div className="relative w-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
          <button
            onClick={() => navigate('/doctors')}
            className={`relative flex gap-2 items-center justify-between px-3 py-2 rounded-lg w-full cursor-pointer transition-[background-color,color,border-color,box-shadow] duration-100 ease-out border border-transparent hover:shadow-[0_2px_8px_${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}] active:scale-[0.98] ${
              isDoctorsPage 
                ? 'bg-[rgba(121,107,255,0.08)]' 
                : isDarkMode ? 'bg-[rgba(255,255,255,0.06)]' : 'bg-[#f8f8f8]'
            } ${isDarkMode ? 'text-white' : 'text-[#22212c]'}`}
            aria-label="Go to Doctors page"
          >
            <div className="flex gap-2 items-center">
              <div className={`w-5 h-5 shrink-0 transition-colors duration-100 ${isDarkMode ? 'text-white' : 'text-[#22212c]'}`}>
                <DoctorIcon />
              </div>
              <p className={`font-medium text-sm whitespace-nowrap transition-colors duration-100 ${isDarkMode ? 'text-white' : 'text-[#22212c]'}`}>Doctor</p>
            </div>
            <div 
              className={`w-4 h-4 shrink-0 transition-all duration-300 ease-out rotate-0 ${isDarkMode ? 'text-white' : 'text-[#22212c]'} ${isDoctorExpanded ? 'rotate-180' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleDoctorExpanded();
              }}
            >
              <ChevronDownIcon />
            </div>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ease-out ${isDoctorExpanded ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="flex flex-col gap-2 items-start ml-3 mt-2 w-full pb-1.5">
              <div className="flex gap-2 items-center cursor-pointer hover:opacity-70 transition-opacity duration-200 px-1 py-0.5 rounded">
                <div className="w-2 h-2 rounded-full bg-[#FFD700]"></div>
                <p className={`font-normal text-xs whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-[#22212c]'}`}>Clinics</p>
              </div>
              <div className="flex gap-2 items-center cursor-pointer hover:opacity-70 transition-opacity duration-200 px-1 py-0.5 rounded">
                <div className="w-2 h-2 rounded-full bg-[#796bff]"></div>
                <p className={`font-normal text-xs whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-[#22212c]'}`}>Hospitals</p>
              </div>
              <div className="flex gap-2 items-center cursor-pointer hover:opacity-70 transition-opacity duration-200 px-1 py-0.5 rounded">
                <div className="w-2 h-2 rounded-full bg-[#22c55e]"></div>
                <p className={`font-normal text-xs whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-[#22212c]'}`}>Surgeries</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div 
          className="flex items-center justify-center w-full cursor-pointer" 
          style={{ minHeight: '40px', padding: '0.5rem 0' }}
          onClick={() => navigate('/doctors')}
        >
          <div className={`flex items-center justify-center p-2.5 rounded-lg w-[42px] h-[40px] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isDarkMode ? 'bg-[rgba(255,255,255,0.1)]' : 'bg-[rgba(0,0,0,0.01)]'
          }`} style={{ overflow: 'visible' }}>
            <div className={`w-5 h-5 shrink-0 flex items-center justify-center ${isDarkMode ? 'text-white' : ''}`} style={{ overflow: 'visible' }}>
              <DoctorIcon />
            </div>
          </div>
        </div>
      )}

      {/* Lab Test */}
      {!isCollapsed ? (
        <button className={`relative flex gap-2 items-center px-3 py-2 rounded-lg w-full cursor-pointer transition-all duration-200 ease-out border border-transparent hover:shadow-[0_2px_8px_${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}] active:scale-[0.98] ${
          isDarkMode 
            ? 'bg-[rgba(255,255,255,0.06)] text-white' 
            : 'bg-[#f8f8f8] text-[#22212c]'
        }`}>
          <div className={`w-5 h-5 shrink-0 transition-colors duration-100 ${isDarkMode ? 'text-white' : 'text-[#22212c]'}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 3V8L4.5 17.5C3.5 19.5 5 22 7.5 22H16.5C19 22 20.5 19.5 19.5 17.5L15 8V3M9 3H15M9 3H7M15 3H17M9 13H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className={`font-medium text-sm whitespace-nowrap transition-colors duration-100 ${isDarkMode ? 'text-white' : 'text-[#22212c]'}`}>Lab Test</p>
        </button>
      ) : (
        <div className="flex items-center justify-center w-full py-2">
          <div className="w-5 h-5 cursor-pointer flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 3V8L4.5 17.5C3.5 19.5 5 22 7.5 22H16.5C19 22 20.5 19.5 19.5 17.5L15 8V3M9 3H15M9 3H7M15 3H17M9 13H15" stroke={isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      )}

      {/* Recent Section */}
      {!isCollapsed ? (
        <div className="relative w-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
          <button
            onClick={toggleRecentExpanded}
            className={`relative flex gap-2 items-center justify-between px-3 py-2 rounded-lg w-full cursor-pointer transition-[background-color,color,box-shadow] duration-150 ease-out border border-transparent hover:shadow-[0_2px_8px_${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}] active:scale-[0.98] ${
              isDarkMode 
                ? 'bg-[rgba(255,255,255,0.06)] text-white' 
                : 'bg-[#f8f8f8] text-[#22212c]'
            }`}
            aria-label={isRecentExpanded ? 'Collapse Recent menu' : 'Expand Recent menu'}
          >
            <div className="flex gap-2 items-center">
              <div className={`w-5 h-5 shrink-0 transition-colors duration-100 ${isDarkMode ? 'text-white' : 'text-[#22212c]'}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <p className={`font-medium text-sm whitespace-nowrap transition-colors duration-100 ${isDarkMode ? 'text-white' : 'text-[#22212c]'}`}>Recent</p>
            </div>
            <div className={`w-4 h-4 shrink-0 transition-[color,transform] duration-100 ease-out rotate-0 ${isDarkMode ? 'text-white' : 'text-[#22212c]'} ${isRecentExpanded ? 'rotate-180' : ''}`}>
              <ChevronDownIcon />
            </div>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ease-out ${isRecentExpanded ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="flex flex-col gap-1.5 items-start mt-2 w-full">
              {threads.length > 0 &&
                threads.map(thread => (
                  <div 
                  key={thread.thread_id}
                  onClick={() => navigate(`/chat/${thread.thread_id}`, { replace: true })}
                   className="flex gap-2 items-center justify-center px-2 py-1.5 rounded-lg w-full min-w-0"
                   style={{
                    cursor: 'pointer',
                    background: `${params.thread_id == thread.thread_id ? "#ddd" : "transparent"}`
                   }}
                   >
                    <p className={`flex-1 font-normal text-xs truncate min-w-0 transition-colors duration-100 ${isDarkMode ? 'text-white' : 'text-[rgba(0,0,0,0.8)]'}`}>Dummy text</p>
                    <div className="w-4 h-4 shrink-0">
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="4" r="1.5" fill={isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}/>
                        <circle cx="10" cy="10" r="1.5" fill={isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}/>
                        <circle cx="10" cy="16" r="1.5" fill={isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}/>
                      </svg>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      ) : null}
      
      {/* History Icon (shown when collapsed) */}
      {isCollapsed && (
        <div className="flex items-center justify-center w-full" style={{ minHeight: '40px', padding: '0.5rem 0' }}>
          <div className="w-5 h-5 shrink-0 cursor-pointer flex items-center justify-center" style={{ overflow: 'visible' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', overflow: 'visible' }}>
              <path d="M12 8V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke={isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationItems;
