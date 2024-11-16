import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface KVNamespace {
  binding: string;
  id: string;
  preview_id?: string;
}

const NamespaceList = () => {
  const [namespaces, setNamespaces] = useState<KVNamespace[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:3000/kv-namespaces')
      .then(res => res.json())
      .then(data => setNamespaces(data))
      .catch(err => setError('Failed to load KV namespaces. Check your server is running or logs.'));
  }, []);

  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-lg font-bold mb-6 text-gray-800">KV Namespaces</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {namespaces.map(ns => (
          <Link 
            key={ns.id} 
            to={`/namespace/${ns.binding}`}
            className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <h3 className="text-lg font-semibold text-blue-600 mb-2">{ns.binding}</h3>
            <p className="text-gray-600 text-sm">ID: {ns.id}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NamespaceList; 