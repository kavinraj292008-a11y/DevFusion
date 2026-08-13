interface ViteEnv {
  VITE_API_BASE_URL?: string;
  VITE_USE_MOCK?: string;
}

export const API_BASE = (import.meta as unknown as { env: ViteEnv }).env.VITE_API_BASE_URL || '';
export const USE_MOCK = (import.meta as unknown as { env: ViteEnv }).env.VITE_USE_MOCK === 'true';

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Export apiRequest helper function
export const apiRequest = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE}${endpoint}`, options);
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
};