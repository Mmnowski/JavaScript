//jshint browser: true, esversion:6
//globals $
const input = '<input type="text">';

let select = false;
let rowSelected;

$(document).ready(function () {
    $('td').on('click', function (ev) {
        $('tr').removeClass("yellow");
        $(this).parent().addClass('yellow');
        rowSelected = $(this).parent();
        select = true;
        ev.stopPropagation();
    });
    $('body').on('click', function (ev) {
        $('tr').removeClass("yellow");
        rowSelected = null;
        select = false;
        ev.stopPropagation();
    });
    $('td').on('dblclick', function (e) {
        var value = $(this).text();
        console.log(value);
        $(this).html(input);
        $('input').val(value);
        $('input').on('keypress', function (ev) {
            if(ev.key === 'Enter'){
                var text = $(this).val();
                $('input').replaceWith(`${text}`);
            }
        });
    });
    $('body').keydown(function (e) {
        if (e.key === 'ArrowUp' && select) {
            $(rowSelected).after($(rowSelected).prev());
        }
        else if (e.key === 'ArrowDown' && select) {
            $(rowSelected).before($(rowSelected).next());
        }
    });

});
