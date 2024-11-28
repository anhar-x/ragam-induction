const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  published_year: {
    type: Number,
    required: [true, 'Published year is required'],
    min: [1000, 'Invalid year'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true
  },
  available_copies: {
    type: Number,
    required: [true, 'Number of available copies is required'],
    min: [0, 'Available copies cannot be negative']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);