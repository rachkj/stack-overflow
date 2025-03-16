import "./index.css";
import { useState, useEffect } from "react";
import SideBarNav from "./sideBarNav";
import QuestionPage from "./questionPage";
import TagPage from "./tagPage";
import AnswerPage from "./answerPage";
import NewQuestion from "./newQuestion";
import NewAnswer from "./newAnswer";
import Profile from "./profilePage/profile";
import UserSearchPage from "./userSearchPage";
import UserPage from "./userPage";
import { getMyUserDetails } from "../../services/userService";

const Main = ({ search = "", title, setQuesitonPage, setPage, page }) => {
    const [questionOrder, setQuestionOrder] = useState("newest");
    const [qid, setQid] = useState("");
    const [otherUserDetails, setOtherUserDetails] = useState("");
    const [userDetails, setUserDetails] = useState(null);
    const [userType, setUserType] = useState();
    let selected = "";
    let content = null;

    useEffect(() => {
        // Fetch user details when the component mounts
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            // Call getMyUserDetails() to fetch user details
            const userDetails = await getMyUserDetails();
            setUserType(userDetails.data.type);
            setUserDetails(userDetails);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    const handleQuestions = () => {
        setQuesitonPage();
        setPage("home");
    };

    const handleTags = () => {
        setPage("tag");
    };

    const handleAnswer = (qid) => {
        setQid(qid);
        setPage("answer");
    };

    const clickTag = (tname) => {
        setQuesitonPage("[" + tname + "]", tname);
        setPage("home");
    };

    const handleNewQuestion = () => {
        setPage("newQuestion");
    };

    const handleNewAnswer = () => {
        setPage("newAnswer");
    };

    const handleUserSearch = () => {
        setPage("userSearch");
    };

    const handleUserPage = (otherUserDetails) => {
        setOtherUserDetails(otherUserDetails);
        setPage("userPage");
    };


    const handleDeleteSuccess = () => {
        setPage('home');
    };

    const getQuestionPage = (order = "newest", search = "") => {
        console.log(userType);
        return (
            <QuestionPage
                title_text={title}
                order={order}
                search={search}
                setQuestionOrder={setQuestionOrder}
                clickTag={clickTag}
                handleAnswer={handleAnswer}
                handleNewQuestion={handleNewQuestion}
                userType={userType} 
            />
        );
    };

    switch (page) {
        case "home": {
            selected = "q";
            content = getQuestionPage(questionOrder.toLowerCase(), search);
            break;
        }
        case "tag": {
            selected = "t";
            content = (
                <TagPage
                    clickTag={clickTag}
                    handleNewQuestion={handleNewQuestion}
                    userType={userType} 
                />
            );
            break;
        }
        case "answer": {
            selected = "";
            content = (
                <AnswerPage
                    qid={qid}
                    handleNewQuestion={handleNewQuestion}
                    handleNewAnswer={handleNewAnswer}
                    handleDeleteSuccess={handleDeleteSuccess}
                    userType={userType} 
                />
            );
            break;
        }
        case "newQuestion": {
            selected = "";
            content = <NewQuestion handleQuestions={handleQuestions} />;
            break;
        }
        case "newAnswer": {
            selected = "";
            content = <NewAnswer qid={qid} handleAnswer={handleAnswer} />;
            break;
        }
        case "profile": {
            selected = "";
            content = (
                <Profile
                    userDetails={userDetails}
                    setUserDetails={setUserDetails}
                    title_text={title}
                    order={questionOrder}
                    search={search}
                    setQuestionOrder={setQuestionOrder}
                    clickTag={clickTag}
                    handleAnswer={handleAnswer}
                    handleNewQuestion={handleNewQuestion}
                />
            );
            break;
        }
        case "userSearch": {
            selected = "";
            content = <UserSearchPage 
            handleUserPage={handleUserPage}
            />;
            break;
        }

        case "userPage": {
            selected = "";
            content = <UserPage 
            userDetails ={otherUserDetails}
              clickTag ={clickTag}
              handleAnswer ={handleAnswer}
            />;
            break;
        }
        default:
            selected = "q";
            content = getQuestionPage();
            break;
    }

    return (
        <div id="main" className="main">
            <SideBarNav
                selected={selected}
                handleQuestions={handleQuestions}
                handleTags={handleTags}
                handleUserSearch={handleUserSearch}
            />
            <div id="right_main" className="right_main">
                {content}
            </div>
        </div>
    );
};

export default Main;
