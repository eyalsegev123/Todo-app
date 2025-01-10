import React, { useState } from 'react';
import { AppBar, Toolbar, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegisterModal from './RegisterModal';
import HomeButton from './HomeButton';
import LoginModal from './LoginModal';
import HeaderButton from './HeaderButton';

const Header = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Left section - Logo */}
          <HomeButton onClick={() => navigate('/')} />

          {/* Right section - User controls */}
          <Box>
            {user ? (
              <>
                <Button 
                  variant="contained"
                  style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '8px 16px', borderRadius: '4px' }}
                  sx={{
                    mr: 2,
                    '&:hover': {
                      backgroundColor: '#2a2a2a',
                      transform: 'scale(1.05)',
                      transition: 'transform 0.2s ease-in-out'
                    }
                  }}
                  disabled
                > 
                  Hello, {user?.username}
                </Button>
                
                <HeaderButton 
                  label="Logout" 
                  onClick={() => handleLogout()} 
                  variant="contained"
                  style={{ backgroundColor: '#1a1a1a', color: 'white' }}
                  sx={{ 
                    '&:hover': {
                      backgroundColor: '#2a2a2a',
                      transform: 'scale(1.05)',
                      transition: 'transform 0.2s ease-in-out'
                    }
                  }}
                />
              </>
            ) : (
              <>
                <HeaderButton 
                  label="Login" 
                  onClick={() => setLoginOpen(true)} 
                  variant="contained"
                  style={{ backgroundColor: '#1a1a1a', color: 'white' }}
                  sx={{ 
                    '&:hover': {
                      backgroundColor: '#2a2a2a',
                      transform: 'scale(1.05)',
                      transition: 'transform 0.2s ease-in-out'
                    }
                  }}
                />
                <HeaderButton 
                  label="Register" 
                  onClick={() => setRegisterOpen(true)} 
                  variant="contained"
                  style={{ backgroundColor: '#1a1a1a', color: 'white' }}
                  sx={{ 
                    ml: 2,
                    '&:hover': {
                      backgroundColor: '#2a2a2a',
                      transform: 'scale(1.05)',
                      transition: 'transform 0.2s ease-in-out'
                    }
                  }}
                />
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <RegisterModal open={registerOpen} onClose={() => setRegisterOpen(false)} />
    </>
  );
};

export default Header;
