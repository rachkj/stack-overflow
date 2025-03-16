// Unit tests for getTagsWithQuestionNumber in controller/tags.js

const supertest = require("supertest")

const Tag = require('../models/tags');
const Question = require('../models/questions');
const Comment = require('../models/comments');
const Answer = require('../models/answers');
const User = require('../models/users');
const { default: mongoose } = require("mongoose");
const jwt = require('jsonwebtoken');
const {your_secret_key} = require('../config')
jest.mock("../models/answers");
jest.mock("../models/users");
jest.mock("../models/questions");
jest.mock("../models/tags");
jest.mock("../models/comments");

const token = jwt.sign({ email: 'test1@gmail.com'}, your_secret_key, { expiresIn: '1h' });


const user1 = {
    _id: "6625269de4b64a8d28edee50",
    name: "hamkalo",
    email: "test1@gmail.com",
    password: "1234",
    type: 0,
    impressions: 0
  };
  
  const user2 = {
    _id: "6625269dsdbee8d28edee50",
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
    name: 'tag1',
    description:'description'
  };
  
  const tag2 = {
    _id: '65e9a5c2b26199dbcc3e6dc8',
    name: 'tag2',
    description: 'description'
  };
  
  const comment1 = {
    _id: '65e9c5a995b6c7045a30d823',
    text: 'Comment 1 Text',
    comment_by: user1._id,
    comment_time: new Date().toString(),
    upvotes:[user1._id],
    downvotes:[],
  };
  
  const comment2 = {
    _id: '65e9c5a995b6c7045a30d824',
    text: 'Comment 2 Text',
    comment_by: user1._id,
    comment_time: new Date().toString(),
    upvotes:[],
    downvotes:[],
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
    tags: [tag1],
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
    tags: [tag2],
    answers: [answer2._id],
    asked_by: user1._id,
    ask_date_time: new Date().toDateString(),
    views: 0,
    comments: [comment2._id],
    upvotes: [user2._id],
    downvotes: []
  };
  
  const mockQuestions = [question1, question2];
  const mockTagList= [tag1, tag2];

describe('POST /addCommentToAnswer', () => {

    beforeEach(() => {
        server = require("../server");
    })
    afterEach(async() => {
        server.close();
        await mongoose.disconnect()
    });

    it('should add comment to answer when everthing is correct', async () => {
        // Mocking Tag.find() and Question.find()
        
        query={
            aid: answer1._id,
            comment: comment1.text
        }

        User.findOne.mockResolvedValueOnce(user1);
        Comment.create.mockResolvedValueOnce(comment1);
        Answer.findOneAndUpdate.mockReturnValueOnce(answer1);
        
        // Making the request
        const response = await supertest(server)
        .post('/comment/addCommentToAnswer')
        .set('Cookie', `token=${token}`)
        .send(query);

        // Asserting the response
        //expect(response.error).toBe(200);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(comment1);
        
        expect(Comment.create).toHaveBeenCalled();
        expect(Answer.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: answer1._id }, 
            { $push: { comments: { $each: [comment1._id]} } }, 
            { new: true } 
       );
  });

  it('should display error when user is  guest', async () => {
    // Mocking Tag.find() and Question.find()
    
    query={
        aid: answer1._id,
        comment: comment1.text
    }

    User.findOne.mockResolvedValueOnce(user3);
    // Comment.create.mockResolvedValueOnce(comment1);
    // Answer.findOneAndUpdate.mockReturnValueOnce(answer1);
    
    // Making the request
    const response = await supertest(server)
    .post('/comment/addCommentToAnswer')
    .set('Cookie', `token=${token}`)
    .send(query);

    // Asserting the response
    //expect(response.error).toBe(200);
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized: Guest user is not allowed to perfom this action' });
    
//     expect(Comment.create).toHaveBeenCalled();
//     expect(Answer.findOneAndUpdate).toHaveBeenCalledWith(
//         { _id: answer1._id }, 
//         { $push: { comments: { $each: [comment1._id]} } }, 
//         { new: true } 
//    );
});

it('should throw error when user not found', async () => {
    // Mocking Tag.find() and Question.find()
    
    query={
        aid: answer1._id,
        comment: comment1.text
    }

    User.findOne.mockResolvedValueOnce(() => {
        throw new Error("Internal server error");
      });
    // Comment.create.mockResolvedValueOnce(comment1);
    // Answer.findOneAndUpdate.mockReturnValueOnce(answer1);
    
    // Making the request
    const response = await supertest(server)
    .post('/comment/addCommentToAnswer')
    .set('Cookie', `token=${token}`)
    .send(query);

    // Asserting the response
    //expect(response.error).toBe(200);
    expect(response.status).toBe(500);
    expect(response.body).toEqual({"error": "Cannot read properties of undefined (reading '_id')" , "message": "Error adding answer"});

});


});








describe('POST /addCommentToQuestion', () => {

    beforeEach(() => {
        server = require("../server");
    })
    afterEach(async() => {
        server.close();
        await mongoose.disconnect()
    });

    it('should add comment to Question when everthing is correct', async () => {
        // Mocking Tag.find() and Question.find()
        
        query={
            qid: question1._id,
            comment: comment1.text
        }

        User.findOne.mockResolvedValueOnce(user1);
        Comment.create.mockResolvedValueOnce(comment1);
        Question.findOneAndUpdate.mockReturnValueOnce(question1);
        
        // Making the request
        const response = await supertest(server)
        .post('/comment/addCommentToQuestion')
        .set('Cookie', `token=${token}`)
        .send(query);

        // Asserting the response
        //expect(response.error).toBe(200);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(comment1);
        
        expect(Comment.create).toHaveBeenCalled();
        expect(Question.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: question1._id }, 
            { $push: { comments: { $each: [comment1._id]} } }, 
            { new: true } 
       );
  });

  it('should display error when user is  guest', async () => {
    // Mocking Tag.find() and Question.find()
    
    query={
        aid: question1._id,
        comment: comment1.text
    }

    User.findOne.mockResolvedValueOnce(user3);
    // Comment.create.mockResolvedValueOnce(comment1);
    // Answer.findOneAndUpdate.mockReturnValueOnce(answer1);
    
    // Making the request
    const response = await supertest(server)
    .post('/comment/addCommentToQuestion')
    .set('Cookie', `token=${token}`)
    .send(query);

    // Asserting the response
    //expect(response.error).toBe(200);
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized: Guest user is not allowed to perfom this action' });
    
//     expect(Comment.create).toHaveBeenCalled();
//     expect(Answer.findOneAndUpdate).toHaveBeenCalledWith(
//         { _id: answer1._id }, 
//         { $push: { comments: { $each: [comment1._id]} } }, 
//         { new: true } 
//    );
});

it('should throw error when user not found', async () => {
    // Mocking Tag.find() and Question.find()
    
    query={
        aid: question1._id,
        comment: comment1.text
    }

    User.findOne.mockResolvedValueOnce(() => {
        throw new Error("Internal server error");
      });
    // Comment.create.mockResolvedValueOnce(comment1);
    // Answer.findOneAndUpdate.mockReturnValueOnce(answer1);
    
    // Making the request
    const response = await supertest(server)
    .post('/comment/addCommentToQuestion')
    .set('Cookie', `token=${token}`)
    .send(query);

    // Asserting the response
    //expect(response.error).toBe(200);
    expect(response.status).toBe(500);
    expect(response.body).toEqual({"error": "Cannot read properties of undefined (reading '_id')" , "message": "Error adding answer"});


});


});




describe('GET /downvoteComment', () => {
    beforeEach(() => {
      server = require("../server");
    });
  
    afterEach(async() => {
      if(server){
        server.close();
      }
      await mongoose.disconnect();
    });
  
    it('should downvote a downvoteComment', async () => {
  
      // Mock request query parameters
      User.findOne.mockResolvedValueOnce(user1);
      Comment.findById.mockResolvedValueOnce(comment1);
      const updatedc = {... comment1, upvotes: [user2._id]}
      Comment.findByIdAndUpdate.mockResolvedValueOnce(updatedc);
  
      
      
      // Making the request
      const response = await supertest(server)
        .post(`/comment/downvoteComment/${comment1._id}`)
        .set('Cookie', `token=${token}`); 
  
      // Asserting the response
      expect(response.status).toBe(200);
      expect(Comment.findById).toHaveBeenCalled();
      expect(Comment.findByIdAndUpdate).toHaveBeenCalledWith(
        comment1._id,
        { $push: { downvotes: user1._id } },
        { new: true }
    
      );
    });
  
  
    it('no comment should return error', async () => {
      // Mock request query parameters
      User.findOne.mockResolvedValueOnce(user1);
      Comment.findById.mockResolvedValueOnce(undefined);
  
      
      // Making the request
      const response = await supertest(server)
        .post(`/comment/downvoteComment/${comment1._id}`)
        .set('Cookie', `token=${token}`); 
  
      // Asserting the response
      expect(response.body).toEqual({ error: 'Comment not found' });
      expect(response.status).toBe(404);
      
    });
  
    it('guest should not upvote a question', async () => {
  
      // Mock request query parameters
      User.findOne.mockResolvedValueOnce(user3);    
      // Making the request
      const response = await supertest(server)
      .post(`/comment/downvoteComment/${comment1._id}`)
      .set('Cookie', `token=${token}`); 

      // Asserting the response
      expect(response.body).toEqual({ error: 'Unauthorized: Login to perform this action' });
      expect(response.status).toBe(401);
      
    });
  
  });
  

  

describe('GET /upvoteComment', () => {
    beforeEach(() => {
      server = require("../server");
    });
  
    afterEach(async() => {
      if(server){
        server.close();
      }
      await mongoose.disconnect();
    });

    it('should  upvote  Comment', async () => {
  
        // Mock request query parameters
        User.findOne.mockResolvedValueOnce(user4);
        Comment.findById.mockResolvedValueOnce(comment1);
        const updatedc = {... comment2, upvotes: []}
        Comment.findByIdAndUpdate.mockResolvedValueOnce(updatedc);
    
        
        
        // Making the request
        const response = await supertest(server)
          .post(`/comment/upvoteComment/${comment2._id}`)
          .set('Cookie', `token=${token}`); 
    
        // Asserting the response
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(updatedc);
        expect(Comment.findById).toHaveBeenCalled();
      });
    
  
    it('should not upvote already upvoted  Comment', async () => {
  
      // Mock request query parameters
      User.findOne.mockResolvedValueOnce(user1);
      Comment.findById.mockResolvedValueOnce(comment1);
      const updatedc = {... comment1, upvotes: [user2._id]}
      Comment.findByIdAndUpdate.mockResolvedValueOnce(updatedc);
  
      
      
      // Making the request
      const response = await supertest(server)
        .post(`/comment/upvoteComment/${comment1._id}`)
        .set('Cookie', `token=${token}`); 
  
      // Asserting the response
      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({"error": "Bad request: User has already upvoted this comment"});
      expect(Comment.findById).toHaveBeenCalled();
      expect(Comment.findByIdAndUpdate).toHaveBeenCalledWith(
        comment1._id,
        { $push: { downvotes: user1._id } },
        { new: true }
    
      );
    });
  
  
    it('no comment should return error', async () => {
      // Mock request query parameters
      User.findOne.mockResolvedValueOnce(user1);
      Comment.findById.mockResolvedValueOnce(undefined);
  
      
      // Making the request
      const response = await supertest(server)
        .post(`/comment/upvoteComment/${comment1._id}`)
        .set('Cookie', `token=${token}`); 
  
      // Asserting the response
      expect(response.body).toEqual({ error: 'Comment not found' });
      expect(response.status).toBe(404);
      
    });
  
    it('guest should not upvote a question', async () => {
  
      // Mock request query parameters
      User.findOne.mockResolvedValueOnce(user3);    
      // Making the request
      const response = await supertest(server)
      .post(`/comment/upvoteComment/${comment1._id}`)
      .set('Cookie', `token=${token}`); 

      // Asserting the response
      expect(response.body).toEqual({ error: 'Unauthorized: Login to perform this action' });
      expect(response.status).toBe(401);
      
    });
  
  });
  


  describe('DELETE /comment/deleteComment/:cid', () => {

    beforeEach(() => {
        server = require("../server");
    });

    afterEach(async() => {
        server.close();
        await mongoose.disconnect();
    });

    it('should delete comment when user has permission', async () => {
        // Mock user, comment, and request
        const user = { _id: 'user_id', type: 3 }; // Assuming user is an admin
        const comment = { _id: 'comment_id', comment_by: 'user_id' }; // Assuming comment belongs to user
        const req = { 
            user: user, 
            params: { cid: 'comment_id' } 
        };

        User.findOne.mockResolvedValueOnce(user); 

        Comment.findById.mockResolvedValueOnce(comment);
        Comment.findByIdAndDelete.mockResolvedValueOnce(comment);

        // Making the request
        const response = await supertest(server)
            .delete(`/comment/deleteComment/${req.params.cid}`)
            .set('Cookie', `token=${token}`)
            .send();

        // Asserting the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Comment deleted successfully' });
        expect(Comment.findByIdAndDelete).toHaveBeenCalledWith(req.params.cid);
    });

    it('should return error when comment is not found', async () => {
        // Mock user and request
        const user = { _id: 'user_id', type: 3 }; // Assuming user is an admin
        const req = { 
            user: user, 
            params: { cid: 'comment_id' } 
        };

        User.findOne.mockResolvedValueOnce(user);
        Comment.findById.mockResolvedValueOnce(null); // Comment not found

        // Making the request
        const response = await supertest(server)
            .delete(`/comment/deleteComment/${req.params.cid}`)
            .set('Cookie', `token=${token}`)
            .send();

        // Asserting the response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Comment not found' });
    });

    it('should return error when user does not have permission', async () => {
        // Mock user, comment, and request
        const user = { _id: 'user_id', type: 2 }; // Assuming user is not an admin
        const comment = { _id: 'comment_id', comment_by: 'other_user_id' }; // Assuming comment belongs to another user
        const req = { 
            user: user, 
            params: { cid: 'comment_id' } 
        };

        User.findOne.mockResolvedValueOnce(user);
        Comment.findById.mockResolvedValueOnce(comment);

        // Making the request
        const response = await supertest(server)
            .delete(`/comment/deleteComment/${req.params.cid}`)
            .set('Cookie', `token=${token}`)
            .send();

        // Asserting the response
        expect(response.status).toBe(403);
        expect(response.body).toEqual({ error: 'Forbidden: You are not authorized to delete this comment' });
    });

    it('should handle internal server error', async () => {
        // Mock user and request
        const user = { _id: 'user_id', type: 3 }; // Assuming user is an admin
        const req = { 
            user: user, 
            params: { cid: 'comment_id' } 
        };

        User.findOne.mockResolvedValueOnce(user);
        Comment.findById.mockRejectedValueOnce(new Error('Internal server error'));

        // Making the request
        const response = await supertest(server)
            .delete(`/comment/deleteComment/${req.params.cid}`)
            .set('Cookie', `token=${token}`)
            .send();

        // Asserting the response
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Internal server error' });
    });

});
