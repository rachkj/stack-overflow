import React from "react";
import { Box, Button } from "@mui/material";
import { getMetaData } from "../../../../tool";
import "./index.css";

const Question = ({ q, clickTag, handleAnswer }) => {
    return (
        <Box
            className="question right_padding"
            onClick={() => {
                handleAnswer(q._id);
            }}
            sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "50px",
                borderRadius: "5px",
                boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
                marginBottom: "15px",
                backgroundColor: "#e3f2fd",
                cursor: "pointer",
            }}
        >
            <Box className="postStats">
                <div>{q.answers.length || 0} answers</div>
                <div>{Math.floor(q.views/2)} views</div>
            </Box>
            <Box className="question_mid" sx={{ flex: 1, marginLeft: "20px" }}>
                <div className="postTitle">{q.title}</div>
                <Box className="question_tags" sx={{ marginTop: "5px" }}>
                    {q.tags.map((tag, idx) => (
                        <Button
                            key={idx}
                            className="question_tag_button"
                            onClick={(e) => {
                                e.stopPropagation();
                                clickTag(tag.name);
                            }}
                            variant="contained"
                            size="small"
                            style={{ marginRight: "5px" }}
                        >
                            {tag.name}
                        </Button>
                    ))}
                </Box>
            </Box>
            <Box className="lastActivity" sx={{ textAlign: "right" }}>
                <div className="question_author">{q.asked_by.name}</div>
                <div>&nbsp;</div>
                <div className="question_meta">
                    asked {getMetaData(q.ask_date_time)}
                </div>
            </Box>
        </Box>
    );
};

export default Question;
