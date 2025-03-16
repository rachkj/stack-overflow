// Unit tests for getTagsWithQuestionNumber in controller/tags.js

const supertest = require("supertest")

const Tag = require('../models/tags');
const Question = require('../models/questions');
const User = require('../models/users');
const { default: mongoose } = require("mongoose");
const jwt = require('jsonwebtoken');
const {your_secret_key} = require('../config');
jest.mock("../models/answers");
jest.mock("../models/users");
jest.mock("../models/questions");
jest.mock("../models/tags");
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

describe('GET /getTagsWithQuestionNumber', () => {

    beforeEach(() => {
        server = require("../server");
    })
    afterEach(async() => {
        server.close();
        await mongoose.disconnect()
    });

    it('should return tags with question numbers', async () => {
        // Mocking Tag.find() and Question.find()

        const query={
            searchText:'tag1'
        }

        User.findOne.mockResolvedValueOnce(user1);

        Tag.find.mockResolvedValueOnce(mockTagList);
        Question.find = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockResolvedValueOnce(mockQuestions), // Mocking populate method
        });
        
        // Making the request
        const response = await supertest(server)
        .get('/tag/getTagsWithQuestionNumber')
        .set('Cookie', `token=${token}`)
        .query(query);

        // Asserting the response
        //expect(response.error).toBe(200);
        expect(response.body).toEqual([
            { name: 'tag1',description: 'description', questionCount: 1 },
            { name: 'tag2',description:'description', questionCount: 1 },
      
        ]);
        expect(response.status).toBe(200);
        expect(Tag.find).toHaveBeenCalled();
        expect(Question.find).toHaveBeenCalled();
  });
});

describe('GET /getTagsWithQuestionNumber', () => {

    beforeEach(() => {
        server = require("../server");
    })
    afterEach(async() => {
        server.close();
        await mongoose.disconnect()
    });

    it('admin should update description', async () => {
        // Mocking Tag.find() and Question.find()

        const input={
            tagName:'tag1',
            description:'newDescription'
        }

        User.findOne.mockResolvedValueOnce(user4);
        const updatedTag = {... tag1, description:input.description}
        Tag.findOneAndUpdate.mockResolvedValueOnce(updatedTag);
        
        
        // Making the request
        const response = await supertest(server)
        .put(`/tag/updateDescription/${input.description}`)
        .set('Cookie', `token=${token}`)
        .send(input);

        // Asserting the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Tag description updated successfully', updatedTag: updatedTag });
        expect(Tag.findOneAndUpdate).toHaveBeenCalled();
  });

  it('non admin should not update description', async () => {
    // Mocking Tag.find() and Question.find()

    const input={
        tagName:'tag1',
        description:'newDescription'
    }

    User.findOne.mockResolvedValueOnce(user2);

    
    // Making the request
    const response = await supertest(server)
    .put(`/tag/updateDescription/${input.description}`)
    .set('Cookie', `token=${token}`)
    .send(input);

    // Asserting the response
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized: Invalid token' });

});

it('parameters must be correctly provided', async () => {
    // Mocking Tag.find() and Question.find()

    const input={
        tagName:'tag1',
        description:undefined
    }

    User.findOne.mockResolvedValueOnce(user4);

    
    // Making the request
    const response = await supertest(server)
    .put(`/tag/updateDescription/${input.description}`)
    .set('Cookie', `token=${token}`)
    .send(input);

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Tag name and new description are required' });

});

it('if tag not found return error', async () => {
    // Mocking Tag.find() and Question.find()

    const input={
        tagName:'tag1',
        description:'newDescription'
    }

    User.findOne.mockResolvedValueOnce(user4);
    //const updatedTag = {... tag1, description:input.description}
    Tag.findOneAndUpdate.mockResolvedValueOnce(undefined);
    
    
    // Making the request
    const response = await supertest(server)
    .put(`/tag/updateDescription/${input.description}`)
    .set('Cookie', `token=${token}`)
    .send(input);

    // Asserting the response
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Tag not found' });
    expect(Tag.findOneAndUpdate).toHaveBeenCalled();
});


});

describe('DELETE /deleteTag', () => {

    beforeEach(() => {
        server = require("../server");
    });

    afterEach(async () => {
        server.close();
        await mongoose.disconnect();
    });

    it('admin should delete tag', async () => {
        // Mocking User.findOne() and Tag.findOneAndDelete()

        const tagName = 'tag1';
        User.findOne.mockResolvedValueOnce(user4);
        Tag.findOneAndDelete.mockResolvedValueOnce(tag1);

        // Making the request
        const response = await supertest(server)
            .delete(`/tag/deleteTag/${tagName}`)
            .set('Cookie', `token=${token}`);

        // Asserting the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Tag deleted successfully' });
        expect(Tag.findOneAndDelete).toHaveBeenCalledWith({ name: tagName });
    });

    it('non-admin should not delete tag', async () => {
        // Mocking User.findOne()

        const tagName = 'tag1';
        User.findOne.mockResolvedValueOnce(user3);

        // Making the request
        const response = await supertest(server)
            .delete(`/tag/deleteTag/${tagName}`)
            .set('Cookie', `token=${token}`);

        // Asserting the response
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: 'Unauthorized: Invalid token' });
        //expect(Tag.findOneAndDelete).toHaveBeenCalled();
    });


    it('if tag not found return error', async () => {
        // Mocking User.findOne() and Tag.findOneAndDelete()

        const tagName = 'nonExistentTag';
        User.findOne.mockResolvedValueOnce(user4);
        Tag.findOneAndDelete.mockResolvedValueOnce(undefined);

        // Making the request
        const response = await supertest(server)
            .delete(`/tag/deleteTag/${tagName}`)
            .set('Cookie', `token=${token}`);

        // Asserting the response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Tag not found' });
        expect(Tag.findOneAndDelete).toHaveBeenCalledWith({ name: tagName });
    });

});
