import { useAuth } from '@clerk/nextjs';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & { token?: string } = {}
  ): Promise<T> {
    const { token, ...fetchOptions } = options;
    
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Health check (no auth required)
  async healthCheck() {
    return this.request('/health/');
  }

  // User profile (requires auth)
  async getUserProfile(token: string) {
    return this.request('/profile/', { token });
  }

  // Users list (requires auth)
  async getUsers(token: string) {
    return this.request('/users/', { token });
  }
}

export const apiClient = new ApiClient();

// Hook for authenticated API calls
export function useApiClient() {
  const { getToken } = useAuth();

  const authenticatedRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const token = await getToken();
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    return apiClient.request(endpoint, { ...options, token });
  };

  return {
    healthCheck: () => apiClient.healthCheck(),
    getUserProfile: () => authenticatedRequest('/profile/'),
    getUsers: () => authenticatedRequest('/users/'),
  };
}
