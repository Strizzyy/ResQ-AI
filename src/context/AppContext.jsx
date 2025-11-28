/**
 * Application Context for ResQ-AI
 * Manages global state including online status, tasks, and sync state
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStorageInfo } from '../services/offlineService';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queuedReportsCount, setQueuedReportsCount] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Network connection restored');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('📴 Network connection lost');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load storage info on mount
  useEffect(() => {
    const loadStorageInfo = async () => {
      try {
        const info = await getStorageInfo();
        setQueuedReportsCount(info.queuedReportsCount);
      } catch (error) {
        console.error('Failed to load storage info:', error);
      }
    };

    loadStorageInfo();
  }, []);

  const value = {
    isOnline,
    queuedReportsCount,
    setQueuedReportsCount,
    lastSyncTime,
    setLastSyncTime,
    tasks,
    setTasks,
    isLoading,
    setIsLoading,
    error,
    setError
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export default AppContext;
