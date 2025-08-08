export interface Challenge {
  id: number;
  name: string;
  description: string;
  value: number;
  category_id: number;
  state: string;
  max_attempts: number;
  type: string;
  created: string;
  start: string;
  end: string;
  freeze: boolean;
}

export type CreateChallenge = {
  name: string;
  description: string;
  value: number;
  start: string;
  end: string;
} & Partial<Pick<Challenge, 'category_id' | 'state' | 'max_attempts' | 'type' | 'freeze'>>;

export interface CreateFlag {
  challenge_id: number;
  type: string;
  content: string;
  data?: string;
}

export interface ChallengeFile {
  challenge_id: number;
  id: number;
  location: string;
  name: string;
  type: string;
}

export interface ChallengeFlag {
  challenge_id: number;
  content: string;
  data: string | null;
  id: number;
  type: string;
}

export interface ChallengeHints {
  id: number;
  challenge_id: number;
  content: string;
  cost: number;
  type: string;
}

export interface CreateHint {
  challenge_id: number;
  content: string;
  cost: number | null;
  type: string | null;
}

export interface ChallengesFreeze {
  unfreeze_at: string;
}
