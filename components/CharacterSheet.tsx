
import React from 'react';
import { Character } from '../types';

interface CharacterSheetProps {
  character: Character;
}

const StatBar: React.FC<{ value: number; maxValue: number; color: string; label: string }> = ({ value, maxValue, color, label }) => (
  <div>
    <div className="flex justify-between items-baseline mb-1">
      <span className="text-sm font-bold text-slate-300">{label}</span>
      <span className="text-sm font-mono">{value} / {maxValue}</span>
    </div>
    <div className="w-full bg-slate-700 rounded-full h-2.5">
      <div className={`${color} h-2.5 rounded-full`} style={{ width: `${(value / maxValue) * 100}%` }}></div>
    </div>
  </div>
);

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character }) => {
  return (
    <div className="bg-slate-800/50 p-4 rounded-xl shadow-lg border border-slate-700 h-full">
      <div className="flex items-center mb-4">
        <img src={character.avatarUrl} alt={character.name} className="w-20 h-20 rounded-full border-2 border-slate-600 mr-4" />
        <div>
          <h2 className="text-2xl font-bold text-amber-100">{character.name}</h2>
          <p className="text-md text-slate-400">{character.characterClass}</p>
        </div>
      </div>
      
      <div className="space-y-4 mb-4">
        <StatBar value={character.hp} maxValue={character.maxHp} color="bg-red-500" label="Health" />
        <StatBar value={character.mp} maxValue={character.maxMp} color="bg-blue-500" label="Mana" />
      </div>

      <div>
        <h3 className="text-lg font-bold mb-2 text-slate-300 border-b border-slate-700 pb-1">Inventory</h3>
        {character.inventory.length > 0 ? (
          <ul className="list-disc list-inside text-slate-400 space-y-1">
            {character.inventory.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 italic">Your pockets are empty.</p>
        )}
      </div>
    </div>
  );
};

export default CharacterSheet;
