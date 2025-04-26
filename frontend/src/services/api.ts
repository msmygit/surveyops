import axios, { AxiosError } from 'axios';
import {
  User,
  AuthResponse,
  LoginCredentials,
  Presentation,
  CreatePresentationDto,
  CreateSlideDto,
  Slide,
  JoinPresentationDto,
  AudienceMember,
} from '../types';

const API_BASE_URL = '/api';

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses and errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const errorMessage = (error.response.data as any)?.message || 'An error occurred';
      throw new ApiError(errorMessage, error.response.status, error.response.data);
    }
    throw new ApiError('Network error');
  }
);

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('token', data.token);
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },
};

export const presentationApi = {
  getAll: async (): Promise<Presentation[]> => {
    const { data } = await api.get<Presentation[]>('/presentations');
    return data;
  },

  getById: async (id: string): Promise<Presentation> => {
    const { data } = await api.get<Presentation>(`/presentations/${id}`);
    return data;
  },

  create: async (dto: CreatePresentationDto): Promise<Presentation> => {
    const { data } = await api.post<Presentation>('/presentations', dto);
    return data;
  },

  update: async (id: string, dto: Partial<Presentation>): Promise<Presentation> => {
    const { data } = await api.put<Presentation>(`/presentations/${id}`, dto);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/presentations/${id}`);
  },

  addSlide: async (presentationId: string, dto: CreateSlideDto): Promise<Slide> => {
    const { data } = await api.post<Slide>(`/presentations/${presentationId}/slides`, dto);
    return data;
  },

  updateSlide: async (presentationId: string, slideId: string, dto: Partial<Slide>): Promise<Slide> => {
    const { data } = await api.put<Slide>(`/presentations/${presentationId}/slides/${slideId}`, dto);
    return data;
  },

  deleteSlide: async (presentationId: string, slideId: string): Promise<void> => {
    await api.delete(`/presentations/${presentationId}/slides/${slideId}`);
  },

  submitResponse: async (presentationId: string, slideId: string, response: any): Promise<void> => {
    await api.post(`/presentations/${presentationId}/slides/${slideId}/responses`, response);
  },

  toggleActive: async (id: string): Promise<Presentation> => {
    const { data } = await api.post<Presentation>(`/presentations/${id}/toggle-active`);
    return data;
  },

  join: async (dto: JoinPresentationDto): Promise<{ presentation: Presentation; member: AudienceMember }> => {
    const { data } = await api.post<{ presentation: Presentation; member: AudienceMember }>('/presentations/join', dto);
    return data;
  },

  getAudience: async (presentationId: string): Promise<AudienceMember[]> => {
    const { data } = await api.get<AudienceMember[]>(`/presentations/${presentationId}/audience`);
    return data;
  },

  leave: async (presentationId: string): Promise<void> => {
    await api.post(`/presentations/${presentationId}/leave`);
  },
};

export { ApiError }; 