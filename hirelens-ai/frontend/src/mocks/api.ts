export const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));