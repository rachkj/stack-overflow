import React, { useEffect, useState } from 'react';
import { getQuestionsByFilter } from '../../../services/questionService';
import QuestionHeader from './header';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import QuestionSet from './questionSet';

const QuestionPage = ({
    title_text = 'All Questions',
    order,
    search,
    setQuestionOrder,
    clickTag,
    handleAnswer,
    handleNewQuestion,
    userType,
}) => {
    const [qlist, setQlist] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getQuestionsByFilter(order, search);
                setQlist(res || []);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [order, search]);

    return (
        <Box sx={{
            backgroundImage: 'linear-gradient(to bottom, #0d47a1, #e3f2fd)', 
            minHeight: '100vh', 
            padding: '20px', 
        }}>
            {/* Only render QuestionHeader if userType is available */}
            {userType !== null && (
                <QuestionHeader
                    title_text={title_text}
                    qcnt={qlist.length}
                    setQuestionOrder={setQuestionOrder}
                    handleNewQuestion={handleNewQuestion}
                    userType={userType}
                />
            )}

            <QuestionSet qlist={qlist} clickTag={clickTag} handleAnswer={handleAnswer} />
            {title_text === 'Search Results' && !qlist.length && (
                <Typography variant="body1" className="bold_title right_padding">
                    No Questions Found
                </Typography>
            )}
        </Box>
    );
};

export default QuestionPage;
