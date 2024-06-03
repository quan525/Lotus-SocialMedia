const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    noti_type : { type : String, enum:['CREATE_POST','NEW_FOLLOWER', 'LIKE_POST', 'COMMENT_POST', 'FRIEND_REQUEST', 'ACCEPT_FRIEND_REQUEST'], required : true},
    sender_id : { type: Number, required : true },
    receiver_id : { type: Number, required : true },
    item_id : { type : Number, required: true },
},{
    timestamp : true
});

const Notification = mongoose.model("Notification", NotificationSchema)

module.exports = Notification;

