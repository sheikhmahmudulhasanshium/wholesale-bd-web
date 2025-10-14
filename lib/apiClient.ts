// FILE: @/lib/apiClient.ts

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { 
  AuthResponse, 
  User, 
  Category, 
  Zone, 
  PaginatedProductsResponse, 
  ProductQuery,
  Product
} from './types';

interface ApiErrorResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

class ApiClient {
  public instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('access_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiErrorResponse>) => {
        this.handleGlobalError(error);
        return Promise.reject(error);
      }
    );
  }

  private handleGlobalError(error: AxiosError<ApiErrorResponse>) {
    const { response, message } = error;
    if (response?.status === 401) {
      toast.error('Session expired. Please log in again.');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
      }
      return;
    }
    const errorData = response?.data;
    let errorMessage = 'An unexpected error occurred.';
    if (errorData) {
        if (typeof errorData.message === 'string') {
            errorMessage = errorData.message;
        } else if (Array.isArray(errorData.message) && errorData.message.length > 0) {
            errorMessage = errorData.message[0];
        } else {
            errorMessage = message;
        }
    }
    if (response?.status !== 409) {
      toast.error(errorMessage);
    }
  }

  auth = {
    register: (data: Record<string, unknown>): Promise<{ data: AuthResponse }> => 
      this.instance.post('/auth/register', data),
    login: (data: Record<string, unknown>): Promise<{ data: AuthResponse }> =>
      this.instance.post('/auth/login', data),
    getProfile: (): Promise<{ data: { success: boolean, data: User } }> =>
      this.instance.get('/auth/profile'),
    verifyEmail: (data: { email: string; otp: string }) =>
      this.instance.post('/auth/verify-email', data),
    resendVerification: (data: { email: string }) =>
      this.instance.post('/auth/resend-verification', data),
    forgotPassword: (data: { email: string }): Promise<{data: {message: string}}> =>
      this.instance.post('/auth/forgot-password', data),
    resetPassword: (data: { email: string; otp: string; newPassword: string }) =>
      this.instance.post('/auth/reset-password', data),
  };

  products = {
    create: (data: FormData): Promise<{ data: Product }> => this.instance.post('/products', data),
    
    getAll: (params: ProductQuery, signal?: AbortSignal): Promise<{ data: PaginatedProductsResponse }> => 
      this.instance.get('/products', { params, signal }),
         
    // ✅ 1. ADDED: Method to get a single product by its ID
    getById: (id: string, signal?: AbortSignal): Promise<{ data: Product }> =>
      this.instance.get(`/products/${id}`, { signal }),

    // ✅ 2. ADDED: Method to update a product (expects FormData)
    update: (id: string, data: FormData): Promise<{ data: Product }> =>
      this.instance.patch(`/products/${id}`, data),
    // ✅ ADDED: Admin delete method (soft delete as per your original backend code)
    delete: (id: string): Promise<void> => this.instance.delete(`/products/${id}`),
    
    getCategories: (): Promise<{ data: Category[] }> => this.instance.get('/categories'),
    getZones: (): Promise<{ data: Zone[] }> => this.instance.get('/zones'),
  };
}

const apiClient = new ApiClient();

export default apiClient;