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
