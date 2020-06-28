/* French initialisation for the jQuery UI date picker plugin. */
/* Written by Keith Wood (kbwood{at}iinet.com.au) and Stéphane Nahmani (sholby@sholby.net). */
jQuery(function($) {
    $.datepicker.regional["fr"] = {
        closeText: "Fermer",
        prevText: "&#x3c;Préc",
        nextText: "Suiv&#x3e;",
        currentText: "Aujourd\'hui",
        monthNames: ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin",
            "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"
        ],
        monthNamesShort: ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun",
            "Jul", "Aou", "Sep", "Oct", "Nov", "Dec"
        ],
        dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
        dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
        dayNamesMin: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
        weekHeader: "Sm",
        dateFormat: "mm/dd/yy",
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: "",
        numberOfMonths: 2,
        showButtonPanel: true
    };

    $.datepicker.setDefaults($.datepicker.regional["fr"]);
});

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

function setInputsDates(e) {
    var numberDays = e.target.value,
        todayStart = new Date();

    todayStart.setDate(todayStart.getDate() - parseInt(numberDays));

    var dd = String(todayStart.getDate()).padStart(2, "0"),
        mm = String(todayStart.getMonth() + 1).padStart(2, "0"),
        yyyy = todayStart.getFullYear();

    todayStart = mm + "/" + dd + "/" + yyyy;

    var todayEnd = new Date(),
        dd = String(todayEnd.getDate()).padStart(2, "0"),
        mm = String(todayEnd.getMonth() + 1).padStart(2, "0"),
        yyyy = todayEnd.getFullYear();

    todayEnd = mm + "/" + dd + "/" + yyyy;

    document.getElementById("min").value = todayStart;
    document.getElementById("max").value = todayEnd;
}

function splitDate(date) {
    var newDate = date.split(" ");

    switch (newDate[1]) {
        case "janvier":
            newDate[1] = "01";
            break;
        case "février":
            newDate[1] = "02";
            break;
        case "mars":
            newDate[1] = "03";
            break;
        case "avril":
            newDate[1] = "04";
            break;
        case "mai":
            newDate[1] = "05";
            break;
        case "juin":
            newDate[1] = "06";
            break;
        case "juillet":
            newDate[1] = "07";
            break;
        case "août":
            newDate[1] = "08";
            break;
        case "septembre":
            newDate[1] = "09";
            break;
        case "octobre":
            newDate[1] = "10";
            break;
        case "novembre":
            newDate[1] = "11";
            break;
        case "décembre":
            newDate[1] = "12";
            break;
        default:
            newDate[1] = "";
            break;
    }

    return newDate[1] + "/" + newDate[0] + "/" + newDate[2];
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

    if (!$.isEmptyObject(data.movieDetails)) text += "<table id=\"movieDetailsTable\" cellpadding=\"5\" cellspacing=\"0\" border=\"0\">" +
        "<tr role=\"row\">" +
        "<td><p><strong>Informations techniques :</strong></p><ul>";

    var movieDetails = data.movieDetails,
        movieDetailsTempArray = [],
        index = 0,
        movieDetailsWording = ["Titre original : ", "Distributeur : ", "Récompenses : "];

    for (var detail in movieDetails) {
        movieDetailsTempArray.push([movieDetailsWording[index], movieDetails[detail]]);
        index++;
    }

    movieDetailsTempArrayDivide = splitUp(movieDetailsTempArray, 2);

    var liNumber = 0;

    for (var i = 0; i < movieDetailsTempArrayDivide.length; i++) {
        var movieDetailsTempArrayDivideChild = movieDetailsTempArrayDivide[i];
        ulNew = (i === 1) ? "</ul></td><td class=\"secondTd\"><p>&nbsp;</p><ul>" : "";

        for (var j = 0; j < movieDetailsTempArrayDivideChild.length; j++) {
            if (j === 0 && width > 767) text += ulNew;

            if (movieDetailsTempArrayDivideChild[j][1] !== "") {
                text += "<li>" + movieDetailsTempArrayDivideChild[j][0] + movieDetailsTempArrayDivideChild[j][1] + "</li>";
                liNumber++;
            }
        }
    }

    if (liNumber % 2 !== 0 && width > 767) {
        text += "<li>&nbsp;</li>";
    }

    text += "</ul></td></tr></table>";

    if (!$.isEmptyObject(data.criticNames)) text += "<table id=\"criticNamesTable\" cellpadding=\"5\" cellspacing=\"0\" border=\"0\">" +
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

    var criticNamesArrayEven = criticNamesSortArray.length % 2 === 0;

    for (var i = 0; i < criticNamesSortArrayDivide.length; i++) {
        var criticNamesSortArrayDivideChild = criticNamesSortArrayDivide[i];
        ulNew = (i === 1) ? "</ul></td><td><p>&nbsp;</p><ul>" : "";
        liNew = (i === 1) ? "<li>&nbsp;</li>" : "";

        for (var j = 0; j < criticNamesSortArrayDivideChild.length; j++) {
            var criticNamesTitle = replaceCriticsTitle(criticNamesSortArrayDivideChild[j][0]),
                criticRatingNumber = criticNamesSortArrayDivideChild[j][1];

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

            if (j === criticNamesSortArrayDivideChild.length - 1 && criticNamesArrayEven === false && width > 767) text += liNew;
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
    var columnNumberOrder = columnsKeyNameDynamic.length + 5;

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
                "data": "date[0].dateName"
            },
