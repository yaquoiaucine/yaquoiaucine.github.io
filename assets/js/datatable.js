function format(data) {
    var text = '<table cellpadding="5" cellspacing="0" border="0">' +
        '<tr role="row">' +
        '<td><img id="td_picture" src="' + data.picture + '"></td>' +
        '<td>Informations du film :' +
        '<br /><br /><a href="http://www.allocine.fr/' + data.url + '" target="_blank">Fiche Allociné</a>' +
        '<br /><br />' + data.date + ' / ' + data.duration + ' / ' + data.genre;

    if (data.director != "") text += '<br /><br />De ' + data.director;
    if (data.mainActors != "") text += '<span><br /><br />Avec ' + data.mainActors + '</span>';

    text += '</td>' +
        '</tr>' +
        '</table>';

    return text;
}

$(document).ready(function() {
    var data = {
        "ajax": "https://yaquoiaucine.fr/assets/js/data.js",
        "columns": [{
                "className": 'details',
                "orderable": false,
                "data": null,
                "defaultContent": ''
            },
            {
                "data": "title"
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.telerama == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.telerama != "") var res = parseFloat(row.telerama).toFixed(1);

                    return res;
                }
            },
            {
                "data": "critic"
            },
            {
                "data": "user"
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var checkBox = document.getElementById("Telerama");

                    if (checkBox.checked == true) {
                        var res = (parseFloat(row.critic) + parseFloat(row.user)) / 2;
                    } else {
                        if (row.telerama == "") var res = (parseFloat(row.critic) + parseFloat(row.user)) / 2;
                        if (row.telerama != "") var res = (parseFloat(row.telerama) + parseFloat(row.critic) + parseFloat(row.user)) / 3;
                    }

                    return res.toFixed(2);
                }
            }
        ],
        "pageLength": 100,
        "order": [5, 'desc'],
        "paging": false,
        "info": false
    }

    var table = $('#table').DataTable(data);

    $('#table tbody').on('click', 'td.details', function() {
        var tr = $(this).closest('tr');
        var row = table.row(tr);

        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown');
        } else {
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
    });

    $('input[type=checkbox]').on('click', function() {
        table.destroy();
        table = $('#table').DataTable(data);

        var checkBox = document.getElementById("Telerama");
        var columnNum = table.column($(this).attr('data-column'));

        if (checkBox.checked == true) {
            table.column(columnNum).visible(true);
        } else {
            table.column(columnNum).visible(false);
        }
    });
});