const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Create a new review
router.post('/reviews', reviewController.createReview);

// Get a list of all reviews
router.get('/reviews', reviewController.getAllReviews);

// Get a single review by ID
router.get('/reviews/:id', reviewController.getReviewById);

// Update a review by ID
router.put('/reviews/:id', reviewController.updateReview);

// Delete a review by ID
router.delete('/reviews/:id', reviewController.deleteReview);

module.exports = router;
