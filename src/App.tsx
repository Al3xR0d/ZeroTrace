import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/Layout/Layout';
import { AppRouter } from './router';
import styles from './styles/global.css';
import { useNavigate } from 'react-router-dom';
import { api } from './services/Api/api';

const AppWithNavigation = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    api.setNavigate(navigate);
  }, [navigate]);

  return (
    <Layout>
      <AppRouter />
    </Layout>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <AppWithNavigation />
  </BrowserRouter>
);

export default App;
