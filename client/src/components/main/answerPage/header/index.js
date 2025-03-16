import React from 'react';
import { Typography, Button, Box } from '@mui/material';

const AnswerHeader = ({ ansCount, title, handleNewQuestion, showAskQuestionButton }) => {
    return (
        <Box
            id="answersHeader"
            className="space_between right_padding"
            display="flex"
            flexDirection="column" // Change to column direction
            alignItems="flex-start" // Align items to the start
            pr={2}
            mb={2}
        >

                <Typography variant="body1" className="bold_title">
                    {ansCount} answers
                </Typography>
                <Typography variant="h5" className="bold_title answer_question_title"  mb={1}>
                    {title}
                </Typography>
            
            {showAskQuestionButton && (
                <Button variant="contained" color="primary" onClick={handleNewQuestion}>
                    Ask a Question
                </Button>
            )}
        </Box>
    );
};

export default AnswerHeader;
