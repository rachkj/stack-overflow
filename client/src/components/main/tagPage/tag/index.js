import { useState } from "react";
import { Box, Button, Modal, Paper, Typography, TextareaAutosize } from "@mui/material";
import { updateDescription, deleteTag , getTagsWithQuestionNumber} from "../../../../services/tagService";

const Tag = ({ t, clickTag, setTlist, searchText , userType}) => {
  const [openModal, setOpenModal] = useState(false);
  const [desc, setDesc] = useState(t.description);
  const [newDescription, setNewDescription] = useState(t.description);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleUpdateDescription = async () => {
    try {
      const res = await updateDescription(t.name, newDescription); // Pass tag name instead of ID
      if (res.status === 200) {
        setDesc(newDescription);
      } else {
        console.log(res);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error updating tag description:", error.message);
      // Handle error appropriately
    }
  };

  const handleDeleteTag = async () => {
    try {
      const res = await deleteTag(t.name); // Pass tag name to delete
      if (res.status === 200) {
        setDesc("Depricated");
        try {
          const res = await getTagsWithQuestionNumber(searchText);
          setTlist(res || []);
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log(res);
      }
    } catch (error) {
      console.error("Error deleting tag:", error.message);
      // Handle error appropriately
    }
  };

  return (
    <div>
      <Paper
        elevation={3}
        style={{ padding: "16px", marginBottom: "20px", cursor: "pointer", backgroundColor: "#E1F5FE" }}
      >
        <Box onClick={() => clickTag(t.name)}>
          <Typography variant="h6" style={{ fontWeight: "bold", marginBottom: "8px" }}>{t.name}</Typography>
          <Typography variant="body1" style={{ marginBottom: "8px" }}>{desc}</Typography>
          <Typography variant="body2" style={{ color: "#00008B" , marginBottom: "5px"}}>{t.questionCount} questions</Typography>
        </Box>
        {userType === 3 && (
          <>
            <Button variant="contained" style={{ marginBottom: "8px" }} color="primary" onClick={handleOpenModal}>
              Edit Description
            </Button>
            <Button variant="contained" color="error" onClick={handleDeleteTag}>
              Delete
            </Button>
          </>
        )}
      </Paper>
      
      <Modal open={openModal} onClose={handleCloseModal}>
        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", width: "300px", margin: "auto", marginTop: "100px" }}>
          <TextareaAutosize
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Enter new description"
            style={{ width: "100%", marginBottom: "20px", border: "1px solid #ccc", borderRadius: "4px", padding: "8px" }}
            minRows={3}
          />
          <Button variant="contained" color="primary" onClick={handleUpdateDescription}>
            Save Description
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Tag;
