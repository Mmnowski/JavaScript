$(document).ready(function () {
  $("#user-main").on("click", () => {
    location.href = "/profile"
  })
  $("#user-auctions").on("click", () => {
    location.href = "/profile/owner"
  })
  $("#user-current").on("click", () => {
    location.href = "/profile/current"
  })
  $("#user-finished").on("click", () => {
    location.href = "/profile/finished"
  })
  $("#auction-list").on("click", "#auction-details", (e) => {
    var auctionID = $(e.target).attr('data-id');
    location.href = "/auctions/" + auctionID;
  })
});