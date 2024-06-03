const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content : { type : String, required: true },
    image : {
        data: Buffer,
        contentType: String
    },
    comment : { type : mongoose.Schema.Types.ObjectId, ref: 'Comment'},
    createdDate : {
        type: Date,
    },  
});

const PostModel = mongoose.model("Post", PostSchema)
 
module.exports = PostModel;