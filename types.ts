
export enum GameState {
  MAIN_MENU,
  CHARACTER_CREATION,
  IN_GAME,
  LOADING,
  GAME_OVER,
  ERROR,
}

export interface Character {
  name: string;
  characterClass: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  inventory: string[];
  avatarUrl: string;
}

export interface StorySegment {
  id: number;
  type: 'narrative' | 'player_choice';
  content: string;
  options?: string[];
}

export interface GeminiStoryResponse {
  story: string;
  choices: string[];
  characterStats: {
    hp: number;
    maxHp: number;
    mp: number;
    maxMp: number;
  } | null;
  inventory: string[];
  sceneDescription: string;
}
