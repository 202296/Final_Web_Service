const Book = require("../model/bookModel"); // Import the Book model
const slugify = require("slugify");
const validateMongodbId = require("../util/validateMongodbId");

const createBook = async (req, res) => {
    try {
      console.log('Request body:', req.body); // Log entire request body
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
        console.log('Generated slug:', req.body.slug); // Log generated slug
      }
      const newBook = await Book.create(req.body);
      res.status(201).json({ acknowledged:true, insertedId: newBook.id });
    } catch (error) {
      console.error('Error creating book:', error);
      //res.status(500).json({ error: 'Failed to create book' });
    }
  };
  


const updateBook = async (req, res) => {
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

    res.status(204).json(updatedBook);
  } catch (error) {
    throw new Error(error);
  }
};

const deleteBook = async (req, res) => {
  const id = req.params.id;
  validateMongodbId(id);
  try {
    const deletedBook = await Book.findOneAndDelete({ _id: id });
    res.json(deletedBook);
  } catch (error) {
    throw new Error(error);
  }
};

const getaBook = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const foundBook = await Book.findOne({ _id: id });
    res.json(foundBook);
  } catch (error) {
    throw new Error(error);
  }
};

const getAllBooks = async (req, res) => {
  try {
    // Retrieve all books from the database and sort them (e.g., by createdAt field)
    const books = await Book.find({}).sort({ createdAt: -1 }).lean();

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

const rating = async (req, res) => {
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
};

module.exports = {
  createBook,
  getaBook,
  getAllBooks,
  updateBook,
  deleteBook,
  rating,
};
