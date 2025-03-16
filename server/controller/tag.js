const express = require("express");
const Tag = require("../models/tags");
const Question = require("../models/questions");
const router = express.Router();
const {getUserFromToken} = require('../middleware/getUserFromToken');

router.use(getUserFromToken);


const getTagsWithQuestionNumber = async (req, res) => {
    try {
        const searchText = req.query.searchText || "";
        let tagsList;
        if (searchText.trim() === "") {
            // If search text is empty, get all tags
            tagsList = await Tag.find();
        } else {
            // If search text is provided, search tags by name and description
            tagsList = await Tag.find({
                $or: [
                    { name: { $regex: searchText, $options: 'i' } }, // Case-insensitive regex search on name
                    { description: { $regex: searchText, $options: 'i' } } // Case-insensitive regex search on description
                ]
            });
        }

        const tagQuestionCount = new Map(tagsList.map(tag => [tag.name, { desc: tag.description, qcnt: 0 }]));

        const qlist = await Question.find().populate({ path: "tags", model: Tag });

        qlist.forEach(question => {
            question.tags.forEach(tag => {
                if (tagQuestionCount.has(tag.name)) {
                    const currentData = tagQuestionCount.get(tag.name);
                    tagQuestionCount.set(tag.name, { desc: currentData.desc, qcnt: currentData.qcnt + 1 });
                }
            });
        });

        const result = Array.from(tagQuestionCount, ([name, data]) => ({ name, description: data.desc, questionCount: data.qcnt }));

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json(error.toString());
    }
};

const updateDescription = async (req, res) => {
    try {
        const user = req.user;
        if (!user || user.type !== 3) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        const tagName = req.params.tagName;
        const newDescription = req.body.description;

        if (!tagName || !newDescription) {
            return res.status(400).json({ error: 'Tag name and new description are required' });
        }

        const tag = await Tag.findOneAndUpdate({ name: tagName }, { description: newDescription }, { new: true });

        if (!tag) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        res.json({ message: 'Tag description updated successfully', updatedTag: tag });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

const deleteTag = async (req, res) => {
    try {
        const tagName = req.params.tagName;

        if (!tagName) {
            return res.status(400).json({ error: 'Tag name is required' });
        }
        
        const user = req.user;
        if (!user || user.type !== 3) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        

        const tag = await Tag.findOneAndDelete({ name: tagName });

        if (!tag) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        res.json({ message: 'Tag deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};



router.delete("/deleteTag/:tagName", deleteTag);
router.put("/updateDescription/:tagName",updateDescription);
router.get("/getTagsWithQuestionNumber", getTagsWithQuestionNumber);
module.exports = router;
