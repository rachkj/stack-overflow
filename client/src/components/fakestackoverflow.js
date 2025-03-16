import React, { useState, useEffect } from "react";
import Header from "./header";
import Main from "./main";
import LoginPage from "./login/signin";
import { verifyPassword } from "../services/userService";
import { loginAsGuest } from "../services/userService";
import { getMyUserDetails } from "../services/userService";

export default function FakeStackOverflow() {
    const [search, setSearch] = useState("");
    const [mainTitle, setMainTitle] = useState("All Questions");
    const [page, setPage] = useState("login");
    const [isGuestLoggedIn, setIsGuestLoggedIn] = useState(false); 
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const res = await getMyUserDetails();
                if (res.status === 200) {
                    setPage("home");
                }
            } catch (error) {
                console.log("Inside catch");
                if (error.response && error.response.status === 401) {
                    setPage("login");
                } else {
                    console.error("Error with login:", error);
                }
            }
        };

        fetchUserDetails(); // Call the async function within useEffect

    }, []);

    const setQuestionPage = (search = "", title = "All Questions") => {
        setSearch(search);
        setMainTitle(title);
    };

    const handleLogin = async (email, password) => {
        setErrorMessage(""); 
        if (email && password) {
            try {
                const res = await verifyPassword(email, password);
                console.log(res);
                if (res.status === 200) {
                    setPage("home");
                    setIsGuestLoggedIn(false); // Set to false for normal login
                } else {
                    setErrorMessage("Incorrect email or password");
                }
            } catch (error) {
                console.error("Login error:", error);
                setErrorMessage("An error occurred during login");
            }
        } else {
            setErrorMessage("Please enter email and password");
        }
    };
    
    

    const handleGuestLogin = async () => {
        setErrorMessage(""); 
        try {
            const res = await loginAsGuest();
            console.log(res);
            if (res.status === 200) {
                setIsGuestLoggedIn(true); // Set to true for guest login
                setPage("home");
            } else {
                setErrorMessage("An error occurred during guest login");
            }
        } catch (error) {
            console.error("Guest login error:", error);
            setErrorMessage("An error occurred during guest login");
        }
    };

    if (page === "login") {
        return <LoginPage onLogin={handleLogin} handleGuestLogin={handleGuestLogin} errorMessage={errorMessage} />;
    } else {
        return (
            <>
                <Header 
                    showSearchBar={true} 
                    showLogout={true} 
                    showProfile={true} 
                    search={search} 
                    setQuestionPage={setQuestionPage} 
                    setPage={setPage}
                    isGuestLoggedIn={isGuestLoggedIn} 
                    />

                <Main
                    title={mainTitle}
                    search={search}
                    setQuesitonPage={setQuestionPage}
                    setPage={setPage}
                    page={page}
                    isGuestLoggedIn={isGuestLoggedIn} 
                />
            </>
        );
    }
}
