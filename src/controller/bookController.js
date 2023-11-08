const Book = require("../model/bookModel"); // Import the Book model
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongodbId = require("../util/validateMongodbId");

const createBook = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newBook = await Book.create(req.body);
    res.json(newBook);
  } catch (error) {
    throw new Error(error);
  }
});

const updateBook = asyncHandler(async (req, res) => {
  const isbn = req.params.isbn;

  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    const updatedBook = await Book.findOneAndUpdate(
      { isbn: isbn },
      req.body,
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(updatedBook);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBook = asyncHandler(async (req, res) => {
  const isbn = req.params.isbn;
  validateMongodbId(isbn);
  try {
    const deletedBook = await Book.findOneAndDelete({ isbn: isbn });
    res.json(deletedBook);
  } catch (error) {
    throw new Error(error);
  }
});

const getaBook = asyncHandler(async (req, res) => {
  const { isbn } = req.params;
  validateMongodbId(isbn);
  try {
    const foundBook = await Book.findOne({ isbn: isbn });
    res.json(foundBook);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBooks = asyncHandler(async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Book.find(JSON.parse(queryStr));

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const bookCount = await Book.countDocuments();
      if (skip >= bookCount) throw new Error("This Page does not exist");
    }
    const books = await query;
    res.json(books);
  } catch (error) {
    throw new Error(error);
  }
});

const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, isbn, comment } = req.body;
  try {
    const book = await Book.findOne({ isbn: isbn });
    let alreadyRated = book.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    if (alreadyRated) {
      const updateRating = await Book.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      const rateBook = await Book.findOneAndUpdate(
        { isbn: isbn },
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      );
    }
    const getAllRatings = await Book.findOne({ isbn: isbn });
    let totalRating = getAllRatings.ratings.length;
    let ratingsSum = getAllRatings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsSum / totalRating);
    let finalBook = await Book.findOneAndUpdate(
      { isbn: isbn },
      {
        totalrating: actualRating,
      },
      { new: true }
    );
    res.json(finalBook);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBook,
  getaBook,
  getAllBooks,
  updateBook,
  deleteBook,
  rating,
};
