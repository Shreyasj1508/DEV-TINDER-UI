/**
 * Image URL utility functions for handling profile photos
 * Addresses common issues with photo display in the app
 */

// Common photo field names that might be used in user objects
// Ordered by priority - 'photo' first since that's what the backend uses
export const PHOTO_FIELD_NAMES = [
  'photo',        // Backend uses this field name
  'photoURL',
  'photoUrl', 
  'profilePhoto',
  'profilePicture',
  'image',
  'avatar',
  'picture'
];

/**
 * Extract the best available photo URL from a user object
 * @param {Object} user - User object that might contain photo URLs
 * @returns {string|null} - Valid photo URL or null
 */
export const getProfilePhotoUrl = (user) => {
  if (!user || typeof user !== 'object') {
    console.warn('getProfilePhotoUrl: Invalid user object provided');
    return null;
  }

  // First, check the main 'photo' field that the backend uses
  if (user.photo && isValidPhotoUrl(user.photo)) {
    console.log(`✅ Found valid photo URL in backend 'photo' field:`, user.photo);
    return user.photo;
  }

  // Then check all other possible photo field names
  for (const fieldName of PHOTO_FIELD_NAMES.slice(1)) { // Skip 'photo' since we already checked it
    const photoUrl = user[fieldName];
    if (isValidPhotoUrl(photoUrl)) {
      console.log(`✅ Found valid photo URL in field '${fieldName}':`, photoUrl);
      return photoUrl;
    }
  }

  console.log('ℹ️ No valid photo URL found for user:', {
    userId: user._id,
    userName: `${user.firstName} ${user.lastName}`,
    backendPhotoField: user.photo,
    checkedFields: PHOTO_FIELD_NAMES.map(field => ({
      field,
      value: user[field],
      type: typeof user[field],
      isValid: isValidPhotoUrl(user[field])
    }))
  });

  return null;
};

/**
 * Validate if a photo URL is usable
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether the URL is valid and usable
 */
export const isValidPhotoUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const trimmedUrl = url.trim();
  
  // Check if it's not empty
  if (trimmedUrl === '' || trimmedUrl === 'null' || trimmedUrl === 'undefined') {
    return false;
  }

  // Check if it starts with http/https or is a data URL
  if (trimmedUrl.startsWith('http://') || 
      trimmedUrl.startsWith('https://') || 
      trimmedUrl.startsWith('data:image/')) {
    return true;
  }

  // Check if it's a relative URL (starts with /)
  if (trimmedUrl.startsWith('/')) {
    return true;
  }

  // Be more lenient - if it looks like it could be a URL, allow it
  if (trimmedUrl.includes('.') && (
      trimmedUrl.includes('.jpg') || 
      trimmedUrl.includes('.jpeg') || 
      trimmedUrl.includes('.png') || 
      trimmedUrl.includes('.gif') || 
      trimmedUrl.includes('.webp') ||
      trimmedUrl.includes('.svg')
    )) {
    console.log('⚠️ Accepting photo URL with relaxed validation:', trimmedUrl);
    return true;
  }

  // Log suspicious URLs for debugging
  console.warn('🔍 Rejected photo URL format:', trimmedUrl);
  return false;
};

/**
 * Create a proxy URL for images that might have CORS issues
 * @param {string} imageUrl - Original image URL
 * @returns {string} - Proxied or original URL
 */
export const createProxyImageUrl = (imageUrl) => {
  if (!isValidPhotoUrl(imageUrl)) {
    return null;
  }

  // If it's already a local URL, return as-is
  if (imageUrl.startsWith('/') || imageUrl.includes(window.location.hostname)) {
    return imageUrl;
  }

  // For external URLs that might have CORS issues, you can use a proxy service
  // Example: return `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}`;
  // For now, return the original URL
  return imageUrl;
};

/**
 * Generate fallback avatar URL using initials
 * @param {Object} user - User object
 * @returns {string} - Data URL for generated avatar
 */
export const generateFallbackAvatar = (user) => {
  const firstName = user?.firstName || '';
  const lastName = user?.lastName || '';
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  
  // Generate a simple colored avatar with initials
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 400, 400);
  gradient.addColorStop(0, '#ec4899'); // pink-500
  gradient.addColorStop(1, '#8b5cf6'); // purple-500
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 400, 400);
  
  // Text
  ctx.fillStyle = 'white';
  ctx.font = 'bold 120px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, 200, 200);
  
  return canvas.toDataURL();
};

/**
 * Preload an image to check if it loads successfully
 * @param {string} src - Image source URL
 * @returns {Promise<boolean>} - Promise that resolves to true if image loads
 */
export const preloadImage = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      console.log('✅ Image preloaded successfully:', src);
      resolve(true);
    };
    img.onerror = () => {
      console.error('❌ Image failed to preload:', src);
      resolve(false);
    };
    img.src = src;
  });
};

export default {
  getProfilePhotoUrl,
  isValidPhotoUrl,
  createProxyImageUrl,
  generateFallbackAvatar,
  preloadImage,
  PHOTO_FIELD_NAMES
};
