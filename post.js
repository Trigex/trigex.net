var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    timestamp: String,
    title: String,
    content: String
});

module.exports = mongoose.model("Post", postSchema);