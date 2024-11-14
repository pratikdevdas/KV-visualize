import React, { useState } from 'react';
import { KVForm } from './KVForm';
import { KVViewer } from './KVViewer';
import { KVPair } from '../types/types';

interface KVDashboardProps {
  binding: string;
}

export const KVDashboard: React.FC<KVDashboardProps> = ({ binding }) => {
  const [selectedKV, setSelectedKV] = useState<KVPair | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleComplete = () => {
    setSelectedKV(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="flex justify-end">
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Add or Edit Key-Value Pair
          </button>
        </div>
          {isFormOpen && (
            <KVForm 
              selectedKV={selectedKV} 
              onComplete={handleComplete} 
              isOpen={isFormOpen} 
              onClose={() => setIsFormOpen(false)} 
            />
          )}
        <div>
          <KVViewer binding={binding} />
        </div>
      </div>
    </div>
  );
}; 