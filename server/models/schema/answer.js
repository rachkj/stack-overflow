const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    text: {type: String , required: true },
    ans_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ans_date_time: {type: Date, required: true},
    comments:[{ type: Schema.Types.ObjectId, ref: 'Comment'}],
    upvotes:[{ type: Schema.Types.ObjectId, ref: 'User'}], 
    downvotes:[{ type: Schema.Types.ObjectId, ref: 'User'}]
}, { collection: "Answer" }); 
  
  module.exports = AnswerSchema;

