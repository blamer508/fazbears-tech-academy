export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type BodyType = 'block';

export interface CharacterDesign {
  bodyType: BodyType;
  primaryColor: string;
  secondaryColor: string;
  eyeType: 'cool';
  hairColor: string;
  gender: 'male';
  clothingType: 'normal';
  hairStyle: 'short';
  hasGlasses: boolean;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: Difficulty;
  category: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  isGameOver: boolean;
  isScaring: boolean;
  scareIndex: number;
}

export enum AppStatus {
  LOGIN = 'LOGIN',
  START = 'START',
  DESIGN = 'DESIGN',
  INTRO = 'INTRO',
  NIGHT_CUTSCENE = 'NIGHT_CUTSCENE',
  NIGHT_START = 'NIGHT_START',
  QUIZ = 'QUIZ',
  RESULTS = 'RESULTS',
  DEAD = 'DEAD',
  PAUSED = 'PAUSED',
  ENDING_CUTSCENE = 'ENDING_CUTSCENE',
  ENDLESS = 'ENDLESS'
}

export interface UserAccount {
  username: string;
  avatarUrl?: string;
  description?: string;
  maxUnlockedNight: number;
  highScores: Record<Difficulty, number>;
  friends: string[]; // List of usernames
}

export interface Comment {
  id: string;
  username: string;
  avatarUrl: string | null;
  text: string;
  timestamp: number;
  replyTo?: string; // ID of the comment being replied to
}

export interface PrivateMessage {
  id: string;
  from: string;
  to: string;
  text: string;
  timestamp: number;
}

export interface FriendRequest {
  from: string;
  to: string;
  status: 'pending' | 'accepted' | 'rejected';
}
