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

var randomQuotesLength = randomQuotes.quotes.length,
    uniqueRandomNumber = JSON.parse(window.localStorage.getItem("uniqueRandomNumber"));

if (uniqueRandomNumber === null) {
    uniqueRandomNumber = [];
}

// Return unique random number for quotes
function makeRandomNumber() {
    if (!uniqueRandomNumber.length) {
        for (var i = 0; i < randomQuotesLength; i++) {
            uniqueRandomNumber.push(i);
        }
    }

    var randomNumber = Math.floor(Math.random() * uniqueRandomNumber.length),
        newRandomNumber = uniqueRandomNumber[randomNumber];

    uniqueRandomNumber.splice(randomNumber, 1);

    return newRandomNumber;
}

function sortCriticsDesc(a, b) {
    if (a[1] === b[1]) {
        return 0;
    } else {
        return (a[1] > b[1]) ? -1 : 1;
    }
}

function replaceCriticsTitle(critic) {
    var s = String(critic);

    return s
        .replace(/L&#039;Express2/g, "L&#039;Express Contre")
        .replace(/Le Figaro2/g, "Le Figaro Contre")
        .replace(/Le Journal du Dimanche2/g, "Le Journal du Dimanche Contre")
        .replace(/Le Nouvel Observateur2/g, "Le Nouvel Observateur Contre")
        .replace(/Libération2/g, "Libération Contre")
        .replace(/Ouest France2/g, "Ouest France Contre")
        .replace(/Sud Ouest2/g, "Sud Ouest Contre")
        .replace(/Télérama2/g, "Télérama Contre")
        .replace(/&#039;/g, "'");
}

function splitUp(arr, n) {
    var rest = arr.length % n,
        restUsed = rest,
        partLength = Math.floor(arr.length / n),
        result = [];

    for (var i = 0; i < arr.length; i += partLength) {
        var end = partLength + i,
            add = false;

        if (rest !== 0 && restUsed) {
            end++;
            restUsed--;
            add = true;
        }

        result.push(arr.slice(i, end));

        if (add) {
            i++;
        }
    }

    return result;
}

// Display extra information for every movie
function format(data) {
    var text = "<table id=\"detailsTable\" cellpadding=\"5\" cellspacing=\"0\" border=\"0\">" +
        "<tr role=\"row\">" +
        "<td><div class=\"video-thumbnail\" data-toggle=\"modal\" data-src=\"" + data.player + "\" data-target=\"#myModal\"><img class=\"td_picture\" src=\"" + data.picture + "\"></div></td>" +
        "<td><p><a href=\"" + data.url + "\" target=\"_blank\">Fiche Allociné</a></p>";

    text += "<p>";
    if (data.date[0].dateLink !== "") {
        var dateLink = "<a href=\"" + data.date[0].dateLink + "\" target=\"_blank\">" + data.date[0].dateName + "</a>";
    } else {
        dateLink = data.date[0].dateName;
    }
    if (data.date[0].dateName !== "") text += "Date de sortie : " + dateLink + "<br />";

    if (data.duration !== "") text += "Durée : " + data.duration + "<br />";

    if (data.genre !== undefined) {
        var genreLink = "";
        if (data.genre.length > 1) {
            genreText = "Genres";
        } else {
            genreText = "Genre";
        }

        for (var i = 0; i < data.genre.length; i++) {
            if (data.genre[i].genreLink !== undefined) {
                genreLink += "<a href=\"" + data.genre[i].genreLink + "\" target=\"_blank\">" + data.genre[i].genreName + "</a>, ";
            } else {
                genreLink += data.genre[i].genreName + ", ";
            }
        }

        text += genreText + " : " + genreLink;
        text = text.replace(/,\s*$/, "");
    }
    text += "</p>";

    if (data.director !== undefined) {
        text += "<p>De : ";

        var directorLink = "";
        for (var i = 0; i < data.director.length; i++) {
            if (data.director[i].directorLink !== undefined) {
                directorLink += "<a href=\"" + data.director[i].directorLink + "\" target=\"_blank\">" + data.director[i].directorName + "</a>, ";
            } else {
                directorLink += data.director[i].directorName + ", ";
            }
        }

        text += directorLink;
        text = text.replace(/,\s*$/, "");
        text += "</p>";
    }

    if (data.mainActors !== undefined) {
        text += "<p>Avec : ";

        var mainActorsLink = "";
        for (var i = 0; i < data.mainActors.length; i++) {
            if (data.mainActors[i].mainActorsLink !== undefined) {
                mainActorsLink += "<a href=\"" + data.mainActors[i].mainActorsLink + "\" target=\"_blank\">" + data.mainActors[i].mainActorsName + "</a>, ";
            } else {
                mainActorsLink += data.mainActors[i].mainActorsName + ", ";
            }
        }

        text += mainActorsLink;
        text = text.replace(/,\s*$/, "");
        text += "</p>";
    }

    if (data.nationality !== undefined) {
        if (data.nationality.length > 1) {
            nationalityText = "Nationalités";
        } else {
            nationalityText = "Nationalité";
        }
        text += "<p>" + nationalityText + " : ";

        var nationalityLink = "";
        for (var i = 0; i < data.nationality.length; i++) {
            if (data.nationality[i].nationalityLink !== undefined) {
                nationalityLink += "<a href=\"" + data.nationality[i].nationalityLink + "\" target=\"_blank\">" + data.nationality[i].nationalityName + "</a>, ";
            } else {
                nationalityLink += data.nationality[i].nationalityName + ", ";
            }
        }

        text += nationalityLink;
        text = text.replace(/,\s*$/, "");
        text += "</p>";
    }

    text += "</td></tr></table>";

    if (data.summary !== "") text += "<table id=\"summaryTable\" cellpadding=\"5\" cellspacing=\"0\" border=\"0\">" +
        "<tr role=\"row\">" +
        "<td><p><strong>Synopsis :</strong></p>" +
        "<div id=\"summary\"><p>" + data.summary + "</p></div></td></tr></table>";

    if (data.criticNames !== "") text += "<table id=\"criticNamesTable\" cellpadding=\"5\" cellspacing=\"0\" border=\"0\">" +
        "<tr role=\"row\">" +
        "<td><p><strong>Notes de la presse :</strong></p><ul>";

    var criticNames = data.criticNames,
        criticNamesTempArray = [],
        criticNamesSortArray = [];

    for (var critic in criticNames) {
        criticNamesTempArray.push([critic, criticNames[critic]]);
    }

    criticNamesSortArray = criticNamesTempArray.sort(sortCriticsDesc);
    criticNamesSortArrayDivide = splitUp(criticNamesSortArray, 2);

    for (var i = 0; i < criticNamesSortArrayDivide.length; i++) {
        var criticNamesSortArrayDivideChild = criticNamesSortArrayDivide[i];
        ulNew = (i === 1) ? "</ul></td><td><p>&nbsp;</p><ul>" : "";
        liNew = (i === 1) ? "<li>&nbsp;</li>" : "";

        for (var j = 0; j < criticNamesSortArrayDivideChild.length; j++) {
            var criticNamesTitle = replaceCriticsTitle(criticNamesSortArrayDivideChild[j][0]),
                criticRatingNumber = criticNamesSortArrayDivideChild[j][1],
                criticNamesArrayEven = criticNamesSortArray.length % 2 === 0;

            if (j === 0 && width > 767) text += ulNew;

            switch (criticRatingNumber) {
                case "1":
                    text += "<li><i class=\"fas fa-star\"></i><i class=\"far fa-star\"></i><i class=\"far fa-star\"></i><i class=\"far fa-star\"></i><i class=\"far fa-star\"></i>&nbsp;" + criticNamesTitle + "</li>";
                    break;
                case "2":
                    text += "<li><i class=\"fas fa-star\"></i><i class=\"fas fa-star\"></i><i class=\"far fa-star\"></i><i class=\"far fa-star\"></i><i class=\"far fa-star\"></i>&nbsp;" + criticNamesTitle + "</li>";
                    break;
                case "3":
                    text += "<li><i class=\"fas fa-star\"></i><i class=\"fas fa-star\"></i><i class=\"fas fa-star\"></i><i class=\"far fa-star\"></i><i class=\"far fa-star\"></i>&nbsp;" + criticNamesTitle + "</li>";
                    break;
                case "4":
                    text += "<li><i class=\"fas fa-star\"></i><i class=\"fas fa-star\"></i><i class=\"fas fa-star\"></i><i class=\"fas fa-star\"></i><i class=\"far fa-star\"></i>&nbsp;" + criticNamesTitle + "</li>";
                    break;
                case "5":
                    text += "<li><i class=\"fas fa-star\"></i><i class=\"fas fa-star\"></i><i class=\"fas fa-star\"></i><i class=\"fas fa-star\"></i><i class=\"fas fa-star\"></i>&nbsp;" + criticNamesTitle + "</li>";
                    break;
                default:
                    text += "";
                    break;
            }

            if (j === criticNamesSortArrayDivideChild.length - 1 && criticNamesArrayEven === false) text += liNew;
        }
    }

    text += "</ul></td></tr></table>";

    return text;
}

function tutorialStepCritics(e) {
    $(".dt-button.buttons-collection.buttons-colvis.customButton").click();
    if (e) e.stopPropagation();

    $("#overlay").fadeIn("fast");
    $("body").append("<div id=\"overlay\"><h2><span class=\"fa-stack\"><span class=\"fa fa-circle-o fa-stack-2x\"></span><strong class=\"fa-stack-1x\">1</strong></span>Choisissez vos critiques préférées · <a class=\"nextTutorial\" href=\"#\">Suivant <i class=\"fas fa-arrow-alt-circle-right\"></i></a></span></h2></div>");
    $(".dt-buttons").addClass("highlightElement");
    $(".dt-buttons").css("border", "2px solid #fff");
}

function tutorialStepMovie() {
    $("tr.shown:first").next().find("td:first table tbody tr td").addClass("tdElement");

    if ($(".tdElement").closest("table").closest("tr").prev().hasClass("shown")) {
        $("td.details:first").click().click();
    } else {
        $("td.details:first").click();
    }

    $("tr.shown:first").next().find("td:first table tbody tr td").addClass("tdElement");

    $("#overlay").fadeIn("fast");
    $("body").append("<div id=\"overlay\"><h2><span class=\"fa-stack\"><span class=\"fa fa-circle-o fa-stack-2x\"></span><strong class=\"fa-stack-1x\">1</strong></span>Aperçu d'un film · <a class=\"nextTutorial\" href=\"#\">Suivant <i class=\"fas fa-arrow-alt-circle-right\"></i></a></span></h2></div>");
    $(".tdElement").addClass("highlightElement");
    $(".tdElement:first").css({
        "border-top": "2px solid #fff",
        "border-left": "2px solid #fff"
    });
    $(".tdElement:first").next().css({
        "border-top": "2px solid #fff",
        "border-right": "2px solid #fff"
    });
    $(".tdElement:first").closest("table").next().find("td").css({
        "border-left": "2px solid #fff",
        "border-bottom": "2px solid #fff",
        "border-right": "2px solid #fff"
    });
}

function tutorialShow(e) {
    tutorialStepCritics(e);
}

function removeCss() {
    $(".dt-buttons, .tdElement").removeClass("highlightElement");
    $(".dt-buttons, .tdElement").css("border", "none");
}

function tutorialHide() {
    $("#overlay").fadeOut("fast");
    $("#overlay").remove();
    removeCss();
}

// Main table function
function mainTable(data) {

    // Get window height
    var height = $(window).height();

    // Get table localStorage object
    var datatablesData = JSON.parse(window.localStorage.getItem("DataTables_table"));

    // If datatablesData get datatablesData columns
    if (datatablesData) {
        var columns = datatablesData.columns;
    }

    var criticNamesArray = [],
        criticNamesArrayLength = Object.keys(data.critics).length;

    for (var i = 0; i < criticNamesArrayLength; i++) {
        criticNamesArray.push(data.critics[i][i])
    }

    // Define columns critic names
    var columnsVisibleState = [],
        columnsKeyNameDynamic = criticNamesArray,
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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[0]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[1]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[2]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[3]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[4]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[5]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[6]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[7]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[8]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[9]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[10]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[11]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[12]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[13]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[14]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[15]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[16]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[17]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[18]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[19]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[20]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[21]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[22]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[23]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[24]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[25]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[26]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[27]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[28]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[29]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[30]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[31]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[32]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[33]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[34]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[35]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[36]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[37]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[38]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[39]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[40]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[41]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[42]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[43]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[44]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[45]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[46]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[47]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[48]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[49]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[50]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[51]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[52]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[53]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[54]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[55]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[56]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[57]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[58]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[59]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[60]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[61]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[62]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[63]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[64]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[65]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[66]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[67]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[68]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[69]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[70]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[71]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[72]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[73]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[74]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[75]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[76]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[77]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[78]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[79]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[80]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[81]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[82]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[83]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[84]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[85]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[86]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[87]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[88]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[89]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[90]];

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
                    var rowcolumnsKeyName = row.criticNames[columnsKeyName[91]];

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
                        if (row.criticNames[columnsKeyNameDynamic[i]] !== undefined && row.criticNames[columnsKeyNameDynamic[i]] !== "") {
                            res += parseFloat(row.criticNames[columnsKeyNameDynamic[i]]);
                            columnsKeyNameLength += 1;
                        }
                    }

                    if (res === 0) {
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
                        if (row.criticNames[columnsKeyNameDynamic[i]] !== undefined && row.criticNames[columnsKeyNameDynamic[i]] !== "") {
                            resBis += parseFloat(row.criticNames[columnsKeyNameDynamic[i]]);
                            columnsKeyNameLengthBis += 1;
                        }
                    }

                    if (resBis === 0) {
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
                        columnsKeyNameButton[i] = replaceCriticsTitle(columnsKeyName[i]);
                    }

                    return columnsKeyNameButton[idx - 2];
                },
                "columns": ":not(.noVis)",
                "collectionLayout": "four-column",
                "text": "Sélectionner les notes",
                "className": "customButton"
            },
            {
                "text": "Afficher toutes les notes",
                "className": "customButtonDisplay",
                "action": function(e, dt, node, config) {}
            },
            {
                "text": "Masquer toutes les notes",
                "className": "customButtonHide",
                "action": function(e, dt, node, config) {}
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
            table.columns(".critic").every(function(index) {
                if (index <= columnNumber - 2) {
                    var data = this.data(),
                        res = 0;

                    for (var i = 0; i < data.length; i++) {
                        newIndex = index - 2;

                        if (data[i].criticNames[columnsKeyName[newIndex]] !== undefined) {
                            res += parseFloat(data[i].criticNames[columnsKeyName[newIndex]]);
                        }
                    }

                    if (res === 0) {
                        table.column(index).visible(false, false);
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

    if (width > 1290) {
        $("#table, #table_wrapper").css("max-width", width - 516);
        $("#quotes").css("width", 500);
    } else {
        $("#table, #table_wrapper").css("max-width", 1274);
    }

    var h1Height = $("h1").height(),
        descriptionHeight = $("p.description").height(),
        descriptionHeightBis = $("p.description").closest("p").height(),
        dtButtonsHeight = $("div.dt-buttons").height(),
        creditsHeight = $("p#credits").height(),
        newHeight = height - (h1Height + descriptionHeight + descriptionHeightBis + dtButtonsHeight + creditsHeight);

    // Set height for Y scroll body
    $("div.dataTables_scroll").height(newHeight);

    var increment = 0;

    $(".customButton").on("click", function() {

        // Add margin top
        $(".dt-button-collection.four-column").css("margin-top", "5px");

        increment++;

        if (increment === 2) {

            // Remove extra buttons for original state
            var dtButtonBackground = document.querySelector("div.dt-button-background"),
                dtButtonCollectionFixedFourColumn = document.querySelector("div.four-column");

            dtButtonBackground.parentNode.removeChild(dtButtonBackground);
            dtButtonCollectionFixedFourColumn.parentNode.removeChild(dtButtonCollectionFixedFourColumn);

            increment = 0;
        }

        // If element target is in the critic menu
        $(document).on("click", function(e) {

            // Get target parent class
            var parentClass = $(e.target).parent().attr("class"),
                parentParentClass = $(e.target).parent().parent().attr("class");

            if (
                parentClass === "dt-button buttons-columnVisibility active" ||
                parentClass === "dt-button buttons-columnVisibility" ||
                parentClass === "dt-button-collection four-column" ||
                $(e.target).is(".dt-button.buttons-columnVisibility.active") ||
                $(e.target).is(".dt-button.buttons-columnVisibility") ||
                $(e.target).is('div[role="menu"]')) {

                if (!$(".customButton").hasClass("customButtonSubmit")) {
                    $(".customButton").addClass("customButtonSubmit");
                    $(".customButton span").html("Valider la sélection ?");
                    $(".customButton").addClass("pulse");
                }

            } else {
                if (parentParentClass === "dt-buttons" ||
                    parentParentClass === "dt-button buttons-collection buttons-colvis customButton customButtonSubmit" ||
                    $(e.target).is("td.details")) return;

                if ($(".customButton").hasClass("customButtonSubmit")) {
                    $(".customButton span").html("Sélectionner les notes");
                    $(".customButton").removeClass("customButtonSubmit");
                    $(".customButton").removeClass("pulse");
                    $(".customButton").addClass("customButtonNotSubmit");
                }

                increment = 0;
            }
        });

        if ($(".customButton").hasClass("customButtonSubmit")) {
            setTimeout(function() {
                $("button, td.details").prop("disabled", true);
                $(".customButton span").html("Chargement... <i class=\"fas fa-circle-notch fa-spin\"></i>");
                $(".customButton").removeClass("pulse");
            }, 100);
            setTimeout(function() {
                $(".customButton span").html("Sélection validée <i class=\"fas fa-check\"></i>");
            }, 4000);
            setTimeout(function() {
                $(".customButton span").html("Sélectionner les notes");
                $(".customButton").removeClass("customButtonSubmit");
                $(".customButton").removeClass("customButtonNotSubmit");
                window.location.reload(false);
            }, 7000);
        }

        if ($(".customButton").hasClass("customButtonNotSubmit")) {
            $(".customButton").addClass("customButtonSubmit");
            $(".customButton span").html("Valider la sélection ?");
            $(".customButton").addClass("pulse");
        }
    });

    $(".customButtonDisplay").on("click", function() {
        $("tr.shown").children().click();

        setTimeout(function() {
            $("button, td.details").prop("disabled", true);
            $(".customButtonDisplay").addClass("customButtonSubmit");
            $(".customButtonDisplay").addClass("pulse");
            $(".customButtonDisplay span").html("Chargement... <i class=\"fas fa-circle-notch fa-spin\"></i>");
            $(".customButtonDisplay").removeClass("pulse");
        }, 100);
        setTimeout(function() {
            table.columns(".critic").visible(true);
        }, 1000);
        setTimeout(function() {
            $(".customButtonDisplay span").html("Sélection validée <i class=\"fas fa-check\"></i>");
        }, 7000)
        setTimeout(function() {
            $(".customButtonDisplay span").html("Afficher toutes les notes");
            $(".customButtonDisplay").removeClass("customButtonSubmit");
            window.location.reload(false);
        }, 10000);
    });

    $(".customButtonHide").on("click", function() {
        $("tr.shown").children().click();

        setTimeout(function() {
            $("button, td.details").prop("disabled", true);
            $(".customButtonHide").addClass("customButtonSubmit");
            $(".customButtonHide").addClass("pulse");
            $(".customButtonHide span").html("Chargement... <i class=\"fas fa-circle-notch fa-spin\"></i>");
            $(".customButtonHide").removeClass("pulse");
        }, 100);
        setTimeout(function() {
            table.columns(".critic").visible(false);
        }, 1000);
        setTimeout(function() {
            $(".customButtonHide span").html("Sélection validée <i class=\"fas fa-check\"></i>");
        }, 7000)
        setTimeout(function() {
            $(".customButtonHide span").html("Masquer toutes les notes");
            $(".customButtonHide").removeClass("customButtonSubmit");
            window.location.reload(false);
        }, 10000);
    });
}

// Get window width
var width = $(window).width();

$(document).ready(function() {

    // If width > 1290
    if (width > 1290) {

        // Display movies quotes
        var randomQuoteNumber = makeRandomNumber(),
            random = randomQuotes.quotes[randomQuoteNumber],
            randomQuotesTitle = "<p><i class=\"fas fa-2x fa-quote-left\"></i><span>" + random.title + "</span>",
            randomQuotesMovieandYear = "<span id=\"movieandyear\"> - " + random.movie + ", " + random.year + "</span></p>",
            randomQuotesPicture = "<p><img src=\"assets/pictures/picture" + random.id + ".jpg\" width=\"374px\"></p>";

        document.getElementById("quotes").innerHTML = randomQuotesTitle + randomQuotesMovieandYear + randomQuotesPicture;

        $("#quotes p img").on("error", function() {
            document.getElementById("quotes").innerHTML = randomQuotesTitle + randomQuotesMovieandYear;
        });

        window.localStorage.setItem("uniqueRandomNumber", JSON.stringify(uniqueRandomNumber));
    }

    // Display movie details
    $("#table").on("click", "td.details, td.noVis", function() {
        setTimeout(function() {
            var dataTables_scrollBody = $("div.dataTables_scrollBody").height();
            $("div.DTFC_RightBodyWrapper").height(dataTables_scrollBody);
        }, 500);

        // Get DataTable API instance
        var table = $("#table").DataTable(),
            tr = $(this).closest("tr"),
            row = table.row(tr),
            player = row.data().player;

        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass("shown");
        } else {
            row.child(format(row.data())).show();
            tr.addClass("shown");

            var videoThumbnail = $(this).closest("tr").next().find("div.video-thumbnail");

            videoThumbnail.hide();
            videoThumbnail.find("img").on("load", function() {
                videoThumbnail.show(1);
            });
        }

        $("#myModal").on("shown.bs.modal", function() {
            video = $(this).find("#video");
            $(video).prop("src", player);
        });

        $("#myModal").on("hide.bs.modal", function() {
            video = $(this).find("#video");
            $(video).prop("src", player);
        });
    });

    if (width > 767) {
        $("p#credits").append("<i class=\"far fa-question-circle\"></i><a class=\"tutorial\" href=\"#\">Aide</a>")
    }

    $(".tutorial").on("click", tutorialShow);

    $("body").on("click", function(e) {
        if (e.target.id === "overlay") {
            tutorialHide();
        }
    });

    $(window).scroll(function() {
        if ($(this).scrollTop() > 10) {
            $("#overlay h2").html("");
        } else {
            $("#overlay h2").html("<span class=\"fa-stack\"><span class=\"fa fa-circle-o fa-stack-2x\"></span><strong class=\"fa-stack-1x\">1</strong></span>Choisissez vos critiques préférées · <a class=\"nextTutorial\" href=\"#\">Suivant <i class=\"fas fa-arrow-alt-circle-right\"></i></a></span>");
        }
    });

    // Call main function
    $.getJSON("https://yaquoiaucine.fr/assets/js/critics.json", mainTable);
});