const Review = require('../model/reviewModel'); // Import the Review model

// Create a new review
const createReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the review.' });
  }
};

// Get a list of all reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching reviews.' });
  }
};

// Get a single review by ID
const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the review.' });
  }
};

// Update a review by ID
const updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the review.' });
  }
};

// Delete a review by ID
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndRemove(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the review.' });
  }
};


module.exports = {
  createReview,
  getReviewById,
  getAllReviews,
  updateReview,
  deleteReview
};
