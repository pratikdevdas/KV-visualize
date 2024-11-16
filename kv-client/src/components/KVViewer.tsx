import React, { useState, useEffect } from 'react';
import { useKVQueries } from '../hooks/useKV';
import { KVPair } from '../types/types';
import { useSearchParams } from 'react-router-dom';

interface KVViewerProps {
  binding: string;
}

export const KVViewer: React.FC<KVViewerProps> = ({ binding }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchKey, setSearchKey] = useState('');
  const [selectedKey, setSelectedKey] = useState('');

  const { allKeysQuery, useGetValueQuery, deleteMutation } = useKVQueries(binding);
  const valueQuery = useGetValueQuery(selectedKey);
  const {data: allKeysData} = allKeysQuery;
  
  const handleKeyClick = (key: string) => {
    setSearchKey(key);
    setSelectedKey(key);
    setSearchParams({ key });
  };

  // Add effect to handle initial query param
  useEffect(() => {
    const keyParam = searchParams.get('key');
    if (keyParam) {
      setSearchKey(keyParam);
      setSelectedKey(keyParam);
    }
  }, [searchParams]);

  const handleSearch = () => {
    if (!searchKey.trim()) return;
    setSelectedKey(searchKey);
  };

  const handleDelete = async () => {
    if (!valueQuery.data) return;
    if (deleteMutation.isPending) return;
    try {
      await deleteMutation.mutateAsync(valueQuery.data.key);
      setSelectedKey('');
      setSearchKey('');
      setSearchParams({});
    } catch (err) {
      console.error('Failed to delete key:', err);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const tryParseJSON = (value: string) => {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  };

  const displayValue = valueQuery.data?.value ? tryParseJSON(valueQuery.data.value) : null;

  if (allKeysQuery.isLoading) return <div>Loading keys...</div>;
  if (!allKeysData) return <div className="text-red-500">Failed to load keys</div>;

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg mx-auto">
      <h2 className="text-2xl font-bold mb-8 text-gray-800 border-b pb-4">
        View KV Pair
      </h2>
      
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-1 border-r pr-6">
          <h3 className="text-lg font-semibold mb-4">Available Keys</h3>
          <div className="space-y-2">
            {allKeysQuery.isLoading ? (
              <div>Loading keys...</div>
            ) : allKeysQuery.error ? (
              <div className="text-red-500">Failed to load keys</div>
            ) : (
              // @ts-ignore
              allKeysData.map((kv: KVPair) => (
                <button
                  key={kv.name}
                  onClick={() => handleKeyClick(kv.name)}
                  className={`w-full text-left p-2 rounded transition-colors text-sm truncate
                    ${selectedKey === kv.name 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'hover:bg-gray-100'
                    }`}
                >
                  {kv.name}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="col-span-2">
          <div className="flex gap-3 mb-8">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                placeholder="Enter key to search"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pl-12"
              />
              <svg 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Search
            </button>
          </div>
          
          {valueQuery.isError && (
            <div className="text-red-500 mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              Failed to fetch value
            </div>
          )}
          {valueQuery.isLoading && (
            <div className="text-gray-500 mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              Loading value...
            </div>
          )}
          {valueQuery.data && valueQuery.data.value === 'Value not found' && (
            <div className="text-red-500 mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              Value not found
            </div>
          )}
          {valueQuery.data && valueQuery.data.value !== 'Value not found' && (
            <div className="border border-gray-200 rounded-lg p-8 bg-gray-50 shadow-inner">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-600">Key</label>
                  <button
                    onClick={() => copyToClipboard(valueQuery.data.key)}
                    className="text-blue-500 hover:text-blue-600 p-1 flex items-center gap-1 text-sm"
                    title="Copy key"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </button>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <code className="text-gray-800">{valueQuery.data.key}</code>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-600">Value</label>
                  <button
                    onClick={() => copyToClipboard(valueQuery.data.value || '')}
                    className="text-blue-500 hover:text-blue-600 p-1 flex items-center gap-1 text-sm"
                    title="Copy value"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </button>
                </div>
                <div className="relative">
                  <pre className="bg-white p-4 rounded-lg border border-gray-200 overflow-y-auto text-gray-800 font-mono text-sm h-[400px] whitespace-pre">
                    <code>
                      {typeof displayValue === 'string' 
                        ? displayValue 
                        : JSON.stringify(displayValue, null, 2)}
                    </code>
                  </pre>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className={`bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm ${deleteMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 