import { useEffect, useState } from "react";
import { Typography, Grid, Box, Container, InputBase } from "@mui/material";
import { getTagsWithQuestionNumber } from "../../../services/tagService";
import Tag from "./tag";
import { Search } from "@mui/icons-material";

const TagPage = ({ clickTag , userType  }) => {
  const [tlist, setTlist] = useState([]);
  const[searchText,setSearchText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTagsWithQuestionNumber(searchText);
        setTlist(res || []);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, [searchText]);

  return (
    <Box
      sx={{
        backgroundImage: 'linear-gradient(to bottom, #0d47a1, #e3f2fd)', 
        minHeight: '100vh', 
        padding: '20px', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={2} alignItems="left">
        <Grid item>
          <div style={{ marginRight: "1rem", display: "flex", alignItems: "center" }}>
            <Typography variant="h6" fontWeight="bold">
              {tlist.length} Tags
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
                placeholder="Search ..."
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ paddingLeft: "2rem" }}
              />
            </div>
          </div>
        </Grid>
        </Grid>
        <Box mt={2}>
          <Grid container spacing={2}>
            {tlist.map((t, idx) => (
              <Grid key={idx} item xs={12} sm={6} md={4} lg={3}>
                <Tag t={t} clickTag={clickTag} setTlist={setTlist} searchText={searchText} userType={userType} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default TagPage;
