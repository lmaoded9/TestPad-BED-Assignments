import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Paper,
  Avatar,
  Divider
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography component="h1" variant="h4">
              Welcome to Code Academy
            </Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Avatar 
              sx={{
                width: 100,
                height: 100,
                fontSize: 40,
                margin: '0 auto 16px',
                bgcolor: 'primary.main'
              }}
            >
              {currentUser?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5" gutterBottom>
              Hello, {currentUser?.username}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You have successfully logged in to the Code Academy Learning Portal.
            </Typography>
          </Box>
          
          <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Your Learning Dashboard
            </Typography>
            <Typography variant="body1" paragraph>
              This is your personalized learning dashboard. In a full implementation, you would see:
            </Typography>
            <ul>
              <li>Your enrolled courses</li>
              <li>Learning progress</li>
              <li>Upcoming assignments</li>
              <li>Recommended content</li>
            </ul>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;
