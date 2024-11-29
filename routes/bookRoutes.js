const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');
const { protect } = require('../middleware/auth');

// Public routes - anyone can view books
router.get('/', getAllBooks);
router.get('/:id', getBook);

// Protected routes - only authenticated users can modify books
router.use(protect); // All routes after this will require authentication
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

module.exports = router;