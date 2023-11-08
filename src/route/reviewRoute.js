const express = require('express');
const router = express.Router();
const {
    createReview,
    getReviewById,
    getAllReviews,
    updateReview,
    deleteReview,
  } = require('../controller/reviewController');

// Create a new review
router.post('/reviews', createReview);

// Get a list of all reviews
router.get('/reviews', getAllReviews);

// Get a single review by ID
router.get('/reviews/:id', getReviewById);

// Update a review by ID
router.put('/reviews/:id', updateReview);

// Delete a review by ID
router.delete('/reviews/:id', deleteReview);

module.exports = router;
