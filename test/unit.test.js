const mongoose = require("mongoose");
const dbConnect = require("../src/config/connectDB"); // Adjust the import path accordingly
const jwt = require('jsonwebtoken');
const { generateToken } = require('../src/config/jwToken'); // Adjust the import path accordingly
const jwt = require('jsonwebtoken');
const { generateRefreshToken } = require('../src/config/refreshToken'); // Adjust the import path accordingly
const { createUser } = require('../src/controller/authController'); // Adjust the import path accordingly
const User = require('../model/authModel');
const { generateToken } = require('../config/jwtoken');
const { getaBook } = require('../src/controller/bookController'); // Adjust the import path accordingly
const Book = require('../src/model/bookModel');


////////////////////////////////////////////////////////////////
//connectDB.js
describe("dbConnect", () => {
  beforeAll(() => {
    // Setup any necessary configurations or mocks before running the tests
  });

  afterAll(async () => {
    // Close the database connection and perform cleanup after the tests
    await mongoose.connection.close();
  });

  it("should connect to the database successfully", async () => {
    // Mock the MONGODB_URL environment variable
    process.env.MONGODB_URL = MONGODB_URL;

    // Create a spy to capture console.log output
    const consoleLogSpy = jest.spyOn(console, "log");

    // Call the dbConnect function
    await dbConnect();

    // Assert that the connection message was logged
    expect(consoleLogSpy).toHaveBeenCalledWith("Database connected successfully");

    // Clean up the spy
    consoleLogSpy.mockRestore();
  });

  it("should handle database connection errors", async () => {
    // Mock the MONGODB_URL environment variable to an incorrect value
    process.env.MONGODB_URL = "invalid-url";

    // Create a spy to capture console.error output
    const consoleErrorSpy = jest.spyOn(console, "error");

    // Call the dbConnect function
    await dbConnect();

    // Assert that an error message was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("Database connection error"));

    // Clean up the spy
    consoleErrorSpy.mockRestore();
  });
});
////////////////////////////////////////////////////////////////
//jwToken.js
describe('generateToken', () => {
    // Mock process.env.JWT_SECRET to provide a known secret
    const originalEnv = process.env;
  
    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });
  
    afterEach(() => {
      process.env = originalEnv;
    });
  
    it('should generate a valid JWT token', () => {
      // Mock the jwt.sign method
      jwt.sign = jest.fn();
  
      // Set process.env.JWT_SECRET
      process.env.JWT_SECRET = 'your-secret-key';
  
      // Generate a token
      const userId = 123;
      generateToken(userId);
  
      // Verify that jwt.sign was called with the expected arguments
      expect(jwt.sign).toHaveBeenCalledWith({ id: userId }, 'your-secret-key', { expiresIn: '3d' });
    });
  });
  //refreshToken.js
  describe('generateRefreshToken', () => {
    // Mock process.env.JWT_SECRET to provide a known secret
    const originalEnv = process.env;
  
    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });
  
    afterEach(() => {
      process.env = originalEnv;
    });
  
    it('should generate a valid refresh token', () => {
      // Mock the jwt.sign method
      jwt.sign = jest.fn();
  
      // Set process.env.JWT_SECRET
      process.env.JWT_SECRET = JWT_SECRET;
  
      // Generate a refresh token
      const userId = 123;
      generateRefreshToken(userId);
  
      // Verify that jwt.sign was called with the expected arguments
      expect(jwt.sign).toHaveBeenCalledWith({ id: userId }, JWT_SECRET, { expiresIn: '3d' });
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
