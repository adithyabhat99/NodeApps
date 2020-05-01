const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  
  // When user wants to join a room
  socket.on("join", (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });
    if (error) {
      return callback(error);
    }
    socket.join(user.room);
    // Send a welcome message
    socket.emit(
      "message",
      generateMessage("admin", `Welcome ${user.username}`)
    );
    // Broadcast a new user has joined to everyone in the room(except the new user)
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage("admin", `${user.username} has joined!`)
      );

    io.to(user.room).emit("roomdata", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  // When client sends a message
  socket.on("sendmessage", (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed :(");
    }

    const user = getUser(socket.id);

    io.to(user.room).emit("message", generateMessage(user.username, message));
    callback("Message sent!");
  });

  // When user sends location
  socket.on("sendlocation", (coords, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "locationMessage",
      generateLocationMessage(user.username, coords)
    );
    callback("Location sent!");
  });

  // When user disconnects
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage("admin", `${user.username} has left`)
      );
      io.to(user.room).emit("roomdata", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

// Start server
server.listen(port, () => {
  console.log("Server started in port ", port);
});


// socket.emit = emit to a specific client
// io.emit = emit to all clients
// socket.broadcast.emit = emit to all clinets except current client
// socket.to("roomname").emit, socket.broadcast.to("roomname").emit is  emit with rooms 
