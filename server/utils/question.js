const Question = require("../models/questions");
const Answer = require("../models/answers");
const Tag = require("../models/tags");
const User = require("../models/users");

const addTag = async (tname) => {
    try {
        // Check if the tag already exists in the database
        let tag = await Tag.findOne({ 'name': tname });

        if (tag === null) {
            // If the tag doesn't exist, create a new one
            const newTag = new Tag({ 'name': tname, 'description': 'no description' });
            tag = await newTag.save();
        }

        return tag._id; // Return the ID of the tag
    } catch (error) {
        console.error('Error adding tag:', error);
        throw error; // Rethrow the error for handling in the calling function
    }
};


const getQuestionsByOrder = async (order = 'newest') => {
    try {
        let questions = await Question.find().populate({path: 'answers', model: Answer}).populate({path: 'tags', model: Tag}).populate({path: 'asked_by', model: User});
        if(order === 'newest'){
            return questions.sort((a,b)=>b.ask_date_time-a.ask_date_time);
        }else if(order==='active'){
            return questions.sort((a,b)=>{
                const answerDateA = a.answers.length>0? Math.max(...a.answers.map(ans=>ans.ans_date_time)):null;
                const answerDateB = b.answers.length>0? Math.max(...b.answers.map(ans=>ans.ans_date_time)):null;
                return answerDateB - answerDateA || b.ask_date_time-a.ask_date_time
            })
        }else if(order === "unanswered"){
            return questions.sort((a,b)=>b.ask_date_time-a.ask_date_time).filter(q=>q.answers.length ===0);
        }
    } catch (error) {
        throw new Error('Error fetching questions by order: ' + error.message);
    }
};



const filterQuestionsBySearch = (qlist, search) => {
    const searchTags = parseTags(search);
    const searchKeywords = parseKeyword(search);
    const searchUsername = parseUsername(search);

    const res = qlist.filter((q) => {
        if (searchKeywords.length === 0 && searchTags.length === 0 && searchUsername === null) {
            return true;
        } else if (searchKeywords.length === 0 && searchUsername === null) {
            return checkTagInQuestion(q, searchTags);
        } else if (searchTags.length === 0 && searchUsername === null) {
            return checkKeywordInQuestion(q, searchKeywords);
        } else {
            return (
                checkKeywordInQuestion(q, searchKeywords) ||
                checkTagInQuestion(q, searchTags) ||
                checkUsernameInQuestion(q, searchUsername)
            );
        }
    });
    return res;
};

const parseUsername = (search) => {
    const usernamePattern = /\.([^\.]+)\./g;
    const match = usernamePattern.exec(search);
    return match ? match[1] : null;
};

const checkUsernameInQuestion = (q, username) => {
    if (!username) return false;
    const matchFound = q.asked_by.name === username;
    return matchFound;
};


const parseTags = (search) => {
    return (search.match(/\[([^\]]+)\]/g) || []).map((word) =>
        word.slice(1, -1)
    );
};

const parseKeyword = (search) => {
    return search.replace(/\[([^\]]+)\]/g, " ").match(/\b\w+\b/g) || [];
};


const checkKeywordInQuestion = (q, keywordlist) => {
    for (let w of keywordlist) {
        if (q.title.includes(w) || q.text.includes(w)) {
            return true;
        }
    }

    return false;
};


const checkTagInQuestion = (q, taglist) => {
    for (let name of taglist) {
        for (let tag of q.tags) {
            if (name == tag.name) {
                return true;
            }
        }
    }

    return false;
};




module.exports = { addTag, getQuestionsByOrder, filterQuestionsBySearch };


