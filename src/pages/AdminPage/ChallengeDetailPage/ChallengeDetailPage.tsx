import React from 'react';
import { useParams } from 'react-router-dom';
import { useFetchCurrentChallenge } from '@/hooks/useQueries';
import { Spin, Typography, Tabs } from 'antd';

export const ChallengeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const challengeId = Number(id);

  const { data, isLoading, isError } = useFetchCurrentChallenge(challengeId);
  console.log(data);
  if (isLoading) return <Spin />;
  if (isError || !data) return <div>Error loading challenge</div>;

  return (
    <div>
      <Typography.Title level={2}>{data.name}</Typography.Title>
      <Typography.Paragraph>{data.description}</Typography.Paragraph>
      <p>Value: {data.value}</p>
      <p>Category: {data.category_id}</p>
    </div>
  );
};

export default ChallengeDetailPage;
