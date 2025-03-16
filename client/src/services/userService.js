import { REACT_APP_API_URL, api } from "./config";

const USER_API_URL = `${REACT_APP_API_URL}/user`;

const verifyPassword = async (email, password) => {
    return api.get(`${USER_API_URL}/verifyPassword?email=${email}&password=${password}`);
};

const logout = async () => {
    return api.get(`${USER_API_URL}/logout`);
};

const loginAsGuest = async () => {
    return api.get(`${USER_API_URL}/loginAsGuest`);
};

const addUser = async (user) => {
    return api.post(`${USER_API_URL}/addUser`, user);
};

const getMyUserDetails = async () => {
    return api.get(`${USER_API_URL}/myUserDetails`);
};

const getUserDetailsByUID = async (uid) => {
    return api.get(`${USER_API_URL}/userDetails/${uid}`);
};

const getUsersByUsername = async (usernameFilter) => {
    return api.get(`${USER_API_URL}/usersByUsername?usernameFilter=${usernameFilter}`);
};

const updateProfile = async (userData) => {
        return  api.post(`${USER_API_URL}/updateProfile`, userData);
};

export { verifyPassword, addUser, loginAsGuest, getMyUserDetails, getUserDetailsByUID, getUsersByUsername, updateProfile, logout };
