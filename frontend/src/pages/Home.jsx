import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeCards from '../components/HomeCards';
import { useAuth } from '../context/AuthContext';
import GoToTasksButton from '../components/GoToTasksButton';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to JustDoIt!
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
          The Only Place to Manage your Tasks
        </Typography>
        <HomeCards />
        {!user ? (
          <Typography variant="body1" component="p" sx={{ mt: 4 }}>
            Wanna get started? Press the Login/Register button on the top right corner!
          </Typography>
        ) : (
          <div style={{ marginTop: '2rem' }}>
            <GoToTasksButton onClick={() => navigate('/tasks')} />
          </div>
        )}
      </Box>
    </Container>
  );
};

export default Home;
