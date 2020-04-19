// Define indexes prototype of same values between two arrays
Array.prototype.multiIndexOf = function(element) {
    var indexes = [];
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] === element) {
            indexes.unshift(i);
        }
    }

    return indexes;
};

// Get window width
var width = $(window).width();

// Display extra information for every movie
function format(data) {
    var text = "<table cellpadding=\"5\" cellspacing=\"0\" border=\"0\">" +
        "<tr role=\"row\">" +
        "<td><img id=\"td_picture\" src=\"" + data.picture + "\"></td>" +
        "<td>Informations du film :" +
        "<br /><br /><a href=\"http://www.allocine.fr" + data.url + "\" target=\"_blank\">Fiche Allociné</a>" +
        "<br /><br />" + data.date + " / " + data.duration + " / " + data.genre;

    if (data.director !== "") text += "<br /><br />De " + data.director;
    if (data.mainActors !== "") text += "<span><br /><br />Avec " + data.mainActors + "</span>";

    text += "</td>" +
        "</tr>" +
        "</table>";

    return text;
}

// Main table function
function tableMain() {
    // Get window height
    var height = $(window).height();

    // Get table localStorage object
    var datatablesData = JSON.parse(window.localStorage.getItem("DataTables_table"));

    // If datatablesData get datatablesData columns
    if (datatablesData) {
        var columns = datatablesData.columns;
    }

    // Define columns critic names
    var columnsVisibleState = [],
        columnsKeyNameDynamic = [
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
            "Dernières Nouvelles d&#039;Alsace",
            "Ecran Large",
            "Elle",
            "Femme Actuelle",
            "Filmsactu",
            "GQ",
            "L&#039;Ecran Fantastique",
            "L&#039;Express",
            "L&#039;Express2",
            "L&#039;Humanité",
            "LCI",
            "La Croix",
            "La Septième Obsession",
            "La Voix du Nord",
            "Le Dauphiné Libéré",
            "Le Figaro",
            "Le Journal du Dimanche",
            "Le Journal du Dimanche2",
            "Le Journal du Geek",
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
        ],
        columnsKeyName = columnsKeyNameDynamic.slice();

    // Define total columns number
    var columnNumberOrder = columnsKeyNameDynamic.length + 4;

    // Define last critic column number
    var columnNumber = columnNumberOrder - 3;

    // Get columns visible state array
    for (var column in columns) {
        if (columns.hasOwnProperty(column)) {
            if (column >= 2 && column <= columnNumber) {
                columnsVisibleState.push(columns[column].visible);
            }
        }
    }

    // Get columns not visible indexes
    columnsNotVisibleIndexes = columnsVisibleState.multiIndexOf(false);

    // Get new array with only visible critic
    for (var i = columnsNotVisibleIndexes.length - 1; i >= 0; i--) {
        columnsKeyNameDynamic.splice(columnsNotVisibleIndexes[i], 1);
    }

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
            dom = "frtip",
            columnsKeyNameDynamic = columnsKeyName;
    }

    // Set datatables data
    var data = {
        "ajax": "https://yaquoiaucine.fr/assets/js/data.json",
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
                    var rowcolumnsKeyName = row[columnsKeyName[0]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[1]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[2]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[3]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[4]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[5]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[6]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[7]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[8]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[9]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[10]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[11]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[12]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[13]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[14]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[15]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[16]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[17]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[18]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[19]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[20]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[21]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[22]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[23]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[24]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[25]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[26]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[27]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[28]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[29]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[30]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[31]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[32]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[33]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[34]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[35]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[36]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[37]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[38]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[39]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[40]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[41]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[42]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[43]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[44]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[45]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[46]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[47]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[48]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[49]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[50]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
                    } else {
                        var res = "&nbsp;&nbsp;-&nbsp;&nbsp;";
                    }

                    return res;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    var rowcolumnsKeyName = row[columnsKeyName[51]];

                    if (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== "") {
                        var res = parseFloat(rowcolumnsKeyName).toFixed(1);
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

                    for (var i = 0; i < columnsKeyNameDynamic.length; i++) {
                        if (row[columnsKeyNameDynamic[i]] !== undefined && row[columnsKeyNameDynamic[i]] !== "") {
                            res += parseFloat(row[columnsKeyNameDynamic[i]]);
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
                    if (row.user !== undefined && row.user !== "") {
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
                    var resBis = 0,
                        columnsKeyNameLengthBis = 0;

                    for (var i = 0; i < columnsKeyNameDynamic.length; i++) {
                        if (row[columnsKeyNameDynamic[i]] !== undefined && row[columnsKeyNameDynamic[i]] !== "") {
                            resBis += parseFloat(row[columnsKeyNameDynamic[i]]);
                            columnsKeyNameLengthBis += 1;
                        }
                    }

                    if (resBis == 0) {
                        var resTotal = parseFloat(row.user);
                    } else {
                        var resCritic = resBis / columnsKeyNameLengthBis,
                            resTotal = (parseFloat(resCritic) + parseFloat(row.user)) / 2;
                    }

                    return resTotal.toFixed(2);
                }
            }
        ],
        "dom": dom,
        "stateSave": true,
        "stateSaveCallback": function(settings, data) {
            localStorage.setItem("DataTables_" + settings.sInstance, JSON.stringify(data))
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
                    var columnsKeyNameButton = [];

                    for (var i = 0; i < columnsKeyName.length; i++) {
                        columnsKeyNameButton[i] = columnsKeyName[i]
                            .replace(/L&#039;Express2/g, "L&#039;Express Contre")
                            .replace(/Le Journal du Dimanche2/g, "Le Journal du Dimanche Contre")
                            .replace(/&#039;/g, "'");
                    }

                    return columnsKeyNameButton[idx - 2];
                },
                "columns": ":not(.noVis)",
                "collectionLayout": "four-column",
                "text": "Sélectionner les notes",
                "className": "customButton"
            },
            {
                "extend": "columnVisibility",
                "text": "Afficher toutes les notes",
                "className": "customButtonDisplay",
                "visibility": true
            },
            {
                "extend": "columnVisibility",
                "text": "Masquer toutes les notes",
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
        "destroy": true,
        "language": {
            "search": "<i class=\"fas fa-search\"></i>",
            "searchPlaceholder": "Rechercher un film"
        },
        "initComplete": function(data) {
            // If width < 767 hide all critic columns
            if (width < 767) {
                for (var i = 2; i <= columnNumber; i++) {
                    table.column(i).visible(false, false);
                }
            }

            // Hide columns with no data
            table.columns().every(function(index) {
                if (index <= columnNumber - 2) {
                    var data = this.data(),
                        res = 0;

                    for (var i = 0; i < data.length; i++) {
                        if (data[i][columnsKeyName[index]] !== undefined) {
                            res += parseFloat(data[i][columnsKeyName[index]]);
                        }
                    }

                    if (res == 0) {
                        table.column(index + 2).visible(false, false);
                    }
                }
            });

            // Adjust column sizing and redraw
            table.columns.adjust().draw(false);
        }
    }

    // Display table
    var table = $("#table").DataTable(data);

    // Sort table last column
    table.column(columnNumberOrder).order("desc").draw();

    // Set height for Y scroll body and hide x scrollbar
    var h1Height = $("h1").height(),
        descriptionHeight = $("p.description").height(),
        descriptionHeightBis = $("p.description").closest("p").height(),
        dtButtonsHeight = $("div.dt-buttons").height(),
        creditsHeight = $("p#credits").height(),
        newHeight = height - (h1Height + descriptionHeight + descriptionHeightBis + dtButtonsHeight + creditsHeight);

    $("div.dataTables_scroll").height(newHeight);

    // Select critic buttons
    var elements = document.querySelectorAll("button.customButton");

    // Add margin top and remove extra buttons for original state
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", function(event) {
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
}

$(document).ready(function() {
    // Display movie details
    $("#table").on("click", "td.details", function() {
        setTimeout(function() {
            var dataTables_scrollBody = $("div.dataTables_scrollBody").height();
            $("div.DTFC_RightBodyWrapper").height(dataTables_scrollBody);
        }, 100);

        // Get DataTable API instance
        var table = $("#table").DataTable();

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

    tableMain();

    if (width > 767) {
        var random = randomQuotes.quotes[Math.floor(Math.random() * randomQuotes.quotes.length)],
            randomQuotesTitle = "<p><i class=\"fas fa-quote-left\"></i> " + random.title + " <i class=\"fas fa-fw fa-quote-right\"></i>",
            randomQuotesMovieandYear = "<span id=\"movieandyear\"> - " + random.movie + ", " + random.year + "</span></p>";

        $("#quotes").css("width", width - 900);
        document.getElementById("quotes").innerHTML = randomQuotesTitle + randomQuotesMovieandYear;
    }
});

$(document).on("click", "button", function() {
    // On filter click destroy and reload data
    tableMain();
});