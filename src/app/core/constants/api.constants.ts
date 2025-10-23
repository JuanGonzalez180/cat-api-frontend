/**
 * API endpoint constants
 */
export const API_ENDPOINTS = {
  // Cats endpoints
  CATS: {
    BREEDS: '/cats/breeds',
    BREED_BY_ID: '/cats/breeds/:id',
    SEARCH_BREEDS: '/cats/breeds/search'
  },
  // Images endpoints
  IMAGES: {
    BY_BREED: '/images/by-breed'
  },
  // Authentication endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register'
  }
};

/**
 * Query parameter keys
 */
export const QUERY_PARAMS = {
  LIMIT: 'limit',
  PAGE: 'page',
  QUERY: 'q',
  BREED_ID: 'breed_id'
};

/**
 * Default values for query parameters
 */
export const DEFAULT_QUERY_VALUES = {
  LIMIT: 10,
  PAGE: 0
};

/**
 * localStorage keys
 */
export const STORAGE_KEYS = {
  CURRENT_USER: 'currentUser',
  AUTH_TOKEN: 'authToken'
};
