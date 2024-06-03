const axios = require('axios');
const { url } = require('../config/cloudinary');
require('dotenv').config();

const CreateMeetingRoom = async (req, res) => {
    try{
        const url = `https://${process.env.METERED_DOMAIN}/api/v1/room/`;
        const secret = process.env.METERED_SECRET_KEY;
        console.log(secret)
        var options = {
            method: "POST",
            url : url,
            params: {
              secretKey: secret,
            },
            headers: {
              Accept: "application/json",
            },
        };
        console.log(options.url)
        axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
          res.send({
            success: true,
            ...response.data,
          });
        })
        .catch(function (error) {
          console.error(error);
          res.send({
            success: false,
          });
        });
    }catch (err){
        // console.log(err)
        res.status(500).json({ message: 'An error occurred while creating the room' });
    }
}

const ValidateMeeting = async (req, res) => {
  try {
    const meetingId = req.query.meetingId;
    const url = `https://${process.env.METERED_DOMAIN}/api/v1/room/${meetingId}`;
    const secret = process.env.METERED_SECRET_KEY;
    
    var options = {
        method: "GET",
        url: url,
        params: {
          secretKey: secret
        },
        headers: {
          Accept: "application/json",
        },
      };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        res.send({
          success: true,
        });
      })
      .catch(function (error) {
        console.error(error);
        res.send({
          success: false,
        });
      });
  }catch (err) {
    console.log(err)
  }
}
module.exports = { CreateMeetingRoom, ValidateMeeting }