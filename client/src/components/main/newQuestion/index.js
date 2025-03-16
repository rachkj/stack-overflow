import { useState } from "react";
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import Textarea from "../baseComponents/textarea";
import { Box, Button, Typography } from "@mui/material";
import { validateHyperlink } from "../../../tool";
import { addQuestion } from "../../../services/questionService";

const NewQuestion = ({ handleQuestions }) => {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [tag, setTag] = useState("");

    const [titleErr, setTitleErr] = useState("");
    const [textErr, setTextErr] = useState("");
    const [tagErr, setTagErr] = useState("");

    const postQuestion = async () => {
        let isValid = true;
        if (!title) {
            setTitleErr("Title cannot be empty");
            isValid = false;
        } else if (title.length > 100) {
            setTitleErr("Title cannot be more than 100 characters");
            isValid = false;
        }

        if (!text) {
            setTextErr("Question text cannot be empty");
            isValid = false;
        }

        // Hyperlink validation
        if (!validateHyperlink(text)) {
            setTextErr("Invalid hyperlink format.");
            isValid = false;
        }

        let tags = tag.split(" ").filter((tag) => tag.trim() !== "");
        if (tags.length === 0) {
            setTagErr("Should have at least 1 tag");
            isValid = false;
        } else if (tags.length > 5) {
            setTagErr("Cannot have more than 5 tags");
            isValid = false;
        }

        for (let tag of tags) {
            if (tag.length > 20) {
                setTagErr("New tag length cannot be more than 20");
                isValid = false;
                break;
            }
        }

        if (!isValid) {
            return;
        }

        const question = {
            title: title,
            text: text,
            tags: tags,
            ask_date_time: new Date(),
        };

        const res = await addQuestion(question);
        if (res && res._id) {
            handleQuestions();
        }
    };

    return (
        <Box
            sx={{
                backgroundImage: 'linear-gradient(to bottom, #0d47a1, #e3f2fd)', 
                minHeight: '100vh', 
                padding: '20px', 
                display: 'flex',
                flexDirection: 'column',
            }}
        >
           <Form
                sx={{
                    bgcolor: '#e3f2fd',
                    padding: '20px', 
                    borderRadius: '10px', 
                }}
            >
                <Input
                    title={"Question Title"}
                    hint={"Limit title to 100 characters or less"}
                    id={"formTitleInput"}
                    val={title}
                    setState={setTitle}
                    err={titleErr}
                />
                <Textarea
                    title={"Question Text"}
                    hint={"Add details"}
                    id={"formTextInput"}
                    val={text}
                    setState={setText}
                    err={textErr}
                />
                <Input
                    title={"Tags"}
                    hint={"Add keywords separated by whitespace"}
                    id={"formTagInput"}
                    val={tag}
                    setState={setTag}
                    err={tagErr}
                />
                <Box className="btn_indicator_container" sx={{ mt: 2 }}>
                    <Button
                        variant="contained"
                        className="form_postBtn"
                        onClick={() => postQuestion()}
                    >
                        Post Question
                    </Button>
                    <Typography variant="body2" className="mandatory_indicator">
                        * indicates mandatory fields
                    </Typography>
                </Box>
            </Form>
        </Box>
    );
};

export default NewQuestion;
