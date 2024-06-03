const jwt = require('jsonwebtoken');

require("dotenv").config()

const generateToken = ( userId ) =>{
    const token =  jwt.sign(  {userid : userId} , process.env.JWT_SECRET, { expiresIn: '5h' });
    // console.log('Generated JWT:', token);

    return token
}

const resetPasswordToken = ( userId ) => {
    const token = jwt.sign( {userid : userId} , process.env.JWT_PASSWORD_SECRET);
    // console.log('Generated JWT:', token);

    return token
}
 
module.exports = { generateToken, resetPasswordToken }

