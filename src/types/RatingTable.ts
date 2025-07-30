export interface RatingItem {
  id: number;
  rank: number;
  name: string;
  score: number;
  tasksCompleted: number;
  lastActivity: string;
}

export interface ColumnDef<T> {
  title: string;
  dataIndex: keyof T;
  key: string;
  align?: 'left' | 'center' | 'right';
}
