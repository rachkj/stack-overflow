import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { updateProfile, getMyUserDetails } from "../../../../services/userService";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Container, Box } from "@mui/material"; 

const defaultTheme = createTheme();

const UpdatePassword = ({ userDetails, setPage, setUserDetails }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState(""); 
  const [errorMessage, setErrorMessage] = useState("");
  const [updated, setUpdated] = useState(false);

  const handleUpdateProfile = async () => {
    if (newPassword.length < 8 || !/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[^a-zA-Z0-9]/.test(newPassword)) {
      setErrorMessage('Password must be at least 8 characters long and contain at least one alphabet, one number, and one special character.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      const userData = {
        oldPassword: oldPassword,
        newPassword: newPassword,
        name: userDetails.data.name,
        email: userDetails.data.email,
      };
      const response = await updateProfile(userData);

      if (response.status === 200) {
        const newUserDetails = await getMyUserDetails();
        setUserDetails(newUserDetails);
        setNewPassword(newUserDetails.data.password);
        setUpdated(true);
      } else {
        setErrorMessage("An error occurred while updating password.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setErrorMessage("An error occurred while updating password.");
    }
  };

  const handleBackToProfile = () => {
    setPage("profile");
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={3}
            style={{
              padding: "16px",
              maxWidth: "400px",
              margin: "auto",
              marginTop: "64px",
              borderRadius: "8px",
            }}
          >
            <Typography variant="h4" gutterBottom>
              Update Password
            </Typography>
            <TextField
              label="Old Password"
              variant="outlined"
              fullWidth
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              style={{ marginBottom: "16px" }}
            />
            <TextField
              label="New Password"
              type="password"
              variant="outlined"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ marginBottom: "16px" }}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              variant="outlined"
              fullWidth
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              style={{ marginBottom: "16px" }}
            />
            {errorMessage && (
              <p style={{ color: "red" }}>{errorMessage}</p>
            )}
            {updated ? (
              <div>
                <p>Updated profile successfully!</p>
                <Button
                  variant="contained"
                  onClick={handleBackToProfile}
                >
                  Back to Profile Page
                </Button>
              </div>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateProfile}
              >
                Update Profile
              </Button>
            )}
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default UpdatePassword;
