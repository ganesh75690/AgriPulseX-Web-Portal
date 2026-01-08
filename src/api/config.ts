// API Configuration for AgriPulseX
// Handles both local development and production environments

const getApiUrl = () => {
  // Check if we're in production
  if (import.meta.env.PROD) {
    // Production: Use the deployed backend URL
    return import.meta.env.VITE_API_URL || 'https://your-backend-url.onrender.com';
  } else {
    // Development: Use local backend
    return import.meta.env.VITE_API_URL || 'http://localhost:8000';
  }
};

export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  ENDPOINTS: {
    ANALYZE_IMAGE: '/api/v2/analyze-image',
    GENERATE_PDF: '/api/v2/generate-pdf',
    FARMER_HISTORY: '/api/v2/farmer-history',
    HEALTH: '/'
  },
  TIMEOUT: 30000, // 30 seconds
};

// Helper function for API calls
export const createApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
