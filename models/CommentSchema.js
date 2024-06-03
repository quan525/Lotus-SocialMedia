const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user : { type: mongoose.Schema.Types.ObjectId, ref : "User", required : true },
    replyTo : { type: mongoose.Schema.Types.ObjectId, ref: "User", required : true},
    post : { type : mongoose.Schema.Types.ObjectId, ref : "Post", required: true },
    content : { type : String, required : true},
    createdDate : {
        type: Date,
    }, 
});

const CommentModel = mongoose.model("Comment", CommentSchema)

module.exports = CommentModel;

