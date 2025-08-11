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
  CreateHint,
  ChallengesFreeze,
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

export const uploadChallengeFile = (id: number, file: File, type: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  formData.append('name', file.name);

  return api.POST(`${ADMIN_CHALLENGES_URL}/${id}/files`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const fetchCurrentChallenge = (id: number) => api.GET(`${ADMIN_CHALLENGES_URL}/${id}`);

export const fetchChallengeFiles = (id: number) => api.GET(`${ADMIN_CHALLENGES_URL}/${id}/files`);

export const downloadChallengeFile = (idChallenge: number, idFile: number) =>
  api.GET(`${ADMIN_CHALLENGES_URL}/${idChallenge}/files/${idFile}`);

export const downloadChallengeFileBlob = (idChallenge: number, idFile: number) =>
  api.GET(`${ADMIN_CHALLENGES_URL}/${idChallenge}/file/${idFile}`, {
    responseType: 'blob',
    withCredentials: true,
  });

export const deleteChallengeFile = (idChallenge: number, idFile: number) =>
  api.DELETE(`${ADMIN_CHALLENGES_URL}/${idChallenge}/file/${idFile}`);

export const fetchChallengeFlag = (id: number) => api.GET(`${ADMIN_CHALLENGES_URL}/${id}/flags`);

export const deleteChallengeFlag = (idChallenge: number, idFlag: number) =>
  api.DELETE(`${ADMIN_CHALLENGES_URL}/${idChallenge}/flag/${idFlag}`);

export const editChallengeFlag = (idChallenge: number, idFlag: number, data: CreateFlag) =>
  api.POST(`${ADMIN_CHALLENGES_URL}/${idChallenge}/flags/${idFlag}`, data);

export const fetchChallengeHints = (id: number) => api.GET(`${ADMIN_CHALLENGES_URL}/${id}/hints`);

export const createChallengeHints = (id: number, data: CreateHint) =>
  api.POST(`${ADMIN_CHALLENGES_URL}/${id}/hints`, data);

export const deleteChallengeHint = (idChallenge: number, idHint: number) =>
  api.DELETE(`${ADMIN_CHALLENGES_URL}/${idChallenge}/hints/${idHint}`);

export const editChallengeHint = (idChallenge: number, idHint: number, data: CreateHint) =>
  api.PATCH(`${ADMIN_CHALLENGES_URL}/${idChallenge}/hints/${idHint}`, data);

export const freezeChallengeTime = (data: ChallengesFreeze) =>
  api.POST(`${ADMIN_CHALLENGES_URL}/freezeall`, data);

export const thawallChallengeTime = () => api.POST(`${ADMIN_CHALLENGES_URL}/thawall`);

export const freezeCurrentChallengeTime = (id: number, data: ChallengesFreeze) =>
  api.POST(`${ADMIN_CHALLENGES_URL}/freezeall/${id}`, data);

export const thawallCurrentChallengeTime = (id: number) =>
  api.POST(`${ADMIN_CHALLENGES_URL}/thawall/${id}`);
