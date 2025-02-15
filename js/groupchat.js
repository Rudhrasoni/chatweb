const socket = io("http://localhost:3002");
socket.on("connect", () => {
  socket.emit('new-user', username);
});

socket.on('user-joined', user => {
  if(user != name){
    userNotify(`${user} has joined the chat!`)  
  }
})

function sendData(input, userdata) {
  if (!input) return;
  const encodedInput = encodeURIComponent(input);
  const time = getCurrentDateTime();
  const data = `${userdata}${delimiter}${encodedInput}${delimiter}${time}`;
  const sender = userdata.split("~");
  if (sender[0] == user) {
    console.log(input, username)
    socket.emit("send-group-message", input);
  }

  $.ajax({
    url: `${apiUrl}/message/group`,
    type: "POST",
    data: JSON.stringify({ data }),
    contentType: "application/json",
    success: () => {},
    error: (xhr, status, error) => console.error("Error:", status, error),
  });
}
function recesivedata(input, userid) {
  if (!input) return;
  const time = getCurrentDateTime();
  const formattedTime = time ? convertTo12HourFormat(time) : "Unknown time";
  addMessage(input, "received", formattedTime);
}
socket.on("group-message", (data) => {
  recesivedata(data.message, data.username);
});

function parseMessageData(response) {
  if (!response) return;
  const showData = response.fileData.split(", ");
  showData.forEach((entry) => {
    if (!entry) return;

    const parts = entry.split(delimiter);
    if (parts.length >= 3) {
      const senderdata = parts[0].trim();
      const message = decodeURIComponent(parts[1].trim()) || "No message";
      const dateTime = parts[2].trim() || "Unknown date/time";
      const [date, time] = dateTime.split(" ");
      const formattedTime = time ? convertTo12HourFormat(time) : "Unknown time";
        const sender = senderdata.split("~");
        if(sender[1] == touser){
          const messageType = sender[0] === String(user) ? "sent" : "received";
          addMessage(message, messageType, formattedTime);
        }
    }
  });
}

function read(userid) {
  $.ajax({
    url: `${apiUrl}/message/group`,
    type: "GET",
    beforeSend: () => {
      $("#chat-messages").html("");
    },
    data: {
      user: userid,
    },
    success: parseMessageData,
    error: (xhr, status, error) => console.error("Error:", status, error),
  });
}

function userNotify(text) {
  const textElement = document.createElement("span");
  textElement.classList.add("join-notice");
  textElement.textContent = text;

  const chatMessages = document.getElementById("chat-messages");
  chatMessages.appendChild(textElement);
}
