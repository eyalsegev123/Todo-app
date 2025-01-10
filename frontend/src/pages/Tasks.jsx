import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TaskModal from '../components/TaskModal';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { user, logout } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    if (!user) {
      setError('Please login to view tasks');
      return;
    }
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      // Sort tasks by status_id
      const sortedTasks = data.sort((a, b) => a.status_id - b.status_id);
      setTasks(sortedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleOpenModal = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleAddTask = async (taskData) => {
    try {
      if (!user) {
        setError('Please login to create tasks');
        return;
      }

      const token = localStorage.getItem('token');
      console.log('Current auth state:', {
        token,
        user,
        tokenExists: !!token,
        userExists: !!user
      });

      await createTask(taskData);
      await fetchTasks();
      setError(null);
      handleCloseModal();
      setSuccessMessage('Task created successfully!');
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        token: !!localStorage.getItem('token')
      });

      // Handle authentication errors
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        logout(); // Clear invalid auth state
        return;
      }

      setError(error.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await updateTask(taskData.task_id, taskData);
      await fetchTasks();
      setError(null);
      handleCloseModal(); // Only close after successful update
      setSuccessMessage('Task updated successfully!');
    } catch (error) {
      setError(error.message || 'Failed to update task');
    }
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (permanent) => {
    try {
      if (permanent) {
        await deleteTask(taskToDelete.task_id);
        setSuccessMessage('Task permanently deleted!');
      } else {
        await updateTask(taskToDelete.task_id, { status_id: 5 });
        setSuccessMessage('Task marked as deleted!');
      }
      await fetchTasks();
    } catch (error) {
      setError(error.message || 'Failed to delete task');
    }
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      // Only allow changing to completed status, not back
      if (currentStatus !== 4) {
        const task = tasks.find((t) => t.task_id === taskId);
        await updateTask(taskId, { ...task, status_id: 4 });
        await fetchTasks();
        setSuccessMessage('Task marked as completed!');
      }
    } catch (error) {
      setError(error.message || 'Failed to update task status');
    }
  };

  const getPriorityText = (priority_id) => {
    switch (priority_id) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
      case 4: return 'Urgent';
      default: return 'Unknown';
    }
  };

  const getStatusText = (status_id) => {
    switch (status_id) {
      case 1: return 'Draft';
      case 2: return 'In Progress';
      case 3: return 'On Hold';
      case 4: return 'Completed';
      case 5: return 'Deleted';
      default: return 'Unknown';
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status_id) => {
    switch (status_id) {
      case 1: return 'rgba(156, 39, 176, 0.1)';  // Draft - light purple
      case 2: return 'rgba(33, 150, 243, 0.1)';  // In Progress - light blue
      case 3: return 'rgba(255, 152, 0, 0.1)';   // On Hold - orange
      case 4: return 'rgba(76, 175, 80, 0.1)';   // Completed - light green
      case 5: return 'rgba(244, 67, 54, 0.1)';   // Deleted - light red
      default: return 'inherit';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'  // Changed from mb: 3 to a more specific margin
      }}>
        <Typography variant="h4" component="h1">
          To Do:
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
          sx={{ backgroundColor: '#1a1a1a', '&:hover': { backgroundColor: '#2a2a2a' } }}
        >
          Add New Task
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow 
                key={task.task_id}
                sx={{ 
                  backgroundColor: getStatusColor(task.status_id)
                }}
              >
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{formatDate(task.due_date)}</TableCell>
                <TableCell>{getPriorityText(task.priority_id)}</TableCell>
                <TableCell>{getStatusText(task.status_id)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenModal(task)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(task)}>
                    <DeleteIcon />
                  </IconButton>
                  {task.status_id !== 5 && (
                    <IconButton 
                      onClick={() => handleToggleComplete(task.task_id, task.status_id)}
                      disabled={task.status_id === 4}
                      sx={{ 
                        '&.Mui-disabled': {
                          opacity: 1 // Keep the icon visible even when disabled
                        }
                      }}
                    >
                      {task.status_id === 4 ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <CheckCircleOutlineIcon />
                      )}
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TaskModal
        open={isModalOpen}
        onClose={handleCloseModal}
        task={editingTask}
        onSubmit={editingTask ? handleUpdateTask : handleAddTask}
        error={error}
      />
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          Do you want to delete this task permanently or mark it as deleted?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDeleteConfirm(false)}>Mark as Deleted</Button>
          <Button onClick={() => handleDeleteConfirm(true)} color="error">
            Delete Permanently
          </Button>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Snackbar 
        open={!!error} 
        autoHideDuration={4000} 
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
      >
        <Alert severity="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Tasks;
