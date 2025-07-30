export interface Team {
  name: string;
  email: string | null;
  website: string | null;
  affiliation: string | null;
  country: string | null;
  banned: boolean;
  verified: boolean;
  admin: boolean;
  hidden: boolean;
  id: number;
  created: string;
}

export type TeamById = Pick<Team, 'name' | 'verified' | 'banned'>;

const updatableFields = ['name', 'banned', 'hidden'] as const;

type UpdatableKeys = (typeof updatableFields)[number];
export type TeamUpdateData = Partial<Pick<Team, UpdatableKeys>>;
