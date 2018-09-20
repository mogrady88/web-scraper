var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  postnum: String,
  title: String,
  body: String
});

var UserComment = mongoose.model("Comment", CommentSchema);

module.exports = UserComment;