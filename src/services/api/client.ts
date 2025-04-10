import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'sonner';

// Error types
export enum ErrorType {
  NETWORK = 'network',
  TIMEOUT = 'timeout',
  SERVER = 'server',
  UNAUTHORIZED = 'unauthorized',
  NOT_FOUND = 'not_found',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown'
}

// API error structure
export interface ApiError {
  type: ErrorType;
  status?: number;
  message: string;
  details?: any;
  originalError?: any;
}

// Response wrapper
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
}

// API client options
export interface ApiClientOptions {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
}

export class ApiClient {
  private instance: AxiosInstance;
  private abortControllers: Map<string, AbortController> = new Map();

  constructor(options: ApiClientOptions) {
    this.instance = axios.create({
      baseURL: options.baseURL,
      timeout: options.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      withCredentials: options.withCredentials || false
    });

    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Cancel previous requests with the same requestId if they exist
        if (config.headers?.['X-Request-ID']) {
          const requestId = config.headers['X-Request-ID'] as string;
          if (this.abortControllers.has(requestId)) {
            this.abortControllers.get(requestId)?.abort();
          }
          
          const controller = new AbortController();
          config.signal = controller.signal;
          this.abortControllers.set(requestId, controller);
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError = this.handleError(error);
        
        // Global error handling
        if (apiError.type === ErrorType.UNAUTHORIZED) {
          // Handle auth errors (redirect to login, etc.)
          console.log('Authentication error, redirecting to login...');
        }
        
        return Promise.reject(apiError);
      }
    );
  }

  // Process API errors into a consistent format
  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      // Server responded with an error status
      const status = error.response.status;
      const data = error.response.data as any;
      
      switch (status) {
        case 401:
          return {
            type: ErrorType.UNAUTHORIZED,
            status,
            message: 'Authentication required',
            details: data,
            originalError: error
          };
        case 404:
          return {
            type: ErrorType.NOT_FOUND,
            status,
            message: 'Resource not found',
            details: data,
            originalError: error
          };
        case 422:
          return {
            type: ErrorType.VALIDATION,
            status,
            message: 'Validation error',
            details: data,
            originalError: error
          };
        default:
          return {
            type: ErrorType.SERVER,
            status,
            message: data?.message || 'Server error',
            details: data,
            originalError: error
          };
      }
    } else if (error.request) {
      // Request was made but no response received
      if (error.code === 'ECONNABORTED') {
        return {
          type: ErrorType.TIMEOUT,
          message: 'Request timed out',
          originalError: error
        };
      }
      
      return {
        type: ErrorType.NETWORK,
        message: 'Network error',
        originalError: error
      };
    }
    
    // Something else happened
    return {
      type: ErrorType.UNKNOWN,
      message: error.message || 'Unknown error',
      originalError: error
    };
  }

  // Generic request method
  private async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.request<T>(config);
      return {
        data: response.data,
        error: null,
        isLoading: false
      };
    } catch (error) {
      const apiError = error as ApiError;
      return {
        data: null,
        error: apiError,
        isLoading: false
      };
    }
  }

  // HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url, data: config?.data });
  }
}

// Create API client instances
export const createApiClient = (options: ApiClientOptions) => new ApiClient(options);

// Default API client
export const apiClient = createApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api'
});