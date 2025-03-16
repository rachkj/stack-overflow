const express = require("express");
const Answer = require("../models/answers");
const router = express.Router();
const Question = require("../models/questions");
const Comment = require("../models/comments");
const {getUserFromToken} = require('../middleware/getUserFromToken')
router.use(getUserFromToken);

// Adding answer
const addAnswer = async (req, res) => {
    try {
        const user = req.user;
        if(user.type === 1){
            return res.status(401).json({ error: 'Unauthorized: Guest user is not allowed to perfom this action' });
        }else{
            const { qid, ans } = req.body;
            if(!qid || !ans){
                return res.status(500).json({ message: "Error adding answer", error: "Incorrect Input"});
            } 
            ans.ans_by = user;
            ans.comments = [];
            ans.downvotes = [];
            ans.upvotes = [user];
    
            const a = await Answer.create(ans);
    
            await Question.findOneAndUpdate(
                { _id: qid }, 
                { $push: { answers: { $each: [a._id], $position: 0 } } }, 
                { new: true } 
            );
            res.status(200).json(a);
        }
    } catch (error) {
        console.error("Error adding answer:", error);
        res.status(500).json({ message: "Error adding answer", error: error.message });
    }
};


const upvoteAnswer = async (req, res) => {
    try {
        const user = req.user;
        const aid = req.params.aid;

        if (user.type === 1) {
            return res.status(401).json({ error: 'Unauthorized: Login to perform this action' });
        }

        

        const answer = await Answer.findById(aid);
        if (!answer) {
            return res.status(404).json({ error: 'Answer not found' });
        }

        // Check if the user has already upvoted the answer
        const hasUpvoted = answer.upvotes.includes(user._id);
        if (hasUpvoted) {
            return res.status(400).json({ error: 'Bad request: User has already upvoted this answer' });
        }

        // Check if the user has previously downvoted the answer
        if (answer.downvotes.includes(user._id)) {
            await Answer.findByIdAndUpdate(
                aid,
                { $pull: { downvotes: user._id } }
            );
        }

        // Update the answer document to push the user's ID into the upvotes array
        const updatedAnswer = await Answer.findByIdAndUpdate(
            aid,
            { $push: { upvotes: user._id } },
            { new: true }
        );

        // Return the updated answer
        res.status(200).json(updatedAnswer);
    } catch (error) {
        console.error('Error upvoting answer:', error);
        // Handle different types of errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Bad request: Invalid answer parameters' });
        } else {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};

const downvoteAnswer = async (req, res) => {
    try {
        const user = req.user;
        if (user.type === 1) {
            return res.status(401).json({ error: 'Unauthorized: Login to perform this action' });
        }

        const aid = req.params.aid;

        // Check if the answer exists
        const answer = await Answer.findById(aid);
        if (!answer) {
            return res.status(404).json({ error: 'Answer not found' });
        }

        // Check if the user has already downvoted the answer
        const hasDownvoted = answer.downvotes.includes(user._id);
        if (hasDownvoted) {
            return res.status(400).json({ error: 'Bad request: User has already downvoted this answer' });
        }

        // Check if the user has previously upvoted the answer
        if (answer.upvotes.includes(user._id)) {
            await Answer.findByIdAndUpdate(
                aid,
                { $pull: { upvotes: user._id } }
            );
        }

        // Update the answer document to push the user's ID into the downvotes array
        const updatedAnswer = await Answer.findByIdAndUpdate(
            aid,
            { $push: { downvotes: user._id } },
            { new: true }
        );

        // Return the updated answer
        res.status(200).json(updatedAnswer);
    } catch (error) {
        console.error('Error downvoting answer:', error);
        // Handle different types of errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Bad request: Invalid answer parameters' });
        } else {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};


const getAnswerById = async (req, res) => {
    const aid = req.params.aid; 
    try {
        const answer = await Answer.findById(aid).populate({ path: 'comments', model: Comment });
        if (!answer) {
            // If no answer is found, throw an error
            throw new Error('Answer not found');
        }
        res.status(200).json(answer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};


const deleteAnswer = async (req, res) => {
    try {
        const user = req.user;

        const aid = req.params.aid;

        // Check if the answer exists
        const answer = await Answer.findById(aid);
        if (!answer) {
            return res.status(404).json({ error: 'Answer not found' });
        }

        // Check if the user has permission to delete the answer
        if (user.type !== 3 && String(answer.ans_by) !== String(user._id)) {
            return res.status(401).json({ error: 'Forbidden: You are not authorized to delete this answer' });
        }

        // Perform the deletion
        await Answer.findByIdAndDelete(aid);

        // Return success message
        return res.status(200).json({ message: 'Answer deleted successfully' });
    } catch (error) {
        console.error('Error deleting answer:', error);
        // Handle different types of errors
        return res.status(500).json({ error: 'Internal server error' });
    }
};


// const updateAnswer = async (req, res) => {
//     try {
//         const user = req.user;
//         const aid = req.params.aid;

//         const answer = await Answer.findById(aid);
//         if (!answer) {
//             return res.status(404).json({ error: 'Answer not found' });
//         }

//         // Check if the user has permission to update the answer
//         if (String(answer.ans_by) !== String(user._id)) {
//             return res.status(403).json({ error: 'Forbidden: You are not authorized to update this answer' });
//         }

//         // Update the answer
//         const { text } = req.body;
//         answer.text = text;
//         await answer.save();

//         // Return the updated answer
//         res.status(200).json(answer);
//     } catch (error) {
//         console.error('Error updating answer:', error);
//         // Handle different types of errors
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// };

const getAllAnswersByUid = async (req, res) => {
    const userId = req.params.uid; // Assuming the user id is passed in the request parameters
    try {
        if (typeof userId !== 'string') {
            throw new Error('User ID must be a string');
        }
        const qlist = await Question.find().populate({ path: "answers", model: Answer });
        
        let answers = [];
        qlist.forEach(question => {
            question.answers.forEach(answer => {
                if (answer.ans_by.toString() === userId) {
                    //const answerObj = answer.toObject(); // Convert Mongoose document to plain JavaScript object
                    const answerObj = {
                        text: answer.text,
                        ans_by: answer.ans_by, // Replace with actual user ID if needed
                        ans_date_time: answer.ans_date_time,
                        comments: answer.comments,
                        upvotes: answer.upvotes,
                        downvotes: answer.downvotes
                    }
                    answerObj.qid = question._id;
                    answers.push(answerObj);
                    console.log(answerObj);
                }
            });
        });
        res.status(200).json(answers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.toString() });
    }
};






router.post("/addAnswer", addAnswer); // rote
router.get("/upvoteAnswer/:aid", upvoteAnswer); // rote
router.get("/downvoteAnswer/:aid", downvoteAnswer);// rote
router.get("/getAnswerById/:aid", getAnswerById); // rote
router.get("/getAllAnswersByUid/:uid", getAllAnswersByUid); // rote
router.delete("/deleteAnswer/:aid", deleteAnswer); // rote
// router.put("/updateAnswer/:aid", updateAnswer);
module.exports = router;
