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

      console.log("Response received:", response);
    return response;
  } catch (err) {
    console.error("Error occurred:", err);
    throw err;
  }
}

$("#menubox").on("click", (event) => {
  event.stopPropagation();
  $(".menuboxclass").toggle(500);
  $(".search-box").fadeOut(500);
});

$("#searchbox").on("click", (event) => {
  event.stopPropagation();
  $(".menuboxclass").fadeOut(500);
  $(".search-box").toggle(500);
});

$(window).on("click", () => {
  $(".menuboxclass").fadeOut(500);
  $(".search-box").fadeOut(500);
});

$(".menuboxclass, .search-box").on("click", (event) => {
  event.stopPropagation();
});