import { REACT_APP_API_URL, api } from "./config";

const ANSWER_API_URL = `${REACT_APP_API_URL}/answer`;

// To add answer
const addAnswer = async (qid, ans) => {
    const data = { qid: qid, ans: ans };
    const res = await api.post(`${ANSWER_API_URL}/addAnswer`, data);
    return res.data;
};

// To upvote an answer
const upvoteAnswer = async (aid) => {
    const res = await api.get(`${ANSWER_API_URL}/upvoteAnswer/${aid}`);
    return res.data;
};

// To downvote an answer
const downvoteAnswer = async (aid) => {
    const res = await api.get(`${ANSWER_API_URL}/downvoteAnswer/${aid}`);
    return res.data;
};

// To get an answer by its ID
const getAnswerById = async (aid) => {
    const res = await api.get(`${ANSWER_API_URL}/getAnswerById/${aid}`);
    return res.data;
};

// To get an answer by its ID
const getAllAnswersByUid = async (uid) => {
    const res = await api.get(`${ANSWER_API_URL}/getAllAnswersByUid/${uid}`);
    return res.data;
};


// To delete an answer
const deleteAnswer = async (aid) => {
    const res = await api.delete(`${ANSWER_API_URL}/deleteAnswer/${aid}`);
    return res;
};

// To update an answer
const updateAnswer = async (aid, text) => {
    const data = { text: text };
    const res = await api.put(`${ANSWER_API_URL}/updateAnswer/${aid}`, data);
    return res.data;
};

export { addAnswer, upvoteAnswer, downvoteAnswer, getAnswerById, deleteAnswer, updateAnswer, getAllAnswersByUid };
