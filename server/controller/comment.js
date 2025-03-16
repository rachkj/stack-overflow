const express = require("express");
const Answer = require("../models/answers");
const Comment = require("../models/comments");
const Question = require("../models/questions");
const router = express.Router();
const {getUserFromToken} = require('../middleware/getUserFromToken')
router.use(getUserFromToken);

// Adding answer
const addCommentToAnswer = async (req, res) => {
    try {
        const user = req.user;
        if(user.type === 1){
            return res.status(401).json({ error: 'Unauthorized: Guest user is not allowed to perfom this action' });
        }else{
            const { aid, comment } = req.body;

            comment.comment_by = user;
            comment.comment_time = new Date();
            comment.upvotes = [user];
            comment.downvotes = [];
    
            const c = await Comment.create(comment);
    
            await Answer.findOneAndUpdate(
                { _id: aid }, 
                { $push: { comments: { $each: [c._id]} } }, 
                { new: true } 
            );
            res.status(200).json(c);
        }
    } catch (error) {
        console.error("Error adding answer:", error);
        res.status(500).json({ message: "Error adding answer", error: error.message });
    }
};


// Adding answer
const addCommentToQuestion = async (req, res) => {
    try {
        const user = req.user;
        if(user.type === 1){
            return res.status(401).json({ error: 'Unauthorized: Guest user is not allowed to perfom this action' });
        }else{
            const { qid, comment } = req.body;

            comment.comment_by = user;
            comment.comment_time = new Date();
    
            const c = await Comment.create(comment);
    
            await Question.findOneAndUpdate(
                { _id: qid }, 
                { $push: { comments: { $each: [c._id]} } }, 
                { new: true } 
            );
            res.status(200).json(c);
        }
    } catch (error) {
        console.error("Error adding answer:", error);
        res.status(500).json({ message: "Error adding answer", error: error.message });
    }
};


const upVoteComment = async (req, res) => {
    try {
        const user = req.user;

        if (user.type === 1) {
            return res.status(401).json({ error: 'Unauthorized: Login to perform this action' });
        }

        const cid = req.params.cid;
        
        const comment = await Comment.findById(cid);
        
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Check if the user has already upvoted the question
        const hasUpvoted = comment.upvotes.includes(user._id);
        if (hasUpvoted) {
            return res.status(400).json({ error: 'Bad request: User has already upvoted this comment' });
        }

        // Check if the user has previously downvoted the question
        if (comment.downvotes.includes(user._id)) {
            await Comment.findByIdAndUpdate(
                cid,
                { $pull: { downvotes: user._id } }
            );
        }

        // Update the comment document to push the user's ID into the upvotes array
        const updatedComment = await Comment.findByIdAndUpdate(
            cid,
            { $push: { upvotes: user._id } },
            { new: true }
        );

        // Return the updated question
        res.status(200).json(updatedComment);
    } catch (error) {
        console.error('Error upvoting:', error);
        // Handle different types of errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Bad request: Invalid comment parameters' });
        } else {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};


const downvoteComment = async (req, res) => {
    try {
        const user = req.user;

        if (user.type === 1) {
            return res.status(401).json({ error: 'Unauthorized: Login to perform this action' });
        }

        const cid = req.params.cid;

        // Validate qid
        // if (!mongoose.Types.ObjectId.isValid(qid)) {
        //     return res.status(400).json({ error: 'Bad request: Invalid question ID' });
        // }

        // Check if the question exists
        const comment = await Comment.findById(cid);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Check if the user has already downvoted the question
        const hasDownvoted = comment.downvotes.includes(user._id);
        if (hasDownvoted) {
            return res.status(400).json({ error: 'Bad request: User has already downvoted this comment' });
        }

        // Check if the user has previously upvoted the question
        if (comment.upvotes.includes(user._id)) {
            await Comment.findByIdAndUpdate(
                cid,
                { $pull: { upvotes: user._id } }
            );
        }

        // Update the question document to push the user's ID into the downvotes array
        const updatedComment = await Comment.findByIdAndUpdate(
            cid,
            { $push: { downvotes: user._id } },
            { new: true }
        );

        // Return the updated question
        res.status(200).json(updatedComment);
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

const deleteComment = async (req, res) => {
    try {
        const user = req.user;
        const cid = req.params.cid;
        const comment = await Comment.findById(cid);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Check if the user has permission to delete the comment
        if (user.type !== 3 && String(comment.comment_by) !== String(user._id)) {
            return res.status(403).json({ error: 'Forbidden: You are not authorized to delete this comment' });
        }

        // Perform the deletion
        await Comment.findByIdAndDelete(cid);

        // Return success message
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        // Handle different types of errors
        return res.status(500).json({ error: 'Internal server error' });
    }
};




router.post("/addCommentToAnswer", addCommentToAnswer);
router.post("/addCommentToQuestion", addCommentToQuestion);
router.post("/upVoteComment/:cid", upVoteComment);
router.post("/downvoteComment/:cid", downvoteComment);
router.delete("/deleteComment/:cid", deleteComment);

module.exports = router;
