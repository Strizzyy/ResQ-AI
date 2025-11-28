/**
 * Validation utility functions for ResQ-AI
 */

/**
 * Validate report submission data
 * @param {Object} reportData - Report data to validate
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export const validateReport = (reportData) => {
  const errors = [];
  
  // Must have either images or description
  const hasImages = reportData.images && reportData.images.length > 0;
  const hasDescription = reportData.description && reportData.description.trim().length > 0;
  
  if (!hasImages && !hasDescription) {
    errors.push('Report must include at least an image or description');
  }
  
  // Validate description if provided
  if (reportData.description && reportData.description.trim().length > 1000) {
    errors.push('Description must be less than 1000 characters');
  }
  
  // Validate images if provided
  if (hasImages && reportData.images.length > 10) {
    errors.push('Maximum 10 images allowed per report');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate text input (non-empty, trimmed)
 * @param {string} text - Text to validate
 * @param {number} minLength - Minimum length (default: 1)
 * @param {number} maxLength - Maximum length (default: 1000)
 * @returns {boolean} True if valid
 */
export const validateText = (text, minLength = 1, maxLength = 1000) => {
  if (!text || typeof text !== 'string') {
    return false;
  }
  
  const trimmed = text.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength;
};

/**
 * Sanitize text input to prevent XSS
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
export const sanitizeText = (text) => {
  if (!text) return '';
  
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
