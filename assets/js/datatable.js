function format(data) {
    text = '<table cellpadding="5" cellspacing="0" border="0">' +
        '<tr role="row">' +
        '<td><img class="td_picture" src="' + data.picture + '"></td>' +
        '<td>Informations du film :' +
        '<br /><br /><a href="http://www.allocine.fr/' + data.url + '" target="_blank">Fiche Allociné</a>' +
        '<br /><br />' + data.date + ' / ' + data.duration + ' / ' + data.genre +
        '<br /><br />De ' + data.director;

    if (data.mainActors != "") {
        text += '<span><br /><br />Avec ' + data.mainActors + '</span>';
    }

    text += '</td>' +
        '</tr>' +
        '</table>';

    return text;
}

$(document).ready(function() {
    var table = $('#table').DataTable({
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
                "data": "critic"
            },
            {
                "data": "user"
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.critic == "") {
                        row.critic = 0;
                    }
                    if (row.user == "") {
                        row.user = 0;
                    }
                    var res = (parseFloat(row.critic) + parseFloat(row.user)) / 2;
                    return res.toFixed(2);
                }
            }
        ],
        "pageLength": 100,
        "order": [4, 'desc'],
        "paging": false,
        "info": false
    });

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
});