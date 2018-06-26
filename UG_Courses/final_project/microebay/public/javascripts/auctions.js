$(document).ready(function () {
  let socket;
  socket = io.connect(`http://${location.host}/auctions`);

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
    var state = 'finished';
    socket.emit('update', { state: state, auction: auctionID });
    location.href = "/auctions/" + auctionID + "/start";
  })

  $("#auction-contact").on("click", (e) => {
    var ownerID = $("#auction-contact").attr('data-id');
    location.href = "/messages/" + ownerID;
  })

  $("#bid-button").on("click", (e) => {
    var price = $('#bid-form').val();
    var auctionID = $("#bid-button").attr('data-auc');
    socket.emit('update', { price: price, auction: auctionID });
  })

  $("#buy-button").on("click", (e) => {
    var price = $(e.target).data(id);
    var auctionID = $("#buy-button").attr('data-auc');
    var state = 'finished';
    socket.emit('update', { price: price, state: state, auction: auctionID });
  })

  //sockets
  socket.on('changeView', (data) => {
    var status = $(`${data.auction}`);
    var bidText = status.find('#bid-text');

    status.empty();
    status.innerHtml = `Current status: ${data.state}`;
    bidText.empty();
    bidText.innerHtml = `Current bid: ${data.price}`;
  });

});