
const io = require("socket.io")(3002, {
  cors: {
    origin: "http://127.0.0.1:5501", // Allow requests from your frontend
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
