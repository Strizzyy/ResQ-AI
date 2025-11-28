/**
 * Offline Service for ResQ-AI Frontend
 * Handles offline storage, queue management, and synchronization
 */

import localforage from 'localforage';

// Configure localforage instances
const reportQueue = localforage.createInstance({
  name: 'resq-ai',
  storeName: 'report_queue'
});

const taskCache = localforage.createInstance({
  name: 'resq-ai',
  storeName: 'task_cache'
});

const appState = localforage.createInstance({
  name: 'resq-ai',
  storeName: 'app_state'
});

/**
 * Queue a report for later submission
 * @param {Object} reportData - Report data to queue
 * @returns {Promise<void>}
 */
export const queueReport = async (reportData) => {
  try {
    const queuedReports = await getQueuedReports();
    const reportWithId = {
      ...reportData,
      id: reportData.id || `QUEUED-${Date.now()}`,
      status: 'queued',
      retryCount: 0,
      queuedAt: Date.now()
    };
    
    queuedReports.push(reportWithId);
    await reportQueue.setItem('reports', queuedReports);
    
    console.log('📦 Report queued for offline sync:', reportWithId.id);
  } catch (error) {
    console.error('Failed to queue report:', error);
    throw error;
  }
};

/**
 * Get all queued reports
 * @returns {Promise<Array>} Array of queued reports
 */
export const getQueuedReports = async () => {
  try {
    const reports = await reportQueue.getItem('reports');
    return reports || [];
  } catch (error) {
    console.error('Failed to get queued reports:', error);
    return [];
  }
};

/**
 * Remove a report from the queue
 * @param {string} reportId - Report ID to remove
 * @returns {Promise<void>}
 */
export const removeFromQueue = async (reportId) => {
  try {
    const queuedReports = await getQueuedReports();
    const filtered = queuedReports.filter(report => report.id !== reportId);
    await reportQueue.setItem('reports', filtered);
    
    console.log('✅ Report removed from queue:', reportId);
  } catch (error) {
    console.error('Failed to remove report from queue:', error);
    throw error;
  }
};

/**
 * Clear all queued reports
 * @returns {Promise<void>}
 */
export const clearQueue = async () => {
  try {
    await reportQueue.setItem('reports', []);
    console.log('🗑️ Report queue cleared');
  } catch (error) {
    console.error('Failed to clear queue:', error);
    throw error;
  }
};

/**
 * Cache tasks for offline access
 * @param {Array} tasks - Tasks to cache
 * @returns {Promise<void>}
 */
export const cacheTasks = async (tasks) => {
  try {
    await taskCache.setItem('tasks', {
      data: tasks,
      cachedAt: Date.now()
    });
    
    console.log('💾 Tasks cached:', tasks.length);
  } catch (error) {
    console.error('Failed to cache tasks:', error);
    throw error;
  }
};

/**
 * Get cached tasks
 * @returns {Promise<Array>} Cached tasks or empty array
 */
export const getCachedTasks = async () => {
  try {
    const cached = await taskCache.getItem('tasks');
    
    if (!cached) {
      return [];
    }
    
    return cached.data || [];
  } catch (error) {
    console.error('Failed to get cached tasks:', error);
    return [];
  }
};

/**
 * Synchronize queued reports with backend
 * @param {Function} submitFn - Function to submit reports
 * @returns {Promise<Object>} Sync result
 */
export const syncQueuedReports = async (submitFn) => {
  const queuedReports = await getQueuedReports();
  
  if (queuedReports.length === 0) {
    return {
      success: true,
      synced: 0,
      failed: 0
    };
  }
  
  console.log(`🔄 Syncing ${queuedReports.length} queued reports...`);
  
  let synced = 0;
  let failed = 0;
  
  for (const report of queuedReports) {
    try {
      await submitFn(report);
      await removeFromQueue(report.id);
      synced++;
    } catch (error) {
      console.error(`Failed to sync report ${report.id}:`, error);
      failed++;
    }
  }
  
  console.log(`✅ Sync complete: ${synced} synced, ${failed} failed`);
  
  return {
    success: failed === 0,
    synced,
    failed
  };
};

/**
 * Get storage usage information
 * @returns {Promise<Object>} Storage info
 */
export const getStorageInfo = async () => {
  try {
    const queuedReports = await getQueuedReports();
    const cachedTasks = await getCachedTasks();
    
    return {
      queuedReportsCount: queuedReports.length,
      cachedTasksCount: cachedTasks.length,
      hasData: queuedReports.length > 0 || cachedTasks.length > 0
    };
  } catch (error) {
    console.error('Failed to get storage info:', error);
    return {
      queuedReportsCount: 0,
      cachedTasksCount: 0,
      hasData: false
    };
  }
};

export default {
  queueReport,
  getQueuedReports,
  removeFromQueue,
  clearQueue,
  cacheTasks,
  getCachedTasks,
  syncQueuedReports,
  getStorageInfo
};
