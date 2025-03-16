// Unit tests for addAnswer in contoller/answer.js

const supertest = require("supertest")
const { default: mongoose } = require("mongoose");

const Answer = require("../models/answers");
const Question = require("../models/questions");
const User = require("../models/users");

const Comment = require("../models/comments");
const Tag = require("../models/tags");
const jwt = require('jsonwebtoken');
const { getUserFromToken } = require("../utils/user");
const { addTag, getQuestionsByOrder, filterQuestionsBySearch } = require('../utils/question');
const {your_secret_key} = require('../config')
// Mock the Answer model
jest.mock("../models/answers");
jest.mock("../models/users");
jest.mock("../models/questions");
jest.mock("../models/tags");

describe('getUserFromToken', () => {

    it('should return user when token is valid and user exists', async () => {
        // Mock valid token and user
        const token = jwt.sign({ email: 'test@example.com' }, your_secret_key);
        const user = { email: 'test@example.com', name: 'Test User' };
        const decoded = { email: 'test@example.com' };

        const verifySpy = jest.spyOn(jwt, 'verify').mockReturnValueOnce(decoded);
        const findOneSpy = jest.spyOn(User, 'findOne').mockResolvedValueOnce(user);

        const result = await getUserFromToken(token);
        
        expect(result).toEqual(user);
        expect(verifySpy).toHaveBeenCalledWith(token, your_secret_key);
        expect(findOneSpy).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should throw error when token is invalid', async () => {
        // Mock invalid token
        const token = 'invalid_token';

        jest.spyOn(jwt, 'verify').mockImplementation(() => {
            throw new jwt.JsonWebTokenError('Invalid token');
        });

        await expect(getUserFromToken(token)).rejects.toThrow('Invalid token');
    });

    it('should throw error when token is expired', async () => {
        // Mock token expired error
        const token = jwt.sign({ email: 'test@example.com' }, your_secret_key, { expiresIn: '-1h' });

        jest.spyOn(jwt, 'verify').mockImplementation(() => {
            throw new jwt.TokenExpiredError('Token expired');
        });

        await expect(getUserFromToken(token)).rejects.toThrow('Token expired');
    });

    it('should throw error on internal server error', async () => {
        // Mock internal server error
        const token = jwt.sign({ email: 'test@example.com' }, your_secret_key);
        const decoded = { email: 'test@example.com' };

        jest.spyOn(jwt, 'verify').mockReturnValueOnce(decoded);
        jest.spyOn(User, 'findOne').mockRejectedValueOnce(new Error('Internal server error'));

        await expect(getUserFromToken(token)).rejects.toThrow('Internal server error');
    });

});


describe('addTag', () => {

    it('should create a new tag if it does not exist in the database', async () => {
        // Mock tag not found in the database
        const tname = 'new_tag';
        const newTag = { _id: 'new_tag_id', name: 'new_tag', description: 'no description' };

        Tag.findOne.mockResolvedValueOnce(null); // Tag not found in the database
        Tag.prototype.save.mockResolvedValueOnce(newTag); // Simulate saving the new tag

        const result = await addTag(tname);

        expect(result).toBe('new_tag_id'); // Expect the function to return the ID of the new tag
        expect(Tag.findOne).toHaveBeenCalledWith({ 'name': tname });
        expect(Tag.prototype.save).toHaveBeenCalled();
    });

    it('should return the ID of the existing tag if it already exists in the database', async () => {
        // Mock tag found in the database
        const tname = 'existing_tag';
        const existingTag = { _id: 'existing_tag_id', name: 'existing_tag', description: 'existing description' };

        Tag.findOne.mockResolvedValueOnce(existingTag); // Tag found in the database

        const result = await addTag(tname);

        expect(result).toBe('existing_tag_id'); // Expect the function to return the ID of the existing tag
        expect(Tag.findOne).toHaveBeenCalledWith({ 'name': tname });
        //expect(Tag.prototype.save).not.toHaveBeenCalled(); // Saving should not be called since the tag already exists
    });

    it('should throw an error if there is an error during tag creation', async () => {
        // Mock error during tag creation
        const tname = 'error_tag';
        const errorMessage = 'Error saving tag';

        Tag.findOne.mockResolvedValueOnce(null); // Tag not found in the database
        Tag.prototype.save.mockRejectedValueOnce(new Error(errorMessage)); // Simulate error during saving

        await expect(addTag(tname)).rejects.toThrow(errorMessage);
        expect(Tag.findOne).toHaveBeenCalledWith({ 'name': tname });
        expect(Tag.prototype.save).toHaveBeenCalled();
    });

});





describe('getQuestionsByOrder', () => {

    it('should fetch questions ordered by newest', async () => {
        // Mock questions data
        const questions = [
            { _id: '1', ask_date_time: new Date('2024-04-23T12:00:00Z') },
            { _id: '2', ask_date_time: new Date('2024-04-22T12:00:00Z') },
            { _id: '3', ask_date_time: new Date('2024-04-24T12:00:00Z') }
        ];

        Question.find= jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnValueOnce({
                populate: jest.fn().mockReturnValueOnce({
                    populate: jest.fn().mockResolvedValueOnce(questions)
                })
            })
        });

        const result = await getQuestionsByOrder('newest');

        expect(result).toEqual([
            { _id: '3', ask_date_time: new Date('2024-04-24T12:00:00Z') },
            { _id: '1', ask_date_time: new Date('2024-04-23T12:00:00Z') },
            { _id: '2', ask_date_time: new Date('2024-04-22T12:00:00Z') }
        ]);
    });

    it('should fetch questions ordered by active', async () => {
        // Mock questions data
        const questions = [
            { _id: '1', ask_date_time: new Date('2024-04-23T12:00:00Z'), answers: [{ ans_date_time: new Date('2024-04-25T12:00:00Z') }] },
            { _id: '2', ask_date_time: new Date('2024-04-22T12:00:00Z'), answers: [] },
            { _id: '3', ask_date_time: new Date('2024-04-24T12:00:00Z'), answers: [{ ans_date_time: new Date('2024-04-23T12:00:00Z') }] }
        ];

        Question.find= jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnValueOnce({
                populate: jest.fn().mockReturnValueOnce({
                    populate: jest.fn().mockResolvedValueOnce(questions)
                })
            })
        });

        const result = await getQuestionsByOrder('active');

        expect(result).toEqual([
            { _id: '1', ask_date_time: new Date('2024-04-23T12:00:00Z'), answers: [{ ans_date_time: new Date('2024-04-25T12:00:00Z') }] },
            { _id: '3', ask_date_time: new Date('2024-04-24T12:00:00Z'), answers: [{ ans_date_time: new Date('2024-04-23T12:00:00Z') }] },
            { _id: '2', ask_date_time: new Date('2024-04-22T12:00:00Z'), answers: [] }
        ]);
    });

    it('should fetch questions ordered by unanswered', async () => {
        // Mock questions data
        const questions = [
            { _id: '1', ask_date_time: new Date('2024-04-23T12:00:00Z'), answers: [] },
            { _id: '2', ask_date_time: new Date('2024-04-22T12:00:00Z'), answers: [{ ans_date_time: new Date('2024-04-25T12:00:00Z') }] },
            { _id: '3', ask_date_time: new Date('2024-04-24T12:00:00Z'), answers: [] }
        ];

        Question.find= jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnValueOnce({
                populate: jest.fn().mockReturnValueOnce({
                    populate: jest.fn().mockResolvedValueOnce(questions)
                })
            })
        });

        const result = await getQuestionsByOrder('unanswered');

        expect(result).toEqual([
            { _id: '3', ask_date_time: new Date('2024-04-24T12:00:00Z'), answers: [] },
            { _id: '1', ask_date_time: new Date('2024-04-23T12:00:00Z'), answers: [] },
        ]);
    });

    it('should throw an error if there is an error during fetching questions', async () => {
        // Mock error during fetching questions
        const errorMessage = 'Error fetching questions';
        Question.find= jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnValueOnce({
                populate: jest.fn().mockReturnValueOnce({
                    populate: jest.fn().mockResolvedValueOnce(()=>{
                        throw new Error('Error fetching quest');
                    })
                })
            })
        });

        await expect(getQuestionsByOrder()).rejects.toThrow(errorMessage);
    });

});


describe('filterQuestionsBySearch', () => {

    const sampleQuestions = [
        { _id: '1', title: 'Sample question 1', tags: [{name: 'tag1'},{name: 'tag2'}], asked_by: {name : 'user1'}, text:'text'  },
        { _id: '2', title: 'Sample question 2', tags: [{name: 'tag3'},{name: 'tag4'}],  asked_by: {name : 'user2'} , text:'text' },
        { _id: '3', title: 'Sample question 3', tags: [{name: 'tag1'},{name: 'tag5'}],  asked_by: {name : 'user3'}, text:'text'  }
    ];

    it('should filter questions based on search tags', () => {
        const search = '[tag1]';
        const result = filterQuestionsBySearch(sampleQuestions, search);
        expect(result).toEqual([
            { _id: '1', title: 'Sample question 1', tags: [{name: 'tag1'},{name: 'tag2'}],  asked_by: {name : 'user1'}, text:'text'  },
            { _id: '3', title: 'Sample question 3', tags: [{name: 'tag1'}, {name: 'tag5'}],  asked_by: {name : 'user3'} , text:'text' }
        ]);
    });

    it('should filter questions based on search keywords', () => {
        const search = 'Sample';
        const result = filterQuestionsBySearch(sampleQuestions, search);
        expect(result).toEqual([
            { _id: '1', title: 'Sample question 1', tags:[{name: 'tag1'},{name: 'tag2'}],  asked_by: {name : 'user1'}, text:'text'  },
            { _id: '2', title: 'Sample question 2', tags: [{name: 'tag3'},{name: 'tag4'}],  asked_by: {name : 'user2'} , text:'text' },
            { _id: '3', title: 'Sample question 3', tags:[{name: 'tag1'}, {name: 'tag5'}],  asked_by: {name : 'user3'} , text:'text' }
        ]);
    });

    it('should filter questions based on search username', () => {
        const search = '.user1.';
        const result = filterQuestionsBySearch(sampleQuestions, search);
        expect(result).toEqual([
            { _id: '1', title: 'Sample question 1', tags: [{name: 'tag1'},{name: 'tag2'}],  asked_by: {name : 'user1'}  , text:'text'}
        ]);
    });

    it('should filter questions based on a combination of tags, keywords, and username', () => {
        const search = '[tag1] .user2.';
        const result = filterQuestionsBySearch(sampleQuestions, search);
        expect(result).toEqual([
            { _id: '1', title: 'Sample question 1', tags:[{name: 'tag1'},{name: 'tag2'}],  asked_by: {name : 'user1'}, text:'text'  },
            { _id: '2', title: 'Sample question 2', tags: [{name: 'tag3'},{name: 'tag4'}],  asked_by: {name : 'user2'} , text:'text' },
            { _id: '3', title: 'Sample question 3', tags:[{name: 'tag1'}, {name: 'tag5'}],  asked_by: {name : 'user3'} , text:'text' }
        ]);
    });

    it('should return all questions when no search parameters are provided', () => {
        const search = '';
        const result = filterQuestionsBySearch(sampleQuestions, search);
        expect(result).toEqual(sampleQuestions);
    });

});
