const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const chatRoutes = require("./routes/messages")
const userRoutes = require("./routes/user")
const { logRequests } = require("./middlewares")

app.use('/js', express.static(path.join(__dirname, 'js')));

app.use(cors());

app.use(express.json());
app.use(logRequests('./logs/logs.txt'))

app.set("view engine", "ejs");
app.set("views", path.resolve("./view"));
app.use("/message", chatRoutes);
app.use("/user", userRoutes);
app.get('/friends', (req, res) => {
  return res.render('list');
})
app.get('/chat', (req, res) => {
  return res.render('chats');
})
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


////////////////////////////////////////////////////



const io = require("socket.io")(3002, {
  cors: {
    origin: '*', // Allow requests from your frontend
    methods: ["GET", "POST"],
  },
});


const users = {}    //create a users object

io.on('connection', socket => {
  socket.on('new-user', user => {     //when new-user is emited
      users[socket.id] = user         //create a key value pair based on socket.id
      socket.broadcast.emit('user-joined', user)  //send the message to everyone that this user joined
  })
  socket.on('send-message', message => {  
      socket.broadcast.emit('message', { message: message, user: users[socket.id] })  
      //instead of just sending message, we now send an object with a message key
      // and a user pulled out of our users object
  })
})
