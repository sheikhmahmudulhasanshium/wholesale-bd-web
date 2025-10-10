import axios, { AxiosInstance, AxiosError } from 'axios';
import { toast } from 'sonner';

// Re-using the User type you already have
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  avatar?: {
    public_id: string;
    url: string;
  };
  createdAt: string;
}

// Type for API error responses
interface ApiErrorResponse {
  message: string;
  errors?: { field: string; message: string }[];
}

// Type for successful auth responses
interface AuthResponse {
  success: boolean;
  user: User;
}

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 10000, // 10 second timeout
      withCredentials: true, // This is crucial for sending httpOnly cookies!
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Response interceptor for global error handling
    this.instance.interceptors.response.use(
      (response) => response, // Simply return successful responses
      (error: AxiosError<ApiErrorResponse>) => {
        this.handleGlobalError(error);
        return Promise.reject(error);
      }
    );
  }

  private handleGlobalError(error: AxiosError<ApiErrorResponse>) {
    const { response, message } = error;
    
    // Handle specific status codes
    if (response?.status === 401) {
      toast.error('Session expired. Please login again.');
      // We can trigger a logout here if the auth context is available or redirect
      if (typeof window !== 'undefined') {
        // A simple redirect is often effective for session expiry
        window.location.href = '/login';
      }
      return;
    }
    
    // Use the error message from the API if available
    const errorMessage = response?.data?.message || message || 'An unexpected error occurred';
    toast.error(errorMessage);
  }

  // =============================================
  // AUTH ENDPOINTS
  // =============================================
  auth = {
    register: (data: Record<string, unknown>) => 
      this.instance.post('/users/register', data),

    login: (data: Record<string, unknown>): Promise<{ data: AuthResponse }> =>
      this.instance.post('/users/login', data),

    getProfile: (): Promise<{ data: AuthResponse }> =>
      this.instance.get('/users/profile'),

    logout: () => this.instance.get('/users/logout'),

    getGoogleLoginUrl: (): string => {
      if (!this.instance.defaults.baseURL) {
        throw new Error("API base URL is not configured.");
      }
      // Note: The base URL already includes /v1
      return `${this.instance.defaults.baseURL}/auth/google`;
    },
  };

  // You can add other endpoint groups here in the future
  // products = { ... }
  // orders = { ... }
}

const apiClient = new ApiClient();

export default apiClient;