import React, { useState } from "react";
import { Typography, Box, IconButton } from "@mui/material";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import { downvoteComment, upVoteComment } from "../../../../services/commentService";

const Comments = ({ comment }) => {
    const [voteCount, setVoteCount] = useState(comment.upvotes - comment.downvotes || 0);
    const [upvoteSuccess, setUpvoteSuccess] = useState(false);
    const [downvoteSuccess, setDownvoteSuccess] = useState(false);
    const cid = comment._id;
    
    const handleUpvote = async () => {
        try {
            const res = await upVoteComment(cid);
            console.log("Upvote response:", res);
            if (res && res.upvotes && res.downvotes) {
                const vote = res.upvotes.length - res.downvotes.length;
                setVoteCount(vote);
                setUpvoteSuccess(true);
                setDownvoteSuccess(false);
                console.log("Upvoted!");
            } else {
                console.error("Invalid response received while upvoting");
            }
        } catch (error) {
            console.error("Error upvoting comment:", error);
        }
    };

    const handleDownvote = async () => {
        try {

            const res = await downvoteComment(comment._id);
            console.log("Downvote response:", res);
            if (res && res.upvotes && res.downvotes) {
                const vote = res.upvotes.length - res.downvotes.length;
                setUpvoteSuccess(false);
                setDownvoteSuccess(true);
                setVoteCount(vote);
                console.log("Downvoted!");
            } else {
                console.error("Invalid response received while downvoting");
            }
        } catch (error) {
            console.error("Error downvoting comment:", error);
        }
    };

    // Render the comment
    return (
        <Box mt={2}>
            {comment ? (
                <>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        {comment.text} <span style={{ color: 'blue' }}> - {comment.comment_by.name}</span> <span style={{ color: 'gray' }}> {comment.comment_time}</span><br />
                        Votes: {voteCount}
                    </Typography>
                    <IconButton id="upvoteButtonComment" size="small" onClick={handleUpvote} sx={{ color: upvoteSuccess ? "primary" : "inherit" }}>
                    <ThumbUp />
                </IconButton>
                <IconButton id="downvoteButtonComment" size="small" onClick={handleDownvote} sx={{ color: downvoteSuccess ? "primary" : "inherit" }}>
                    <ThumbDown />
                </IconButton>
                </>
            ) : (
                <Typography variant="body1" sx={{ mb: 1 }}>
                    No comments available
                </Typography>
            )}
        </Box>
    );
};

export default Comments;
