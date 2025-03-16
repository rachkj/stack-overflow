import { Typography, Box } from "@mui/material";

const AnswerSet = ({ text, ansBy, meta , handleAnswer, qid}) => {

    
    return (
        <Box sx={{ p: 2, border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "#e3f2fd" }}  onClick={()=>{
            handleAnswer(qid)}}>
            <Typography variant="body1" sx={{ mb: 1 }}>
                {text}
            </Typography>
            <Typography variant="body1" mb={1} color="text.secondary">
                Answered by {ansBy} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Asked {meta}
            </Typography>
        </Box>
    );
};

export default AnswerSet;
