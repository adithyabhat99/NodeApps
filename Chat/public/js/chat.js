const socket = io();

const messageText = document.getElementById("messagetext");
const submit = document.getElementById("messagesubmit");
const locationButton = document.getElementById("location");
const messages = document.getElementById("messages");
const sidebar = document.getElementById("sidebar");
const serverMessge = document.getElementById("serverMessge");

// Templates
const messageTemplate = document.getElementById("message-template").innerHTML;
const locationTemplate = document.getElementById("location-template").innerHTML;
const sideBarTemplate = document.getElementById("sidebar-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoScroll = () => {
  // Get new message
  const newMessage = messages.lastElementChild;
  // Get the height of last message
  const newMessageStyles = getComputedStyle(newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin;
  // Visible height
  const visibleHeight = messages.offsetHeight;
  // Height of messages container
  const containerHeight = messages.scrollHeight;
  // How far have I scrolled
  const scrollOffset = messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    messages.scrollTop = messages.scrollHeight;
  }
};

// Server emits
socket.on("message", (msg) => {
  const message = msg.message;
  const username1 = msg.username;
  const createdAt = moment(msg.createdAt).format("h:mm a");
  const html = Mustache.render(messageTemplate, {
    message,
    createdAt,
    username: username1,
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("locationMessage", (msg) => {
  const url = msg.url;
  const username1 = msg.username;
  const createdAt = moment(msg.createdAt).format("h:mm a");
  const html = Mustache.render(locationTemplate, {
    url,
    createdAt,
    username: username1,
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("roomdata", ({ room, users }) => {
  const html = Mustache.render(sideBarTemplate, {
    room,
    users,
  });
  sidebar.innerHTML = html;
});

// Client emits
submit.addEventListener("click", (event) => {
  event.preventDefault();
  const message = messageText.value;
  messageText.focus();
  if (message) {
    submit.setAttribute("disabled", "disabled");
    messageText.value = " ";
    serverMessge.innerText = "Sending message...";
    socket.emit("sendmessage", message, (ack) => {
      serverMessge.innerText = ack;
      submit.removeAttribute("disabled");
    });
  }
});

locationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }
  serverMessge.innerText = "Sending location...";
  navigator.geolocation.getCurrentPosition((position) => {
    locationButton.setAttribute("disabled", "disabled");
    socket.emit(
      "sendlocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      (ack) => {
        serverMessge.innerText = ack;
        locationButton.removeAttribute("disabled");
      }
    );
  });
});

// Join room
socket.emit("join", { username, room }, (error) => {
  if (error) {
    location.href = "/";
    alert(`Could'nt join ${room} \n Error: ${error}`);
  }
});
