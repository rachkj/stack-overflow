import React, { useState } from 'react';
import { Typography, Button, Box, Modal } from '@mui/material';
import OrderButton from './orderButton';

const QuestionHeader = ({ title_text, qcnt, setQuestionOrder, handleNewQuestion, userType }) => {
    const [modalOpen, setModalOpen] = useState(false);

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleAskQuestion = () => {
        if (userType === 1) {
            // If userType is 1 (guest user), open the modal
            setModalOpen(true);
        } else {
            // Otherwise, proceed with asking the question
            handleNewQuestion();
        }
    };

    return (
        <div>
            <Box display="flex" justifyContent="space-between" alignItems="center" pr={4} mt={4}>
                <Typography variant="h5" className="bold_title" sx={{ color: 'white' }}>
                    {title_text}
                </Typography>
                <Button variant="contained" color="primary" onClick={handleAskQuestion} sx={{ color: 'white' }}>
                    Ask a Question
                </Button>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" pr={4} mt={2}>
                <Typography variant="body1" id="question_count" sx={{ color: 'white' }}>
                    {qcnt} questions
                </Typography>
                <div className="btns">
                    {['Newest', 'Active', 'Unanswered'].map((m, idx) => (
                        <OrderButton key={idx} message={m} setQuestionOrder={setQuestionOrder} sx={{ color: 'white' }} />
                    ))}
                </div>
            </Box>

            {/* Modal for guest user message */}
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="ask-question-modal-title"
                aria-describedby="ask-question-modal-description"
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
                        Login to post a question
                    </Typography>
                    <Typography id="ask-question-modal-title" variant="body1">
                        Guest users cannot post a question.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <Button onClick={handleCloseModal} color="primary" variant="contained">
                            Close
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default QuestionHeader;
