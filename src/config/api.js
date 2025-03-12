export const API_BASE_URL = 'https://farmcare-backend-new.onrender.com';

export const ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/v1/auth/login',
  SIGNUP: '/api/v1/auth/signup',
  GOOGLE_LOGIN: '/api/v1/auth/google',
  LOGOUT: '/api/v1/auth/logout',
  
  // User endpoints
  USERS: '/api/v1/users',
  USER_PROFILE: '/api/v1/users/profile',
  UPDATE_PROFILE: '/api/v1/users/update',
  
  // Post endpoints
  POSTS: '/api/v1/posts/getposts',
  CREATE_POST: '/api/v1/posts/createpost',
  UPDATE_POST: '/api/v1/posts/updatepost',
  DELETE_POST: '/api/v1/posts/delete',
  LIKE_POST: '/api/v1/posts/addlike',
  
  // Comment endpoints
  GET_COMMENTS: '/api/v1/comments',
  ADD_COMMENT: '/api/v1/comments/create',
  DELETE_COMMENT: '/api/v1/comments',
  
  // Photo endpoints
  UPLOAD_PHOTO: '/api/v1/posts/upload',
  
  // Message endpoints
  MESSAGES: '/api/v1/messages'
};

// Utility function to get full API URL
export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;