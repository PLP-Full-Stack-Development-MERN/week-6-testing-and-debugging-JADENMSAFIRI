import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  CircularProgress 
} from '@mui/material';
import BugForm from './components/BugForm';
import BugList from './components/BugList';
import axios from 'axios';

function App() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingBug, setEditingBug] = useState(null);

  const fetchBugs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/bugs');
      setBugs(response.data);
    } catch (error) {
      console.error('Error fetching bugs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBug = async (bugData) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/bugs', bugData);
      setBugs([...bugs, response.data]);
    } catch (error) {
      console.error('Error creating bug:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBug = async (bugData) => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/bugs/${bugData._id}`, bugData);
      setBugs(bugs.map(bug => 
        bug._id === bugData._id ? bugData : bug
      ));
      setEditingBug(null);
    } catch (error) {
      console.error('Error updating bug:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBug = async (bugId) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/bugs/${bugId}`);
      setBugs(bugs.filter(bug => bug._id !== bugId));
    } catch (error) {
      console.error('Error deleting bug:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Bug Tracker
        </Typography>
        <Paper sx={{ p: 3 }}>
          <BugForm
            onSubmit={editingBug ? handleUpdateBug : handleCreateBug}
            initialData={editingBug}
          />
        </Paper>
        <BugList
          bugs={bugs}
          onEdit={setEditingBug}
          onDelete={handleDeleteBug}
        />
      </Box>
    </Container>
  );
}

export default App;
