if (!user) {
  window.location.href = "/user/logout";
}
const socket = io("http://localhost:3002");
socket.on("connect", () => {
  console.log("Connected to server");
});
const padZero = (num) => String(num).padStart(2, "0");

function getCurrentDateTime() {
  const currentdate = new Date();
  const date = `${padZero(currentdate.getDate())}/${padZero(
    currentdate.getMonth() + 1
  )}/${currentdate.getFullYear()}`;
  const time = `${padZero(currentdate.getHours())}:${padZero(
    currentdate.getMinutes()
  )}:${padZero(currentdate.getSeconds())}`;
  return `${date} ${time}`;
}

function convertTo12HourFormat(time24) {
  const [hours, minutes] = time24.split(":");
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${padZero(hour12)}:${minutes} ${period}`;
}

function sendData(input, userdata) {
  if (!input) return;
  const encodedInput = encodeURIComponent(input);
  const time = getCurrentDateTime();
  const data = `${userdata}${delimiter}${encodedInput}${delimiter}${time}`;
  const sender = userdata.split("~");
  if (sender[0] == user) {
    socket.emit("send-message", input, touser);
  }

  $.ajax({
    url: `${apiUrl}/message/write`,
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
  if (userid == user) addMessage(input, "received", formattedTime);
}
socket.on("message", (data) => {
  if (data.sender != user) {
    sendData(data.message, data.sender + "~" + user);
  }
  recesivedata(data.message, data.sender);
});

function parseMessageData(response) {
  if (!response) return;

  const showData = response.fileData.split(", ");
  showData.forEach((entry) => {
    if (!entry) return;

    const parts = entry.split(delimiter);
    if (parts.length >= 3) {
      const senderdata = parts[0].trim();
      const senderarray = user + "~" + touser;
      const senderarray1 = touser + "~" + user;
      const message = decodeURIComponent(parts[1].trim()) || "No message";
      const dateTime = parts[2].trim() || "Unknown date/time";

      const [date, time] = dateTime.split(" ");
      const formattedTime = time ? convertTo12HourFormat(time) : "Unknown time";
      if (senderdata == senderarray || senderdata == senderarray1) {
        const sender = senderdata.split("~");
        const messageType =
          sender[0] === String(user)
            ? "sent"
            : sender[0] === String(touser)
            ? "received"
            : "else";
        if (messageType !== "else") {
          addMessage(message, messageType, formattedTime);
        }
      }
    }
  });
}

function read(userid) {
  $.ajax({
    url: `${apiUrl}/message/read`,
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

function convertLinksToClickable(text) {
  const urlPattern = /((https?:\/\/|www\.)[^\s]+)/g;
  return text.replace(urlPattern, (url) => {
    let href = url.startsWith("http") ? url : "https://" + url;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
}

function addMessage(text, type, time) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", type);

  const contentElement = document.createElement("div");
  contentElement.classList.add("content");

  if (/https?:\/\/[^\s]+/.test(text)) {
    const link = document.createElement("a");
    link.href = text.startsWith("http") ? text : "https://" + text;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = text;
    contentElement.appendChild(link);
  } else {
    contentElement.textContent = text;
  }

  const timeElement = document.createElement("div");
  timeElement.classList.add("time");
  timeElement.textContent = time;

  contentElement.appendChild(timeElement);
  messageElement.appendChild(contentElement);

  const chatMessages = document.getElementById("chat-messages");
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

sendButton.addEventListener("click", () => {
  const messageText = messageInput.value.trim();
  const userdata = user + "~" + touser;
  if (messageText) {
    sendData(messageText, userdata);
    addMessage(
      messageText,
      "sent",
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
    messageInput.value = "";
  }
});

messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendButton.click();
  }
});

read();
