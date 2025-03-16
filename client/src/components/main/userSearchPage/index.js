import "./index.css";
import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import UserCard from "./userCard"; // Import the UserCard component
import { getUsersByUsername } from "../../../services/userService"; // Import the getUsersByUsername function
import { InputBase } from "@mui/material";
import { Search } from "@mui/icons-material";

const UserSearchPage = ({handleUserPage}) => {
  const [searchText, setSearchText] = useState("");
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUsersByUsername(searchText);
        setUserList(res.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [searchText]);

  return (
    <div
      style={{
        backgroundImage: "linear-gradient(to bottom, #0d47a1, #e3f2fd)",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <div style={{ marginRight: "1rem", display: "flex", alignItems: "center" }}>
            <Typography variant="h6" fontWeight="bold">
              {userList.length} Users
            </Typography>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  left: "10px",
                }}
              >
                <Search sx={{ color: "black" }} />
              </div>
              <InputBase
                id="searchBar"
                className="searchBarUser"
                placeholder="Search ..."
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ paddingLeft: "2rem" }}
              />
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {userList.map((user, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <div>
                  <UserCard userData={user} handleUserPage={handleUserPage} />
                </div>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserSearchPage;
