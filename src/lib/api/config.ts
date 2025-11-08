// Cấu hình API
export const API_CONFIG = {
  // Sử dụng proxy local để tránh CORS
  BASE_URL: '', // Empty string để gọi local API routes
  ENDPOINTS: {
    LOGIN: '/api/auth/login',      // Next.js API route proxy
    REGISTER: '/api/auth/register', // Next.js API route proxy
    REFRESH: '/api/v1/auth/refresh',
    LOGOUT: '/api/v1/auth/logout',
  },
  HEADERS: {
    'Content-Type': 'application/json',
  }
}

// Cấu hình Backend API (dùng cho reference)
export const BACKEND_API = {
  BASE_URL: 'https://postmaxillary-variably-justa.ngrok-free.dev',
  ENDPOINTS: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    REFRESH: '/api/v1/auth/refresh',
    LOGOUT: '/api/v1/auth/logout',
  }
}

// Token storage keys
export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
}
