import { KVPair, APIResponse } from '../types/types';

const API_BASE_URL = 'http://localhost:3000';

// Add default headers configuration
const getHeaders = (binding?: string) => ({
  'Content-Type': 'application/json',
  'X-KV-Binding': binding || 'USER_PROFILE_INTERACTICO',
});

export const kvService = {
  async getAllValues(binding: string): Promise<APIResponse> {
    const response = await fetch(`${API_BASE_URL}/kv`, {
      headers: getHeaders(binding),
    });
    return response.json();
  },

  async getValue(key: string, binding?: string): Promise<APIResponse> {
    const response = await fetch(`${API_BASE_URL}/kv/${key}`, {
      headers: getHeaders(binding),
    });
    return response.json();
  },

  async createOrUpdate(kvPair: KVPair, binding?: string): Promise<APIResponse> {
    const response = await fetch(`${API_BASE_URL}/kv`, {
      method: 'POST',
      headers: getHeaders(binding),
      body: JSON.stringify(kvPair),
    });
    return response.json();
  },

  async deleteKey(key: string, binding?: string): Promise<APIResponse> {
    const response = await fetch(`${API_BASE_URL}/kv/${key}`, {
      method: 'DELETE',
      headers: getHeaders(binding),
    });
    return response.json();
  },
}; 