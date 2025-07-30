import React from 'react';
import { useUserStore } from '@/store/userStore';
import { NoTeamCard } from '@/components/NoTeamCard';

export const TasksPage: React.FC = () => {
  const currentUser = useUserStore((store) => store.currentUser);
  return <>{currentUser?.team_id === null && <NoTeamCard />}</>;
};

export default TasksPage;
