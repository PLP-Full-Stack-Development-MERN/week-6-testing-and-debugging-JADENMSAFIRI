const mongoose = require('mongoose');
const validator = require('validator');

const bugSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    minlength: [5, 'Description must be at least 5 characters']
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  createdBy: {
    type: String,
    required: [true, 'Please provide creator name']
  }
}, {
  timestamps: true
});

// Add validation middleware
bugSchema.pre('save', function(next) {
  if (this.title && !validator.isLength(this.title, { min: 3, max: 100 })) {
    next(new Error('Title must be between 3 and 100 characters'));
  }
  next();
});

const Bug = mongoose.model('Bug', bugSchema);

module.exports = Bug;
