
import React, { useState, useCallback, useEffect } from 'react';
import { GameState, Character, StorySegment } from './types';
import MainMenu from './components/MainMenu';
import CharacterCreation from './components/CharacterCreation';
import CharacterSheet from './components/CharacterSheet';
import StoryDisplay from './components/StoryDisplay';
import SceneImage from './components/SceneImage';
import LoadingSpinner from './components/LoadingSpinner';
import { generateInitialScenario, generateNextStep, generateImage } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MAIN_MENU);
  const [character, setCharacter] = useState<Character | null>(null);
  const [storyLog, setStoryLog] = useState<StorySegment[]>([]);
  const [sceneImageUrl, setSceneImageUrl] = useState<string>('');
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const resetGame = () => {
    setGameState(GameState.MAIN_MENU);
    setCharacter(null);
    setStoryLog([]);
    setSceneImageUrl('');
    setIsGeneratingImage(false);
    setErrorMessage('');
  };

  const handleStartGame = useCallback(async (name: string, characterClass: string) => {
    setGameState(GameState.LOADING);
    setStoryLog([]);
    setSceneImageUrl('');
    
    try {
      const initialCharacter: Character = {
        name,
        characterClass,
        hp: 1, maxHp: 1, mp: 1, maxMp: 1, // Will be overwritten
        inventory: [],
        avatarUrl: `https://picsum.photos/seed/${name}/200`
      };
      setCharacter(initialCharacter);

      const response = await generateInitialScenario(name, characterClass);

      setStoryLog([{ id: 0, type: 'narrative', content: response.story, options: response.choices }]);
      setCharacter(prev => ({
        ...prev!,
        hp: response.characterStats?.hp ?? 20,
        maxHp: response.characterStats?.maxHp ?? 20,
        mp: response.characterStats?.mp ?? 10,
        maxMp: response.characterStats?.maxMp ?? 10,
        inventory: response.inventory,
      }));

      setIsGeneratingImage(true);
      setGameState(GameState.IN_GAME);

      const imageUrl = await generateImage(response.sceneDescription);
      setSceneImageUrl(imageUrl);

    } catch (error) {
      console.error(error);
      setErrorMessage('The ancient spirits are slumbering. Failed to start a new adventure. Please try again.');
      setGameState(GameState.ERROR);
    } finally {
      setIsGeneratingImage(false);
    }
  }, []);

  const handleChoice = useCallback(async (choice: string) => {
    if (gameState !== GameState.IN_GAME) return;

    const newPlayerSegment: StorySegment = {
      id: storyLog.length,
      type: 'player_choice',
      content: choice,
    };
    
    // Disable choices on the last narrative segment
    const updatedStoryLog = storyLog.map(segment => 
      segment.id === storyLog.length - 1 ? { ...segment, options: [] } : segment
    );

    setStoryLog([...updatedStoryLog, newPlayerSegment]);
    setGameState(GameState.LOADING);
    
    try {
      const storyContext = storyLog.slice(-3).map(s => s.content).join('\n');
      const response = await generateNextStep(storyContext, choice, character!);

      const newNarrativeSegment: StorySegment = {
        id: storyLog.length + 1,
        type: 'narrative',
        content: response.story,
        options: response.choices,
      };

      setStoryLog(prev => [...prev, newNarrativeSegment]);

      if(response.characterStats) {
        setCharacter(prev => ({
          ...prev!,
          hp: response.characterStats!.hp,
          maxHp: response.characterStats!.maxHp,
          mp: response.characterStats!.mp,
          maxMp: response.characterStats!.maxMp,
        }));
      }
      if(response.inventory) {
        setCharacter(prev => ({ ...prev!, inventory: response.inventory }));
      }

      setIsGeneratingImage(true);
      if (response.choices.length === 0) {
        setGameState(GameState.GAME_OVER);
      } else {
        setGameState(GameState.IN_GAME);
      }
      
      const imageUrl = await generateImage(response.sceneDescription);
      setSceneImageUrl(imageUrl);

    } catch (error) {
      console.error(error);
      setErrorMessage('A mysterious fog clouds your path. The story cannot continue. Please try starting a new game.');
      setGameState(GameState.ERROR);
    } finally {
      setIsGeneratingImage(false);
    }
  }, [storyLog, gameState, character]);

  const renderContent = () => {
    switch (gameState) {
      case GameState.MAIN_MENU:
        return <MainMenu onStart={() => setGameState(GameState.CHARACTER_CREATION)} />;
      case GameState.CHARACTER_CREATION:
        return <CharacterCreation onStartGame={handleStartGame} onBack={() => setGameState(GameState.MAIN_MENU)}/>;
      case GameState.IN_GAME:
      case GameState.LOADING:
      case GameState.GAME_OVER:
        if (!character) return null;
        return (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 md:p-6 h-full">
            <div className="lg:col-span-1 order-1 lg:order-1">
              <CharacterSheet character={character} />
            </div>
            <div className="lg:col-span-2 order-3 lg:order-2 h-[50vh] lg:h-auto overflow-y-auto">
              <StoryDisplay 
                storyLog={storyLog} 
                onChoice={handleChoice} 
                isLoading={gameState === GameState.LOADING}
                isGameOver={gameState === GameState.GAME_OVER}
                onNewGame={resetGame}
              />
            </div>
            <div className="lg:col-span-1 order-2 lg:order-3">
              <SceneImage imageUrl={sceneImageUrl} isLoading={isGeneratingImage} />
            </div>
          </div>
        );
      case GameState.ERROR:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center text-red-300">
            <h2 className="text-3xl font-bold mb-4">An Error Occurred</h2>
            <p className="max-w-md mb-6">{errorMessage}</p>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Return to Main Menu
            </button>
          </div>
        );
    }
  };

  return (
    <main className="bg-slate-900 text-slate-200 min-h-screen w-full font-sans">
      <div className="container mx-auto max-w-7xl h-screen flex flex-col">
        <header className="text-center p-4 border-b border-slate-700">
          <h1 className="text-4xl font-bold font-story text-amber-100">Gemini Text Adventure</h1>
        </header>
        <div className="flex-grow overflow-hidden relative">
          {gameState === GameState.LOADING && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <LoadingSpinner />
              </div>
          )}
          {renderContent()}
        </div>
      </div>
    </main>
  );
};

export default App;
