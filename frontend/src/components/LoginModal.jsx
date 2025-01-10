import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Snackbar, Alert } from '@mui/material';
import PropTypes from 'prop-types';
import LoginForm from './LoginForm';
import { login as apiLogin } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginModal = ({ open, onClose }) => {
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { login } = useAuth();

  const handleSubmit = async (formData) => {
    try {
      const userData = await apiLogin(formData);
      // Let AuthContext handle the storage
      login(userData);
      
      setSnackbar({ open: true, message: 'Logged in successfully!', severity: 'success' });
      setTimeout(() => {
        onClose();
      }, 200);
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : 'Login failed';
      setError(errorMessage);
      setSnackbar({ open: true, message: 'Failed to login: ' + errorMessage, severity: 'error' });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <LoginForm onSubmit={handleSubmit} error={error} />
        </DialogContent>
      </Dialog>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

LoginModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default LoginModal;
