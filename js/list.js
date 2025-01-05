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