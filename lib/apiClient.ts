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
  ProductMedia,
  SearchResponse,
  DiscoveryResponse,
  UserActivity
} from './types';

interface ApiErrorResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

type RawProductData = Omit<Product, 'thumbnail' | 'previews'> & {
  media?: ProductMedia[];
};

class ApiClient {
  public instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
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

  private _transformProductShape = (productData: RawProductData): Product => {
    if (productData && 'thumbnail' in productData && 'previews' in productData) {
      return productData as Product;
    }

    const media: ProductMedia[] = productData.media || [];
    const sortedMedia = [...media].sort((a, b) => (a.priority || 0) - (b.priority || 0));
    
    const thumbnail = sortedMedia.find(m => m.purpose === 'thumbnail') || null;
    const previews = sortedMedia.filter(m => m.purpose === 'preview');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { media: _media, ...rest } = productData;

    return { ...rest, thumbnail, previews } as Product;
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
  
  search = {
    getResults: async (params: { q: string; page?: number; limit?: number }, signal?: AbortSignal): Promise<{ data: SearchResponse }> => {
        type RawSearchResponse = Omit<SearchResponse, 'data'> & { data: RawProductData[] };
        const response = await this.instance.get<RawSearchResponse>('/search', { params, signal });
        response.data.data = response.data.data.map(this._transformProductShape);
        return response as unknown as { data: SearchResponse };
    },
    getDiscoveryFeed: async (signal?: AbortSignal): Promise<{ data: DiscoveryResponse }> => {
        type RawDiscoveryResponse = {
          recentlyViewed?: RawProductData[];
          recommendedForYou?: { title: string; items: RawProductData[] };
          trendingNow?: { title: string; items: RawProductData[] };
        }
        const response = await this.instance.get<RawDiscoveryResponse>('/me/discover', { signal });
        
        const transformedData: DiscoveryResponse = {};
        if (response.data.recentlyViewed) {
          transformedData.recentlyViewed = response.data.recentlyViewed.map(this._transformProductShape);
        }
        if (response.data.recommendedForYou) {
          transformedData.recommendedForYou = {
            title: response.data.recommendedForYou.title,
            items: response.data.recommendedForYou.items.map(this._transformProductShape)
          };
        }
        if (response.data.trendingNow) {
          transformedData.trendingNow = {
            title: response.data.trendingNow.title,
            items: response.data.trendingNow.items.map(this._transformProductShape)
          };
        }
        
        return { data: transformedData };
    }
  };

  products = {
    create: (data: Partial<Product>): Promise<{ data: Product }> => this.instance.post('/products', data),
    getAll: (params: ProductQuery, signal?: AbortSignal): Promise<{ data: PaginatedProductsResponse }> => this.instance.get('/products', { params, signal }),
    getById: (id: string, signal?: AbortSignal): Promise<{ data: Product }> => this.instance.get(`/products/${id}`, { signal }),
    update: (id: string, data: Partial<Product>): Promise<{ data: Product }> => this.instance.patch(`/products/${id}`, data),
    delete: (id: string): Promise<void> => this.instance.delete(`/products/${id}`),
    getCategories: (): Promise<{ data: Category[] }> => this.instance.get('/categories'),
    getZones: (): Promise<{ data: Zone[] }> => this.instance.get('/zones'),
    
    addTags: (productId: string, tags: string[]): Promise<{ data: Product }> =>
      this.instance.post(`/products/${productId}/tags`, { tags }),

    getAllPublic: async (signal?: AbortSignal): Promise<{ data: Product[] }> => {
        const response = await this.instance.get<RawProductData[]>('/products/public/all', { signal });
        response.data = response.data.map(this._transformProductShape);
        return response as unknown as { data: Product[] };
    },
    getByIdPublic: async (id: string, signal?: AbortSignal): Promise<{ data: Product }> => {
        const response = await this.instance.get<RawProductData>(`/products/public/find/${id}`, { signal });
        response.data = this._transformProductShape(response.data);
        return response as unknown as { data: Product };
    },
    getByCategoryIdPublic: async (categoryId: string, signal?: AbortSignal): Promise<{ data: Product[] }> => {
        const response = await this.instance.get<RawProductData[]>(`/products/public/category/${categoryId}`, { signal });
        response.data = response.data.map(this._transformProductShape);
        return response as unknown as { data: Product[] };
    },
    getByZoneIdPublic: async (zoneId: string, signal?: AbortSignal): Promise<{ data: Product[] }> => {
        const response = await this.instance.get<RawProductData[]>(`/products/public/zone/${zoneId}`, { signal });
        response.data = response.data.map(this._transformProductShape);
        return response as unknown as { data: Product[] };
    },
    getBySellerIdPublic: async (sellerId: string, signal?: AbortSignal): Promise<{ data: Product[] }> => {
        const response = await this.instance.get<RawProductData[]>(`/products/public/seller/${sellerId}`, { signal });
        response.data = response.data.map(this._transformProductShape);
        return response as unknown as { data: Product[] };
    },
    
    // --- VVVVVV FIX: Added missing method VVVVVV ---
    getPublicCount: (signal?: AbortSignal): Promise<{ data: { totalProducts: number } }> =>
      this.instance.get('/products/public/count', { signal }),
    // --- ^^^^^^ END OF FIX ^^^^^^ ---

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
    findAllPublic: async (): Promise<{ data: Collection[] }> => {
      const response = await this.instance.get<Collection[]>('/collections');
      response.data = response.data.map(collection => ({
        ...collection,
        products: collection.products.map(cp => ({ ...cp, product: this._transformProductShape(cp.product as RawProductData) })),
      }));
      return response;
    },
  };
  
  uploads = {
    getMediaForEntity: (entityModel: 'Product' | 'User', entityId: string, signal?: AbortSignal): Promise<{ data: GroupedMedia }> =>
      this.instance.get(`/uploads/by/${entityModel}/${entityId}`, { signal }),
  };

  users = {
     getMyActivity: (signal?: AbortSignal): Promise<{ data: UserActivity }> =>
      this.instance.get('/me/activity', { signal }),
    getPublicProfileById: (userId: string, signal?: AbortSignal): Promise<{ data: PublicUserProfile }> =>
      this.instance.get(`/users/${userId}`, { signal }),
    
    getMyUploads: (signal?: AbortSignal): Promise<{ data: GroupedMedia }> =>
      this.instance.get('/users/me/uploads', { signal }),

    // --- VVVVVV FIX: Added missing method VVVVVV ---
    getTotalCount: (signal?: AbortSignal): Promise<{ data: { totalUsers: number } }> =>
      this.instance.get('/users/count', { signal }),
    // --- ^^^^^^ END OF FIX ^^^^^^ ---

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