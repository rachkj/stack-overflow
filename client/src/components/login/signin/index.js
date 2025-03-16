import React, { useState } from "react";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Header from "../../header";
import SignupPage from "../signup"; 
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

export default function LoginPage({ onLogin , handleGuestLogin, errorMessage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [page, setPage] = useState("login");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();


    onLogin(email, password);
  };

  const handleSignup = () => {
    setPage("signup");
  };

  const handleRedirectToLogin = () => {
    setPage("login");
  };

  return (
    <ThemeProvider theme={defaultTheme}>
     <Box
  sx={{
    backgroundImage: 'linear-gradient(to bottom, #0d47a1, #e3f2fd)', 
    minHeight: '100vh', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}
>


    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: '#e3f2fd', 
          minHeight: '100vh', 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px', 
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <div>
          <Header />
        
          <div className="login-page-content">

            {page === "login" && (
              <>
                        <Typography component="h1" variant="h5">
        Sign in
        </Typography>
                <Box component="form" onSubmit={handleSubmit} name="login-form" noValidate sx={{ mt: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={handleEmailChange}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  />
                  {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                </Box>
                
                
              <Grid item>
                <Link href="#" variant="body2" onClick={handleSignup}>
                  Dont have an account? Sign Up
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2" onClick={handleGuestLogin}>
                  Guest Login
                </Link>
              </Grid>
                
               
              </>
            )}
            {page === "signup" && (
              <SignupPage setPage={handleRedirectToLogin} />
            )}
          </div>
        </div>
      </Box>
    </Container>
    </Box>
    </ThemeProvider>
  );
}
