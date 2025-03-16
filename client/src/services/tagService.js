import { REACT_APP_API_URL, api } from "./config";

const TAG_API_URL = `${REACT_APP_API_URL}/tag`;

const getTagsWithQuestionNumber = async (searchText) => {
    const res = await api.get(`${TAG_API_URL}/getTagsWithQuestionNumber?searchText=${searchText}`);
    return res.data;
};

const updateDescription = async (tagName, newDescription) => {
    const res = await api.put(`${TAG_API_URL}/updateDescription/${tagName}`, { description: newDescription });
    return res;
};

const deleteTag = async (tagName) => {
    const res = await api.delete(`${TAG_API_URL}/deleteTag/${tagName}`);
    return res;
};

export { getTagsWithQuestionNumber, updateDescription, deleteTag };
