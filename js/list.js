const user_id = 1;
const apiUrl = "http://localhost:3001";
const contactsList = document.getElementById("contacts-list");

async function getFriends(userid) {
  try {
    const response = await $.ajax({
      url: `${apiUrl}/user/usersbyid`,
      type: "POST",
      beforeSend: () => {
        $("#contacts-list").html("");
        // console.log(user_id);
      },
      data: JSON.stringify({ data: userid }),
      contentType: "application/json",
    });

    //   console.log("Response received:", response);
    return response;
  } catch (err) {
    console.error("Error occurred:", err);
    throw err;
  }
}

const contacts = getFriends(1)
  .then((contacts) => {
    contacts.forEach((contact) => {
      if (document.querySelector(`[data-id='${contact.unique_id}']`)) {
        console.log(`Duplicate entry for ID: ${contact.unique_id}, skipping.`);
        return; // Skip duplicate
      }
      // console.log(contact);
      const listItem = document.createElement("li");
      listItem.classList.add("contact-item");

      // Avatar
      const avatar = document.createElement("div");
      avatar.classList.add("contact-avatar");
      avatar.textContent = contact.name.charAt(0).toUpperCase();

      // Contact details
      const details = document.createElement("div");
      details.classList.add("contact-details");

      const name = document.createElement("div");
      name.classList.add("contact-name");
      name.textContent = contact.name;

      // const userId = document.createElement("div");
      // userId.classList.add("contact-id");
      // userId.textContent = `User ID: ${contact.unique_id}`;

      details.appendChild(name);
      // details.appendChild(userId);

      // Chat button
      const chatButton = document.createElement("a");
      chatButton.href = `/chat?userid=${contact.unique_id}`;
      chatButton.classList.add("chat-button");
      chatButton.textContent = "Chat";

      listItem.appendChild(avatar);
      listItem.appendChild(details);
      listItem.appendChild(chatButton);

      contactsList.appendChild(listItem);
    });
  })
  .catch((err) => {
    console.error("Error fetching contacts:", err);
  });
