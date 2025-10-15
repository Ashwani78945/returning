
import React from 'react';

interface MainMenuProps {
  onStart: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className="bg-slate-800/50 p-8 rounded-xl shadow-2xl backdrop-blur-sm border border-slate-700 max-w-lg">
        <h2 className="text-4xl md:text-5xl font-bold font-story text-amber-100 mb-4">Your Adventure Awaits</h2>
        <p className="text-slate-300 mb-8 text-lg">
          Forge your legend in a world crafted by imagination. Every choice you make carves a new path in an epic tale where you are the hero. The story is unwritten. The destiny is yours.
        </p>
        <button
          onClick={onStart}
          className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xl rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          Begin Your Journey
        </button>
      </div>
    </div>
  );
};

export default MainMenu;
