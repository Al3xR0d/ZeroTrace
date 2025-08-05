import { useEffect } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientContext,
  QueryKey,
} from '@tanstack/react-query';
import { useUserStore } from '@/store/userStore';
import { useNotificationStore } from '@/store/notificationsStore';
import {
  User,
  Team,
  TeamById,
  AllUsers,
  UserUpdateData,
  TeamUpdateData,
  Challenge,
  ServerNotification,
} from '@/types';
import {
  login,
  fetchCurrentUser,
  fetchTeams,
  fectCurrentTeams,
  fetchTeamMembers,
  fetchAllUsersAdmin,
  deleteUser,
  updateUser,
  deleteTeam,
  updateTeam,
  fetchTeamsAdmin,
  createTeam,
  createUser,
  createNotification,
  fetchAllChallengesAdmin,
  deleteChallenge,
  updateChallenge,
  createChallenge,
} from '@/services/Api/fetches';
import { message, notification } from 'antd';
import { error } from 'console';

export const defaultQueryOptions = {
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchInterval: false,
} as const;

interface UserMutationContext {
  previousUsers?: AllUsers[];
  previousUser?: User;
}

interface TeamMutationContext {
  previousTeams?: Team[];
  previousTeam?: Team;
}

interface UserDeleteMutationContext {
  previousUsers: AllUsers[];
}

interface TeamDeleteMutationContext {
  previousTeams: Team[];
}

interface ChallengeDeleteMutationContext {
  previousChallenges: [queryKey: QueryKey, data: Challenge[] | undefined][];
}

interface ChallengerMutationContext {
  previousChallenges: [queryKey: QueryKey, data: Challenge[] | undefined][];
  previousChallenge: [queryKey: QueryKey, data: Challenge | undefined][];
}

interface Notification {
  id: number;
  title: string;
  content: string;
  date: string;
}

export const useLogin = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      // const token = data.access_token;
      // if (token) {
      //   localStorage.setItem('token', token);
      // }
      qc.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

export const useCurrentUser = () => {
  const setCurrentUser = useUserStore((store) => store.setCurrentUser);
  // const token = localStorage.getItem('token');

  const query = useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    enabled: false,
    staleTime: 0,
    ...defaultQueryOptions,
  });

  // useEffect(() => {
  //   if (token && !query.data) {
  //     query.refetch();
  //   }
  // }, [token]);

  useEffect(() => {
    if (query.data) {
      setCurrentUser(query.data);
    }
  }, [query.data, setCurrentUser]);

  return query;
};

export const useFetchTeams = () =>
  useQuery<Team[]>({
    queryKey: ['teams'],
    queryFn: fetchTeams,
    ...defaultQueryOptions,
  });

export const useFetchTeamsAdmin = () =>
  useQuery<Team[]>({
    queryKey: ['teamsAdmin'],
    queryFn: fetchTeamsAdmin,
    ...defaultQueryOptions,
  });

export const useFetchCurrentTeam = (id: string) =>
  useQuery<TeamById>({
    queryKey: ['team', id],
    queryFn: () => fectCurrentTeams({ id }),
    enabled: !!id,
    ...defaultQueryOptions,
  });

export const useFetchTeamMembers = (id: string) =>
  useQuery<User[]>({
    queryKey: ['members', id],
    queryFn: () => fetchTeamMembers({ id }),
    ...defaultQueryOptions,
  });

export const useFetchAllUsersAdmin = () =>
  useQuery<AllUsers[]>({
    queryKey: ['users'],
    queryFn: fetchAllUsersAdmin,
    ...defaultQueryOptions,
  });

export const useDeleteUser = (id: number) => {
  const qc = useQueryClient();

  return useMutation<void, Error, void, UserDeleteMutationContext>({
    mutationFn: () => deleteUser(id),

    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ['users'] });

      const previousUsers = qc.getQueryData<AllUsers[]>(['users']) || [];
      qc.setQueryData<AllUsers[]>(['users'], (old = []) => old.filter((user) => user.id !== id));

      return { previousUsers };
    },

    onError: (_, __, context) => {
      if (context?.previousUsers) {
        qc.setQueryData(['users'], context.previousUsers);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, UserUpdateData, UserMutationContext>({
    mutationFn: (updateData) => updateUser(id, updateData),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      await queryClient.cancelQueries({ queryKey: ['user', id] });

      const previousUsers = queryClient.getQueryData<AllUsers[]>(['users']);
      const previousUser = queryClient.getQueryData<User>(['user', id]);

      queryClient.setQueryData(['user', id], (old: User | undefined) =>
        old ? { ...old, ...newData } : undefined,
      );

      queryClient.setQueryData(['users'], (old: AllUsers[] | undefined) =>
        old?.map((user) => (user.id === id ? { ...user, ...newData } : user)),
      );

      return { previousUsers, previousUser };
    },

    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user', id], updatedUser);

      queryClient.setQueryData(['users'], (old: AllUsers[] | undefined) =>
        old?.map((user) => (user.id === id ? { ...user, ...updatedUser } : user)),
      );

      notification.success({
        message: 'User updated successfully',
        description: `Changes to ${updatedUser.name} have been saved`,
        placement: 'topRight',
      });
    },

    onError: (error, _, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers);
      }
      if (context?.previousUser) {
        queryClient.setQueryData(['user', id], context.previousUser);
      }

      notification.error({
        message: 'Update failed',
        description: error.message || 'Failed to update user data',
        placement: 'topRight',
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
    },

    retry: 1,
    retryDelay: 1000,
  });
};

export const useDeleteTeam = (id: number) => {
  const qc = useQueryClient();

  return useMutation<void, Error, void, TeamDeleteMutationContext>({
    mutationFn: () => deleteTeam(id),

    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ['teamsAdmin'] });
      const previousTeams = qc.getQueryData<Team[]>(['teamsAdmin']) || [];
      qc.setQueryData<Team[]>(['teamsAdmin'], (old) =>
        old ? old.filter((team) => team.id !== id) : [],
      );

      return { previousTeams };
    },

    onSuccess: () => {
      notification.success({
        message: 'Team has been deleted',
        placement: 'topRight',
      });
    },

    onError: (error, _, context) => {
      if (context?.previousTeams) {
        qc.setQueryData(['teamsAdmin'], context.previousTeams);
      }

      notification.error({
        message: 'Team deletion error',
        description: error.message || 'Try again',
        placement: 'topRight',
      });
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['teamsAdmin'] });
    },

    ...defaultQueryOptions,
  });
};

export const useUpdateTeam = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation<Team, Error, TeamUpdateData, TeamMutationContext>({
    mutationFn: (updateData) => updateTeam(id, updateData),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['teamsAdmin'] });
      await queryClient.cancelQueries({ queryKey: ['team', id] });

      const previousTeams = queryClient.getQueryData<Team[]>(['teamsAdmin']);
      const previousTeam = queryClient.getQueryData<Team>(['team', id]);

      queryClient.setQueryData(['team', id], (old: Team | undefined) =>
        old ? { ...old, ...newData } : undefined,
      );
      queryClient.setQueryData(['teamsAdmin'], (old: Team[] | undefined) =>
        old?.map((team) => (team.id === id ? { ...team, ...newData } : team)),
      );

      return { previousTeams, previousTeam };
    },
    onSuccess: (updatedTeam) => {
      queryClient.setQueryData(['team', id], updatedTeam);
      queryClient.setQueryData(['teamsAdmin'], (old: Team[] | undefined) =>
        old?.map((team) => (team.id === id ? updatedTeam : team)),
      );

      notification.success({
        message: 'Team updated successfully',
        description: `Changes to ${updatedTeam.name} have been saved`,
        placement: 'topRight',
      });
    },
    onError: (error, _, context) => {
      if (context?.previousTeams) {
        queryClient.setQueryData(['teamsAdmin'], context.previousTeams);
      }
      if (context?.previousTeam) {
        queryClient.setQueryData(['team', id], context.previousTeam);
      }
      notification.error({
        message: 'Update failed',
        description: error.message || 'Failed to update team data',
        placement: 'topRight',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['teamsAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['team', id] });
    },
    retry: 1,
    retryDelay: 1000,
  });
};

export const useCreateTeam = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createTeam,
    onSuccess: (createdTeam) => {
      notification.success({
        message: 'Team has been created',
        description: `Team ${createdTeam.name} has been added`,
        placement: 'topRight',
      });
      qc.invalidateQueries({ queryKey: ['teamsAdmin'] });
    },
    onError: (error) => {
      notification.error({
        message: 'Team creation error',
        description: error.message,
        placement: 'topRight',
      });
    },
  });
};

export const useCreateUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: (createdUser) => {
      notification.success({
        message: 'User has been created',
        description: `User ${createdUser.name} has been added`,
        placement: 'topRight',
      });
      qc.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      notification.error({
        message: 'User creation error',
        description: error.message,
        placement: 'topRight',
      });
    },
  });
};

export const useNotificationsSSE = () => {
  const addNotification = useNotificationStore((s) => s.addNotification);

  // получаем массив уже сохранённых ID (реактивность не нужна)
  const existingIds = useNotificationStore.getState().notifications.map((n) => n.id);

  useEffect(() => {
    const es = new EventSource('https://10.67.0.89:7443/api/v1/sse/notifications', {
      withCredentials: true,
    });

    es.addEventListener('notification', (evt) => {
      try {
        const data = JSON.parse(evt.data);
        if (!existingIds.includes(data.id)) {
          addNotification(data);
        }
      } catch (e) {
        console.error('SSE parse error', e);
      }
    });

    es.addEventListener('error', () => es.close());
    return () => es.close();
  }, [addNotification, existingIds]);
};

export const useCreateNotification = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createNotification,
    onSuccess: () => {
      notification.success({
        message: 'Notification has been created',
        placement: 'topRight',
      });
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      notification.error({
        message: 'Notification creation error',
        description: error.message,
        placement: 'topRight',
      });
    },
  });
};

export const useFetchAllChallengesAdmin = () =>
  useQuery<Challenge[]>({
    queryKey: ['challenges'],
    queryFn: fetchAllChallengesAdmin,
    ...defaultQueryOptions,
  });

export const useDeleteChallenge = (id: number) => {
  const qc = useQueryClient();

  return useMutation<void, Error, void, ChallengeDeleteMutationContext>({
    mutationFn: () => deleteChallenge(id),

    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ['challenges'] });

      const previousChallenges = qc.getQueriesData<Challenge[]>({ queryKey: ['challenges'] });

      qc.setQueriesData<Challenge[]>({ queryKey: ['challenges'] }, (old = []) =>
        old.filter((challenge) => challenge.id !== id),
      );

      return { previousChallenges };
    },

    onError: (_, __, context) => {
      if (!context?.previousChallenges) return;

      context.previousChallenges.forEach(([queryKey, data]) => {
        qc.setQueryData(queryKey, data);
      });
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['challenges'] });
    },
  });
};

export const useUpdateChallenge = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation<Challenge, Error, Challenge, ChallengerMutationContext>({
    mutationFn: (updateData) => updateChallenge(id, updateData),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['challenges'] });
      await queryClient.cancelQueries({ queryKey: ['challenges', id] });

      const previousChallenges = queryClient.getQueriesData<Challenge[]>({
        queryKey: ['challenges'],
      });
      const previousChallenge = queryClient.getQueriesData<Challenge>({
        queryKey: ['challenge', id],
      });

      queryClient.setQueryData(['challenge', id], (old: Challenge | undefined) =>
        old ? { ...old, ...newData } : undefined,
      );

      queryClient.setQueryData(['challenges'], (old: Challenge[] | undefined) =>
        old?.map((challenge) => (challenge.id === id ? { ...challenge, ...newData } : challenge)),
      );

      return { previousChallenges, previousChallenge };
    },

    onSuccess: (updateChallenge) => {
      queryClient.setQueryData(['challenge', id], updateChallenge);

      queryClient.setQueryData(['challenges'], (old: Challenge[] | undefined) =>
        old?.map((challenge) =>
          challenge.id === id ? { ...challenge, ...updateChallenge } : challenge,
        ),
      );

      notification.success({
        message: 'Challenge updated successfully',
        description: `Changes to ${updateChallenge.name} have been saved`,
        placement: 'topRight',
      });
    },

    onError: (error, _, context) => {
      if (context?.previousChallenges) {
        queryClient.setQueryData(['challenges'], context.previousChallenges);
      }
      if (context?.previousChallenge) {
        queryClient.setQueryData(['challenge', id], context.previousChallenge);
      }

      notification.error({
        message: 'Update failed',
        description: error.message || 'Failed to update challenge data',
        placement: 'topRight',
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['challenge', id] });
    },

    retry: 1,
    retryDelay: 1000,
  });
};

export const useCreateChallenge = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createChallenge,
    onSuccess: (createdChallenge) => {
      notification.success({
        message: 'Challenge has been created',
        description: `Challenge ${createdChallenge.name} has been added`,
        placement: 'topRight',
      });
      qc.invalidateQueries({ queryKey: ['challenges'] });
    },
    onError: (error) => {
      notification.error({
        message: 'Challenge creation error',
        description: error.message,
        placement: 'topRight',
      });
    },
  });
};
