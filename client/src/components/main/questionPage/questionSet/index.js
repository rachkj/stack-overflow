import Question from '../question';
import Box from '@mui/material/Box';


const QuestionSet= ({
    qlist,
    clickTag,
    handleAnswer,
}) => {
    return (
       
            <Box id="question_list" className="question_list">
                {qlist.map((q, idx) => (
                    <Question
                        q={q}
                        key={idx}
                        clickTag={clickTag}
                        handleAnswer={handleAnswer}
                        comments={q.comments ? q.comments.length : 0}
                        views={q.views}
                    />
                ))}
            </Box>
    );
};

export default QuestionSet;
