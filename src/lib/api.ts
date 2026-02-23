// Environment-based API configuration
const getApiBaseUrl = (): string => {
  // Check for explicit environment variable first
  const envApiUrl = import.meta.env.VITE_API_BASE_URL;
  if (envApiUrl) {
    return envApiUrl;
  }
  
  // Check if running in production/cloud environment
  // This can be determined by checking if we're in production mode
  // or by checking the hostname
  const isProduction = import.meta.env.PROD || 
                      import.meta.env.MODE === 'production' ||
                      window.location.hostname !== 'localhost';
  
  if (isProduction) {
    return 'https://postrai-backend-gie8.onrender.com/api';
  } else {
    // return 'http://localhost:8000/api';
    return "https://postrai-backend-gie8.onrender.com/api";
  }
};

// Export the function for potential use elsewhere
export { getApiBaseUrl };

const API_BASE_URL = getApiBaseUrl();

// Log the API configuration for debugging
console.log('API Configuration:', {
  envApiUrl: import.meta.env.VITE_API_BASE_URL,
  isProduction: import.meta.env.PROD || import.meta.env.MODE === 'production' || window.location.hostname !== 'localhost',
  hostname: window.location.hostname,
  mode: import.meta.env.MODE,
  apiBaseUrl: API_BASE_URL
});

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    user_id: string;
    firstName: string;
    lastName: string;
    email: string;
    created_at: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  user_id: string;
  firstName: string;
  lastName: string;
  email: string;
  created_at: string;
}

export interface GetUserTopicsRequest {
  user_id: string;
}

export interface GetUserTopicsResponse {
  success: boolean;
  user_id: string;
  topics: string[];
}

export interface AddUserTopicsRequest {
  user_id: string;
  topics: string[];
}

export interface AddUserTopicsResponse {
  success: boolean;
  message: string;
  topics: {
    id: string;
    user_id: string;
    topic_name: string;
    status: string;
    created_at: string;
    updated_at: string;
  }[];
  total_added: number;
  skipped: number;
}

export interface AddUserDocumentsRequest {
  user_id: string;
  document_ids: string[];
}

export interface AddUserDocumentsResponse {
  success: boolean;
  message: string;
  documents: {
    id: string;
    user_id: string;
    document_id: string;
    folder: string;
    is_favorite: boolean;
    created_at: string;
    updated_at: string;
  }[];
  total_added: number;
  skipped: number;
}

export interface GetResearchPapersMetadataRequest {
  document_ids: string[];
}

export interface GetResearchPapersMetadataResponse {
  success: boolean;
  message: string;
  papers: {
    id: string;
    document_id: string;
    title: string;
    authors: string[];
    published_date: string;
    source: string;
    pdf_url: string;
    abstract: string;
    summary: string;
    labels: string[];
    created_at: string;
    updated_at: string;
  }[];
  total_requested: number;
  total_found: number;
  not_found: string[];
}

export interface ApiError {
  success: false;
  message: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async signUp(userData: SignUpRequest): Promise<SignUpResponse> {
    console.log('=== API CALL START ===');
    console.log('SignUp method called with data:', userData);
    
    const url = `${this.baseUrl}/signup`;
    console.log('Request URL:', url);
    
    const requestBody = JSON.stringify(userData);
    console.log('Request body:', requestBody);

    try {
      console.log('About to make fetch request...');
      
      // Simplest possible fetch request
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });
      
      console.log('=== RESPONSE RECEIVED ===');
      console.log('Response status:', response.status);
      console.log('Response statusText:', response.statusText);
      console.log('Response ok:', response.ok);
      console.log('Response type:', response.type);
      console.log('Response url:', response.url);
      
      // Log all response headers
      const headers = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      console.log('Response headers:', headers);
      
      if (!response.ok) {
        console.log('Response not OK, attempting to read error...');
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorText = await response.text();
          console.log('Error response text:', errorText);
          
          // Try to parse as JSON
          try {
            const errorData = JSON.parse(errorText);
            console.log('Error response data:', errorData);
            if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch (parseError) {
            console.log('Could not parse error response as JSON');
            errorMessage = errorText || errorMessage;
          }
        } catch (readError) {
          console.log('Could not read error response:', readError);
        }
        
        throw new Error(errorMessage);
      }

      console.log('Response OK, reading JSON...');
      const data = await response.json();
      console.log('=== SUCCESS ===');
      console.log('Response data:', data);
      return data;
      
    } catch (error) {
      console.log('=== ERROR ===');
      console.error('API request error:', error);
      console.error('Error type:', typeof error);
      console.error('Error name:', error?.name);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Unable to connect to the server. Please check if the backend is running and CORS is properly configured.');
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('An unexpected error occurred while connecting to the server.');
    }
  }

  async login(userData: LoginRequest): Promise<LoginResponse> {
    console.log('=== LOGIN API CALL START ===');
    console.log('Login method called with data:', { email: userData.email, password: '[HIDDEN]' });
    
    const url = `${this.baseUrl}/login`;
    console.log('Request URL:', url);
    
    const requestBody = JSON.stringify(userData);
    console.log('Request body:', JSON.stringify({ email: userData.email, password: '[HIDDEN]' }));

    try {
      console.log('About to make login fetch request...');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });
      
      console.log('=== LOGIN RESPONSE RECEIVED ===');
      console.log('Response status:', response.status);
      console.log('Response statusText:', response.statusText);
      console.log('Response ok:', response.ok);
      console.log('Response type:', response.type);
      console.log('Response url:', response.url);
      
      // Log all response headers
      const headers = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      console.log('Response headers:', headers);
      
      if (!response.ok) {
        console.log('Login response not OK, attempting to read error...');
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorText = await response.text();
          console.log('Error response text:', errorText);
          
          // Try to parse as JSON
          try {
            const errorData = JSON.parse(errorText);
            console.log('Error response data:', errorData);
            // Handle FastAPI error format
            if (errorData.detail) {
              errorMessage = errorData.detail;
            } else if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch (parseError) {
            console.log('Could not parse error response as JSON');
            errorMessage = errorText || errorMessage;
          }
        } catch (readError) {
          console.log('Could not read error response:', readError);
        }
        
        throw new Error(errorMessage);
      }

      console.log('Login response OK, reading JSON...');
      const data = await response.json();
      console.log('=== LOGIN SUCCESS ===');
      console.log('Response data:', data);
      return data;
      
    } catch (error) {
      console.log('=== LOGIN ERROR ===');
      console.error('Login API request error:', error);
      console.error('Error type:', typeof error);
      console.error('Error name:', error?.name);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Unable to connect to the server. Please check if the backend is running and CORS is properly configured.');
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('An unexpected error occurred while connecting to the server.');
    }
  }

  async getUserTopics(userData: GetUserTopicsRequest): Promise<GetUserTopicsResponse> {
    console.log('=== GET USER TOPICS API CALL START ===');
    console.log('GetUserTopics method called with data:', userData);
    
    const url = `${this.baseUrl}/get-user-topics`;
    console.log('Request URL:', url);
    
    const requestBody = JSON.stringify(userData);
    console.log('Request body:', requestBody);

    try {
      console.log('About to make get-user-topics fetch request...');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });
      
      console.log('=== GET USER TOPICS RESPONSE RECEIVED ===');
      console.log('Response status:', response.status);
      console.log('Response statusText:', response.statusText);
      console.log('Response ok:', response.ok);
      console.log('Response type:', response.type);
      console.log('Response url:', response.url);
      
      // Log all response headers
      const headers = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      console.log('Response headers:', headers);
      
      if (!response.ok) {
        console.log('Get user topics response not OK, attempting to read error...');
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorText = await response.text();
          console.log('Error response text:', errorText);
          
          // Try to parse as JSON
          try {
            const errorData = JSON.parse(errorText);
            console.log('Error response data:', errorData);
            // Handle both FastAPI and custom error formats
            if (errorData.detail) {
              errorMessage = errorData.detail;
            } else if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch (parseError) {
            console.log('Could not parse error response as JSON');
            errorMessage = errorText || errorMessage;
          }
        } catch (readError) {
          console.log('Could not read error response:', readError);
        }
        
        throw new Error(errorMessage);
      }

      console.log('Get user topics response OK, reading JSON...');
      const data = await response.json();
      console.log('=== GET USER TOPICS SUCCESS ===');
      console.log('Response data:', data);
      return data;
      
    } catch (error) {
      console.log('=== GET USER TOPICS ERROR ===');
      console.error('Get user topics API request error:', error);
      console.error('Error type:', typeof error);
      console.error('Error name:', error?.name);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Unable to connect to the server. Please check if the backend is running and CORS is properly configured.');
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('An unexpected error occurred while connecting to the server.');
    }
  }

  async addUserTopics(userData: AddUserTopicsRequest): Promise<AddUserTopicsResponse> {
    console.log('=== ADD USER TOPICS API CALL START ===');
    console.log('AddUserTopics method called with data:', userData);
    
    const url = `${this.baseUrl}/add-user-topics`;
    console.log('Request URL:', url);
    
    const requestBody = JSON.stringify(userData);
    console.log('Request body:', requestBody);

    try {
      console.log('About to make add-user-topics fetch request...');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });
      
      console.log('=== ADD USER TOPICS RESPONSE RECEIVED ===');
      console.log('Response status:', response.status);
      console.log('Response statusText:', response.statusText);
      console.log('Response ok:', response.ok);
      console.log('Response type:', response.type);
      console.log('Response url:', response.url);
      
      // Log all response headers
      const headers = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      console.log('Response headers:', headers);
      
      if (!response.ok) {
        console.log('Add user topics response not OK, attempting to read error...');
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorText = await response.text();
          console.log('Error response text:', errorText);
          
          // Try to parse as JSON
          try {
            const errorData = JSON.parse(errorText);
            console.log('Error response data:', errorData);
            // Handle both FastAPI and custom error formats
            if (errorData.detail) {
              errorMessage = errorData.detail;
            } else if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch (parseError) {
            console.log('Could not parse error response as JSON');
            errorMessage = errorText || errorMessage;
          }
        } catch (readError) {
          console.log('Could not read error response:', readError);
        }
        
        throw new Error(errorMessage);
      }

      console.log('Add user topics response OK, reading JSON...');
      const data = await response.json();
      console.log('=== ADD USER TOPICS SUCCESS ===');
      console.log('Response data:', data);
      return data;
      
    } catch (error) {
      console.log('=== ADD USER TOPICS ERROR ===');
      console.error('Add user topics API request error:', error);
      console.error('Error type:', typeof error);
      console.error('Error name:', error?.name);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Unable to connect to the server. Please check if the backend is running and CORS is properly configured.');
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('An unexpected error occurred while connecting to the server.');
    }
  }

  async addUserDocuments(userData: AddUserDocumentsRequest): Promise<AddUserDocumentsResponse> {
    console.log('=== ADD USER DOCUMENTS API CALL START ===');
    console.log('AddUserDocuments method called with data:', userData);
    
    const url = `${this.baseUrl}/add-user-documents`;
    console.log('Request URL:', url);
    
    const requestBody = JSON.stringify(userData);
    console.log('Request body:', requestBody);

    try {
      console.log('About to make add-user-documents fetch request...');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });
      
      console.log('=== ADD USER DOCUMENTS RESPONSE RECEIVED ===');
      console.log('Response status:', response.status);
      console.log('Response statusText:', response.statusText);
      console.log('Response ok:', response.ok);
      console.log('Response type:', response.type);
      console.log('Response url:', response.url);
      
      // Log all response headers
      const headers = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      console.log('Response headers:', headers);
      
      if (!response.ok) {
        console.log('Add user documents response not OK, attempting to read error...');
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorText = await response.text();
          console.log('Error response text:', errorText);
          
          // Try to parse as JSON
          try {
            const errorData = JSON.parse(errorText);
            console.log('Error response data:', errorData);
            // Handle both FastAPI and custom error formats
            if (errorData.detail) {
              errorMessage = errorData.detail;
            } else if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch (parseError) {
            console.log('Could not parse error response as JSON');
            errorMessage = errorText || errorMessage;
          }
        } catch (readError) {
          console.log('Could not read error response:', readError);
        }
        
        throw new Error(errorMessage);
      }

      console.log('Add user documents response OK, reading JSON...');
      const data = await response.json();
      console.log('=== ADD USER DOCUMENTS SUCCESS ===');
      console.log('Response data:', data);
      return data;
      
    } catch (error) {
      console.log('=== ADD USER DOCUMENTS ERROR ===');
      console.error('Add user documents API request error:', error);
      console.error('Error type:', typeof error);
      console.error('Error name:', error?.name);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Unable to connect to the server. Please check if the backend is running and CORS is properly configured.');
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('An unexpected error occurred while connecting to the server.');
    }
  }

  async getResearchPapersMetadata(userData: GetResearchPapersMetadataRequest): Promise<GetResearchPapersMetadataResponse> {
    console.log('=== GET RESEARCH PAPERS METADATA API CALL START ===');
    console.log('GetResearchPapersMetadata method called with data:', userData);
    
    const url = `${this.baseUrl}/get-research-papers-metadata`;
    console.log('Request URL:', url);
    
    const requestBody = JSON.stringify(userData);
    console.log('Request body:', requestBody);

    try {
      console.log('About to make get-research-papers-metadata fetch request...');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });
      
      console.log('=== GET RESEARCH PAPERS METADATA RESPONSE RECEIVED ===');
      console.log('Response status:', response.status);
      console.log('Response statusText:', response.statusText);
      console.log('Response ok:', response.ok);
      console.log('Response type:', response.type);
      console.log('Response url:', response.url);
      
      // Log all response headers
      const headers = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      console.log('Response headers:', headers);
      
      if (!response.ok) {
        console.log('Get research papers metadata response not OK, attempting to read error...');
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorText = await response.text();
          console.log('Error response text:', errorText);
          
          // Try to parse as JSON
          try {
            const errorData = JSON.parse(errorText);
            console.log('Error response data:', errorData);
            // Handle both FastAPI and custom error formats
            if (errorData.detail) {
              errorMessage = errorData.detail;
            } else if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch (parseError) {
            console.log('Could not parse error response as JSON');
            errorMessage = errorText || errorMessage;
          }
        } catch (readError) {
          console.log('Could not read error response:', readError);
        }
        
        throw new Error(errorMessage);
      }

      console.log('Get research papers metadata response OK, reading JSON...');
      const data = await response.json();
      console.log('=== GET RESEARCH PAPERS METADATA SUCCESS ===');
      console.log('Response data:', data);
      return data;
      
    } catch (error) {
      console.log('=== GET RESEARCH PAPERS METADATA ERROR ===');
      console.error('Get research papers metadata API request error:', error);
      console.error('Error type:', typeof error);
      console.error('Error name:', error?.name);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Unable to connect to the server. Please check if the backend is running and CORS is properly configured.');
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('An unexpected error occurred while connecting to the server.');
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL); 