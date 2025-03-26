const express = require('express');
const router = express.Router();
const Bug = require('../models/Bug');
const { body, validationResult } = require('express-validator');

// Create a new bug
router.post('/',
  [
    body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
    body('description').trim().isLength({ min: 5 }).withMessage('Description must be at least 5 characters'),
    body('status').isIn(['open', 'in-progress', 'resolved']).withMessage('Invalid status'),
    body('priority').isIn(['low', 'medium', 'high']).withMessage('Invalid priority')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const bug = new Bug({
        ...req.body,
        createdBy: req.body.createdBy || 'Anonymous'
      });

      await bug.save();
      res.status(201).json(bug);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Get all bugs
router.get('/', async (req, res) => {
  try {
    const bugs = await Bug.find().sort({ createdAt: -1 });
    res.json(bugs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a bug
router.put('/:id', async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }

    // Validate status and priority
    if (req.body.status && !['open', 'in-progress', 'resolved'].includes(req.body.status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    if (req.body.priority && !['low', 'medium', 'high'].includes(req.body.priority)) {
      return res.status(400).json({ message: 'Invalid priority' });
    }

    Object.assign(bug, req.body);
    await bug.save();
    res.json(bug);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a bug
router.delete('/:id', async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }

    await bug.remove();
    res.json({ message: 'Bug removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
