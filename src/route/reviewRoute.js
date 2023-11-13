const express = require('express');
const router = express.Router();
const {
    createReview,
    getReviewById,
    getAllReviews,
    updateReview,
    deleteReview
  } = require('../controller/reviewController');
  const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
  const asyncHandler = require('express-async-handler');

// Create a new review
router.post('/reviews', authMiddleware, asyncHandler(createReview));

// Get a list of all reviews
router.get('/reviews', asyncHandler(getAllReviews));

// Get a single review by ID
router.get('/reviews/:id', asyncHandler(getReviewById));

// Update a review by ID
router.put('/reviews/:id', isAdmin, authMiddleware, asyncHandler(updateReview));

// Delete a review by ID
router.delete('/reviews/:id', isAdmin, authMiddleware, asyncHandler(deleteReview));

module.exports = router;
