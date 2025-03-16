import React from "react";
import { Typography, Box } from "@mui/material";

const UserCard = ({ userData, handleUserPage }) => {
  const userNodeStyle = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    cursor: "pointer",
    backgroundColor: "#E1F5FE",
  };

  const userNameStyle = {
    fontWeight: "bold",
    marginBottom: "8px",
  };

  const userDetailsStyle = {
    fontFamily: "Arial",
    fontSize: "14px",
    color: "#333",
    marginBottom: "8px",
  };

//   const userImpressionsStyle = {
//     color: "#00008B",
//   };

return (
  <Box sx={userNodeStyle} onClick={() => handleUserPage(userData)}>
    <Typography variant="h5" sx={userNameStyle}>
     {userData.name}
    </Typography>
    <Typography variant="body1" mb={1} sx={userDetailsStyle}>
      User Type: {userData.type === 0 ? "Regular" : userData.type === 3 ? "Admin" : "Guest"}
    </Typography>
    <Typography variant="body1" mb={1} sx={userDetailsStyle}>
      Impressions: {Math.floor(userData.impressions/2)}
    </Typography>
  </Box>
);

};

export default UserCard;
