import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Collapse
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
  const [dateError, setDateError] = useState('');

  const statusOptions = [
    { value: 1, label: 'Draft' },
    { value: 2, label: 'In Progress' },
    { value: 3, label: 'On Hold' },
    { value: 4, label: 'Completed', disabled: !task },
    { value: 5, label: 'Deleted', disabled: !task }
  ];

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
      due_date: formData.due_date && formData.due_date.isValid() 
        ? formData.due_date.format('YYYY-MM-DD') 
        : null
    };
    await onSubmit(submitData);
  };

  const handleDateChange = (newValue) => {
    setDateError(''); // Clear previous errors

    // If no date is selected (clearing the field)
    if (!newValue) {
      setFormData({ ...formData, due_date: null });
      return;
    }

    // Ensure we're working with start of day for consistent comparison
    const today = dayjs().startOf('day');
    const selectedDate = newValue.startOf('day');

    // Check if the date is valid and not before today
    if (!selectedDate.isValid()) {
      setDateError('Please enter a valid date');
      return;
    }

    if (selectedDate.isBefore(today)) {
      setDateError('Due date cannot be in the past');
      return;
    }

    setFormData({ ...formData, due_date: selectedDate });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} sx={{ mt: 2 }}>
        <Collapse in={!!dateError}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {dateError}
          </Alert>
        </Collapse>
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
            onChange={handleDateChange}
            minDate={dayjs().startOf('day')}
            disablePast
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!dateError,
                helperText: dateError
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
            {statusOptions.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                disabled={option.disabled} // MenuItem will be disabled based on this prop
              >
                {option.label}
              </MenuItem>
            ))}
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
