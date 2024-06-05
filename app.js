process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });
const express = require("express");
const cors = require("cors");

const app = express();

const bodyParser = require("body-parser");
const parser = require("./config/multer");

const friendRoute = require("./Routers/FriendRouter");
const authRoute = require("./Routers/AuthRouter");
const userRoute = require("./Routers/UserRouter");
const postRoute = require("./Routers/PostRouter");
const commentRoute = require("./Routers/CommentRouter");
const likeRoute = require("./Routers/LikeRouter");
const roomRoute = require("./Routers/RoomRouter");
const messageRoute = require("./Routers/MessageRouter")
const NotificationRoute = require ('./Routers/NotificationRouter');

const initWebSocketServer = require("./middleware/socket");
const { ConnectRabbitMQ } = require("./services/messageQueue/rabbitMq");
const { authenticateToken } = require("./middleware/authorization");
const { connectDB } = require("./config/mongodb");

connectDB();
// Middleware
app.use(bodyParser.json()); // This line already handles parsing JSON data
app.use(express.urlencoded({ extended: false })); // Parse application/x-www-form-urlencoded

// const corsOptions = {
//   origin: "http://localhost:3001",
// };
var corsOptions = {
  origin: 'https://lotus-socialmedia.pages.dev/' || "http://localhost:3001",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  // getting connection ip address
  // const ip = req.headers['x-forwarded-for'] ||
    //  req.socket.remoteAddress ||
    //  null;
  // res.send("ip: " + ip)
})
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/post", postRoute);
app.use("/api/post/comments", commentRoute);
app.use("/api/friends", friendRoute );
app.use("/api/like", likeRoute);
app.use("/api/chats", roomRoute);
app.use("/api/message", messageRoute);
app.use('/api/notification', NotificationRoute);
app.use("/1test", parser.single("avatar"), (req, res) => {
  const file = req.file;
  console.log(file);
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`App running on port: ${PORT}`);
}); 

const wss = initWebSocketServer(server);
if (wss) { 
  const address = server.address();
  console.log(address)
  console.log("WebSocket server is running and listening for connections.");
} else {
  console.log("Failed to start WebSocket server.");
}
