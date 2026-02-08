import { useState, useEffect } from 'react';
import { CHAT_API_URL } from '../../../../config/api.js';

/**
 * Custom hook to fetch and manage chat threads.
 */
const useThreads = () => {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    const getThreads = async () => {
      try {
        const threadListResponse = await fetch(
          `${CHAT_API_URL}/threads`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const threadList = await threadListResponse.json();
        if (!threadListResponse.ok) {
          throw new Error(threadList?.error || "Failed to fetch threads");
        }
        setThreads(threadList);
      } catch (err) {
        // Chat service may not be running in development - fail silently
        if (import.meta.env.DEV) {
          console.warn('Chat service unavailable:', err.message);
        }
      }
    };

    getThreads();
  }, []);

  return { threads };
};

export default useThreads;
