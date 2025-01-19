const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const app = express();

const { logRequests, checksession, checkAuth } = require("./middlewares");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/messages");

app.set("view engine", "ejs");
app.set("views", path.resolve("./view"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/js", express.static(path.join(__dirname, "js")));

app.use(logRequests("./logs/logs.txt"));
app.get("/login",checkAuth, (req, res) => {
  const user = req.user;
  if(user) return res.redirect('/');
  return res.render("login", {
    page: 1,
    registered: 3,
  });
});
app.use("/user", checkAuth, userRoutes);

app.use(checksession()); /// Need Access 

app.use("/message", chatRoutes);
app.get("/friends", (req, res) => {
  return res.render("list");
});
app.get("/chat", (req, res) => {
  const user = req.user;
  if(!user) return res.redirect('/login');
    return res.render("chats", {user});
});

app.get("/register", (req, res) => {
  return res.render("login", {
    page: 2,
    registered: 3,
  });
});
app.get("/world", (req, res) => {
  const user = req.user
  return res.render("group", {
    user
  });
});
app.get("/", (req, res) => {
  const user = req.user;
  return res.render("list", {
    user
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

////////////////////////////////////////////////////

const io = require("socket.io")(3002, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  },
});

const users = {};
io.on("connection", (socket) => {
  socket.on("new-user", (user) => {
    //when new-user is emited
    users[socket.id] = user; //create a key value pair based on socket.id
    socket.broadcast.emit("user-joined", user); //send the message to everyone that this user joined
  });
  socket.on("send-message", (message, sender) => {
    socket.broadcast.emit("message", {
      message: message,
      sender : sender,
      user: users[socket.id],
    });
  });
  socket.on("send-group-message", (message) => {
    const user = users[socket.id];
    if (user) {
      socket.broadcast.emit("group-message", { 
        message: message, 
        user: user
      }); 
    }
  });
  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      socket.broadcast.emit("user-left", user);
      delete users[socket.id];
    }
  });
});
