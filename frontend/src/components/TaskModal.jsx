import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import TaskForm from './TaskForm';
import PropTypes from 'prop-types';

const TaskModal = ({ open, onClose, task, onSubmit, error }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {task ? 'Edit Task' : 'Add New Task'}
      </DialogTitle>
      <DialogContent>
        <TaskForm
          task={task}
          onSubmit={onSubmit}
          onCancel={onClose}
          error={error}
        />
      </DialogContent>
    </Dialog>
  );
};

TaskModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  task: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.string
};

export default TaskModal;
