// Display extra information for every movie
function format(data) {
    var text = "<table cellpadding=\"5\" cellspacing=\"0\" border=\"0\">" +
        "<tr role=\"row\">" +
        "<td><img id=\"td_picture\" src=\"" + data.picture + "\"></td>" +
        "<td>Informations du film :" +
        "<br /><br /><a href=\"http://www.allocine.fr" + data.url + "\" target=\"_blank\">Fiche Allociné</a>" +
        "<br /><br />" + data.date + " / " + data.duration + " / " + data.genre;

    if (data.director != "") text += "<br /><br />De " + data.director;
    if (data.mainActors != "") text += "<span><br /><br />Avec " + data.mainActors + "</span>";

    text += "</td>" +
        "</tr>" +
        "</table>";

    return text;
}

$(document).ready(function() {
    // Get window width
    var width = $(window).width();

    // Get window height
    var height = $(window).height();

    var columnsVisibleState = [],
        columnsKeyName = [
            "20 Minutes",
            "BIBA",
            "Bande à part",
            "CNews",
            "Cahiers du Cinéma",
            "Charlie Hebdo",
            "CinemaTeaser",
            "Closer",
            "Critikat.com",
            "Culturebox - France Télévisions",
            "Culturopoing.com",
            "Dernières Nouvelles d'Alsace",
            "Ecran Large",
            "Elle",
            "Femme Actuelle",
            "L'Express",
            "L'Humanité",
            "LCI",
            "La Croix",
            "La Septième Obsession",
            "La Voix du Nord",
            "Le Dauphiné Libéré",
            "Le Figaro",
            "Le Journal du Dimanche",
            "Le Monde",
            "Le Nouvel Observateur",
            "Le Parisien",
            "Le Point",
            "Les Fiches du Cinéma",
            "Les Inrockuptibles",
            "Libération",
            "Mad Movies",
            "Marianne",
            "Marie Claire",
            "Ouest France",
            "Paris Match",
            "Positif",
            "Première",
            "Rolling Stone",
            "Sud Ouest",
            "Transfuge",
            "Télé 7 Jours",
            "Télé Loisirs",
            "Télérama",
            "Voici",
            "aVoir-aLire.com"
        ];

    // Set columns number
    var columnNumberOrder = columnsKeyName.length + 4,
        columnNumber = columnNumberOrder - 3;

    // If width > 767, fix the last 3 columns and add visibility buttons
    if (width > 767) {
        var scrollX = true,
            leftColumns = 0,
            rightColumns = 3,
            dom = "Bfrtip";
    } else {
        var scrollX = false,
            leftColumns = 0,
            rightColumns = 0,
            dom = "frtip";
    }

    if (columns != null) {
        var datatablesData = JSON.parse(window.localStorage.getItem("DataTables_table")),
            columns = datatablesData.columns;
    }

    Array.prototype.multiIndexOf = function(element) {
        var indexes = [];
        for (var i = this.length - 1; i >= 0; i--) {
            if (this[i] === element) {
                indexes.unshift(i);
            }
        }

        return indexes;
    };

    for (var column in columns) {
        if (columns.hasOwnProperty(column)) {
            if (column >= 2 && column <= columnNumber) {
                columnsVisibleState.push(columns[column].visible);
            }
        }
    }

    columnsNotVisibleIndexes = columnsVisibleState.multiIndexOf(false);

    for (var i = columnsNotVisibleIndexes.length - 1; i >= 0; i--) {
        columnsKeyName.splice(columnsNotVisibleIndexes[i], 1);
    }

    // Set datatables data
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
                    if (row[columnsKeyName[0]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[0]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[1]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[1]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[2]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[2]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[3]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[3]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[4]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[4]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[5]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[5]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[6]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[6]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[7]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[7]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[8]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[8]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[9]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[9]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[10]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[10]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[11]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[11]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[12]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[12]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[13]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[13]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[14]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[14]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[15]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[15]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[16]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[16]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[17]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[17]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[18]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[18]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[19]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[19]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[20]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[20]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[21]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[21]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[22]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[22]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[23]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[23]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[24]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[24]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[25]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[25]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[26]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[26]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[27]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[27]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[28]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[28]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[29]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[29]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[30]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[30]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[31]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[31]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[32]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[32]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[33]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[33]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[34]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[34]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[35]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[35]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[36]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[36]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[37]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[37]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[38]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[38]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[39]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[39]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[40]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[40]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[41]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[41]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[42]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[42]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[43]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[43]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[44]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[44]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row[columnsKeyName[45]] != undefined) {
                        var res = parseFloat(row[columnsKeyName[45]]).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var res = 0,
                        columnsKeyNameLength = 0;

                    for (var i = 0; i < columnsKeyName.length; i++) {
                        if (row[columnsKeyName[i]] != undefined) {
                            res += parseFloat(row[columnsKeyName[i]]);
                            columnsKeyNameLength += 1;
                        }
                    }

                    if (res == 0) {
                        resTotal = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                        return resTotal;
                    } else {
                        resTotal = res / columnsKeyNameLength;
                        return resTotal.toFixed(2);
                    }
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.user != undefined && row.user != "") {
                        var res = parseFloat(row.user).toFixed(2);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    if (row.user != undefined && row.user != "" && row.critic != undefined && row.critic != "") {
                        var res = (parseFloat(row.critic) + parseFloat(row.user)) / 2;
                        return res.toFixed(2);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                        return res;
                    }
                }
            }
        ],
        "dom": dom,
        "stateSave": true,
        "stateSaveCallback": function(settings, data) {
            localStorage.setItem('DataTables_' + settings.sInstance, JSON.stringify(data))
        },
        "stateLoadCallback": function(settings) {
            return JSON.parse(localStorage.getItem("DataTables_" + settings.sInstance))
        },
        "columnDefs": [{
            "targets": [0, 1, columnNumber + 1, columnNumber + 2, columnNumber + 3],
            "className": "noVis"
        }],
        "buttons": [{
                "extend": "colvis",
                "columnText": function(dt, idx, title) {
                    return columnsKeyName[idx - 2];
                },
                "columns": ":not(.noVis)",
                "collectionLayout": "four-column",
                "text": "Choisir les critiques",
                "className": "customButton"
            },
            {
                "extend": "columnVisibility",
                "text": "Afficher toutes les critiques",
                "className": "customButtonDisplay",
                "visibility": true
            },
            {
                "extend": "columnVisibility",
                "text": "Masquer toutes les critiques",
                "className": "customButtonHide",
                "columns": ":not(.noVis)",
                "visibility": false
            }
        ],
        "scrollX": scrollX,
        "fixedColumns": {
            "leftColumns": leftColumns,
            "rightColumns": rightColumns
        },
        "paging": false,
        "pageLength": 100,
        "info": false,
        "language": {
            "search": "<i class=\"fas fa-search\"></i>",
            "searchPlaceholder": "Rechercher un film"
        }
    }

    var table = $("#table").DataTable(data);

    // Sort table last column
    table.column(columnNumberOrder).order("desc").draw();

    // Display movie details
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

    var elements = document.querySelectorAll("button.customButton");

    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', function(event) {
            $(".dt-button-collection.four-column").css("margin-top", "5px");
            setTimeout(function() {
                if (document.querySelector('[role="menu"]') == null) {
                    var dtButtonBackground = document.querySelector("div.dt-button-background"),
                        dtButtonCollectionFixedFourColumn = document.querySelector("div.four-column");

                    dtButtonBackground.parentNode.removeChild(dtButtonBackground);
                    dtButtonCollectionFixedFourColumn.parentNode.removeChild(dtButtonCollectionFixedFourColumn);
                }
            }, 1000);

        });
    }

    // If width < 767 hide all critic columns
    if (width < 767) {
        for (var i = 2; i <= columnNumber; i++) {
            table.column(i).visible(false, false);
        }
    }
});