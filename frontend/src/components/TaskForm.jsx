import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

const TaskForm = ({ task, onSubmit, onCancel, error }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority_id: 2,
    status_id: 1,
    due_date: null
  });

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        due_date: task.due_date ? dayjs(task.due_date) : null
      });
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      priority_id: Number(formData.priority_id),
      status_id: Number(formData.status_id),
      due_date: formData.due_date ? formData.due_date.toISOString() : null
    };
    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <TextField
          fullWidth
          label="Description"
          multiline
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Due Date"
            value={formData.due_date}
            onChange={(newValue) => setFormData({ ...formData, due_date: newValue })}
            slotProps={{
              textField: {
                fullWidth: true
              }
            }}
          />
        </LocalizationProvider>
        <FormControl fullWidth>
          <InputLabel>Priority</InputLabel>
          <Select
            value={formData.priority_id}
            label="Priority"
            onChange={(e) => setFormData({ ...formData, priority_id: e.target.value })}
          >
            <MenuItem value={1}>Low</MenuItem>
            <MenuItem value={2}>Medium</MenuItem>
            <MenuItem value={3}>High</MenuItem>
            <MenuItem value={4}>Urgent</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={formData.status_id}
            label="Status"
            onChange={(e) => setFormData({ ...formData, status_id: e.target.value })}
          >
            <MenuItem value={1}>Draft</MenuItem>
            <MenuItem value={2}>In Progress</MenuItem>
            <MenuItem value={3}>On Hold</MenuItem>
            <MenuItem value={4}>Completed</MenuItem>
            <MenuItem value={5}>Deleted</MenuItem>
          </Select>
        </FormControl>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="contained">
            {task ? 'Update' : 'Create'} Task
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

TaskForm.propTypes = {
  task: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  error: PropTypes.string
};

export default TaskForm;
