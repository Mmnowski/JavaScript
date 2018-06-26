$(document).ready(function () {
  $("#register-button").on("click", () => {
    location.href = "/users/register"
  })
  $("#login-button").on("click", () => {
    location.href = "/users/login"
  })
  $("#logout-button").on("click", () => {
    location.href = "/users/logout"
  })
  $("#profile-button").on("click", () => {
    location.href = "/profile"
  })
  $("#auctions-button").on("click", () => {
    location.href = "/auctions"
  })
  $("#messages-button").on("click", () => {
    location.href = "/messages"
  })
  $("#logo").on("click", () => {
    location.href = "/"
  })
});