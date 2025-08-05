import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useUserStore } from '@/store/userStore';

const MenuPage = lazy(() => import('@/pages/MenuPage/MenuPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage/LoginPage'));
const RatingPage = lazy(() => import('@/pages/RatingPage/RatingPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage/SettingsPage'));
const TeamsPage = lazy(() => import('@/pages/TeamsPage/TeamsPage'));
const TeamsDetailPage = lazy(() => import('@/pages/TeamsDetailPage/TeamsDetailPage'));
const TasksPage = lazy(() => import('@/pages/TasksPage/TasksPage'));
const AdminLayout = lazy(() => import('@/components/Layout/AdminLayout/AdminLayout'));
const TeamsSettings = lazy(() => import('@/pages/AdminPage/TeamsSettings/TeamsSettings'));
const UsersSettings = lazy(() => import('@/pages/AdminPage/UsersSettings/UsersSettings'));
const CtfTimes = lazy(() => import('@/pages/AdminPage/CtfTimes/CtfTimes'));
const CtfVisibility = lazy(() => import('@/pages/AdminPage/CtfVisibility/CtfVisibility'));
const NotificationsPage = lazy(
  () => import('@/pages/AdminPage/NotificationsPage/NotificationsPage'),
);
const Challenges = lazy(() => import('@/pages/AdminPage/Challenges/Challenges'));

// const token = localStorage.getItem('token');

export const AppRouter: React.FC = () => {
  const authorization = useUserStore((store) => store.currentUser?.name);

  return (
    <Suspense fallback={<Spin />}>
      <Routes>
        <Route
          path="/login"
          element={!authorization ? <LoginPage /> : <Navigate to="/menu" replace />}
        />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/rating" element={<RatingPage />} />
        <Route
          path="/settings"
          element={authorization ? <SettingsPage /> : <Navigate to="/menu" replace />}
        />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/teams/:id" element={<TeamsDetailPage />} />
        <Route
          path="/tasks"
          element={authorization ? <TasksPage /> : <Navigate to="/menu" replace />}
        />
        <Route
          path="/admin"
          element={authorization ? <AdminLayout /> : <Navigate to="/menu" replace />}
        >
          <Route index element={<Navigate to="ctf/times" replace />} />
          <Route path="ctf/visibility" element={<CtfVisibility />} />
          <Route path="ctf/times" element={<CtfTimes />} />
          <Route path="teams" element={<TeamsSettings />} />
          <Route path="users" element={<UsersSettings />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="challenges" element={<Challenges />} />
        </Route>
        <Route path="*" element={<Navigate to="/menu" replace />} />
      </Routes>
    </Suspense>
  );
};
