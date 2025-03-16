import React, { useEffect, useState } from "react";
import { Button, Box, Modal, Typography } from "@mui/material";
import { getMetaData } from "../../../tool";
import Answer from "./answer";
import AnswerHeader from "./header";
import QuestionBody from "./questionBody";
import { getQuestionById } from "../../../services/questionService";

const AnswerPage = ({ qid, handleNewQuestion, handleNewAnswer, handleDeleteSuccess, userType }) => {
    const [question, setQuestion] = useState({});
    const [questionComments, setQuestionComments] = useState([]);
    const [voteCount, setVoteCount] = useState(0);
    const [modalOpen, setModalOpen] = useState(false); // State for modal

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getQuestionById(qid);
                setQuestion(res || {});
                setQuestionComments(res.comments || []);
                if (res.upvotes && res.downvotes) {
                    setVoteCount(res.upvotes.length - res.downvotes.length);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [qid]);

    const handleAnswerQuestion = () => {
        if (userType === 1) {
            // If userType is 1 (guest user), open the modal
            setModalOpen(true);
        } else {
            // Otherwise, proceed with answering the question
            handleNewAnswer();
        }
    };

    return (
        <Box sx={{ 
            backgroundImage: 'linear-gradient(to bottom, #0d47a1, #e3f2fd)', 
            minHeight: '100vh', 
            padding: '20px', 
        }}>
            <Box sx={{ 
                bgcolor: '#e3f2fd', 
                padding: '20px', 
                borderRadius: '5px', 
            }}>
                <AnswerHeader
                    ansCount={question.answers ? question.answers.length : 0}
                    title={question.title}
                    handleNewQuestion={handleNewQuestion}
                    showAskQuestionButton={false}
                />
                <QuestionBody
                    views={question.views}
                    text={question.text}
                    askby={question.asked_by ? question.asked_by.name : ""}
                    meta={getMetaData(new Date(question.ask_date_time))}
                    voteCount={voteCount}
                    setVoteCount={setVoteCount}
                    comments={questionComments}
                    setQuestionComments={setQuestionComments}
                    qid={qid}
                    handleDeleteSuccess={handleDeleteSuccess}
                />
            </Box>

            {question.answers && question.answers.map((a, idx) => (
                <Box key={idx} sx={{ 
                    bgcolor: '#e3f2fd', 
                    padding: '20px', 
                    borderRadius: '5px',
                    marginTop: '20px',
                }}>
                    <Answer
                        text={a.text}
                        ansBy={a.ans_by.name}
                        meta={getMetaData(new Date(a.ans_date_time))}
                        comments={a.comments}
                        aid={a._id}
                        handleDeleteSuccess={handleDeleteSuccess}
                    />
                </Box>
            ))}
            
            <Button variant="contained" color="primary" sx={{ marginTop: '20px' }} onClick={handleAnswerQuestion}>
                Answer Question
            </Button>

            {/* Modal for guest user message */}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="answer-question-modal-title"
                aria-describedby="answer-question-modal-description"
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
                    <Typography id="answer-question-modal-title" variant="h6" component="h2" gutterBottom>
                        Login to post answers
                    </Typography>
                    <Typography id="answer-question-modal-title" variant="body1">
                        Guest users cannot answer a question. 
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <Button onClick={() => setModalOpen(false)} color="primary" variant="contained">
                            Close
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default AnswerPage;
