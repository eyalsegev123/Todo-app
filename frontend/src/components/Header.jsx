import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegisterModal from './RegisterModal';
import HeaderButton from './HeaderButton';
import LoginModal from './LoginModal';

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
          <Typography variant="h6" component="div">
            <Link to="/" style={{ color: 'black', textDecoration: 'none' }}>
              JustDoIt
            </Link>
          </Typography>

          {/* Right section - User controls */}
          <Box>
            {user ? (
              <>
                <Typography variant="subtitle1" component="span" sx={{ mr: 2 }}>
                  Hello, {user?.username}
                </Typography>
                <Button variant="contained" color="secondary" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <HeaderButton 
                  label="Login" 
                  onClick={() => setLoginOpen(true)} 
                  variant="contained"
                  color="secondary"
                />
                <HeaderButton 
                  label="Register" 
                  onClick={() => setRegisterOpen(true)} 
                  variant="contained"
                  color="secondary"
                  sx={{ ml: 2 }}
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
