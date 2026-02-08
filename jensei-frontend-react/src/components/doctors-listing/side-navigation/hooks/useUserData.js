import { useState, useEffect, useMemo } from 'react';
import { getStoredUser, checkAuth } from '../../../../utils/auth.js';
import { generateAvatarSphere } from '../utils.js';

/**
 * Custom hook to fetch and manage user data.
 */
const useUserData = () => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // First try to get from localStorage (fast)
        const storedUser = getStoredUser();
        if (storedUser) {
          setUser(storedUser);
          setLoadingUser(false);
        }

        // Then verify/refresh from API (in background)
        const authResult = await checkAuth();
        if (authResult.authenticated && authResult.user) {
          setUser(authResult.user);
          // Update localStorage with fresh data
          try {
            localStorage.setItem('user', JSON.stringify(authResult.user));
          } catch (e) {
            console.warn('Failed to update localStorage:', e);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        // Fallback to stored user if available
        const storedUser = getStoredUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  // Get user display values with fallbacks
  const userName = useMemo(() => {
    if (!user) return 'User';
    return user.name || user.displayName || user.username || 'User';
  }, [user]);

  const userPlan = useMemo(() => {
    if (!user) return 'Free';
    return user.plan || user.subscription || 'Free';
  }, [user]);

  const userPicture = useMemo(() => {
    if (!user) {
      // Generate sphere avatar for no user
      return generateAvatarSphere('User');
    }
    
    // Try multiple possible field names for Google profile picture
    const picture = user.picture || user.photoURL || user.image || user.profilePicture || user.avatar || user.profileImage;
    
    if (picture && picture !== '/doctors-listing/9788f70d54e0c3c708e99a3ad2a4297a099e19f9.png') {
      return picture;
    }
    
    // Generate colored sphere avatar based on user's name or email
    const nameForAvatar = user.name || user.displayName || user.username || user.email || 'User';
    return generateAvatarSphere(nameForAvatar);
  }, [user]);

  return {
    user,
    loadingUser,
    userName,
    userPlan,
    userPicture,
  };
};

export default useUserData;
