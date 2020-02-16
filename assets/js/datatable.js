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
                    if (row.critic == "") var res = parseFloat(row.user);
                    if (row.user == "") var res = parseFloat(row.critic);
                    if ((row.critic != "") && (row.user != "")) var res = (parseFloat(row.critic) + parseFloat(row.user)) / 2;

                    return res.toFixed(2);
                }
            }
        ],
        "pageLength": 100,
        "order": [5, 'desc'],
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