const express = require("express");
const Question = require("../models/questions");
const Answer = require("../models/answers");
const User = require("../models/users");
const { addTag, getQuestionsByOrder, filterQuestionsBySearch } = require('../utils/question');

const Comment = require("../models/comments");
const router = express.Router();
const {getUserFromToken} = require('../middleware/getUserFromToken')

router.use(getUserFromToken);

const getQuestionsByFilter = async (req, res) => {
    try {
        // Validating if 'order' query parameter is provided
        if (!req.query.order) {
            req.query.order = 'newest';
        }
        
        // Validating if 'search' query parameter is provided
        if (!req.query.search) {
            req.query.search = '';
        }

        const qlist = await getQuestionsByOrder(req.query.order);
        const response = await filterQuestionsBySearch(qlist, req.query.search);
        res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};


const getQuestionById = async (req, res) => {
    const qid = req.params.qid; 
    
    try {

        if (!qid) {
            throw new Error('qid must be provided');
        }
        
        const question = await Question.findOneAndUpdate(
            { _id: qid },
            { $inc: { views: 1 } },
            { new: true }
        ).populate({ 
            path: 'asked_by', 
            model: User 
        }).populate({ 
            path: 'answers', 
            model: Answer,
            populate: {
                path: 'ans_by',
                model: User
            }
        }).populate({ 
            path: 'comments', 
            model: Comment,
            populate: {
                path: 'comment_by',
                model: User
            }
        });
        // Increment the impressions count of all users who posted answers
        await Promise.all(question.answers.map(async ans => {
            await User.findByIdAndUpdate(
                ans.ans_by,
                { $inc: { impressions: 1 } }
            );
        }));

        // Increment the impressions count of the asked_by user
        await User.findByIdAndUpdate(
            question.asked_by,
            { $inc: { impressions: 1 } }
        );

        res.json(question);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.toString() });
    }
};


const addQuestion = async (req, res) => {
    try {
        const user = req.user;

        if(user.type === 1){
            return res.status(401).json({ error: 'Unauthorized: Guest account login to perform this action' });
        }
        // Check if request body contains necessary parameters
        if (!req.body || !req.body.tags) {
            return res.status(400).json({ error: 'Bad request: Missing question parameters' });
        }
        // Extract question parameters
        const questionParams = req.body;

        const { title, text, tags } = questionParams;

        if (typeof title !== 'string' || typeof text !== 'string' || !Array.isArray(tags)) {
            return res.status(400).json({ error: 'Bad request: Invalid question parameters' });
        }

        // Validate tags and add them if they don't exist
        // Validate tags and add them if they don't exist
        questionParams.tags  = [...new Set(questionParams.tags)];
        const tagIds = [];
        for (const tname of questionParams.tags) {
            const tagId = await addTag(tname);
                tagIds.push(tagId);
        }

        
        questionParams.tags = Array.from(tagIds);


        // Assign user who asked the question
        questionParams.asked_by = user;
        questionParams.comments = [];
        questionParams.downvotes = [];
        questionParams.upvotes = [user];

        // Create question
        const newQ = await Question.create(questionParams);
        
        // Return the newly created question
        res.status(200).json(newQ);
    } catch (error) {
        console.error('Error adding question:', error);
        // Handle different types of errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Bad request: Invalid question parameters' });
        } else {
            return res.status(500).json(error.toString());
        }
    }
};

const upvoteQuestion = async (req, res) => {
    try {
        const user = req.user;
        if (user.type === 1) {
            return res.status(401).json({ error: 'Unauthorized: Login to perform this action' });
        }

        const qid = req.params.qid;

        const question = await Question.findById(qid);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        // Check if the user has already upvoted the question
        const hasUpvoted = question.upvotes.includes(user._id);
        if (hasUpvoted) {
            return res.status(400).json({ error: 'Bad request: User has already upvoted this question' });
        }

        // Check if the user has previously downvoted the question
        if (question.downvotes.includes(user._id)) {
            await Question.findByIdAndUpdate(
                qid,
                { $pull: { downvotes: user._id } }
            );
        }

        // Update the question document to push the user's ID into the upvotes array
        const updatedQuestion = await Question.findByIdAndUpdate(
            qid,
            { $push: { upvotes: user._id } },
            { new: true }
        );

        // Return the updated question
        res.status(200).json(updatedQuestion);
    } catch (error) {
        console.error('Error upvoting:', error);
        // Handle different types of errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Bad request: Invalid question parameters' });
        } else {
            return res.status(500).json(error.toString());
        }
    }
};



const downvoteQuestion = async (req, res) => {
    try {
        const user = req.user;

        if (user.type === 1) {
            return res.status(401).json({ error: 'Unauthorized: Login to perform this action' });
        }

        const qid = req.params.qid;
        const question = await Question.findById(qid);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        // Check if the user has already downvoted the question
        const hasDownvoted = question.downvotes.includes(user._id);
        if (hasDownvoted) {
            return res.status(400).json({ error: 'Bad request: User has already downvoted this question' });
        }

        // Check if the user has previously upvoted the question
        if (question.upvotes.includes(user._id)) {
            await Question.findByIdAndUpdate(
                qid,
                { $pull: { upvotes: user._id } }
            );
        }

        // Update the question document to push the user's ID into the downvotes array
        const updatedQuestion = await Question.findByIdAndUpdate(
            qid,
            { $push: { downvotes: user._id } },
            { new: true }
        );

        // Return the updated question
        res.status(200).json(updatedQuestion);
    } catch (error) {
        console.error('Error downvoting:', error);
        // Handle different types of errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Bad request: Invalid question parameters' });
        } else {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};

const deleteQuestion = async (req, res) => {
   
    try {
        const user = req.user;

        const qid = req.params.qid;

        const question = await Question.findById(qid);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        // Check if the user has permission to delete the question
        if (user.type !== 3 && String(question.asked_by) !== String(user._id)) {
            return res.status(403).json({ error: 'Forbidden: You are not authorized to delete this question' });
        }

        // Perform the deletion
        await Question.findByIdAndDelete(qid);

        // Return success message
        return res.status(200).json(true);
        //return res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error deleting question:', error);
        // Handle different types of errors
        return res.status(500).json({ error: 'Internal server error' });
    }
};


router.get("/getQuestion", getQuestionsByFilter); //roue
router.get("/getQuestionById/:qid", getQuestionById); //roue
router.get("/upvoteQuestion/:qid", upvoteQuestion);//roue
router.get("/downvoteQuestion/:qid", downvoteQuestion);//roue
router.post("/addQuestion", addQuestion);//roue
router.delete("/deleteQuestion/:qid", deleteQuestion);//roue

module.exports = router;
