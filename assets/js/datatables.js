// Display extra information for every movie
function format(data) {
    var text = "<table cellpadding=\"5\" cellspacing=\"0\" border=\"0\">" +
        "<tr role=\"row\">" +
        "<td><img id=\"td_picture\" src=\"" + data.picture + "\"></td>" +
        "<td>Informations du film :" +
        "<br /><br /><a href=\"http://www.allocine.fr/" + data.url + "\" target=\"_blank\">Fiche Allociné</a>" +
        "<br /><br />" + data.date + " / " + data.duration + " / " + data.genre;

    if (data.director != "") text += "<br /><br />De " + data.director;
    if (data.mainActors != "") text += "<span><br /><br />Avec " + data.mainActors + "</span>";

    text += "</td>" +
        "</tr>" +
        "</table>";

    return text;
}

$(document).ready(function() {
    var data = {
        "ajax": "https://yaquoiaucine.fr/assets/js/data.js",
        "columns": [{
                "className": "details",
                "orderable": false,
                "data": null,
                "defaultContent": ""
            },
            {
                "data": "title"
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.minutes == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.minutes != "") var res = parseFloat(row.minutes).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.avoiralirecom == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.avoiralirecom != "") var res = parseFloat(row.avoiralirecom).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.bandeapart == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.bandeapart != "") var res = parseFloat(row.bandeapart).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.cultureboxfrancetelevisions == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.cultureboxfrancetelevisions != "") var res = parseFloat(row.cultureboxfrancetelevisions).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.cahiersducinema == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.cahiersducinema != "") var res = parseFloat(row.cahiersducinema).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.cinemateaser == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.cinemateaser != "") var res = parseFloat(row.cinemateaser).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.culturopoingcom == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.culturopoingcom != "") var res = parseFloat(row.culturopoingcom).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.dernieresnouvellesdalsace == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.dernieresnouvellesdalsace != "") var res = parseFloat(row.dernieresnouvellesdalsace).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.ecranlarge == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.ecranlarge != "") var res = parseFloat(row.ecranlarge).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.laseptiemeobsession == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.laseptiemeobsession != "") var res = parseFloat(row.laseptiemeobsession).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.lavoixdunord == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.lavoixdunord != "") var res = parseFloat(row.lavoixdunord).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.lci == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.lci != "") var res = parseFloat(row.lci).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.lejournaldudimanche == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.lejournaldudimanche != "") var res = parseFloat(row.lejournaldudimanche).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.lenouvelobservateur == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.lenouvelobservateur != "") var res = parseFloat(row.lenouvelobservateur).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.leparisien == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.leparisien != "") var res = parseFloat(row.leparisien).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.lepoint == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.lepoint != "") var res = parseFloat(row.lepoint).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.lesfichesducinema == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.lesfichesducinema != "") var res = parseFloat(row.lesfichesducinema).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.lhumanite == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.lhumanite != "") var res = parseFloat(row.lhumanite).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.liberation == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.liberation != "") var res = parseFloat(row.liberation).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.marianne == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.marianne != "") var res = parseFloat(row.marianne).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.ouestfrance == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.ouestfrance != "") var res = parseFloat(row.ouestfrance).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.parismatch == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.parismatch != "") var res = parseFloat(row.parismatch).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.positif == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.positif != "") var res = parseFloat(row.positif).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.premiere == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.premiere != "") var res = parseFloat(row.premiere).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.sudouest == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.sudouest != "") var res = parseFloat(row.sudouest).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.teleloisirs == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.teleloisirs != "") var res = parseFloat(row.teleloisirs).toFixed(1);

                    return res;
                }
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
                "data": null,
                "render": function(data, type, row) {
                    if (row.transfuge == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.transfuge != "") var res = parseFloat(row.transfuge).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.voici == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.voici != "") var res = parseFloat(row.voici).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.cnews == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.cnews != "") var res = parseFloat(row.cnews).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.lacroix == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.lacroix != "") var res = parseFloat(row.lacroix).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.lefigaro == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.lefigaro != "") var res = parseFloat(row.lefigaro).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.lemonde == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.lemonde != "") var res = parseFloat(row.lemonde).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.lesinrockuptibles == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.lesinrockuptibles != "") var res = parseFloat(row.lesinrockuptibles).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.madmovies == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.madmovies != "") var res = parseFloat(row.madmovies).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.rollingstone == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.rollingstone != "") var res = parseFloat(row.rollingstone).toFixed(1);

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.critikatcom == "") var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    if (row.critikatcom != "") var res = parseFloat(row.critikatcom).toFixed(1);

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
                    var res = (parseFloat(row.critic) + parseFloat(row.user)) / 2;

                    return res.toFixed(2);
                }
            }
        ],
        "pageLength": 100,
        "order": [41, "desc"],
        "paging": false,
        "info": false,
        "language": {
            search: "<i class=\"fas fa-search\"></i>",
            searchPlaceholder: "Rechercher un film"
        }
    }

    var table = $("#table").DataTable(data);

    $("#table tbody").on("click", "td.details", function() {
        var tr = $(this).closest("tr");
        var row = table.row(tr);

        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass("shown");
        } else {
            row.child(format(row.data())).show();
            tr.addClass("shown");
        }
    });

    var checkboxValues = JSON.parse(localStorage.getItem("checkboxValues")) || {},
        max = 15,
        checkboxes = $("#checkbox-container :checkbox");

    if (Object.keys(checkboxValues).length == 0) {
        for (var i = 2; i <= 38; i++) {
            table.column(i).visible(false, false);
        }
    }

    checkboxes.change(function() {
        table.destroy();
        table = $("#table").DataTable(data);

        checkboxes.each(function() {
            checkboxValues[this.id] = this.checked;
            var columnNum = document.getElementById(this.id).getAttribute("data-column");
            table.column(columnNum).visible(this.checked);
        });

        localStorage.setItem("checkboxValues", JSON.stringify(checkboxValues));
        var current = checkboxes.filter(":checked").length;
        checkboxes.filter(":not(:checked)").prop("disabled", current >= max);
    });

    $.each(checkboxValues, function(key, value) {
        $("#" + key).prop("checked", value);
        var columnNum = document.getElementById(key).getAttribute("data-column");
        table.column(columnNum).visible(value);
        var current = checkboxes.filter(":checked").length;
        checkboxes.filter(":not(:checked)").prop("disabled", current >= max);
    });

    width = $(window).width();
    checkboxContainer = document.getElementById("checkbox-container");

    if (width < 1415) {
        checkboxContainer.classList.add("hide");
        for (var i = 2; i <= 38; i++) {
            table.column(i).visible(false, false);
        }
    }
});