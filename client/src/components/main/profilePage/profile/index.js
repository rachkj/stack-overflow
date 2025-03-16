import React, { useState, useEffect } from "react";
//import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import EditProfile from '../editProfile'; // Import ProfileUpdatePage component
import UpdatePassword from "../updatePassword";
import QuestionSet from "../../questionPage/questionSet";
import AnswerSet from "../../answerPage/answerSet";
import { getQuestionsByFilter } from "../../../../services/questionService";
import { getAllAnswersByUid } from "../../../../services/answerService";
import EmailIcon from '@mui/icons-material/Email';
import Link from "@mui/material/Link";
import { getMetaData } from "../../../../tool";
import { getMyUserDetails } from "../../../../services/userService";


const profilePageStyle = {
  padding: "16px",
  backgroundColor: "#fff", // Light blue background color
  maxWidth: "100%", // Set maximum width to 100% of the viewport
  margin: "auto",
  borderRadius: "8px",
  height: "100vh", // Set height to full screen
  display: "flex",
  flexDirection: "row", // Change to row layout
};

const sideNavStyle = {
  width: "200px", // Adjust width as needed
  backgroundColor: "#fff", // Light gray background color
  display: "flex",
  flexDirection: "column",
};

const impressionBoxStyle = {
  backgroundColor: "#fff", // White background color
  padding: "16px", // Padding around the content
  borderRadius: "8px", // Rounded corners
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Shadow effect
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
};

const noContentStyle = {
  color: "#1A237E",
};


const Profile = ({ userDetails, 
setUserDetails, 
order,
search,
clickTag,
handleAnswer}) => {
  const [page, setPage] = useState("profile"); 

  const handleEditProfile = () => {
    setPage("editProfile");
  };

  const handleRedirectToProfile = () => {
    setPage("profile");
  };

  const handleUpdatePassword = () => {
    setPage("updatePassword");
  };

  const [qlist, setQlist] = useState([]);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await getMyUserDetails();
            setUserDetails(res || {});
        } catch (error) {
            console.log(error);
        }
    };
    fetchData();
}, []);



  useEffect(() => {
      const fetchData = async () => {
          try {
              const res = await getQuestionsByFilter('newest', `.${userDetails.data.name}.`);
              setQlist(res || []);
          } catch (error) {
              console.log(error);
          }
      };

      fetchData();
  }, [order, search]);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await getAllAnswersByUid(userDetails.data._id);

        setAnswers(response || []);
      } catch (error) {
        console.error("Error fetching answers:", error);
      }
    };

    fetchAnswers();
  }, [userDetails]);

  return (
    <div style={profilePageStyle}>
      
      <div style={sideNavStyle}>
        <Button  variant="contained" onClick={handleEditProfile}  style={{ marginBottom: "8px" }}>
          Edit Profile
        </Button>
        <Button  variant="contained" onClick={handleUpdatePassword}>
          Update Password
        </Button>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>

</div>
<div style={{ textAlign: "center", marginBottom: "8px" }}>
  <Typography variant="h4">{userDetails.data.name}</Typography>
  <div style={{ display: "flex", alignItems: "center" }}>
  <EmailIcon style={{ marginLeft: "4px" }} />
  <Link href={`mailto:${userDetails.data.email}`} color="primary" underline="always" style={{ marginLeft: "4px" }}>
    {userDetails.data.email}
  </Link>

  </div>

</div>

          <div style={impressionBoxStyle}>
            <Typography variant="body1" style={{ marginBottom: "8px" }}>
              <strong>Impressions</strong>
            </Typography>
            <Typography variant="h5">{Math.floor(userDetails.data.impressions/2)}</Typography>
          </div>
        </div>
        <div>
          <Typography variant="h6" style={{ marginBottom: "8px" }}>Questions Posted</Typography>
          {qlist.length === 0 ? (
            <Typography variant="body1" style={noContentStyle}>No questions posted by the user</Typography>
          ) : (
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              <QuestionSet qlist={qlist} clickTag={clickTag} handleAnswer={handleAnswer} />
            </div>
          )}
        </div>
        <div>
          <Typography variant="h6" style={{ marginBottom: "8px" }}>Answers</Typography>
          {answers.length === 0 ? (
            <Typography variant="body1" style={noContentStyle}>No answers by user</Typography>
          ) : (
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {answers.map((answer, idx) => (
                <AnswerSet key={idx} text={answer.text} ansBy={userDetails.data.name} meta={getMetaData(new Date(answer.ans_date_time))}  handleAnswer={handleAnswer} qid={answer.qid} />
              ))}
            </div>
          )}
        </div>
        </div>
      {page === "editProfile" && (
        <EditProfile userDetails={userDetails} setPage={handleRedirectToProfile} setUserDetails={setUserDetails}/>
      )}
      {page === "updatePassword" && (
        <UpdatePassword userDetails={userDetails} setPage={handleRedirectToProfile} setUserDetails={setUserDetails} />
      )}
    </div>
  );
};

export default Profile;