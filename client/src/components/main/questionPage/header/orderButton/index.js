import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const OrderButton = ({ message, setQuestionOrder }) => {
    return (
        <Box sx={{ border: '1px solid #ccc', borderRadius: '5px', display: 'inline-block', marginLeft: '15px', marginBottom: '15px' }}> {/* Adjusted marginBottom */}
            <Button
                variant="text"
                className="btn"
                onClick={() => {
                    setQuestionOrder(message);
                }}
                sx={{ color: 'white' }} 
            >
                {message}
            </Button>
        </Box>
    );
};

export default OrderButton;
