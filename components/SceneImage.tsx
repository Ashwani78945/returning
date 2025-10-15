
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface SceneImageProps {
  imageUrl: string;
  isLoading: boolean;
}

const SceneImage: React.FC<SceneImageProps> = ({ imageUrl, isLoading }) => {
  return (
    <div className="bg-slate-800/50 p-3 rounded-xl shadow-lg border border-slate-700 aspect-square w-full h-full flex items-center justify-center">
      {isLoading ? (
         <div className="flex flex-col items-center text-slate-400">
            <LoadingSpinner />
            <p className="mt-2">Conjuring a vision...</p>
         </div>
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt="Current scene"
          className="rounded-lg object-cover w-full h-full"
        />
      ) : (
        <div className="text-center text-slate-500">
            <p>Your journey's sights will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default SceneImage;
