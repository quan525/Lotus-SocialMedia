const Notification = require("../models/NotificationSchema.js")

const pushNotiToSystem = async (noti_type, item_id, sender_id, receiver_id) => {
    const check = await Notification.findOne({noti_type : noti_type, item_id : item_id, sender_id : sender_id, receiver_id : receiver_id}).exec();
    if(!check){
        const notis = await Notification.create({
            noti_type, item_id, sender_id, receiver_id
        })
    } else
    {
        return
    }
}

const getNotisByReceiverId = async (receiver_id) => {
    const notis = await Notification.find({receiver_id : receiver_id}).exec();
    return notis
}
module.exports = { pushNotiToSystem, getNotisByReceiverId }
    // noti_type : { type : String, enum:['CREATE_POST','NEW_FOLLOWER', 'LIKE_POST', 'COMMENT_POST', 'FRIEND_REQUEST', 'ACCEPT_FRIEND_REQUEST'], required : true},
    // noti_sender_id : { type: Number, required : true },
    // noti_receiver_id : { type: Number, required : true },
    // item_id : { type : Number, required: true },