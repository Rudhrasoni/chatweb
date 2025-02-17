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
  $(document).ready(function () {
    $("#attach-button").click(function () {
      $("#attachment-menu").toggle();
    });
  
    $(".attachment-option").click(function () {
      let type = $(this).data("type");
  
      if (type === "photo" || type === "document") {
        let fileInput = $("#file-input");
        fileInput.data("type", type);
        fileInput.click();
      } else if (type === "contact") {
        previewAttachment("contact", "Contact selection coming soon!");
      }
    });
  
    // Handle file selection
    $("#file-input").change(function (event) {
      let file = event.target.files[0];
      let fileType = $(this).data("type");
  
      if (!file) return;
  
      let reader = new FileReader();
      reader.onload = function (e) {
        if (fileType === "photo") {
          previewAttachment("image", e.target.result, file);
        } else if (fileType === "document") {
          previewAttachment("document", file.name, file);
        }
      };
  
      if (fileType === "photo") {
        reader.readAsDataURL(file);
      } else if (fileType === "document") {
        previewAttachment("document", file.name, file);
      }
    });
  
    // Function to preview attachment
    function previewAttachment(type, content, file = null) {
      let previewContainer = $("#attachment-preview");
      previewContainer.empty(); // Clear previous previews
  
      let previewHTML = "";
      if (type === "image") {
        previewHTML = `<div class="preview-item">
                        <img src="${content}" alt="Preview Image" class="preview-img">
                        <div>
                        <span class="remove-preview">&times;</span>
                        <button id="send-attachment" class="send-button"><i class="fa-solid fa-paper-plane"></i></button>
                        </div>
                      </div>`;
      } else if (type === "document") {
        previewHTML = `<div class="preview-item">
                        <span style="align-self: flex-start">
                        <i class="fa-solid fa-file"></i> ${content}
                        </span>
                        <div>
                        <span class="remove-preview">&times;</span>
                        <button id="send-attachment" class="send-button"><i class="fa-solid fa-paper-plane"></i></button>
                        </div>
                      </div>`;
      } else if (type === "contact") {
        previewHTML = `<div class="preview-item">
                        <i class="fa-solid fa-user"></i> ${content}
                        <span class="remove-preview">&times;</span>
                        </div>`;
      }
  
  
      previewContainer.html(previewHTML).show();
  
      // Remove preview when clicking close
      $(".remove-preview").click(function () {
        previewContainer.hide().empty();
      });
  
      // Send attachment when clicking send button
      $("#send-attachment").click(function () {
        sendAttachment(type, file);
      });
    }
  
    // Function to send attachment to API
    function sendAttachment(type, file) {
      if (!file) {
        alert("No file selected!");
        return;
      }
  
      let formData = new FormData();
      formData.append("attachmentType", type);
      formData.append("file", file);
      if(type == "contact"){
        return;
      }
  
      $.ajax({
        url: "${apiUrl}/file/upload", // Replace with your API URL
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
          alert("Attachment sent successfully!");
          $("#attachment-preview").hide().empty();
        },
        error: function (xhr, status, error) {
          alert("Error sending attachment: " + error);
        },
      });
    }
  
    // Close menu when clicking outside
    $(document).click(function (event) {
      if (!$(event.target).closest("#attachment-menu, #attach-button").length) {
        $("#attachment-menu").hide();
      }
    });
  });
  