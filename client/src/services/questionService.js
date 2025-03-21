import { REACT_APP_API_URL, api } from "./config";

const QUESTION_API_URL = `${REACT_APP_API_URL}/question`;

// To get Questions by Filter
const getQuestionsByFilter = async (order = "newest", search = "") => {
    const res = await api.get(
        `${QUESTION_API_URL}/getQuestion?order=${order}&search=${search}`
    );
    return res.data;
};

// To get Questions by id
const getQuestionById = async (qid) => {
    const res = await api.get(`${QUESTION_API_URL}/getQuestionById/${qid}`);
    return res.data;
};

// To add Questions
const addQuestion = async (q) => {
    const res = await api.post(`${QUESTION_API_URL}/addQuestion`, q);
    return res.data;
};

// To upvote a question
const upvoteQuestion = async (qid) => {
    const res = await api.get(`${QUESTION_API_URL}/upvoteQuestion/${qid}`);
    return res.data;
};

// To downvote a question
const downvoteQuestion = async (qid) => {
    const res = await api.get(`${QUESTION_API_URL}/downvoteQuestion/${qid}`);
    return res.data;
};

// To delete a question
const deleteQuestion = async (qid) => {
    const res = await api.delete(`${QUESTION_API_URL}/deleteQuestion/${qid}`);
    return res;
};

export { getQuestionsByFilter, getQuestionById, addQuestion, upvoteQuestion, downvoteQuestion, deleteQuestion };
