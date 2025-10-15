
import React, { useRef, useEffect } from 'react';
import { StorySegment } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface StoryDisplayProps {
  storyLog: StorySegment[];
  onChoice: (choice: string) => void;
  isLoading: boolean;
  isGameOver: boolean;
  onNewGame: () => void;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ storyLog, onChoice, isLoading, isGameOver, onNewGame }) => {
  const endOfLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfLogRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [storyLog]);

  return (
    <div className="bg-slate-800/50 p-4 md:p-6 rounded-xl shadow-lg border border-slate-700 h-full flex flex-col">
      <div className="flex-grow overflow-y-auto pr-2 space-y-6">
        {storyLog.map((segment) => (
          <div key={segment.id}>
            {segment.type === 'narrative' ? (
              <div className="prose prose-lg prose-invert max-w-none font-story text-slate-300">
                <p>{segment.content}</p>
                {segment.options && segment.options.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {segment.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => onChoice(option)}
                        disabled={isLoading}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-amber-100 font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 disabled:bg-slate-800 disabled:cursor-not-allowed disabled:scale-100"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-right">
                <p className="inline-block bg-amber-900/50 text-amber-100 font-semibold italic px-4 py-2 rounded-lg">
                  {`> ${segment.content}`}
                </p>
              </div>
            )}
          </div>
        ))}
        {isLoading && storyLog.length > 0 && (
          <div className="flex justify-center py-4">
             <div className="flex items-center space-x-2 text-slate-400">
                <LoadingSpinner small/>
                <span>The Dungeon Master is thinking...</span>
            </div>
          </div>
        )}
        {isGameOver && (
          <div className="text-center py-6">
            <h3 className="text-3xl font-bold font-story text-red-400 mb-4">GAME OVER</h3>
            <button 
              onClick={onNewGame}
              className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Start a New Adventure
            </button>
          </div>
        )}
        <div ref={endOfLogRef} />
      </div>
    </div>
  );
};

export default StoryDisplay;
