import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Typography 
} from '@mui/material';

const BugList = ({ bugs, onEdit, onDelete }) => {
  if (!bugs.length) {
    return (
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" align="center">
          No bugs reported yet
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Created By</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bugs.map((bug) => (
            <TableRow key={bug._id}>
              <TableCell>{bug.title}</TableCell>
              <TableCell>
                <span style={{ 
                  color: bug.status === 'open' ? 'red' :
                         bug.status === 'in-progress' ? 'orange' : 'green'
                }}>
                  {bug.status}
                </span>
              </TableCell>
              <TableCell>
                <span style={{ 
                  color: bug.priority === 'high' ? 'red' :
                         bug.priority === 'medium' ? 'orange' : 'green'
                }}>
                  {bug.priority}
                </span>
              </TableCell>
              <TableCell>{bug.createdBy}</TableCell>
              <TableCell>
                {new Date(bug.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onEdit(bug)}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => onDelete(bug._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BugList;
