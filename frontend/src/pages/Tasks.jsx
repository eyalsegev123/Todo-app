import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,  // Make sure Paper is included in the imports
  IconButton,
  Button,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TaskModal from '../components/TaskModal';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Tasks = () => {
  const navigate = useNavigate(); // Add this hook
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

      await createTask(taskData);
      await fetchTasks();
      setError(null);
      handleCloseModal();
      setSuccessMessage('Task created successfully!');
    } catch (error) {
      if (error.message === 'Session expired. Please login again.') {
        logout();
        navigate('/');
      } else {
        setError(error.message || 'Failed to create task');
      }
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      if (!taskData.task_id) {
        setError('Task ID is missing');
        return;
      }

      const updateData = {
        title: taskData.title,
        description: taskData.description,
        priority_id: Number(taskData.priority_id),
        status_id: Number(taskData.status_id),
        due_date: taskData.due_date
      };

      await updateTask(taskData.task_id, updateData);
      await fetchTasks();
      setError(null);
      handleCloseModal();
      setSuccessMessage('Task updated successfully!');
    } catch (error) {
      if (error.message === 'Session expired. Please login again.') {
        logout();
        navigate('/');
      } else {
        setError(error.message || 'Failed to update task');
      }
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await updateTask(taskId, { status_id: 4 });
      await fetchTasks();
      setSuccessMessage('Task marked as completed!');
    } catch (error) {
      setError(error.message || 'Failed to complete task');
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem' // Added this line
    }}>
      <Typography variant="h4" component="h1">
        My To-Do List
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
            // Optional: Add different styling for different statuses
            sx={{ 
              backgroundColor: task.status_id === 4 ? 'rgba(0, 200, 0, 0.1)' : 
                             task.status_id === 5 ? 'rgba(200, 0, 0, 0.1)' : 
                             'inherit'
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
            {task.status_id !== 4 && task.status_id !== 5 && (
              <IconButton 
                onClick={() => handleCompleteTask(task.task_id)}
                color="success"
              >
                <CheckCircleIcon />
              </IconButton>
            )}
            <IconButton onClick={() => handleDeleteClick(task)}>
              <DeleteIcon />
            </IconButton>
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
    <Snackbar 
      open={!!error} 
      autoHideDuration={6000} 
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

    {/* Add Delete Confirmation Dialog */}
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
    </Container>
  );
};

export default Tasks;
