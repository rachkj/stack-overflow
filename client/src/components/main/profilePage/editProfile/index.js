import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { updateProfile, getMyUserDetails } from "../../../../services/userService";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Container, Box } from "@mui/material"; 

const defaultTheme = createTheme();

const EditProfile = ({ userDetails, setPage, setUserDetails }) => {
  const [name, setName] = useState(userDetails.data.name);
  const [email, setEmail] = useState(userDetails.data.email);
  const [oldPassword, setOldPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [updated, setUpdated] = useState(false);

  const handleUpdateProfile = async () => {


    try {
      const userData = {
        oldPassword: oldPassword, 
        newPassword: oldPassword,
        name: name,
        email: email,
      };
      const response = await updateProfile(userData);
      console.log(response);
      if (response.status === 200) {
        setErrorMessage("");
        const newUserDetails = await getMyUserDetails();
        setUserDetails(newUserDetails);
        setName(newUserDetails.data.name);
        setEmail(newUserDetails.data.email);
        setUpdated(true);
      } else {
        setErrorMessage("An error occurred while updating profile page.");
      }
    } catch (error) {
      console.error("Error updating profile details:", error);
      setErrorMessage("An error occurred while updating profile page.");
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
              Update Profile
            </Typography>
            <TextField
              label="Name"
              id="uname"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ marginBottom: "16px" }}
            />
            <TextField
              label="Old Password"
              type="password"
              variant="outlined"
              fullWidth
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
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
                id="updateProfileButton"
                variant="contained"
                color="primary"
                onClick={handleUpdateProfile}
              >
                Update Profile
              </Button >
            )}
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default EditProfile;
