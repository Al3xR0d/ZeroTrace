import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { NavigateFunction } from 'react-router-dom';

class Api {
  private readonly api: AxiosInstance;
  private navigate: NavigateFunction | null = null;

  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }
  private setupInterceptors() {
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
          // localStorage.removeItem('token');
          this.navigate?.('/login', { replace: true });
        }
        return Promise.reject(error);
      },
    );
  }

  setNavigate(navigate: NavigateFunction) {
    this.navigate = navigate;
  }

  async GET<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  async POST<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  async PATCH<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.patch<T>(url, data, config);
    return response.data;
  }

  async PUT<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  async DELETE<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }
}

export const api = new Api(import.meta.env.VITE_API_URL || '/api');
