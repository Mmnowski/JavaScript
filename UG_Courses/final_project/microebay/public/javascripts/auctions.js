$(document).ready(function () {
  $("#add-auction").on("click", () => {
    location.href = "/auctions/add"
  })

  $("#auction-list").on("click", "#auction-details", (e) => {
    var auctionID = $(e.target).attr('data-id');
    location.href = "/auctions/" + auctionID;
  })

  $("#auction-edit").on("click", (e) => {
    var auctionID = $("#auction-edit").attr('data-id');
    location.href = "/auctions/" + auctionID + "/edit";
  })

  $("#auction-start").on("click", (e) => {
    var auctionID = $("#auction-start").attr('data-id');
    location.href = "/auctions/" + auctionID + "/start";
  })

  $("#auction-contact").on("click", (e) => {
    var ownerID = $("#auction-contact").attr('data-id');
    location.href = "/messages/" + ownerID;
  })
});