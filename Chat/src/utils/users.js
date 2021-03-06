const users = [];

const addUser = ({ id, username, room }) => {
  // Clean data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  // Validate data
  if (!username || !room) {
    return {
      error: "username and room are required",
    };
  }
  // Check for existing user
  const existsUser = users.find((user) => {
    return user.room === room && user.username === username;
  });
  if (existsUser || username == "admin") {
    return {
      error: "username already exists in the room",
    };
  }
  // Store user
  const user = { id, username, room };
  users.push(user);
  return {
    user,
  };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id;
  });
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  return users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
