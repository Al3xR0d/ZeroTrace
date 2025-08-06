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
