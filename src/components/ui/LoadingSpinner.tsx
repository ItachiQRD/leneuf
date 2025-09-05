import React from 'react';
import '@/styles/LoadingSpinner.css'; // Assurez-vous d'importer le fichier CSS pour le style

const LoadingSpinner: React.FC<{ size?: number }> = ({ size = 40 }) => {
  return (
    <div className="loading-spinner" style={{ width: size, height: size }}>
      <div className="spinner" />
    </div>
  );
};

export default LoadingSpinner;
