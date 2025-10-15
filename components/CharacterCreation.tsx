
import React, { useState } from 'react';

interface CharacterCreationProps {
  onStartGame: (name: string, characterClass: string) => void;
  onBack: () => void;
}

const classes = [
    { name: 'Warrior', description: 'Master of arms, clad in steel. High health and melee prowess.' },
    { name: 'Mage', description: 'Wielder of arcane energies. High mana and powerful spells.' },
    { name: 'Rogue', description: 'A shadow in the night. Agile and cunning, strikes from the dark.' },
];

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onStartGame, onBack }) => {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState(classes[0].name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStartGame(name.trim(), selectedClass);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="bg-slate-800/50 p-8 rounded-xl shadow-2xl backdrop-blur-sm border border-slate-700 max-w-2xl w-full">
        <h2 className="text-3xl font-bold font-story text-amber-100 mb-6 text-center">Create Your Hero</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-slate-300 text-sm font-bold mb-2">
              Character Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border border-slate-600 rounded w-full py-2 px-3 bg-slate-700 text-slate-200 leading-tight focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter your hero's name"
              required
            />
          </div>
          <div className="mb-6">
             <label className="block text-slate-300 text-sm font-bold mb-2">
              Choose your Class
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {classes.map(c => (
                    <div key={c.name} onClick={() => setSelectedClass(c.name)} 
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedClass === c.name ? 'border-amber-500 bg-amber-900/30' : 'border-slate-600 hover:bg-slate-700'}`}>
                        <h3 className="font-bold text-lg text-amber-200">{c.name}</h3>
                        <p className="text-sm text-slate-400">{c.description}</p>
                    </div>
                ))}
            </div>
          </div>
          <div className="flex items-center justify-between mt-8">
            <button
                type="button"
                onClick={onBack}
                className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
                Back
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:bg-slate-500 disabled:cursor-not-allowed disabled:scale-100"
            >
              Start Adventure
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CharacterCreation;
