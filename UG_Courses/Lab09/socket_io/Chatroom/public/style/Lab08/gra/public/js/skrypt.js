/*jshint jquery: true, devel: true */
$(function () {

    var size;
    var dim;
    var max;
    var results = "";
    var temp;

    if (sessionStorage.getItem("game") !== null) {
        $("#size").val(sessionStorage.getItem("game.gameConfig.size"));
        $("#dim").val(sessionStorage.getItem("game.gameConfig.dim"));
        $("#max").val(sessionStorage.getItem("game.gameConfig.max"));

        if (sessionStorage.getItem("results") !== null) {
            $("#results").empty().append(sessionStorage.getItem("results"));
            results = sessionStorage.getItem("results");
        }
    }

    $("#play").click(function () {

        sessionStorage.clear();
        location.reload();

        if ($("#size").val().length !== 0) {
            size = $("#size").val();
        }
        if ($("#dim").val().length !== 0) {
            dim = $("#dim").val();
        }
        if ($("#max").val().length !== 0) {
            max = $("#max").val();
        }

        $("#move").val(null);

        $.ajax({
            method: "POST",
            url: "/play",
            data: JSON.stringify({ size: size, dim: dim, max: max }),
            contentType: "application/json"
        })
            .done(function (data) {
                alert(data.kod);
                sessionStorage.setItem("game.gameData", data.kod);
                sessionStorage.setItem("game.gameConfig.size", data.size);
                sessionStorage.setItem("game.gameConfig.dim", data.dim);
                sessionStorage.setItem("game.gameConfig.max", data.max);
            });
        location.reload();
    });

    if (sessionStorage.getItem("guess") !== null) {
        $("#move").val(sessionStorage.getItem("guess"));
    }

    $("#mark").click(function () {
        move = JSON.parse("[" + $("#move").val() + "]");
        sessionStorage.setItem("guess", $("#move").val());
        $.ajax({
            method: "POST",
            url: "/mark",
            data: JSON.stringify({ move: move }),
            contentType: "application/json"
        })
            .done(function (data) {

                if (parseInt(sessionStorage.getItem("game.gameConfig.max")) > 0) {

                    temp = parseInt(sessionStorage.getItem("game.gameConfig.max")) - 1;

                    sessionStorage.setItem("game.gameConfig.max", temp);

                    if (parseInt(sessionStorage.getItem("game.gameConfig.max")) === 0) {
                        if (parseInt(data.czarne) === parseInt(sessionStorage.getItem("game.gameConfig.size"))) {
                            alert("Wygrałeś!");
                            sessionStorage.clear();
                            location.reload();
                        }
                        else {
                            alert("Przegrałeś!");
                            sessionStorage.clear();
                            location.reload();
                        }
                    }

                }

                if (parseInt(data.czarne) === parseInt(sessionStorage.getItem("game.gameConfig.size"))) {
                    alert("Wygrałeś!");
                    sessionStorage.clear();
                    location.reload();
                }

                else {

                    results += "<br><br>Czarne : " + data.czarne + ", Biale :  " + data.biale + "<br><input type='text' id='move' value='" + $("#move").val() + "' disabled>";

                    $("#results").empty().append(results);

                    sessionStorage.setItem("results", results);
                }
            });

    });

});
