import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Snackbar, Alert } from '@mui/material';
import PropTypes from 'prop-types';
import RegisterForm from './RegisterForm';
import { register } from '../services/api';

const RegisterModal = ({ open, onClose }) => {
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

	const handleSubmit = async (formData) => {
			try {
					await register(formData);
					setSnackbar({ open: true, message: 'Registered successfully!', severity: 'success' });
					setTimeout(() => {
							onClose();
					}, 1500);
			} catch (err) {
				const errorMessage = err || 'Failed to register. Please try again.';
				setError(errorMessage);
				setSnackbar({ open: true, message: errorMessage, severity: 'error' });
			}
	};


  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Register</DialogTitle>
        <DialogContent>
          <RegisterForm onSubmit={handleSubmit} error={error} />
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

RegisterModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default RegisterModal;
