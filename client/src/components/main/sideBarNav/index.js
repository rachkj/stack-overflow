import React from 'react';
import { Button, Box } from '@mui/material';

const SideBarNav = ({ selected = "", handleQuestions, handleTags, handleUserSearch  }) => {
    return (
        <Box
            id="sideBarNav"
            className="sideBarNav"
            display="flex"
            flexDirection="column"
            alignItems="center"
            p={1}
            sx={{ 
                backgroundImage: 'linear-gradient(to bottom, #0d47a1, #e3f2fd)', 
                width: 200, 
            }}
        >
            <Button
                id="menu_question"
                className={`menu_button ${
                    selected === "q" ? "menu_selected" : ""
                }`}
                onClick={handleQuestions}
                variant="text"
                fullWidth
                sx={{ marginBottom: '10px', color: 'white' }} 
            >
                Questions
            </Button>
            
            <Button
                id="menu_tag"
                className={`menu_button ${
                    selected === "t" ? "menu_selected" : ""
                }`}
                onClick={handleTags}
                variant="text"
                fullWidth
                sx={{ marginBottom: '10px', color: 'white' }} 

            >
                Tags
            </Button>

            <Button
                id="user_search"
                className={`menu_button ${
                    selected === "t" ? "menu_selected" : ""
                }`}
                onClick={handleUserSearch}
                variant="text"
                fullWidth
                sx={{ color: 'white' }} 
            >
                Users
            </Button>
        </Box>
    );
};

export default SideBarNav;
