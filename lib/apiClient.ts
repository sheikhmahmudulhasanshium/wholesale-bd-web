// @/lib/apiClient.ts
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { 
  AuthResponse, 
  AuthenticatedUser,
  PublicUserProfile,
  Category, 
  Zone, 
  PaginatedProductsResponse, 
  ProductQuery,
  Product,
  GroupedMedia,
  Media,
  Collection,
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
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];
        } else {
          config.headers['Content-Type'] = 'application/json';
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
      if (typeof window !== 'undefined' && localStorage.getItem('access_token')) {
        toast.error('Your session has expired. Please log in again.');
        localStorage.removeItem('access_token');
        window.location.reload(); 
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
    getProfile: (): Promise<{ data: AuthenticatedUser }> =>
      this.instance.get('/users/me'),
    validateOtp: (data: { email: string; otp: string }) =>
      this.instance.post('/auth/validate-otp', data),
    requestNewOtp: (data: { email: string }) =>
      this.instance.post('/auth/verify-email', data),
    forgotPassword: (data: { email: string }): Promise<{data: {message: string}}> =>
      this.instance.post('/auth/forgot-password', data),
    resetPassword: (data: { token: string; newPassword: string }) =>
      this.instance.post('/auth/reset-password', data),
  };

  products = {
    create: (data: Partial<Product>): Promise<{ data: Product }> => this.instance.post('/products', data),
    getAll: (params: ProductQuery, signal?: AbortSignal): Promise<{ data: PaginatedProductsResponse }> => this.instance.get('/products', { params, signal }),
    getAllPublic: (signal?: AbortSignal): Promise<{ data: Product[] }> => this.instance.get('/products/public/all', { signal }),
    getById: (id: string, signal?: AbortSignal): Promise<{ data: Product }> => this.instance.get(`/products/${id}`, { signal }),
    getByIdPublic: (id: string, signal?: AbortSignal): Promise<{ data: Product }> => this.instance.get(`/products/public/find/${id}`, { signal }),
    getByCategoryIdPublic: (categoryId: string, signal?: AbortSignal): Promise<{ data: Product[] }> => this.instance.get(`/products/public/category/${categoryId}`, { signal }),
    getByZoneIdPublic: (zoneId: string, signal?: AbortSignal): Promise<{ data: Product[] }> => this.instance.get(`/products/public/zone/${zoneId}`, { signal }),
    getBySellerIdPublic: (sellerId: string, signal?: AbortSignal): Promise<{ data: Product[] }> => this.instance.get(`/products/public/seller/${sellerId}`, { signal }),
    update: (id: string, data: Partial<Product>): Promise<{ data: Product }> => this.instance.patch(`/products/${id}`, data),
    delete: (id: string): Promise<void> => this.instance.delete(`/products/${id}`),
    getCategories: (): Promise<{ data: Category[] }> => this.instance.get('/categories'),
    getZones: (): Promise<{ data: Zone[] }> => this.instance.get('/zones'),
    
    // New media management endpoints
    uploadThumbnail: (productId: string, file: File): Promise<{ data: Product }> => {
      const formData = new FormData();
      formData.append('file', file);
      return this.instance.post(`/products/${productId}/thumbnail/upload`, formData);
    },
    setThumbnailFromUrl: (productId: string, url: string): Promise<{ data: Product }> =>
      this.instance.post(`/products/${productId}/thumbnail/from-url`, { url }),
    
    uploadPreview: (productId: string, file: File): Promise<{ data: Product }> => {
      const formData = new FormData();
      formData.append('file', file);
      return this.instance.post(`/products/${productId}/previews/upload`, formData);
    },
    addPreviewFromUrl: (productId: string, url: string): Promise<{ data: Product }> =>
      this.instance.post(`/products/${productId}/previews/from-url`, { url }),

    updateMediaProperties: (productId: string, mediaId: string, data: { purpose?: 'thumbnail' | 'preview', priority?: number }): Promise<{ data: Product }> =>
      this.instance.patch(`/products/${productId}/media/${mediaId}`, data),
      
    deleteMedia: (productId: string, mediaId: string): Promise<{ data: Product }> =>
      this.instance.delete(`/products/${productId}/media/${mediaId}`),
  };

  zones = {
    findAll: (): Promise<{ data: Zone[] }> => this.instance.get('/zones'),
  };

  collections = {
    findAllPublic: (): Promise<{ data: Collection[] }> => this.instance.get('/collections'),
  };
  
  uploads = {
    getMediaForEntity: (entityModel: 'Product' | 'User', entityId: string, signal?: AbortSignal): Promise<{ data: GroupedMedia }> =>
      this.instance.get(`/uploads/by/${entityModel}/${entityId}`, { signal }),
  };

  users = {
    getPublicProfileById: (userId: string, signal?: AbortSignal): Promise<{ data: PublicUserProfile }> =>
      this.instance.get(`/users/${userId}`, { signal }),
    
    getMyUploads: (signal?: AbortSignal): Promise<{ data: GroupedMedia }> =>
      this.instance.get('/users/me/uploads', { signal }),

    uploadProfilePicture: (file: File): Promise<{ data: Media }> => {
      const formData = new FormData();
      formData.append('file', file);
      return this.instance.post('/users/me/profile-picture', formData);
    },

    uploadBackgroundPicture: (file: File): Promise<{ data: Media }> => {
      const formData = new FormData();
      formData.append('file', file);
      return this.instance.post('/users/me/background-picture', formData);
    },

    setProfilePictureFromUrl: (url: string): Promise<{ data: Media }> =>
      this.instance.post('/users/me/profile-picture/from-url', { url }),

    setBackgroundPictureFromUrl: (url: string): Promise<{ data: Media }> =>
      this.instance.post('/users/me/background-picture/from-url', { url }),
  };
}

const apiClient = new ApiClient();

export default apiClient;