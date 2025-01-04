const socket = io("http://192.168.47.220:3002");

// Prompt the user to enter their name and join the chat
const userName = prompt("Enter your name to join the group chat:");
if (userName) {
  socket.emit("new-user", userName); // Notify the server of the new user
} else {
  return;
}

// Listen for new users joining
socket.on("user-joined", (user) => {
  console.log(`${user} has joined the group chat.`);
  addMessage(`${user} joined the chat`, "system");
});

// Sending a group message
function sendGroupMessage(message) {
  if (message.trim()) {
    socket.emit("send-group-message", message); // Emit the message to the server
    addMessage(`You: ${message}`, "sent"); // Display the message in the UI
  }
}

// Listening for incoming group messages
socket.on("group-message", (data) => {
  const { message, user } = data;
  console.log(`${user}: ${message}`);
  addMessage(`${user}: ${message}`, "received"); // Display received message
});

// Handle user leaving
socket.on("user-left", (user) => {
  console.log(`${user} has left the group chat.`);
  addMessage(`${user} left the chat`, "system"); // Notify others about the user leaving
});

// Add a message to the chat UI
function addMessage(text, type) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");

  if (type === "system") {
    messageElement.classList.add("join-notice");
  } else {
    messageElement.classList.add(type);
  }

  messageElement.textContent = text;

  const chatBox = document.getElementById("chat-box");
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the latest message
}

// Event listener for sending messages via the form
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

messageForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent form submission
  const message = messageInput.value;
  sendGroupMessage(message); // Call the function to send a message
  messageInput.value = ""; // Clear the input field
});

// Handle "Enter" key for sending messages
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // Prevent a new line
    messageForm.dispatchEvent(new Event("submit")); // Trigger form submission
  }
});
