if (!user) {
  window.location.href = "/user/logout";
}

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

