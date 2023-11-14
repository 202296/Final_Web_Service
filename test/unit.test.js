const mongoose = require("mongoose");
const dbConnect = require("../src/config/connectDB"); // Adjust the import path accordingly
const jwt = require('jsonwebtoken');
const { generateToken } = require('../src/config/jwToken'); // Adjust the import path accordingly
const { generateRefreshToken } = require('../src/config/refreshToken'); // Adjust the import path accordingly
const { createUser } = require('../src/controller/authController'); // Adjust the import path accordingly
const { getaBook } = require('../src/controller/bookController'); // Adjust the import path accordingly
const Book = require('../src/model/bookModel');
const sendEmail = require('../src/controller/emailController'); // Adjust the import path accordingly
const {
  createMeeting,
  getAllMeetings,
} = require('../src/controller/meetController'); // Adjust the import path accordingly
const Meeting = require('../src/model/meetModel');
const {
  createReview,
  getAllReviews,
} = require('../src/controller/reviewController'); // Adjust the import path accordingly
const Review = require('../src/model/reviewModel');
const { authMiddleware, isAdmin } = require('../src/middleware/authMiddleware'); // Adjust the import path accordingly
const { notFound, errorHandler } = require('../src/middleware/errorHandler'); // Adjust the import path accordingly
const express = require('express');
const supertest = require('supertest');
const router = require('../src/route/authRoute');
const {
  createBook
} = require('../src/controller/bookController');
const {
  getMeetingById,
  updateMeeting,
  deleteMeeting,
} = require('../src/controller/meetController');
const {
  getReviewById,
  updateReview,
  deleteReview,
} = require('../src/controller/reviewController');
const validateMongodbId = require('../src/util/validateMongodbId');
require('dotenv').config();
////////////////////////////////////////////////////////////////
//connectDB.js
describe("dbConnect", () => {
  beforeAll(() => {
    // Setup any necessary configurations or mocks before running the tests
  });

  afterEach(async () => {
    // Close the database connection and perform cleanup after the tests
    await mongoose.connection.close();
  });

  it("should connect to the database successfully", async () => {
    // Mock the MONGODB_URL environment variable
    const mongodbUrl = process.env.MONGODB_URL;


    // Create a spy to capture console.log output
    const consoleLogSpy = jest.spyOn(console, "log");

    // Call the dbConnect function
    await dbConnect();

    // Assert that the connection message was logged
    expect(consoleLogSpy).toHaveBeenCalledWith("Database connected successfully");

    // Clean up the spy
    consoleLogSpy.mockRestore();
  });
});
////////////////////////////////////////////////////////////////
//jwToken.js
describe('generateToken', () => {
  // Mock process.env.JWT_SECRET to provide a known secret
  const originalEnv = process.env.JWT_Secret;

  beforeEach(() => {
    jest.resetModules();
    process.env.JWT_Secret = { ...originalEnv };
  });

  afterEach(() => {
    process.env.JWT_Secret = originalEnv;
  });

  it('should generate a valid JWT token', () => {
    // Mock the jwt.sign method
    jwt.sign = jest.fn();

    // Set process.env.JWT_SECRET
    process.env.JWT_SECRET= originalEnv;

    // Generate a token
    const userId = 123;
    generateToken(userId);

    // Verify that jwt.sign was called with the expected arguments
    expect(jwt.sign).toHaveBeenCalledWith({ id: userId }, process.env.JWT_SECRET, { expiresIn: '3d' });
  });
});

// refreshToken.js
describe('generateRefreshToken', () => {
  // Mock process.env.JWT_SECRET to provide a known secret
  const originalEnv = process.env.JWT_SECRET;

  beforeEach(() => {
    jest.resetModules();
    process.env.JWT_SECRET = { ...originalEnv };
  });

  afterEach(() => {
    process.env.JWT_SECRET = originalEnv;
  });

  it('should generate a valid refresh token', () => {
    // Mock the jwt.sign method
    jwt.sign = jest.fn();

    // Set process.env.JWT_SECRET
    process.env.JWT_SECRET = originalEnv;

    // Generate a refresh token
    const userId = 123;
    generateRefreshToken(userId);

    // Verify that jwt.sign was called with the expected arguments
    expect(jwt.sign).toHaveBeenCalledWith({ id: userId }, process.env.JWT_SECRET, { expiresIn: '3d' });
  });
});

  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////


//authController.js

describe('createUser', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: 'Change to a valid USER', // Provide valid user data here
        // Add other required user data
      },
    };
    res = {
      json: jest.fn(),
    };
  });

  it('should create a new user and respond with the user data', async () => {
    // Mock the User.findOne method to return null (user does not exist)
    User.findOne = jest.fn().mockReturnValue(null);

    // Mock the User.create method to return the user data
    User.create = jest.fn().mockResolvedValue(req.body);

    await createUser(req, res);

    // Verify that the response contains the new user data
    expect(res.json).toHaveBeenCalledWith(req.body);
  });

  it('should throw an error when the user already exists', async () => {
    // Mock the User.findOne method to return an existing user
    User.findOne = jest.fn().mockReturnValue({ email: req.body.email });

    // Expecting an error to be thrown
    await expect(createUser(req, res)).rejects.toThrow('User Already Exists');
  });
});
////////////////////////////////////////////////////////////////

//bookController.js

describe('getaBook', () => {
  it('should retrieve a book by ISBN and respond with the book data', async () => {
    const req = {
      params: {
        isbn: 'CHANGE TO BOOK ID', // Provide a valid ISBN here
      },
    };
    const res = {
      json: jest.fn(),
    };

    // Mock the Book.findOne method to return the book data
    Book.findOne = jest.fn().mockResolvedValue(/* Provide the expected book data here */);

    await getaBook(req, res);

    // Verify that the response contains the expected book data
    expect(res.json).toHaveBeenCalledWith(/* Provide the expected book data here */);
  });

  // Add more test cases for scenarios where the book is not found, validation, etc.
});

////////////////////////////////////////////////////////////////

//emailController.js

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn(() => Promise.resolve({ messageId: 'mockedMessageId' })),
  })),
}));

describe('sendEmail', () => {
  it('should send an email successfully', async () => {
    // Mock data for testing
    const testData = {
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test plain text',
      html: '<p>Test HTML body</p>',
    };

    // Mock Express request and response objects
    const req = {};
    const res = {};

    // Mock process.env values
    process.env.MAIL_ID = mailad;
    process.env.MP = mailpass;

    // Call the sendEmail function
    await sendEmail(testData, req, res);

    // Assertions
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MP,
      },
    });

    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith({
      from: '"Hey 👻" <abc@gmail.com>',
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test plain text',
      html: '<p>Test HTML body</p>',
    });
  });
});

////////////////////////////////

//meetController.js

jest.mock('../src/model/meetModel');

describe('Meeting Controller', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createMeeting', () => {
    it('should create a new meeting successfully', async () => {
      const req = { body: { 'April':'24'} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Meeting.mockImplementationOnce(() => ({ save: jest.fn() }));

      await createMeeting(req, res);

      expect(Meeting).toHaveBeenCalledWith(req.body);
      expect(Meeting().save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(Meeting());
    });

    it('should handle errors during meeting creation', async () => {
      const req = { body: { 'March' : '30'} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Meeting.mockImplementationOnce(() => ({ save: jest.fn(() => { throw new Error(); }) }));

      await createMeeting(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while creating the meeting.' });
    });
  });

  describe('getAllMeetings', () => {
    describe('getAllMeetings', () => {
      it('should get a list of all meetings successfully', async () => {
        // Mock the find method of the Meeting model
        jest.spyOn(Meeting, 'find').mockResolvedValueOnce([]);
    
        // Create a mock response object
        const res = { json: jest.fn() };
    
        // Call the getAllMeetings function
        await getAllMeetings({}, res);
    
        // Your assertions here
        expect(Meeting.find).toHaveBeenCalledWith(/* Your expected arguments */);
        expect(res.json).toHaveBeenCalledWith(/* Your expected arguments */);
      });
    });
  });
});

////////////////////////////////

//reviewController.js

jest.mock('../src/model/reviewModel.js');

describe('Review Controller', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createReview', () => {
    it('should create a new review successfully', async () => {
      const req = { body: { /* your review data */ } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Review.mockImplementationOnce(() => ({ save: jest.fn() }));

      await createReview(req, res);

      expect(Review).toHaveBeenCalledWith(req.body);
      expect(Review().save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(Review());
    });

    it('should handle errors during review creation', async () => {
      const req = { body: { /* your review data */ } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Review.mockImplementationOnce(() => ({ save: jest.fn(() => { throw new Error(); }) }));

      await createReview(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while creating the review.' });
    });
  });

  describe('getAllReviews', () => {
    it('should get a list of all reviews successfully', async () => {
      const res = { json: jest.fn() };

      Review.find.mockResolvedValueOnce([]);

      await getAllReviews({}, res);

      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should handle errors during fetching reviews', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Review.find.mockRejectedValueOnce(new Error());

      await getAllReviews({}, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while fetching reviews.' });
    });
  });

});

////////////////////////////////////////////////////////////////////////

//authMiddleware.js

jest.mock('../src/model/authModel');
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('authMiddleware', () => {
    it('should set req.user and call next on valid token', async () => {
      const req = { headers: { authorization: 'Bearer validToken' } };
      const res = {};
      const next = jest.fn();

      jwt.verify.mockReturnValueOnce({ id: 'userId' });
      User.findById.mockResolvedValueOnce({ /* user data */ });

      await authMiddleware(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('validToken', process.env.JWT_SECRET);
      expect(User.findById).toHaveBeenCalledWith('userId');
      expect(req.user).toEqual({ /* user data */ });
      expect(next).toHaveBeenCalled();
    });

    it('should throw an error on invalid token', async () => {
      const req = { headers: { authorization: 'Bearer invalidToken' } };
      const res = {};
      const next = jest.fn();

      jwt.verify.mockImplementationOnce(() => {
        throw new Error('Token verification failed');
      });

      await expect(() => authMiddleware(req, res, next)).toThrow('Not Authorized token expired, Please Login again');

      expect(next).not.toHaveBeenCalled();
    });

    it('should throw an error when no token is attached to the header', async () => {
      const req = { headers: {} };
      const res = {};
      const next = jest.fn();

      await expect(() => authMiddleware(req, res, next)).toThrow('There is no token attached to header');

      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('isAdmin', () => {
    it('should call next for admin user', async () => {
      const req = { user: { email: 'admin@example.com', role: 'admin' } };
      const res = {};
      const next = jest.fn();

      User.findOne.mockResolvedValueOnce({ role: 'admin' });

      await isAdmin(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'admin@example.com' });
      expect(next).toHaveBeenCalled();
    });

    it('should throw an error for non-admin user', async () => {
      const req = { user: { email: 'user@example.com', role: 'user' } };
      const res = {};
      const next = jest.fn();

      User.findOne.mockResolvedValueOnce({ role: 'user' });

      await expect(() => isAdmin(req, res, next)).toThrow('You are not an admin');

      expect(next).not.toHaveBeenCalled();
    });
  });
});

////////////////////////////////////////////////////////////////

//errorHandler.js

describe('Not Found Middleware', () => {
  it('should call next with a 404 error', () => {
    const req = { originalUrl: '/unknown-route' };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    notFound(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Not Found : /unknown-route' }));
  });
});

describe('Error Handler Middleware', () => {
  it('should handle errors with status code 500', () => {
    const err = new Error('Test Error');
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Test Error',
      stack: expect.any(String),
    });
  });

  it('should handle errors with existing status code', () => {
    const err = new Error('Test Error');
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    res.statusCode = 404; // Existing status code

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Test Error',
      stack: expect.any(String),
    });
  });

  it('should handle errors with status code 500 when res.statusCode is 200', () => {
    const err = new Error('Test Error');
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    res.statusCode = 200; // Existing status code

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Test Error',
      stack: expect.any(String),
    });
  });
});

////////////////////////////////////////////////////////////////

//authRoute.js

jest.mock('../src/controller/authController');
jest.mock('../src/middleware/authMiddleware');

const app = express();
app.use(express.json());
app.use(router);

describe('Auth Router', () => {
  it('should handle POST /register', async () => {
    const req = { body: { /* user data */ } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    createUser.mockResolvedValueOnce(/* user data */);

    await supertest(app)
      .post('/register')
      .send(req.body)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res.json);

    expect(createUser).toHaveBeenCalledWith(req, res);
  });

});

////////////////////////////////////////////////////////////////

//bookRoute.js

jest.mock('../src/controller/bookController');
jest.mock('../src/middleware/authMiddleware');

app.use(express.json());
app.use(router);

describe('Book Router', () => {
  it('should handle POST /', async () => {
    const req = { body: { /* book data */ } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    createBook.mockResolvedValueOnce(/* book data */);

    await supertest(app)
      .post('/')
      .send(req.body)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res.json);

    expect(createBook).toHaveBeenCalledWith(req, res);
  });

  it('should handle GET /:id', async () => {
    const req = { params: { id: 'bookId' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    getaBook.mockResolvedValueOnce(/* book data */);

    await supertest(app)
      .get(`/${req.params.id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res.json);

    expect(getaBook).toHaveBeenCalledWith(req, res);
  });

});

////////////////////////////////////////////////////////////////////////

//meetRoute.js

jest.mock('../src/controller/meetController');

app.use(express.json());
app.use(router);

describe('Meeting Router', () => {
  it('should handle POST /meetings', async () => {
    const req = { body: { /* meeting data */ } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    createMeeting.mockResolvedValueOnce(/* meeting data */);

    await supertest(app)
      .post('/meetings')
      .send(req.body)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res.json);

    expect(createMeeting).toHaveBeenCalledWith(req, res);
  });

  it('should handle GET /meetings', async () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    getAllMeetings.mockResolvedValueOnce([]);

    await supertest(app)
      .get('/meetings')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res.json);

    expect(getAllMeetings).toHaveBeenCalledWith({}, res);
  });

  it('should handle GET /meetings/:id', async () => {
    const req = { params: { id: 'meetingId' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    getMeetingById.mockResolvedValueOnce(/* meeting data */);

    await supertest(app)
      .get(`/meetings/${req.params.id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res.json);

    expect(getMeetingById).toHaveBeenCalledWith(req, res);
  });

  it('should handle PUT /meetings/:id', async () => {
    const req = { params: { id: 'meetingId' }, body: { /* updated meeting data */ } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    updateMeeting.mockResolvedValueOnce(/* updated meeting data */);

    await supertest(app)
      .put(`/meetings/${req.params.id}`)
      .send(req.body)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res.json);

    expect(updateMeeting).toHaveBeenCalledWith(req, res);
  });

  it('should handle DELETE /meetings/:id', async () => {
    const req = { params: { id: 'meetingId' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    deleteMeeting.mockResolvedValueOnce(/* deleted meeting data */);

    await supertest(app)
      .delete(`/meetings/${req.params.id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res.json);

    expect(deleteMeeting).toHaveBeenCalledWith(req, res);
  });
});

////////////////////////////////////////////////////////////////

//reviewRoute.js

jest.mock('../src/controller/reviewController');

app.use(express.json());
app.use(router);

describe('Review Router', () => {
  it('should handle POST /reviews', async () => {
    const req = { body: { /* review data */ } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    createReview.mockResolvedValueOnce(/* review data */);

    await supertest(app)
      .post('/reviews')
      .send(req.body)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res.json);

    expect(createReview).toHaveBeenCalledWith(req, res);
  });

  it('should handle GET /reviews', async () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    getAllReviews.mockResolvedValueOnce([]);

    await supertest(app)
      .get('/reviews')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res.json);

    expect(getAllReviews).toHaveBeenCalledWith({}, res);
  });

  it('should handle GET /reviews/:id', async () => {
    const req = { params: { id: 'reviewId' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    getReviewById.mockResolvedValueOnce(/* review data */);

    await supertest(app)
      .get(`/reviews/${req.params.id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res.json);

    expect(getReviewById).toHaveBeenCalledWith(req, res);
  });

  it('should handle PUT /reviews/:id', async () => {
    const req = { params: { id: 'reviewId' }, body: { /* updated review data */ } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    updateReview.mockResolvedValueOnce(/* updated review data */);

    await supertest(app)
      .put(`/reviews/${req.params.id}`)
      .send(req.body)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res.json);

    expect(updateReview).toHaveBeenCalledWith(req, res);
  });

  it('should handle DELETE /reviews/:id', async () => {
    const req = { params: { id: 'reviewId' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    deleteReview.mockResolvedValueOnce(/* deleted review data */);

    await supertest(app)
      .delete(`/reviews/${req.params.id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res.json);

    expect(deleteReview).toHaveBeenCalledWith(req, res);
  });
});

////////////////////////////////////////////////////////////////

//ValidateMondodbld.js

describe('validateMongodbId', () => {
  it('should throw an error for invalid MongoDB ID', () => {
    const invalidId = 'invalidId';
    expect(() => validateMongodbId(invalidId)).toThrowError('This Id is not valid or not found');
  });

  it('should not throw an error for valid MongoDB ID', () => {
    const validId = mongoose.Types.ObjectId().toHexString();
    expect(() => validateMongodbId(validId)).not.toThrowError();
  });
});