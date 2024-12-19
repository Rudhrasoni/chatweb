(() => {
  const socket = io("http://localhost:3002");
  socket.on("connect", () => {
    console.log("Connected to server");
  });
  const user = prompt("Who are you");
  const touser = 2;
  const apiUrl = "http://localhost:3001";
  const delimiter = "|^|"; // Unique delimiter

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

  // Convert time from 24-hour format to 12-hour format with AM/PM
  function convertTo12HourFormat(time24) {
    const [hours, minutes] = time24.split(":");
    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12; // Convert 0 to 12 for midnight
    return `${padZero(hour12)}:${minutes} ${period}`;
  }

  // Send data to the API
  function sendData(input) {
    if (!input) return;
    const encodedInput = encodeURIComponent(input);
    const time = getCurrentDateTime();
    const data = `${user}${delimiter}${encodedInput}${delimiter}${time}`;

    $.ajax({
      url: `${apiUrl}/write`,
      type: "POST",
      data: JSON.stringify({ data }),
      contentType: "application/json",
      success: () => console.log("Message sent successfully"),
      error: (xhr, status, error) => console.error("Error:", status, error),
    });
  }
  function recesivedata(input) {
    if (!input) return;
    const encodedInput = encodeURIComponent(input);
    const time = getCurrentDateTime();
    const data = `${touser}${delimiter}${encodedInput}${delimiter}${time}`;

    $.ajax({
      url: `${apiUrl}/write`,
      type: "POST",
      data: JSON.stringify({ data }),
      contentType: "application/json",
      success: () => console.log("Message sent successfully"),
      error: (xhr, status, error) => console.error("Error:", status, error),
    });
  }
    socket.on('message', data => {
      recesivedata();
      read();
  })

  // Parse the message data returned by the server
  function parseMessageData(response) {
    if (!response) return;

    const showData = response.fileData.split(", ");
    showData.forEach((entry) => {
      if (!entry) return;

      const parts = entry.split(delimiter);
      if (parts.length >= 3) {
        const sender = parts[0].trim();
        const message = decodeURIComponent(parts[1].trim()) || "No message";
        const dateTime = parts[2].trim() || "Unknown date/time";

        const [date, time] = dateTime.split(" ");
        const formattedTime = time
          ? convertTo12HourFormat(time)
          : "Unknown time";
        const messageType = sender === String(user) ? "sent" : "received";

        addMessage(message, messageType, formattedTime);
      }
    });
  }

  // Read the messages from the server
  function read() {
    $.ajax({
      url: `${apiUrl}/read`,
      type: "GET",
      success: parseMessageData,
      error: (xhr, status, error) => console.error("Error:", status, error),
    });
  }

  // Convert any URLs in the message text into clickable links
  function convertLinksToClickable(text) {
    const urlPattern = /((https?:\/\/|www\.)[^\s]+)/g;
    return text.replace(urlPattern, (url) => {
      let href = url.startsWith("http") ? url : "https://" + url;
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
  }

  // Add a message to the chat window
  function addMessage(text, type, time) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", type);

    const contentElement = document.createElement("div");
    contentElement.classList.add("content");

    // Check if the text is a URL and create a link if so
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

  // Event listeners for sending messages
  const messageInput = document.getElementById("message-input");
  const sendButton = document.getElementById("send-button");

  sendButton.addEventListener("click", () => {
    const messageText = messageInput.value.trim();
    if (messageText) {
      sendData(messageText);
      // let sendobj = {
      //   message : messageText,
      //   user : user
      // }
      socket.emit("send-message", messageText);
      read();
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

  // Initial read when the page loads
  read();
})();
