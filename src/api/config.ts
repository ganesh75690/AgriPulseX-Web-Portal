// API Configuration for AgriPulseX
// Handles both local development and production environments

const getApiUrl = () => {
  // Check if we're in production
  if (import.meta.env.PROD) {
    // Production: Use deployed backend URL
    return import.meta.env.VITE_API_URL || 'https://your-backend-url.onrender.com';
  } else {
    // Development: Use unified backend server
    return import.meta.env.VITE_API_URL || 'http://localhost:8000';
  }
};

export const API_CONFIG = {
  BASE_URL: getApiUrl(), // Single unified server
  ENDPOINTS: {
    // Authentication
    LOGIN: '/api/auth/login',
    CURRENT_USER: '/api/auth/me',
    
    // Reports Management
    SUBMIT_REPORT: '/api/reports',
    GET_REPORTS: '/api/reports',
    REPORT_DETAILS: '/api/reports',
    UPDATE_REPORT_STATUS: '/api/reports',
    TAKE_ACTION: '/api/reports',
    
    // Analysis (using our backend endpoints)
    ANALYZE_IMAGE: '/api/v2/analyze-image',
    GENERATE_PDF: '/api/v2/generate-pdf',
    FARMER_HISTORY: '/api/v2/farmer-history',
    REGION_SUMMARY: '/api/v2/region-summary',
    TREND_ANALYSIS: '/api/v2/trend-analysis',
    
    // System
    HEALTH: '/',
    SYSTEM_INFO: '/api/v2/info'
  },
  TIMEOUT: 30000, // 30 seconds
};

// Helper function for API calls
export const createApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
