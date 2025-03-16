const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const QuestionSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }], 
  answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }], 
  asked_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  ask_date_time: { type: Date },
  views: { type: Number, required: true , default: 0},
  comments:[{ type: Schema.Types.ObjectId, ref: 'Comment'}],
  upvotes:[{ type: Schema.Types.ObjectId, ref: 'User'}], 
  downvotes:[{ type: Schema.Types.ObjectId, ref: 'User'}]
}, { collection: "Question" }); 

module.exports = QuestionSchema;
