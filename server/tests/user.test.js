const supertest = require("supertest")
const { default: mongoose } = require("mongoose");
const jwt = require('jsonwebtoken');
const User = require("../models/users");
const {your_secret_key} = require('../config');

jest.mock("../models/answers");
jest.mock("../models/users");
jest.mock("../models/questions");

const crypto = require('crypto');


let server;

describe("Get /verifyUser", () => {
  beforeEach(() => {
    server = require("../server"); // Start the server for testing
  });

  afterEach(async () => {
    await server.close(); // Close the server after each test
    await mongoose.disconnect(); // Disconnect from the MongoDB database
  });

  it("should verify correct passwords", async () => {
    const query = {
      email : "rohan10dalvi@gmail.com",
      password : "123456"
    }
    const hashedPassword = crypto.createHash('sha256').update(query.password).digest('hex');
    User.findOne.mockReturnValueOnce({ email: query.email, password:hashedPassword });
    // Send a GET request to /user/verifyPassword with the provided query
    const response = await supertest(server)
      .get("/user/verifyPassword")
      .query(query);

    // Assert response status and body
    expect(response.status).toBe(200);
    expect(response.body).toEqual(true);
  });

  it("should throw error at incorrect passwords", async () => {
    const query = {
      email : "rohan10dalvi@gmail.com",
      password : "123456"
    }
    const hashedPassword = crypto.createHash('sha256').update('not working').digest('hex');
    User.findOne.mockReturnValueOnce({ email: query.email, password:hashedPassword });
    // Send a GET request to /user/verifyPassword with the provided query
    const response = await supertest(server)
      .get("/user/verifyPassword")
      .query(query);

    // Assert response status and body
    expect(response.status).toBe(401);
    expect(response.body).toEqual(false);
  });

  it("should throw error if internal element throws error", async () => {
    const query = {
      email : "rohan10dalvi@gmail.com",
      password : "123456"
    }
    const hashedPassword = crypto.createHash('sha256').update('not working').digest('hex');
    User.findOne.mockImplementationOnce(() => {
      throw new Error("Internal server error");
    });
    // Send a GET request to /user/verifyPassword with the provided query
    const response = await supertest(server)
      .get("/user/verifyPassword")
      .query(query);

    // Assert response status and body
    expect(response.status).toBe(500);
    expect(response.body).toEqual(false);
  });

  it("should throw error when no user match", async () => {
    const query = {
      email : "rohan10dalvi@gmail.com",
      password : "123456"
    }
  
    User.findOne.mockReturnValueOnce(undefined);
    // Send a GET request to /user/verifyPassword with the provided query
    const response = await supertest(server)
      .get("/user/verifyPassword")
      .query(query);

    // Assert response status and body
    expect(response.status).toBe(401);
    expect(response.body).toEqual(false);
  });
  
});



describe("GET /logout", () => {
  beforeEach(() => {
    server = require("../server"); // Start the server for testing
  });

  afterEach(async () => {
    await server.close(); // Close the server after each test
    await mongoose.disconnect(); // Disconnect from the MongoDB database
  });

  it("should throw out token", async () => {
    
    const response = await supertest(server)
      .get("/user/logout")
      
    // Assert response status and body
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, message: "Logout successful" });
  });

});


describe("POST /addUser", () => {
  beforeEach(() => {
    server = require("../server"); // Listen on port 3000 for testing
  });

  afterEach(async () => {
    await server.close();
    await mongoose.disconnect();
  });

  it("should add a new user", async () => {
    const body ={
      name : 'rohan',
      email : 'rohan10dalvi@gmail.com',
      password: 'Pass23@word'
    }

    User.findOne.mockReturnValueOnce(null);

    const response = await supertest(server)
      .post("/user/addUser")
      .send(body);
      
    // Assert response body
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ success: true, message: "User added successfully" });
  });

  it("should return 409 if email already exists", async () => {
    const body ={
      name : 'rohan',
      email : 'rohan10dalvi@gmail.com',
      password: 'Pass23@word'
    }

    User.findOne.mockReturnValueOnce({ email: body.email });

    const response = await supertest(server)
      .post("/user/addUser")
      .send(body);
      
    // Assert response body
    expect(response.status).toBe(409);
    expect(response.body).toEqual({ success: false, message: "Email already exists" });
  });

  it("should return 400 if email format is invalid", async () => {
    const body ={
      name : 'rohan',
      email : 'invalidemail',
      password: 'Pass23@word'
    }

    const response = await supertest(server)
      .post("/user/addUser")
      .send(body);
      
    // Assert response body
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ success: false, message: "Invalid email format" });
  });

  it("should return 400 if password is weak", async () => {
    const body ={
      name : 'rohan',
      email : 'rohan10dalvi@gmail.com',
      password: 'weakpassword'
    }

    const response = await supertest(server)
      .post("/user/addUser")
      .send(body);
      
    // Assert response body
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ success: false, message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character. The first character should be an alphabet." });
  });

  it("should return 500 if an internal server error occurs", async () => {
    const body ={
      name : 'rohan',
      email : 'rohan10dalvi@gmail.com',
      password: 'Pass23@word'
    }

    User.findOne.mockRejectedValueOnce(new Error("Internal server error"));

    const response = await supertest(server)
      .post("/user/addUser")
      .send(body);
      
    // Assert response body
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ success: false, message: "Internal server error" });
  });
});

describe("POST /loginAsGuest", () => {
  beforeEach(() => {
    server = require("../server"); // Start the server for testing
  });

  afterEach(async () => {
    await server.close(); // Close the server after each test
    await mongoose.disconnect(); // Disconnect from the MongoDB database
  });

  it("should login as guest successfully", async () => {
    const email = "testGuest@gmail.com";
    const password = "1234";

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
   
    User.findOne.mockResolvedValueOnce({ email: email, password: hashedPassword });

    const response = await supertest(server)
      .get("/user/loginAsGuest");

    // Assert response body
    expect(response.status).toBe(200);
    expect(response.body).toEqual(true);
  });

  it("should return 401 if user is not found", async () => {
    User.findOne.mockResolvedValueOnce(null);

    const response = await supertest(server)
      .get("/user/loginAsGuest");

    // Assert response body
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'User not found' });
  });

  it("should return 401 if password is incorrect", async () => {
    const email = "testGuest@gmail.com";
    const password = "incorrectPassword";

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
   
    User.findOne.mockResolvedValueOnce({ email: email, password: hashedPassword });

    const response = await supertest(server)
      .get("/user/loginAsGuest");

    // Assert response body
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'password dont match' });
  });

  it("should return 500 if an internal server error occurs", async () => {
    const email = "testGuest@gmail.com";
    const password = "1234";

    User.findOne.mockRejectedValueOnce(new Error("Internal server error"));

    const response = await supertest(server)
      .get("/user/loginAsGuest");

    // Assert response body
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'internal server error' });
  });
});


describe("POST /updateProfile", () => {
  beforeEach(() => {
    server = require("../server"); // Start the server for testing
  });

  afterEach(async () => {
    await server.close(); // Close the server after each test
    await mongoose.disconnect(); // Disconnect from the MongoDB database
  });

  const user1 = {
    _id: "6625269de4b64a8d28edee50",
    name: "hamkalo",
    email: "test1@gmail.com",
    password: crypto.createHash('sha256').update("oldPassword").digest('hex') ,
    type: 0,
    impressions: 0,
    save: ()=>{}
  };

  const user2 = {
    _id: "6625269de4b64a8d28edee50",
    name: "hamkalo",
    email: "test1@gmail.com",
    password: crypto.createHash('sha256').update("oldPassword").digest('hex') ,
    type: 0,
    impressions: 0,
    save: ()=>{}
  };

  const token = jwt.sign({ email: 'test1@gmail.com'}, your_secret_key, { expiresIn: '1h' });


  it("should update profile successfully", async () => {
    const oldPassword = "oldPassword";
    const newPassword = "newPassword";
    const name = "newName";
    const email = "newemail@example.com";

    User.findOne.mockResolvedValueOnce(user1);

    const res = {
      _id: user1._id,
      email: email,
      impressions: user1.impressions,
      name: name,
      type: user1.type
    } 

    const response = await supertest(server)
      .post("/user/updateProfile")
      .set("Cookie", [`token=${token}`]) // Set the token in the request cookie
      .send({ oldPassword, newPassword, name, email });

    // Assert response body
    expect(response.body).toEqual({ success: true, message: 'Profile updated successfully', user: res });
  });


  it("should return 401 if token is missing", async () => {
    const response = await supertest(server)
      .post("/user/updateProfile")
      .send({});

    // Assert response body
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized: Missing token' });
  });


  it("should return 400 if old password is incorrect", async () => {
    const oldPassword = "incorrectPassword";
    const newPassword = "newPassword";
    const name = "newName";
    const email = "newemail@example.com";
  
    User.findOne.mockResolvedValueOnce(user1);

    const response = await supertest(server)
      .post("/user/updateProfile")
      .set("Cookie", [`token=${token}`])
      .send({ oldPassword, newPassword, name, email });
  
    // Assert response body
    expect(response.body).toEqual({ success: false, message: 'Old password is incorrect' });
    expect(response.status).toBe(400);
    
  });
  
  // Add more test cases for incorrect old password, existing email/username, and internal server error scenarios
});




describe("GET /getMyUserDetails", () => {
  beforeEach(() => {
    server = require("../server"); // Set up server for testing
  });

  afterEach(async () => {
    await server.close(); // Close server after each test
    await mongoose.disconnect(); // Disconnect from MongoDB after each test
  });

  it("should return my user details", async () => {
    // Mock user data
    const user1 = {
      _id: "6625269de4b64a8d28edee50",
      name: "hamkalo",
      email: "test1@gmail.com",
      password: crypto.createHash('sha256').update("oldPassword").digest('hex'),
      type: 0,
      impressions: 0,
      save: () => {}
    };

    // Generate a JWT token for authorization
    const token = jwt.sign({ email: 'test1@gmail.com'}, your_secret_key, { expiresIn: '1h' });

    // Mock User.findOne to resolve with user1
    User.findOne.mockResolvedValueOnce(user1);

    // Expected response body
    const res = {
      _id: user1._id,
      email: user1.email,
      impressions: user1.impressions,
      name: user1.name,
      type: user1.type
    };

    // Send request to server
    const response = await supertest(server)
      .get("/user/myUserDetails")
      .set("Cookie", [`token=${token}`]);

    // Assert response body
    expect(response.body).toEqual(res);
    expect(response.status).toBe(200);
  });

  it("should return error when no cookies", async () => {
    // Mock user data
    const user1 = {
      _id: "6625269de4b64a8d28edee50",
      name: "hamkalo",
      email: "test1@gmail.com",
      password: crypto.createHash('sha256').update("oldPassword").digest('hex'),
      type: 0,
      impressions: 0,
      save: () => {}
    };

    // Mock User.findOne to resolve with user1
    User.findOne.mockResolvedValueOnce(user1);

    // Send request to server without token
    const response = await supertest(server)
      .get("/user/myUserDetails");

    // Assert response body
    expect(response.body).toEqual({ error: 'Unauthorized: Missing token' });
    expect(response.status).toBe(401);
  });
  // Add more test cases for incorrect old password, existing email/username, and internal server error scenarios
});


describe("GET /userDetails", () => {
  beforeEach(() => {
    server = require("../server"); // Set up server for testing
  });

  afterEach(async () => {
    await server.close(); // Close server after each test
    await mongoose.disconnect(); // Disconnect from MongoDB after each test
  });

  // Mock user data
  const user1 = {
    _id: "6625269de4b64a8d28edee50",
    name: "hamkalo",
    email: "test1@gmail.com",
    password: crypto.createHash('sha256').update("oldPassword").digest('hex'),
    type: 0,
    impressions: 0,
    save: () => {}
  };

  // Generate a JWT token for authorization
  const token = jwt.sign({ email: 'test1@gmail.com'}, your_secret_key, { expiresIn: '1h' });

  it("should return user of that uid", async () => {
    // Mock User.findById to resolve with user1
    User.findById.mockResolvedValueOnce(user1);

    // Expected response body
    const res = {
      _id: user1._id,
      email: user1.email,
      impressions: user1.impressions,
      name: user1.name,
      type: user1.type
    };

    // Send request to server
    const response = await supertest(server)
      .get(`/user/userDetails/${user1._id}`)
      .set("Cookie", [`token=${token}`]);

    // Assert response body
    expect(response.status).toBe(200);
    expect(response.body).toEqual(res);
  });

  it("should throw error when no user", async () => {
    // Send request to server with undefined user ID
    const response = await supertest(server)
      .get(`/user/userDetails/${undefined}`)
      .set("Cookie", [`token=${token}`]);

    // Assert response body
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'User not found' });
  });
  // Add more test cases for incorrect old password, existing email/username, and internal server error scenarios
});

describe("GET /getUsersByUsername", () => {
  beforeEach(() => {
    server = require("../server"); // Set up server for testing
  });

  afterEach(async () => {
    await server.close(); // Close server after each test
    await mongoose.disconnect(); // Disconnect from MongoDB after each test
  });

  const user1 = {
    _id: "6625269de4b64a8d28edee50",
    name: "hamkalo",
    email: "test1@gmail.com",
    password: crypto.createHash('sha256').update("oldPassword").digest('hex') ,
    type: 0,
    impressions: 0,
    save: () => {}
  };

  const user2 = {
    _id: "6625269de4b64a8d28edee50",
    name: "hamkalo0",
    email: "test1@gmail.com",
    password: crypto.createHash('sha256').update("oldPassword").digest('hex') ,
    type: 0,
    impressions: 0,
    save: () => {}
  };

  const token = jwt.sign({ email: 'test1@gmail.com'}, your_secret_key, { expiresIn: '1h' });


  it("should return users of the given string", async () => {

    User.findById.mockResolvedValueOnce(user1);
    // Mock findById to return user1

    const res1 = {
      _id: user1._id,
      email: user1.email,
      impressions: user1.impressions,
      name: user1.name,
      type: user1.type
    }
    const res2 = {
      _id: user2._id,
      email: user2.email,
      impressions: user2.impressions,
      name: user2.name,
      type: user2.type
    }
    const res = [res1, res2 ]

    User.find.mockResolvedValueOnce([user1, user2]);
    
    const response = await supertest(server)
      .get(`/user/usersByUsername`)
      .set("Cookie", [`token=${token}`])
      .query({usernameFilter:''});

    // Assert response body
    expect(response.status).toBe(200);
    expect(response.body).toEqual(res);
  });


  it("should throw internal server error", async () => {

    // Mock User.find to throw an error
    User.find.mockResolvedValueOnce(() => {
      throw new Error("Internal server error");
    });
    const response = await supertest(server)
      .get(`/user/usersByUsername`)
      .set("Cookie", [`token=${token}`])
      .query({usernameFilter:''});

    // Assert response status
    expect(response.status).toBe(500);
  });
  
});
