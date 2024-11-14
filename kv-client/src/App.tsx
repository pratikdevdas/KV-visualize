import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NamespaceList from './components/NamespaceList';
import KVManager from './components/KVManager';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // Consider data stale after 1 minute
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="App">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Cloudflare Local KV Manager</h1>
          <Routes>
            <Route path="/" element={<NamespaceList />} />
            <Route path="/namespace/:binding" element={<KVManager />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App; 