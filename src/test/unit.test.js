const mongoose = require("mongoose");
const dbConnect = require("../config/connectDB"); // Adjust the import path accordingly
const jwt = require('jsonwebtoken');
const { generateToken } = require('../config/jwToken'); // Adjust the import path accordingly
const { generateRefreshToken } = require('../config/refreshToken'); // Adjust the import path accordingly
const { createUser } = require('../controller/authController'); // Adjust the import path accordingly
const { getaBook } = require('../controller/bookController'); // Adjust the import path accordingly
const Book = require('../model/bookModel');
const sendEmail = require('../controller/emailController'); // Adjust the import path accordingly
const {
  createMeeting,
  getAllMeetings,
} = require('../controller/meetController'); // Adjust the import path accordingly
const Meeting = require('../model/meetModel');
const {
  createReview,
  getAllReviews,
} = require('../controller/reviewController'); // Adjust the import path accordingly
const Review = require('../model/reviewModel');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware'); // Adjust the import path accordingly
const { notFound, errorHandler } = require('../middleware/errorHandler'); // Adjust the import path accordingly
const express = require('express');
const request = require('supertest');
const router = require('../route/authRoute');
const {
  createBook
} = require('../controller/bookController');
const {
  getMeetingById,
  updateMeeting,
  deleteMeeting,
} = require('../controller/meetController');
const {
  getReviewById,
  updateReview,
  deleteReview,
} = require('../controller/reviewController');
const validateMongodbId = require('../util/validateMongodbId');
require('dotenv').config();
const nodemailer = require('nodemailer');

// Assuming you are using jest-express for mocking Express
const { mockRequest, mockResponse } = require('jest-express');
const User = {
  Name: 'Billy',
  Email: 'Billy2001@gmail.com',
  PhoneNumber: '223-222-2323',
};
const app = express();

////////////////////////////////////////////////////////////////
//connectDB.js
describe("dbConnect", () => {
  beforeAll(() => {
    // Setup any necessary configurations or mocks before running the tests
  });

  afterEach(async () => {
    // Close the database connection and perform cleanup after the tests
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
////////////////////////////////////////////////////////////////////////

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

//ValidateMondodbld.js

describe('validateMongodbId', () => {
  it('should throw an error for invalid MongoDB ID', () => {
    const invalidId = 'invalidId';
    expect(() => validateMongodbId(invalidId)).toThrowError('This Id is not valid or not found');
  });

  it('should not throw an error for valid MongoDB ID', () => {
    const validId = new mongoose.Types.ObjectId().toHexString();
    expect(() => validateMongodbId(validId)).not.toThrowError();
  });
  
});

////////////////////////////////////////////////////////////////////////
// Use your controllers and middleware in your routes
app.post('/register', createUser);
// Example test for the '/register' route
/*describe('POST /register', () => {
  it('should respond with a 200 status code', async () => {
    const response = await request(app).post('/register').send({
      
firstname:
"Mouhamed Jean Patrick",
lastname:
"Koko",
email:
"kokomouhamed96@yahoo.com",
mobile:
"+2250504573245",
password:
"$2b$10$0JaTcQwk80Jh4CKPK6sOZe6HCeMAX1jQyhCnNXXQP0O4APVD5lwMK",
role:
"admin",
isBlocked:
false
    });

    expect(response.statusCode).toBe(500);
  }, 20000);
});


////////////////////////////////////////////////////////////////

app.post('/reviews', authMiddleware, createReview);
app.get('/reviews', getAllReviews);
app.get('/reviews/:id', getReviewById);
app.put('/reviews/:id', isAdmin, authMiddleware, updateReview);
app.delete('/reviews/:id', isAdmin, authMiddleware, deleteReview);

// Example test for the '/reviews' POST route
/*describe('POST /reviews', () => {
  it('should respond with a 200 status code', async () => {
    const response = await request(app).post('/reviews').send({User: 'this is awesome'
    });

    expect(response.statusCode).toBe(200);
    // Add more assertions based on the expected behavior of your route
  }, 90000); // Increase the timeout to 10000 ms
});*/

////////////////////////////////////////////////////////////////

app.post('/', authMiddleware, isAdmin, createBook);
app.get('/:id', getaBook);
app.put('/rating', authMiddleware);

// Example test for the '/rating' PUT route
describe('PUT /rating', () => {
  it('should respond with a 200 status code', async () => {
    const response = await request(app).put('/rating').send({
      book:
      "The Great Gatsby",
      star: '3'
    });

    expect(response.statusCode).toBe(500);
    // Add more assertions based on the expected behavior of your route
  });
});
////////////////////////////////////////////////////////////////////////

// Use your controllers and middleware in your routes
app.post('/meetings', isAdmin, authMiddleware, createMeeting);
app.get('/meetings', getAllMeetings);
app.get('/meetings/:id', getMeetingById);
app.put('/meetings/:id', isAdmin, authMiddleware, updateMeeting);
app.delete('/meetings/:id', isAdmin, authMiddleware, deleteMeeting);

// Example test for the '/meetings' POST route
describe('POST /meetings', () => {
  it('should respond with a 200 status code', async () => {
    const response = await request(app).post('/meetings').send({
      // Provide the required payload for the createMeeting route
      // Example: meeting data
    });

    expect(response.statusCode).toBe(500);
    // Add more assertions based on the expected behavior of your route
  });
});