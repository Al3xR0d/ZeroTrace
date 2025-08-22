// export interface UserById {
//   id: number;
//   name: string;
//   team_id: null | number;
// }

export type UserById = Pick<User, 'id' | 'name' | 'team_id'>;

// export interface AllUsers extends UserById {
//   properties: string;
// }

export interface AllUsers extends User {
  properties: string;
  type: string;
}

export interface User {
  email: string;
  website: null | string;
  affiliation: null | string;
  country: null | string;
  created: string;
  banned: boolean;
  verified: boolean;
  hidden: boolean;
  id: number;
  name: string;
  team_id: null | number;
  score: number;
}

export interface UsersListResponse {
  data: UserById[];
}

const updatableFields = [
  'name',
  'email',
  'type',
  'banned',
  'verified',
  'hidden',
  'team_id',
  'properties',
] as const;

type UpdatableKeys = (typeof updatableFields)[number];
export type UserUpdateData = Partial<Pick<AllUsers, UpdatableKeys>>;

export interface ChangePassword {
  password: string;
}
