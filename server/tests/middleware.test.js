const { getUserFromToken } = require('../middleware/getUserFromToken'); // Assuming the middleware file is named auth.js
const supertest = require("supertest")
// Mock required modules and imports
jest.mock('jsonwebtoken');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
jest.mock("../models/users");
const {your_secret_key} = require('../config');

describe('getUserFromToken middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      cookies: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should set req.user if a valid token is provided', async () => {
    const token = 'valid_token';
    req.cookies.token = token;
    const decoded = { email: 'test@example.com' };
    const user = { _id: 'user_id', email: 'test@example.com' };

    jwt.verify.mockReturnValueOnce(decoded);
    User.findOne.mockResolvedValueOnce(user);

    await getUserFromToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, your_secret_key);
    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if no token is provided', async () => {
    await getUserFromToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized: Missing token' });
    expect(next).not.toHaveBeenCalled();
  });


  it('should return 500 if any other error occurs', async () => {
    req.cookies.token = 'error_token';
    jwt.verify.mockImplementation(() => {
      throw new Error('Some other error');
    });

    await getUserFromToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith('Error: Some other error');
    expect(next).not.toHaveBeenCalled();
  });
});
