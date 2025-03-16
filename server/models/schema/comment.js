const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const CommentSchema = new Schema({
    text: {type: String , required: true },
    comment_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comment_time:{type: Date, required: true},
    upvotes:[{ type: Schema.Types.ObjectId, ref: 'User'}], 
    downvotes:[{ type: Schema.Types.ObjectId, ref: 'User'}]
}, { collection: "Comment" }); 
  
  module.exports = CommentSchema;

