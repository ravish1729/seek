/**
 * Converts bytes to human readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size with unit (e.g., "1.5 MB", "2.3 GB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}; 