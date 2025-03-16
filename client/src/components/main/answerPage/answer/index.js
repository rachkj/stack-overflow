import React, { useState, useEffect } from "react";
import { Typography, Button, Divider, Box, TextField, IconButton } from "@mui/material";
import Comments from "../comments";
import { handleHyperlink } from "../../../../tool";
import { upvoteAnswer, downvoteAnswer, getAnswerById, deleteAnswer } from "../../../../services/answerService";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import { addCommentToAnswer } from "../../../../services/commentService";
import { getMyUserDetails } from "../../../../services/userService";

const Answer = ({ text, ansBy, meta, votes, comments, aid, handleDeleteSuccess}) => {
    const [showComments, setShowComments] = useState(false);
    const [commentInput, setCommentInput] = useState("");
    const [voteCount, setVoteCount] = useState(votes || 0);
    const [answerComments, setAnswerComments] = useState(comments || []);
    const [userType, setUserType] = useState(null);
    const [userName, setUserName] = useState(null);
    const [upvoteSuccess, setUpvoteSuccess] = useState(false);
    const [downvoteSuccess, setDownvoteSuccess] = useState(false);

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

        async function fetchUpdatedAnswer() {
            try {
                const updatedAnswer = await getAnswerById(aid);
                setAnswerComments(updatedAnswer.comments || []);
            } catch (error) {
                console.error("Error fetching updated answer details:", error);
            }
        }

        fetchUserDetails();
        if (commentInput === "") {
            fetchUpdatedAnswer();
        }
    }, [aid, commentInput]);

    const commentCount = answerComments ? answerComments.length : 0;

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const handleCommentChange = (event) => {
        setCommentInput(event.target.value);
    };

    const handleCommentSubmit = async () => {
        try {
            const comment = {
                text: commentInput,
            };

            const response = await addCommentToAnswer(aid, comment);
            const updatedAnswer = await getAnswerById(aid);
            setAnswerComments(updatedAnswer.comments || []);
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
            const res = await upvoteAnswer(aid);
            const vote = res.upvotes.length - res.downvotes.length;
            setVoteCount(vote);
            setUpvoteSuccess(true);
            setDownvoteSuccess(false);
            console.log("Upvoted!");
        } catch (error) {
            console.error("Error upvoting answer:", error);
        }
    };

    const handleDownvote = async () => {
        try {
            const res = await downvoteAnswer(aid);
            const vote = res.upvotes.length - res.downvotes.length;
            setVoteCount(vote);
            setUpvoteSuccess(false);
            setDownvoteSuccess(true);
            console.log("Downvoted!");
        } catch (error) {
            console.error("Error downvoting answer:", error);
        }
    };

    const handleDeleteAnswer = async () => {
        try {
            const res = await deleteAnswer(aid);
            if (res.status === 200) {
                console.log("Deleted Answer!");
                handleDeleteSuccess();
            } else {
                console.error("Error deleting answer:", res.data.message);
            }
        } catch (error) {
            console.error("Error deleting answer:", error);
        }
    };

    return (
        <Box sx={{ p: 2, border: "1px solid #ccc", borderRadius: "4px" }}>
            <Typography variant="body1" sx={{ mb: 1 }} className="answerText">
                {handleHyperlink(text)}
            </Typography>
            <Typography variant="body1" mb={1} color="text.secondary">
                Answered by {ansBy} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Asked {meta} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Votes: {voteCount} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Comments: {commentCount}
            </Typography>
            <Divider />
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Button onClick={toggleComments} size="small">
                    {showComments ? "Hide Comments" : "Show Comments"}
                </Button>
                {(userType === 3 || ansBy === userName) && (
                    <Button onClick={handleDeleteAnswer} size="small" sx={{ ml: 1 }}>
                        Delete Answer
                    </Button>
                )}
            </Box>
            {answerComments && showComments && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" mb={1}>Comments:</Typography>
                    {answerComments.map((comment) => (
                        <Comments key={comment._id} comment={comment} />
                    ))}
                </Box>
            )}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <IconButton id="upvoteButtonAnswer" size="small" onClick={handleUpvote} sx={{ color: upvoteSuccess ? "primary" : "inherit" }}>
                    <ThumbUp />
                </IconButton>
                <IconButton  id="downvoteButtonAnswer" size="small" onClick={handleDownvote} sx={{ color: downvoteSuccess ? "primary" : "inherit" }}>
                    <ThumbDown />
                </IconButton>
                <TextField
                    id="asCommentTextField" 
                    variant="outlined"
                    placeholder="Write a comment..."
                    value={commentInput}
                    onChange={handleCommentChange}
                    sx={{ ml: 1, flex: 1 }}
                />
                <Button
                    id="asCommentButton" 
                    variant="contained"
                    color="primary"
                    onClick={handleCommentSubmit}
                    sx={{ ml: 1 }}
                >
                    Comment
                </Button>
            </Box>
        </Box>
    );
};

export default Answer;
