import React from 'react';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';

const HeaderButton = ({ label, onClick, variant = 'contained', ...props }) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      color="inherit"
      {...props}
    >
      {label}
    </Button>
  );
};

HeaderButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['contained', 'outlined', 'text'])
};

export default HeaderButton;
