
import React from 'react';
import { DetectedObject } from '../types';
import { SHOPPING_PLATFORMS } from '../constants';

interface ObjectCardProps {
  object: DetectedObject;
}

const ObjectCard: React.FC<ObjectCardProps> = ({ object }) => {
  const getSearchUrl = (platform: typeof SHOPPING_PLATFORMS[0]) => {
    const query = platform.transform 
      ? platform.transform(object.brand, object.name)
      : encodeURIComponent(`${object.brand} ${object.name}`);
    return `${platform.baseUrl}${query}`;
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-md hover:border-blue-500/50 transition-all group">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
            {object.name}
          </h3>
          <p className="text-sm text-gray-400 font-medium">Brand: {object.brand}</p>
        </div>
        <div className="bg-green-500/10 text-green-400 text-xs font-bold px-2 py-1 rounded border border-green-500/20">
          {Math.round(object.confidence * 100)}% Match
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {SHOPPING_PLATFORMS.map((platform) => (
          <a
            key={platform.name}
            href={getSearchUrl(platform)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${platform.color} text-white text-[10px] font-bold py-2 rounded-lg text-center uppercase tracking-wider transition-all hover:scale-[1.02] shadow-sm`}
          >
            {platform.name}
          </a>
        ))}
        <a
          href={`https://www.google.com/search?q=${encodeURIComponent(object.brand + ' ' + object.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold py-2 rounded-lg text-center uppercase border border-white/10"
        >
          Official Store
        </a>
      </div>
    </div>
  );
};

export default ObjectCard;
