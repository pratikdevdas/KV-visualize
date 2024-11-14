export interface KVPair {
  name: string;
  value: string;
}

export interface APIResponse {
  key: string;
  value?: string;
  message?: string;
  error?: string;
} 