import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import {addUser} from "../../../services/userService";

const defaultTheme = createTheme();

const SignupPage = ({ setPage }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [signedUp, setSignedUp] = useState(false);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!email || !username || !password || !confirmPassword) {
            setErrorMessage('All fields are mandatory.');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage('Invalid email format.');
            return;
        }

        if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) {
            setErrorMessage('Password must be at least 8 characters long and contain at least one alphabet, one number, and one special character.');
            return;
        }

        if (username.length < 8 || !/^[a-zA-Z]/.test(username)) {
            setErrorMessage('Username must start with an alphabet and be at least 8 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }
        setSignedUp(true);
        try {
            const user = {
                name: username,
                email: email,
                password: password,
                type: 0,
                impressions: 0
            };
            addUser(user);
            setSignedUp(true);
        } catch (error) {
            console.error('Error adding user:', error);
            setErrorMessage('An error occurred while signing up.');
        }
    };

    const handleBackToLogin = () => {
        setPage('login');
    };

    return (
        <div>
            <div className="signup-page-content">
                {signedUp ? (
                    <div>
                        <p>Signed up successfully!</p>
                        <Button variant="contained" onClick={handleBackToLogin}>Back to Login</Button>
                    </div>
                ) : (
                    <ThemeProvider theme={defaultTheme}>
                        <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >

                                <Typography component="h1" variant="h5">
                                    Sign up
                                </Typography>
                                <Box component="form" noValidate onSubmit={handleSubmit} name="signup-form" sx={{ mt: 3 }}>

                                    <Grid >
                                        <Grid item xs={12} >
                                            <TextField
                                                type="email"
                                                label="Email"
                                                value={email}
                                                onChange={handleEmailChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                type="text"
                                                label="Username"
                                                value={username}
                                                onChange={handleUsernameChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                type="password"
                                                label="Password"
                                                value={password}
                                                onChange={handlePasswordChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                type="password"
                                                label="Confirm Password"
                                                value={confirmPassword}
                                                onChange={handleConfirmPasswordChange}
                                            />
                                        </Grid>
                                    </Grid>
                                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                                    <br/>
                                    <Button type="submit" variant="contained" >Sign Up</Button>
                                    <br/>
                                    <br/>
                                    <Button onClick={handleBackToLogin} color="primary">Back to Login</Button>
                                </Box>
                            </Box>
                        </Container>
                    </ThemeProvider>
                )}
            </div>
        </div>
    );
};

export default SignupPage;
