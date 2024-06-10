const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PasswordToken = new Schema({
  user_id: {
    type: Number,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 240,// this is the expiry time in seconds
  },
});

module.exports = mongoose.model("ResetItem", PasswordToken);


