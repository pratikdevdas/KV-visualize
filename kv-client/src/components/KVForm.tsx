import React, { useState, useEffect } from 'react';
import { useKVQueries } from '../hooks/useKV';
import { KVPair } from '../types/types';

interface KVFormProps {
  selectedKV: KVPair | null;
  onComplete: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const KVForm: React.FC<KVFormProps> = ({ selectedKV, onComplete, isOpen, onClose }) => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  const { createOrUpdateMutation } = useKVQueries('USER_PROFILE_INTERACTICO');

  useEffect(() => {
    if (selectedKV) {
      setKey(selectedKV.name);
      setValue(selectedKV.value);
    } else {
      // Reset form when opening for new entry
      setKey('');
      setValue('');
    }
  }, [selectedKV, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // @ts-ignore
      await createOrUpdateMutation.mutateAsync({ key, value });
      setKey('');
      setValue('');
      onComplete();
      onClose();
    } catch (err) {
      console.error('Failed to save KV pair:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {selectedKV ? 'Edit KV Pair' : 'Create New KV Pair'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Key</label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              rows={6}
              required
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={createOrUpdateMutation.isPending}
              className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {createOrUpdateMutation.isPending ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 