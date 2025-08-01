/**
 * API client for Digital Shadow backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

interface Document {
  id: number;
  title: string;
  description?: string;
  file_size: number;
  file_type: string;
  file_hash: string;
  ipfs_hash?: string;
  blockchain_tx_hash?: string;
  is_verified: boolean;
  created_at: string;
  updated_at?: string;
}

interface Verification {
  id: number;
  document_id: number;
  verification_type: string;
  status: string;
  blockchain_tx_hash?: string;
  ipfs_hash?: string;
  metadata?: string;
  created_at: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  email: string;
  username: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('access_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Authentication
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Login failed');
    }

    const data = await response.json();
    this.token = data.access_token;
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('user', JSON.stringify({
      id: data.user_id,
      email: data.email,
      username: data.username,
    }));

    return { data };
  }

  async register(userData: {
    email: string;
    username: string;
    password: string;
    full_name?: string;
  }): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.data) {
      this.token = response.data.access_token;
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.user_id,
        email: response.data.email,
        username: response.data.username,
      }));
    }

    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me');
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  // Documents
  async uploadDocument(
    file: File,
    title: string,
    description?: string
  ): Promise<ApiResponse<Document>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    if (description) {
      formData.append('description', description);
    }

    const url = `${this.baseUrl}/documents/upload`;
    const headers: HeadersInit = {};
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Upload failed');
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Upload failed' };
    }
  }

  async getDocuments(): Promise<ApiResponse<Document[]>> {
    return this.request<Document[]>('/documents/');
  }

  async getDocument(id: number): Promise<ApiResponse<Document>> {
    return this.request<Document>(`/documents/${id}`);
  }

  async deleteDocument(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/documents/${id}`, {
      method: 'DELETE',
    });
  }

  async verifyDocument(id: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/documents/${id}/verify`, {
      method: 'POST',
    });
  }

  // Verification
  async getVerificationHistory(): Promise<ApiResponse<{ verifications: Verification[]; total_count: number }>> {
    return this.request<{ verifications: Verification[]; total_count: number }>('/verification/history');
  }

  async getDocumentVerificationHistory(documentId: number): Promise<ApiResponse<Verification[]>> {
    return this.request<Verification[]>(`/verification/document/${documentId}`);
  }

  async verifyDocumentOnBlockchain(documentId: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/verification/verify-blockchain/${documentId}`, {
      method: 'POST',
    });
  }

  async getVerificationStats(): Promise<ApiResponse<any>> {
    return this.request<any>('/verification/stats');
  }

  // User Profile
  async updateProfile(userData: {
    full_name?: string;
    email?: string;
    username?: string;
  }): Promise<ApiResponse<User>> {
    return this.request<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async changePassword(passwordData: {
    current_password: string;
    new_password: string;
  }): Promise<ApiResponse<void>> {
    return this.request<void>('/users/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }

  async deleteAccount(): Promise<ApiResponse<void>> {
    return this.request<void>('/users/account', {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.request<any>('/health');
  }
}

export const apiClient = new ApiClient();
export type { User, Document, Verification, AuthResponse }; 