import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, InputBase, Button, Modal, Box } from '@mui/material';
import { Search } from '@mui/icons-material';
import { logout } from '../../services/userService';

const Header = ({ showSearchBar, showLogout, showProfile, search, setQuestionPage, setPage, isGuestLoggedIn }) => {
    const [val, setVal] = useState(search);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const [loginToViewProfileModalOpen, setLoginToViewProfileModalOpen] = useState(false);

    const handleOpenLogoutModal = () => {
        setLogoutModalOpen(true);
    };

    const handleCloseLogoutModal = () => {
        setLogoutModalOpen(false);
    };

    const handleCloseLoginToViewProfileModal = () => {
        setLoginToViewProfileModalOpen(false);
    };

    const handleLogout = async () => {
        const res = await logout();
        if (res.status === 200) {
            setPage('login');
        } else {
            alert("Logout failed");
        }
    };

    const handleUserProfile = () => {
        if (isGuestLoggedIn) {
            // If guest is logged in, open modal for "Login to view profile"
            setLoginToViewProfileModalOpen(true);
        } else {
            // Otherwise, navigate to the profile page
            setPage('profile');
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setPage("home")
            setQuestionPage(e.target.value, 'Search Results');
        }
    };

    return (
        <AppBar position="static" sx={{ backgroundImage: 'linear-gradient(to right, #0d47a1, #e3f2fd)' }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Fake Stack Overflow
                </Typography>
                {showSearchBar && (
                    <div style={{ position: 'relative', marginRight: '1rem' }}>
                        <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '10px' }}>
                            <Search sx={{ color: "black" }} />
                        </div>
                        <InputBase
                            id="searchBar"
                            placeholder="Search ..."
                            type="text"
                            value={val}
                            onChange={(e) => setVal(e.target.value)}
                            onKeyDown={handleSearch}
                            style={{ paddingLeft: '2rem' }}
                        />
                    </div>
                )}
                {showProfile && (
                    <Button id="profileBut" variant="text" color="inherit" onClick={handleUserProfile} sx={{ color: "black" }}>
                        Profile
                    </Button>
                )}
                {showLogout && (
                    <Button variant="text" color="inherit" onClick={handleOpenLogoutModal} sx={{ color: "black" }}>
                        Logout
                    </Button>
                )}
            </Toolbar>
            <Modal
                open={logoutModalOpen}
                onClose={handleCloseLogoutModal}
                aria-labelledby="logout-modal-title"
                aria-describedby="logout-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography id="logout-modal-title" variant="h6" component="h2" gutterBottom>
                        Are you sure you want to logout?
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <Button id="cancelButton" onClick={handleCloseLogoutModal} color="secondary" variant="contained" sx={{ marginRight: '1rem' }}>
                        Cancel
                    </Button>
                    <Button id="logoutButton" onClick={handleLogout} color="primary" variant="contained">
                        Logout
                    </Button>
                    </Box>
                </Box>
            </Modal>
            <Modal
                open={loginToViewProfileModalOpen}
                onClose={handleCloseLoginToViewProfileModal}
                aria-labelledby="login-to-view-profile-modal-title"
                aria-describedby="login-to-view-profile-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography id="login-to-view-profile-modal-title" variant="h6" component="h2" gutterBottom>
                        Login to view profile
                    </Typography>
                    <Typography id="login-to-view-profile-modal-description" variant="body1">
                        You need to login to view your profile.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <Button onClick={handleCloseLoginToViewProfileModal} color="primary" variant="contained">
                            Close
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </AppBar>
    );
};

export default Header;
