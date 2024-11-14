import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { KVDashboard } from './KVDashboard';

const KVManager = () => {
  const { binding } = useParams<{ binding: string, id: string }>();

  if (!binding) return <div>No namespace selected</div>;

  return (
    <div>
      <p className="text-center">
        <Link to="/" className="text-blue-500 hover:underline">Back</Link>
      </p>
      <h2 className="text-lg font-bold text-center text-gray-700">Binding: {binding}</h2>
      <KVDashboard binding={binding} />
    </div>
  );
};

export default KVManager; 