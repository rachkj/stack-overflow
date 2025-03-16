// unit tests for functions in controller/question.js


const supertest = require("supertest")
const { default: mongoose } = require("mongoose");
const jwt = require('jsonwebtoken');
const Answer = require("../models/answers");
const Question = require("../models/questions");
const User = require("../models/users");

const Comment = require("../models/comments");
const answers = require("../models/answers");
const {your_secret_key} = require('../config');
const { addTag, getQuestionsByOrder, filterQuestionsBySearch } = require('../utils/question');

jest.mock("../models/answers");
jest.mock("../models/users");
jest.mock("../models/questions");

const {getUserFromToken} = require('../middleware/getUserFromToken');
const token = jwt.sign({ email: 'test1@gmail.com'}, your_secret_key, { expiresIn: '1h' });

// Mocking the models
jest.mock("../models/questions");
jest.mock('../utils/question', () => ({
  addTag: jest.fn(),
  getQuestionsByOrder: jest.fn(),
  filterQuestionsBySearch: jest.fn(),
}));
//jest.mock('../middleware/getUserFromToken');

let server;

const user1 = {
  _id: "6625269de4b64a8d28edee50",
  name: "hamkalo",
  email: "test1@gmail.com",
  password: "1234",
  type: 0,
  impressions: 0
};

const user2 = {
  _id: "6625269dsdb64a8d28edee50",
  name: "change",
  email: "test2@gmail.com",
  password: "1212",
  type: 0,
  impressions: 0
};

const user3 = {
  _id: "6625269de4b64erd28edee50",
  name: "haramko",
  email: "test3@gmail.com",
  password: "13234",
  type: 1,
  impressions: 0
};

const user4 = {
  _id: "6625269de4sfb64erd28edee50",
  name: "admin",
  email: "test4@gmail.com",
  password: "13234",
  type: 3,
  impressions: 0
};


const tag1 = {
  _id: '507f191e810c19729de860ea',
  name: 'tag1'
};

const tag2 = {
  _id: '65e9a5c2b26199dbcc3e6dc8',
  name: 'tag2'
};

const comment1 = {
  _id: '65e9c5a995b6c7045a30d823',
  text: 'Comment 1 Text',
  comment_by: user1._id,
  comment_time: new Date()
};

const comment2 = {
  _id: '65e9c5a995b6c7045a30d824',
  text: 'Comment 2 Text',
  comment_by: user1._id,
  comment_time: new Date()
};

const answer1 = {
  _id: '65e9b58910afe6e94fc6e6dc',
  text: 'Answer 1 Text',
  ans_by: user1._id,
  ans_date_time: new Date(),
  comments: [comment1._id],
  upvotes: [user1._id],
  downvotes: []
};

const answer2 = {
  _id: '65e9b58910afe6e94fc6e6dd',
  text: 'Answer 2 Text',
  ans_by: user1._id,
  ans_date_time: new Date(),
  comments: [comment2._id],
  upvotes: [user2._id],
  downvotes: []
};

const question1 = {
  _id: '65e9b58910afe6e94fc6e6de',
  title: 'Question 1 Title',
  text: 'Question 1 Text',
  tags: [tag1._id],
  answers: [answer1._id],
  asked_by: user1._id,
  ask_date_time: new Date().toDateString(),
  views: 0,
  comments: [comment1._id],
  upvotes: [user2._id],
  downvotes: []
};

const question2 = {
  _id: '65e9b58910afe6e94fc6e6df',
  title: 'Question 2 Title',
  text: 'Question 2 Text',
  tags: [tag2._id],
  answers: [answer2._id],
  asked_by: user1._id,
  ask_date_time: new Date().toDateString(),
  views: 0,
  comments: [comment2._id],
  upvotes: [user2._id],
  downvotes: []
};

const mockQuestions = [question1, question2];


describe('GET /getQuestion', () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async() => {
    if(server){
      server.close();
    }
    await mongoose.disconnect();
  });

  it('should return questions by filter an order', async () => {
    // Mock request query parameters
    const mockReqQuery = {
      order: 'someOrder',
      search: 'someSearch',
    };

    User.findOne.mockResolvedValueOnce(user1);
   
    getQuestionsByOrder.mockResolvedValueOnce(mockQuestions);
    filterQuestionsBySearch.mockReturnValueOnce(mockQuestions);
    
    // Making the request
    const response = await supertest(server)
      .get('/question/getQuestion')
      .set('Cookie', `token=${token}`)
      .query(mockReqQuery); 

    // Asserting the response
    expect(response.body).toEqual(mockQuestions);
    expect(response.status).toBe(200);
    
  });
});





describe('GET /getQuestionById', () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async() => {
    if(server){
      server.close();
    }
    await mongoose.disconnect();
  });

  it('should return question details for that id', async () => {



    User.findOne.mockResolvedValueOnce(user1);
    //getUserFromToken.mockResolvedValueOnce({ data: mockReqQuery, user: u1 });
    Question.findOneAndUpdate = jest.fn().mockReturnValueOnce({
          populate: jest.fn().mockReturnValueOnce({
              populate: jest.fn().mockReturnValueOnce({
                  populate: jest.fn().mockResolvedValueOnce(mockQuestions[0])
              })
          })
      });
  
      User.findByIdAndUpdate.mockReturnValueOnce(user1);


    
    
    // Making the request
    const response = await supertest(server)
      .get(`/question/getQuestionById/${mockQuestions[0]._id}`)
      .set('Cookie', `token=${token}`);

    // Asserting the response
    expect(response.body).toEqual(mockQuestions[0]);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestions[0]);
    
    
  });

  it('should return error when params not correct', async () => {



    User.findOne.mockResolvedValueOnce(user1);
    //getUserFromToken.mockResolvedValueOnce({ data: mockReqQuery, user: u1 });
    Question.findOneAndUpdate = jest.fn().mockReturnValueOnce({
          populate: jest.fn().mockReturnValueOnce({
              populate: jest.fn().mockReturnValueOnce({
                  populate: jest.fn().mockResolvedValueOnce(mockQuestions[0])
              })
          })
      });
  
      User.findByIdAndUpdate.mockReturnValueOnce(user1);


    
    
    // Making the request
    const response = await supertest(server)
      .get(`/question/getQuestionById/${undefined}`)
      .set('Cookie', `token=${token}`);

    // Asserting the response
    expect(response.body).toEqual(mockQuestions[0]);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestions[0]);
    
    
  });
});




describe('GET /addQuestion', () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async() => {
    if(server){
      server.close();
    }
    await mongoose.disconnect();
  });

  it('should add question when all params are correct', async () => {
    questionParams ={
      title: "new question",
      text: "question text",
      tags:['tag1'  , 'tag2']
    }

    question ={
      title: "new question",
      text: "question text",
      tags:['tag1'  , 'tag2'],
      comments:[],
      downvotes : [],
      upvotes : [user1]
    }
    User.findOne.mockResolvedValueOnce(user1);

    addTag.mockResolvedValueOnce('tag1_id');
    addTag.mockResolvedValueOnce('tag2_id');
   
    Question.create.mockReturnValueOnce(question);
    // Making the request
    const response = await supertest(server)
      .post('/question/addQuestion')
      .set('Cookie', `token=${token}`)
      .send(questionParams); 

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(question);
    
  });

  it('should return 401 when guest account tries to add a question', async () => {
  
    const questionParams = {
      title: "new question",
      text: "question text",
      tags:['tag1'  , 'tag2']
    };

    User.findOne.mockResolvedValueOnce(user3);

    const response = await supertest(server)
      .post('/question/addQuestion')
      .set('Cookie', `token=${token}`)
      .send(questionParams);
  
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized: Guest account login to perform this action' });
  });

  it('should return 400 when question parameters are missing', async () => {
   // const token = 'valid_user_token'; // assuming the token for a valid user
    // Missing tags in questionParams
    const questionParams = {
      title: "new question",
      text: "question text"
    };

    User.findOne.mockResolvedValueOnce(user1);

    const response = await supertest(server)
      .post('/question/addQuestion')
      .set('Cookie', `token=${token}`)
      .send(questionParams);
  
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Bad request: Missing question parameters' });
  });

  it('should return 400 when question parameters are invalid', async () => {
    //const token = 'valid_user_token'; // assuming the token for a valid user
    // Invalid tags in questionParams
    const questionParams = {
      title: "new question",
      text: "question text",
      tags: 'invalid_tag' // not an array
    };

    User.findOne.mockResolvedValueOnce(user1);
  
    const response = await supertest(server)
      .post('/question/addQuestion')
      .set('Cookie', `token=${token}`)
      .send(questionParams);
  
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Bad request: Invalid question parameters' });
  });
  
});


describe('GET /downvoteQuestion', () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async() => {
    if(server){
      server.close();
    }
    await mongoose.disconnect();
  });

  it('should downvote a question', async () => {

    // Mock request query parameters
    User.findOne.mockResolvedValueOnce(user1);
    Question.findById.mockResolvedValueOnce(question2);
    const updatedq = {... question2, upvotes: [user2._id, user1._id]}
    Question.findByIdAndUpdate.mockResolvedValueOnce(updatedq);

    
    
    // Making the request
    const response = await supertest(server)
      .get(`/question/downvoteQuestion/${question2._id}`)
      .set('Cookie', `token=${token}`); 

    // Asserting the response
    expect(response.body).toEqual(updatedq);
    expect(response.status).toBe(200);
    
  });


  it('no question should return error', async () => {
    // Mock request query parameters
    User.findOne.mockResolvedValueOnce(user1);
    Question.findById.mockResolvedValueOnce(undefined);

    
    // Making the request
    const response = await supertest(server)
      .get(`/question/downvoteQuestion/${question2._id}`)
      .set('Cookie', `token=${token}`); 

    // Asserting the response
    expect(response.body).toEqual({ error: 'Question not found' });
    expect(response.status).toBe(404);
    
  });

  it('guest should not upvote a question', async () => {

    // Mock request query parameters
    User.findOne.mockResolvedValueOnce(user3);    
    // Making the request
    const response = await supertest(server)
      .get(`/question/downvoteQuestion/${question2._id}`)
      .set('Cookie', `token=${token}`); 

    // Asserting the response
    expect(response.body).toEqual({ error: 'Unauthorized: Login to perform this action' });
    expect(response.status).toBe(401);
    
  });

});


describe('GET /deleteQuestion', () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async() => {
    if(server){
      server.close();
    }
    await mongoose.disconnect();
  });

  it('should delete a question', async () => {

    // Mock request query parameters
    User.findOne.mockResolvedValueOnce(user1);
    Question.findById.mockResolvedValueOnce(question2);

    
    // Making the request
    const response = await supertest(server)
      .delete(`/question/deleteQuestion/${question2._id}`)
      .set('Cookie', `token=${token}`); 

    // Asserting the response
    expect(response.body).toEqual(true);
    expect(response.status).toBe(200);
    
  });


  it('throw error for different user', async () => {

    // Mock request query parameters
    User.findOne.mockResolvedValueOnce(user2);
    Question.findById.mockResolvedValueOnce(question2);

    
    // Making the request
    const response = await supertest(server)
      .delete(`/question/deleteQuestion/${question2._id}`)
      .set('Cookie', `token=${token}`); 

    // Asserting the response
    expect(response.body).toEqual({ error: 'Forbidden: You are not authorized to delete this question' });
    expect(response.status).toBe(403);
    
  });

  it(' allow delete for moderator', async () => {

    // Mock request query parameters
    User.findOne.mockResolvedValueOnce(user4);
    Question.findById.mockResolvedValueOnce(question2);

    
    // Making the request
    const response = await supertest(server)
      .delete(`/question/deleteQuestion/${question2._id}`)
      .set('Cookie', `token=${token}`); 

    // Asserting the response
    expect(response.body).toEqual(true);
    expect(response.status).toBe(200);
    
  });

  it(' throw error on question not found', async () => {

    // Mock request query parameters
    User.findOne.mockResolvedValueOnce(user4);
    Question.findById.mockResolvedValueOnce(undefined);

    
    // Making the request
    const response = await supertest(server)
      .delete(`/question/deleteQuestion/${question2._id}`)
      .set('Cookie', `token=${token}`); 

    // Asserting the response
    expect(response.body).toEqual({ error: 'Question not found' });
    expect(response.status).toBe(404);
    
  });

});


describe('GET /upvoteQuestion', () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async() => {
    if(server){
      server.close();
    }
    await mongoose.disconnect();
  });

  it('should downvote a question', async () => {

    // Mock request query parameters
    User.findOne.mockResolvedValueOnce(user1);
    Question.findById.mockResolvedValueOnce(question2);
    const updatedq = {... question2, upvotes: [user2._id, user1._id]}
    Question.findByIdAndUpdate.mockResolvedValueOnce(updatedq);

    
    
    // Making the request
    const response = await supertest(server)
      .get(`/question/upvoteQuestion/${question2._id}`)
      .set('Cookie', `token=${token}`); 

    // Asserting the response
    expect(response.body).toEqual(updatedq);
    expect(response.status).toBe(200);
    
  });


  it('no question should return error', async () => {
    // Mock request query parameters
    User.findOne.mockResolvedValueOnce(user1);
    Question.findById.mockResolvedValueOnce(undefined);

    
    // Making the request
    const response = await supertest(server)
      .get(`/question/upvoteQuestion/${question2._id}`)
      .set('Cookie', `token=${token}`); 

    // Asserting the response
    expect(response.body).toEqual({ error: 'Question not found' });
    expect(response.status).toBe(404);
    
  });

  it('guest should not upvote a question', async () => {

    // Mock request query parameters
    User.findOne.mockResolvedValueOnce(user3);    
    // Making the request
    const response = await supertest(server)
      .get(`/question/upvoteQuestion/${question2._id}`)
      .set('Cookie', `token=${token}`); 

    // Asserting the response
    expect(response.body).toEqual({ error: 'Unauthorized: Login to perform this action' });
    expect(response.status).toBe(401);
    
  });

});