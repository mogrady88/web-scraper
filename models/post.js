var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var RedditSchema = new Schema({
    upvotes: {
      type: String,
      trim: true,
      required: true
    },
    title: {
      type: String,
      trim: true,
      required: true
    },
    link: {
      type: String,
      trim: true,
      required: true
    },
    userCreated: {
      type: Date,
      default: Date.now
    },
  });

  var Post = mongoose.model("Post", RedditSchema);

module.exports = Post;
