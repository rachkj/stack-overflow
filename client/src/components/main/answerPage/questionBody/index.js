import React, { useState, useEffect } from "react";
import Comments from "../comments";
import { handleHyperlink } from "../../../../tool";
import { Typography, TextField, Button, Box, Divider, IconButton, Modal } from "@mui/material";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import { addCommentToQuestion } from "../../../../services/commentService";
import { upvoteQuestion, downvoteQuestion, getQuestionById, deleteQuestion } from "../../../../services/questionService";
import { getMyUserDetails } from "../../../../services/userService";

const QuestionBody = ({ views, text, askby, meta, voteCount, setVoteCount, comments, setQuestionComments, qid, handleDeleteSuccess}) => {
    const [showComments, setShowComments] = useState(false);
    const [commentInput, setCommentInput] = useState("");
    const [userType, setUserType] = useState(null);
    const [userName, setUserName] = useState(null);
    const [upvoteSuccess, setUpvoteSuccess] = useState(false);
    const [downvoteSuccess, setDownvoteSuccess] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    useEffect(() => {
        async function fetchUserDetails() {
            try {
                const userDetails = await getMyUserDetails();
                setUserType(userDetails.data.type);
                setUserName(userDetails.data.name);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        }

        fetchUserDetails();
    }, []);

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const commentCount = comments.length;

    const handleCommentChange = (event) => {
        setCommentInput(event.target.value);
    };

    const handleCommentSubmit = async () => {
        try {
            const comment = {
                text: commentInput,
            };

            const response = await addCommentToQuestion(qid, comment);


            const updatedQuestion = await getQuestionById(qid);
            setQuestionComments(updatedQuestion.comments);
            setShowComments(true);

            setCommentInput("");

            if (response) {
                console.log("Comment added successfully!");
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleUpvote = async () => {
        try {
            const res = await upvoteQuestion(qid);
                const vote = res.upvotes.length - res.downvotes.length;
                setVoteCount(vote);
                console.log("Upvoted!");
                setUpvoteSuccess(true);
                setDownvoteSuccess(false);
        } catch (error) {
                console.error("Error upvoting question:", error);
            }
    };
    
    const handleDownvote = async () => {
        try {
            const res = await downvoteQuestion(qid);
            const vote = res.upvotes.length - res.downvotes.length;
            setVoteCount(vote);
            console.log("Downvoted!");
            setUpvoteSuccess(false);
            setDownvoteSuccess(true);
        } catch (error) {
            console.error("Error downvoting question:", error);
        }
    };

    
    

    const handleDeleteQuestion = async () => {
        try {
            const res = await deleteQuestion(qid);

            if (res.status === 200) {

                handleDeleteSuccess(); // Call handleDeleteSuccess function
            } else {
                console.error("Error deleting question:");
            }
        } catch (error) {
            console.error("Error deleting question:", error);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setErrorMessage("");
    };

    return (
        <Box id="questionBody" className="questionBody right_padding">
            <Typography variant="body1" mb={1} color="text.secondary">
                Viewed {Math.floor(views/2)} times &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Asked by {askby} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Asked {meta} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Votes: {voteCount} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Comments: {commentCount}
            </Typography>
            <Divider />
            <div className="answer_question_text">
                <Typography variant="body1">{handleHyperlink(text)}</Typography>
            </div>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Button onClick={toggleComments} size="small">
                    {showComments ? "Hide Comments" : "Show Comments"}
                </Button>
                {(userType === 3 || askby === userName) && (
                    <Button onClick={handleDeleteQuestion} size="small" sx={{ ml: 1 }}>
                        Delete Question
                    </Button>
                )}
            </Box>
            {showComments && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" mb={1}>Comments:</Typography>
                    {comments.map((comment, index) => (
                        <Comments key={index} comment={comment} />
                    ))}
                </Box>
            )}

            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton id="upvoteButton" size="small" onClick={handleUpvote} sx={{ color: upvoteSuccess ? "primary" : "inherit" }}>
                    <ThumbUp />
                </IconButton>
                <IconButton id="downvoteButton" size="small" onClick={handleDownvote} sx={{ color: downvoteSuccess ? "primary" : "inherit" }}>
                    <ThumbDown />
                </IconButton>
                <TextField
                    id="qsCommentTextField" 
                    variant="outlined"
                    placeholder="Write a comment..."
                    value={commentInput}
                    onChange={handleCommentChange}
                    sx={{ ml: 1, flex: 1 }}
                />
                <Button
                    id="qsCommentButton" 
                    variant="contained"
                    color="primary"
                    onClick={handleCommentSubmit}
                    sx={{ ml: 1 }}
                >
                    Comment
                </Button>
            </Box>
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Error
                    </Typography>
                    <Typography id="modal-modal-description" variant="body1">
                        {errorMessage}
                    </Typography>
                    <Button onClick={handleCloseModal}>Close</Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default QuestionBody;
