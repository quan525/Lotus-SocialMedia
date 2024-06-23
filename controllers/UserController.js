const pool = require("../config/postgresdb");
const { generateToken, resetPasswordToken } = require("../config/generateToken");
const cloudinary = require("../config/cloudinary")
const bcrypt = require('bcrypt')
const saltRounds = 10
const sendEmail = require("../utils/sendEmail");

const ResetItem = require("../models/ResetPasswordSchema");

const Register = async (req, res, next) => {
  let uploadedImagePublicId;
  try {
    const emailPattern= /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    const { username, email, password, file } = req.body;
    if(!username || !password || !email || username.length < 6 || password.length < 8) {
      return res.status(400).json({ message: "Invalid or missing fields" });
    }else if (!emailPattern.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const userExists = (await pool.query('SELECT 1  FROM users WHERE username = $1 LIMIT 1', [username])).rows.length > 0;
    if (userExists) {
      return res.status(400).send("User already exists");
    }

    let avatarUrl;
    if (file) {
      const result = await cloudinary.uploader.upload(file.path);
      avatarUrl = result.secure_url;
      uploadedImagePublicId = result.public_id;
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const encryptPassword = await bcrypt.hash(password, salt);

    const query = file ? 
      'INSERT INTO users (username, email, password, avatar_url, profile_name) VALUES ($1, $2, $3, $4, $5) RETURNING profile_name,avatar_url,created_at,cover_url' :
      'INSERT INTO users (username, email, password, profile_name) VALUES ($1, $2, $3, $4) RETURNING *';

    const params = file ? [username, email, encryptPassword, avatarUrl, username] : [username, email, encryptPassword, username];
    const user = (await pool.query(query, params)).rows[0];

    if (!user) {
      return res.status(400).send("Error creating user");
    }

    const { user_id, profile_name, created_at, avatar_url, cover_url } = user;
    const formattedDate = new Date(created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const token = generateToken(user_id);
    res.cookie("token", token,{ httpOnly: true });

    return res.status(201).json({
      profile_name,
      created_at : formattedDate,
      user_id,
      token,
      image: avatar_url,
      cover_url,
      email
    });
  } catch (error) {
    if (uploadedImagePublicId) {
      await cloudinary.uploader.destroy(uploadedImagePublicId);
    }
    console.log(error)
    return res.status(500).send({ message: "Server error", error });  
  }
};

const Login = async (req, res) => {
  try {
    if(!req.body.username || !req.body.password || req.body.password == '' || req.body.username == '') {
      res.status(400).json("Missing username or password")
    }
    const username = req.body.username;
    const password = req.body.password;
    const user = await pool.query('SELECT * FROM users WHERE username = $1 LIMIT 1', [username]);
    if (user){
        if (user.rows.length > 0) {
        } else {
          res.status(400).send("No user found")
          return;
        }
        bcrypt.compare(password, user.rows[0].password, function(err, result) {
            if (err) throw err;
            if(result === true){
              console.log(user.rows[0])
              const profileName = user.rows[0].profile_name;
              const created_date = new Date(user.rows[0].created_at);
              const formattedDate = created_date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); // Get the formatted date
              res.status(200).json({
                profile_name : profileName,
                created_at : formattedDate,
                user_id : user.rows[0].user_id,
                email : user.rows[0].email,
                token : generateToken( user.rows[0].user_id),
                cover_url : user.rows[0].cover_url,
                image: user.rows[0].avatar_url,
                gender: user.rows[0].gender
              })
            }else{
                res.status(400).send("Incorrect password")
                return;
            }
        });
    }else{
        res.status(400).send("No user found")
        return;
    }
  }catch (error) {
    res.status(500).send("Server error",error);
    return;
  }
}

const ResetPassword = async (req, res) => {
  try{
    const { userId, resetPassword, token } = req.body;
    const result = await pool.query('SELECT username, user_id, email FROM users WHERE user_id = $1 LIMIT 1', [userId]);
    if(result.rows.length < 1){
      res.status(404).send("User not found")
    }else if(result.rows[0].email){
      const user = result.rows[0];
      const userId = user.user_id;
      const resetItem = await ResetItem.findOneAndDelete({user_id: userId, token: token});
      if(!resetItem) {
        res.status(400).send('Token not found')
      }else{
        const salt = await bcrypt.genSalt(saltRounds);
        const encryptPassword = await bcrypt.hash(resetPassword, salt);
        const result = await pool.query('UPDATE users SET password = $1 WHERE user_id = $2', [encryptPassword, userId]);
        if(result.rowCount > 0){
          res.status(200).send("Password reset successful")
        }else{
          res.status(400).send("Password reset failed")
        }
      }
    }
  }catch (err){
    console.log(err)
    res.status(500).send("Server error")
  }
}

const ForgotPassword = async (req, res) => {
  try{
    console.log(req.body.username)
    const username = req.body.username;
    const webUrl = req.body.webRootUrl;
    const result = await pool.query('SELECT username, user_id, email FROM users WHERE username = $1', [username]);
    console.log(result)
    if(result.rows.length < 1){
      res.status(404).send("User not found")
    }else if(result.rows[0].email){
      const user = result.rows[0];
      const userId = user.user_id;
      const token = resetPasswordToken(user.user_id);
      await new ResetItem({
        user_id : userId,
        token : token
      }).save();
      const link = `${webUrl}/passwordReset?token=${token}&userId=${userId}`;
      const body = `
      <h2>Hi,</h2> 
      <p>We received your request to reset password from account ${user.username}.</p>
      <p>Here is your password reset link:</p>
      <a href="${link}"> click here </a>
      <p>Please note that the reset token will be expired in 3 minute 30 sec</p>`
      await sendEmail(user.email,"Password Reset Request",body);
      res.status(200).send("Password reset link sent to your email")
    }
  }catch (err){
    console.log(err)
    res.status(500).send("Server error")
  }
}

const UpdateAvatar = async (req, res) => {
  console.log(req.file)
  const file = req.file;
  if (file) {
    let uploadedImagePublicId;
    try {  
      const filePath = file.path;
      const userId = req.userId; // Assuming you have the userId available in req.userId
      const currentAvatarResult = await pool.query('SELECT avatar_url FROM users WHERE user_id = $1', [userId]);
      const currentAvatarUrl = currentAvatarResult.rows[0].avatar_url;  
      if(currentAvatarResult !== "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"){
        await cloudinary.uploader.destroy(currentAvatarUrl);
      }
      const upload = await cloudinary.uploader.upload(filePath);
      const secure_url = upload.secure_url;
      uploadedImagePublicId = upload.public_id; 

      const result = await pool.query('UPDATE users SET avatar_url = $1 WHERE user_id = $2', [secure_url, userId]);
      
      if (result.rowCount > 0) {
        res.status(200).send("Avatar successfully updated");
      } else {
        res.status(400).send("No user found or avatar update failed");
      }
    } catch (error) {
      await cloudinary.uploader.destroy(uploadedImagePublicId); 
      console.error("Error:", error);
      res.status(400).send("Error: " + error.message);
    }
  } else {
    res.status(400).send("No file uploaded");
  }
};

const UpdateProfileName = async (req, res) => {
  const userId = req.userId;
  const updateName = req.body.updateName;
  const checkUser = await pool.query("SELECT * FROM users WHERE userId = $1",
                                    values = [userId])
  
  if (checkUser.rows.length > 0) {
    const result = await pool.query("UPDATE users SET profile_name = $1 WHERE user_ID = $2",
                                        values = [ updateName, user_id])
    res.send(result);
  }
}
const UpdateProfile = async (req, res) => {
  try{
    const userId = req.userId;
    const profileName = req.body.profileName;
    const gender = req.body.gender;
    const email = req.body.email;
    const checkUser = await pool.query("SELECT * FROM users WHERE user_id = $1", [userId]);
    let result;
    if (checkUser.rows.length > 0) {
      result = await pool.query("UPDATE users SET profile_name = $1, gender = $2, email = $3 WHERE user_id = $4", [profileName, gender, email, userId]);
    }
    if(result) {
      console.log(result)
      res.status(200).send("Succesfully updated");
    }
  }catch (err) {
    console.log(err)
    res.status(500).send("Server error") 
  }
}

const GetAllUsers = async (req, res) => {
  pool.query('SELECT * FROM users ORDER BY user_id ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results)
  })
} 

const GetSingleUser = async (req,res) => {
  const userId = req.userId;
  const userSearchId = req.params.userId
  const query = `SELECT user_id, profile_name, created_at, avatar_url, cover_url, gender, email
                 FROM users
                 WHERE user_id = $1`
  const values = [userSearchId]
  const result = await pool.query(query, values)
  if(result.rows.length > 0){
    res.status(200).json(result.rows[0])
  }else {
    res.status(404).send("User not found")
  
  }
}

const SearchUser = async (req, res) => {
  const userId = req.userId;
  const searchTerm = req.query.q; // Extract the query parameter 'q'
    if (!searchTerm) {
      return res.status(400).send('Search term is required');
    }
   
    try {
      const query = 'SELECT u.profile_name, u.user_id, u.avatar_url FROM users u WHERE profile_name ILIKE $1 AND u.user_id != $2 LIMIT 10';
      const values = [`%${searchTerm}%`, userId];
      const data = await pool.query(query, values);
      res.status(200).json(data);
    } catch (error) {
      console.error('Error querying database', error);
      res.status(500).send('Internal Server Error');
  }
}

const FriendSuggestion = async (req, res) => {
  try {
    let users = [];
    const query = ` SELECT user_id, profile_name, avatar_url 
                    FROM users 
                    WHERE user_id != $1 
                    AND user_id IN (
                        SELECT 
                            CASE 
                                WHEN f1.person1_id = f2.person2_id THEN f1.person2_id
                                WHEN f1.person2_id = f2.person2_id THEN f1.person1_id
                            END
                        FROM friends f1
                        JOIN friends f2 ON f1.person2_id = f2.person1_id OR f1.person1_id = f2.person1_id
                        WHERE f1.status != 'Friends' AND f2.status != 'Friends' AND f1.status != 'Pending' AND f2.status != 'Pending' AND (f2.person1_id = $1 OR f2.person2_id = $1)
                    )
                    AND user_id NOT IN (
                        SELECT 
                            CASE 
                                WHEN person1_id = $1 THEN person2_id
                                WHEN person2_id = $1 THEN person1_id
                            END
                        FROM friends
                        WHERE (person1_id = $1 OR person2_id = $1)
                    )
                    LIMIT 15`;
    
    const past = new Date;
    const result  = await pool.query(query, [req.userId])
    .then(res => {
      for(let i = 0; i < res.rows.length; i++){
        pool.query ('SELECT user_id, profile_name, avatar_url FROM users WHERE user_id = $1', [res.rows[i].user_id])
        .then((res) => {
          users =  users.concat(res.rows);
        });
      }
    });

    if(users.length < 30){
      pool.query(`SELECT user_id, profile_name, avatar_url 
              FROM users 
              WHERE user_id != $1 
              AND user_id NOT IN (
                  SELECT 
                      CASE 
                          WHEN person1_id = $1 AND status = 'Friends' THEN person2_id
                          WHEN person2_id = $1 AND status = 'Friends' THEN person1_id
                          WHEN person1_id = $1 AND status = 'Pending' THEN person2_id
                          WHEN person2_id = $1 AND status = 'Pending' THEN person1_id
                          ELSE -1
                      END
                  FROM friends
                  WHERE (status = 'Friends' OR status = 'Pending') AND (person1_id = $1 OR person2_id = $1)
              )
              LIMIT 20`, [req.userId])
      .then((queryResult) => {
        users = users.concat(queryResult.rows.filter((user) => !users.some(existingUser => existingUser.user_id === user.user_id)));
        if(users.length > 0){
          let differenceInSeconds = (new Date() - past) / 1000;
          console.log(differenceInSeconds);    
          res.status(200).json(users);
        }
      });
    }

    if(users.length > 0){
      let differenceInSeconds = (new Date() - past) / 1000;
      console.log(differenceInSeconds);    
      res.status(200).json(users);
    }
  } catch(error) {
    console.error(error);
    // Handle error
  }
};
module.exports = { Login, Register, ForgotPassword, ResetPassword, GetAllUsers, UpdateAvatar, GetSingleUser, SearchUser, FriendSuggestion, UpdateProfile}