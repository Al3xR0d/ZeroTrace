import {
  UsersListResponse,
  User,
  UserById,
  Team,
  TeamById,
  AllUsers,
  UserUpdateData,
  Challenge,
  CreateChallenge,
  CreateFlag,
} from '@/types';
import {
  USER_REGISTRATION_URL,
  USER_LOGIN_URL,
  USER_URL,
  TEAM_URL,
  CHALLENGES_URL,
  ADMIN_URL,
  ADMIN_CHALLENGES_URL,
  ADMIN_STATISTICS_URL,
  ADMIN_TEAMS_URL,
  ADMIN_USERS_URL,
  NOTIFICATION_URL,
} from './url';
import { api } from './api';
import { title } from 'process';

export const login = ({ email, password }: { email: string; password: string }) =>
  api.POST(USER_LOGIN_URL, { email: email, password: password }, { withCredentials: true });

export const fetchCurrentUser = () => api.GET<User>(`${USER_URL}/me`, { withCredentials: true });

export const fetchTeams = async (): Promise<Team[]> => await api.GET(TEAM_URL);

export const fetchTeamsAdmin = async (): Promise<Team[]> => await api.GET(ADMIN_TEAMS_URL);

export const fectCurrentTeams = async ({ id }: { id: string }): Promise<TeamById> =>
  await api.GET(`${TEAM_URL}/${id}`);

export const fetchTeamMembers = async ({ id }: { id: string }): Promise<User[]> =>
  await api.GET(`${TEAM_URL}/${id}/members`);

export const fetchAllUsersAdmin = async (): Promise<AllUsers[]> => await api.GET(ADMIN_USERS_URL);

export const deleteUser = (id: number) => api.DELETE(`${ADMIN_USERS_URL}/${id}`);

export const updateUser = (id: number, data: UserUpdateData) =>
  api.PATCH(`${ADMIN_USERS_URL}/${id}`, data);

export const deleteTeam = (id: number) => api.DELETE(`${ADMIN_TEAMS_URL}/${id}`);

export const updateTeam = (id: number, data: UserUpdateData) =>
  api.PATCH(`${ADMIN_TEAMS_URL}/${id}`, data);

export const createTeam = ({ name }: { name: string }) => api.POST(ADMIN_TEAMS_URL, { name: name });

export const createUser = ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => api.POST(ADMIN_USERS_URL, { name, email, password });

export const createNotification = ({ title, content }: { title: string; content: string }) =>
  api.POST(NOTIFICATION_URL, { title, content });

export const fetchAllChallengesAdmin = async (): Promise<Challenge[]> =>
  await api.GET(ADMIN_CHALLENGES_URL);

export const deleteChallenge = (id: number) => api.DELETE(`${ADMIN_CHALLENGES_URL}/${id}`);

export const updateChallenge = (id: number, data: Challenge) =>
  api.PATCH(`${ADMIN_CHALLENGES_URL}/${id}`, data);

export const createChallenge = (data: CreateChallenge) => api.POST(ADMIN_CHALLENGES_URL, data);

export const createFlag = (data: CreateFlag, id: number) =>
  api.POST(`${ADMIN_CHALLENGES_URL}/${id}/flags`, data);
