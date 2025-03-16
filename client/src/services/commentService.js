
import { REACT_APP_API_URL, api } from "./config";

const COMMENT_API_URL = `${REACT_APP_API_URL}/comment`;

// To add answer
const addCommentToAnswer = async (aid, comment) => {
    const data = { aid: aid, comment: comment }; // comment has only text
    const res = await api.post(`${COMMENT_API_URL}/addCommentToAnswer`, data);

    return res.data;
};

// To add answer
const addCommentToQuestion = async (qid, comment) => {

    const data = { qid: qid, comment: comment }; // comment has only text
    const res = await api.post(`${COMMENT_API_URL}/addCommentToQuestion`, data);

    return res.data;
};


const upVoteComment = async (cid) => {
    const res = await api.post(`${COMMENT_API_URL}/upVoteComment/${cid}`);
    return res.data;
};



const downvoteComment = async (cid) => {
    const res = await api.post(`${COMMENT_API_URL}/downvoteComment/${cid}`);
    return res.data;
};

const deleteComment = async (cid) => {
    const res = await api.delete(`${COMMENT_API_URL}/deleteComment/${cid}`);
    return res.data;
};


export { addCommentToAnswer, addCommentToQuestion, upVoteComment, downvoteComment, deleteComment };
