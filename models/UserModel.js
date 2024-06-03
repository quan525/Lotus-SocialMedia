const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username : {
        type : String,
        required: true
    },
    phone: String,
    email: String,
    password: {
        type : String,
        required: true
    },
    avatar:
    {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    city : { type : String },
    interest : [{ type : String }],
    createDate : {
        type: Date,
    },  
    dob: Date

});

const UserModel = mongoose.model("User", UserSchema)

module.exports = UserModel;