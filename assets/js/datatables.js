// Table version
var tableVersion = "1.1-20201229"

// Get current date year
var buttonYearTemp = new Date,
    buttonYear = buttonYearTemp.getFullYear()

// Define main numbers columns
var columnNumberStart = 3,
    extraRightColumns = 4

// Get window width
var filterValue = window.localStorage.getItem("filterValue"),
    increment = 0,
    randomQuotesLength = randomQuotes.quotes.length,
    uniqueRandomNumber = JSON.parse(window.localStorage.getItem("uniqueRandomNumber")),
    width = $(window).width()

// Define indexes prototype of same values between two arrays
Array.prototype.multiIndexOf = function(element) {
    for (var indexes = [], i = this.length - 1; i >= 0; i--) this[i] === element && indexes.unshift(i);
    return indexes
}

// Remove every localStorage keys but columns
function clearLocalStorage(e) {
    var datatablesData = JSON.parse(window.localStorage.getItem("DataTables_table")),
        validKeys;
    $(e).attr("class") == "display dataTable no-footer" ? datatablesData && (validKeys = ["columns"], Object.keys(datatablesData).forEach(key => validKeys.includes(key) || delete datatablesData[key]), window.location.reload(!0)) : (window.localStorage.clear(), window.localStorage.setItem("tableVersion", tableVersion), window.location.reload(!0))
}

// Deactivate all critics columns in customButton
function deactivateAllCriticsColumns() {
    $(".customButton").on("click", function() {
        var toastShow2 = window.localStorage.getItem("toastShow2");
        toastShow2 == null && toastr.info("<br>Les critiques ne possédant pas de notes sont automatiquement désélectionnées.", "Informations"), $("button.deactivate").length == 0 && $('<button class="dt-button buttons-collection deactivate" tabindex="0" aria-controls="table" type="button" aria-haspopup="true" aria-expanded="false"><span><i class=\'fas fa-eye-slash\'></i> Désélectionner toutes les critiques</span></button>').insertBefore('div[role="menu"] button:first-child'), $("button.deactivate").on("click", function() {
            $(".mainContent").css("visibility", "hidden"), $("#loadingOverlay, #loadingOverlayImg").css("display", "block"), $("#firstCaption").html('Chargement<span class="one">.</span><span class="two">.</span><span class="three">.</span>'), $("#subFigcaption").html("Votre sélection est en cours<br>de mise à jour, veuillez patienter."), $("body").addClass("noscroll"), setTimeout(function() {
                $("button.active").click()
            }, 100), setTimeout(function() {
                $(".mainContent").css("visibility", "visible"), $("#loadingOverlay, #loadingOverlayImg").css("display", "none"), $("body").removeClass("noscroll")
            }, 100)
        })
    })
}

// Stop propagation on date change id
function defaultDate() {
    $("#defaultDate").on("click", function(e) {
        $("button.periodListArrayButton").click(), e && e.stopPropagation()
    })
}

// Return localStorage filter value
function filterValueFunction() {
    var filterValue = window.localStorage.getItem("filterValue");
    filterValue || window.localStorage.setItem("filterValue", "7"), filterValue == "7" ? dateValue = "les 7 derniers jours" : filterValue == "14" ? dateValue = "les 2 dernières semaines" : filterValue == "21" ? dateValue = "les 3 dernières semaines" : filterValue == "30" ? dateValue = "les 30 derniers jours" : filterValue == "90" ? dateValue = "les 90 derniers jours" : parseInt(filterValue) > 2e3 && parseInt(filterValue) < 2050 ? dateValue = "en " + filterValue : dateValue = "depuis toujours", $("#dateValue").text(dateValue)
}

// Return unique random number for quotes
function makeRandomNumber() {
    var i, randomNumber, newRandomNumber;
    if (!uniqueRandomNumber.length)
        for (i = 0; i < randomQuotesLength; i++) uniqueRandomNumber.push(i);
    return randomNumber = Math.floor(Math.random() * uniqueRandomNumber.length), newRandomNumber = uniqueRandomNumber[randomNumber], uniqueRandomNumber.splice(randomNumber, 1), newRandomNumber
}

// Display movies quotes
function movieQuotesFunction() {
    if (uniqueRandomNumber === null && (uniqueRandomNumber = []), width > 1290) {
        var randomQuoteNumber = makeRandomNumber(),
            random = randomQuotes.quotes[randomQuoteNumber],
            randomQuotesTitle = '<p><i class="fas fa-2x fa-quote-left"></i><span>' + random.title + "</span>",
            randomQuotesMovieandYear = '<span id="movieandyear"> - ' + random.movie + ", " + random.year + "</span></p>",
            randomQuotesPicture = '<p><img src="assets/pictures/picture' + random.id + '.jpg" width="480px"></p>';
        document.getElementById("quotes").innerHTML = randomQuotesTitle + randomQuotesMovieandYear + randomQuotesPicture, $("#quotes p img").on("error", function() {
            document.getElementById("quotes").innerHTML = randomQuotesTitle + randomQuotesMovieandYear
        }), window.localStorage.setItem("uniqueRandomNumber", JSON.stringify(uniqueRandomNumber))
    }
}

// Display dates buttons
function periodListArrayButton() {
    $(".customButton, .periodListArrayButton").on("click", function(e) {
        var filterValue, childNumber, dtButtonBackground, dtButtonCollectionFixedFourColumn;
        switch ($("button.dt-button").on("click", filterValueFunction), filterValue = window.localStorage.getItem("filterValue"), filterValue) {
            case "7":
                childNumber = 0;
                break;
            case "14":
                childNumber = 1;
                break;
            case "21":
                childNumber = 2;
                break;
            case "30":
                childNumber = 3;
                break;
            case "90":
                childNumber = 4;
                break;
            case String(buttonYear):
                childNumber = 5;
                break;
            case String(buttonYear - 1):
                childNumber = 6;
                break;
            case String(buttonYear - 2):
                childNumber = 7;
                break;
            case String(buttonYear - 3):
                childNumber = 8;
                break;
            case "365000":
                childNumber = 9;
                break
        }
        $(this).attr("class") == "dt-button buttons-collection buttons-colvis customButton" && $("*").removeClass("clickedFilter"), $(this).attr("class") == "dt-button buttons-collection periodListArrayButton" && ($("button.deactivate").length > 0 && $("button.deactivate").remove(), $(".dt-button-collection.four-column").find(".dt-button:eq(" + childNumber + ")").addClass("clickedFilter")), $(".dt-button-collection.four-column").css("margin-top", "5px"), increment++, increment === 2 && (dtButtonBackground = document.querySelector("div.dt-button-background"), dtButtonCollectionFixedFourColumn = document.querySelector("div.four-column"), dtButtonBackground.parentNode.removeChild(dtButtonBackground), dtButtonCollectionFixedFourColumn.parentNode.removeChild(dtButtonCollectionFixedFourColumn), increment = 0), $(document).on("click", function(e) {
            var parentClass = $(e.target).parent().attr("class"),
                parentParentClass = $(e.target).parent().parent().attr("class");
            if (parentClass === "dt-button buttons-columnVisibility active" || parentClass === "dt-button buttons-columnVisibility" || parentClass === "dt-button-collection four-column" || $(e.target).is(".dt-button.buttons-columnVisibility.active") || $(e.target).is(".dt-button.buttons-columnVisibility") || $(e.target).is('div[role="menu"]')) !$(".customButton").hasClass("customButtonSubmit") && $(e.target).parent().attr("class") != "dt-button-collection four-column" && ($(".customButton").addClass("customButtonSubmit"), $(".customButton span").html("<i class=\"fas fa-check\"></i> Valider la sélection ?"), $(".customButton").addClass("pulse"));
            else {
                if (parentParentClass === "dt-buttons" || parentParentClass === "dt-button buttons-collection buttons-colvis customButton customButtonSubmit") return;
                $(".customButton").hasClass("customButtonSubmit") && ($(".customButton span").html("<i class='fas fa-tasks'></i> Mes critiques"), $(".customButton").removeClass("customButtonSubmit"), $(".customButton").removeClass("pulse"), $(".customButton").addClass("customButtonNotSubmit")), increment = 0
            }
        }), $(".customButton").hasClass("customButtonSubmit") && window.location.reload(!0), $(".customButton").hasClass("customButtonNotSubmit") && ($(".customButton").addClass("customButtonSubmit"), $(".customButton span").html("<i class=\"fas fa-check\"></i> Valider la sélection ?"), $(".customButton").addClass("pulse"))
    })
}

// Replace critics titles
function replaceCriticsTitle(critic) {
    var s = String(critic);
    return s.replace(/20 Minutes2/g, "20 Minutes Contre").replace(/CNews2/g, "CNews Contre").replace(/Cahiers du Cinéma2/g, "Cahiers du Cinéma Contre").replace(/Charlie Hebdo2/g, "Charlie Hebdo Contre").replace(/Chronic&#039;art.com2/g, "Chronic&#039;art.com Contre").replace(/CinemaTeaser2/g, "CinemaTeaser Contre").replace(/Culturopoing.com2/g, "Culturopoing.com Contre").replace(/Ecran Large2/g, "Ecran Large Contre").replace(/Elle2/g, "Elle Contre").replace(/L&#039;Ecran Fantastique2/g, "L&#039;Ecran Fantastique Contre").replace(/L&#039;Express2/g, "L&#039;Express Contre").replace(/L&#039;Humanité2/g, "L&#039;Humanité Contre").replace(/La Croix2/g, "La Croix Contre").replace(/Le Figaro2/g, "Le Figaro Contre").replace(/Le Journal du Dimanche2/g, "Le Journal du Dimanche Contre").replace(/Le Monde2/g, "Le Monde Contre").replace(/Le Nouvel Observateur2/g, "Le Nouvel Observateur Contre").replace(/Le Parisien2/g, "Le Parisien Contre").replace(/Le Point2/g, "Le Point Contre").replace(/Les Echos2/g, "Les Echos Contre").replace(/Les Fiches du Cinéma2/g, "Les Fiches du Cinéma Contre").replace(/Inrockuptibles2/g, "Inrockuptibles Contre").replace(/Libération2/g, "Libération Contre").replace(/MCinéma.com2/g, "MCinéma.com Contre").replace(/Mad Movies2/g, "Mad Movies Contre").replace(/Marie Claire2/g, "Marie Claire Contre").replace(/Metro2/g, "Metro Contre").replace(/Obejctif-Cinema.com2/g, "Objectif-Cinema.com Contre").replace(/Ouest France2/g, "Ouest France Contre").replace(/Paris Match2/g, "Paris Match Contre").replace(/Positif2/g, "Positif Contre").replace(/Première2/g, "Première Contre").replace(/Rolling Stone2/g, "Rolling Stone Contre").replace(/Starfix2/g, "Starfix Contre").replace(/Studio Ciné Live2/g, "Studio Ciné Live Contre").replace(/Studio Magazine2/g, "Studio Magazine Contre").replace(/Sud Ouest2/g, "Sud Ouest Contre").replace(/TéléCinéObs2/g, "TéléCinéObs Contre").replace(/Télérama2/g, "Télérama Contre").replace(/VSD2/g, "VSD Contre").replace(/Zurban2/g, "Zurban Contre").replace(/Obejctif-Cinema.com/g, "Objectif-Cinema.com").replace(/&#039;/g, "'")
}

// Set inputs filter dates
function setInputsDates(node) {
    var numberDays, todayStart, todayEnd, ddEnd, mmEnd, yyyyEnd, ddStart, mmStart, yyyyStart;
    $("*").removeClass("clickedFilter"), $(node).addClass("clickedFilter"), numberDays = window.localStorage.getItem("filterValue"), todayStart = new Date, todayEnd = new Date, ddEnd = String(todayEnd.getDate()).padStart(2, "0"), mmEnd = String(todayEnd.getMonth() + 1).padStart(2, "0"), yyyyEnd = todayEnd.getFullYear(), todayStart.setDate(todayStart.getDate() - parseInt(numberDays)), ddStart = String(todayStart.getDate()).padStart(2, "0"), mmStart = String(todayStart.getMonth() + 1).padStart(2, "0"), yyyyStart = todayStart.getFullYear(), todayStart = mmStart + "/" + ddStart + "/" + yyyyStart, todayEnd = mmEnd + "/" + ddEnd + "/" + yyyyEnd, numberDays == buttonYear ? todayStart = "1/1/" + buttonYear : numberDays == buttonYear - 1 ? (todayStart = "1/1/" + parseInt(buttonYear - 1), todayEnd = "12/31/" + parseInt(buttonYear - 1)) : numberDays == buttonYear - 2 ? (todayStart = "1/1/" + parseInt(buttonYear - 2), todayEnd = "12/31/" + parseInt(buttonYear - 2)) : numberDays == buttonYear - 3 && (todayStart = "1/1/" + parseInt(buttonYear - 3), todayEnd = "12/31/" + parseInt(buttonYear - 3)), document.getElementById("min").value = todayStart, document.getElementById("max").value = todayEnd
}

// Change french date format to mm/dd/yyyy
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
            break
    }
    return newDate[1] + "/" + newDate[0] + "/" + newDate[2]
}

function typewriter() {
    var app = document.getElementById("typewriter");

    var typewriter = new Typewriter(app, {
        loop: true,
        delay: 50
    });

    typewriter.typeString("T'as vu quoi récemment ?")
        .pauseFor(2500)
        .deleteAll()
        .typeString("C'est quoi le meilleur film au ciné ?")
        .pauseFor(2500)
        .deleteAll()
        .typeString("Tu me recommandes quoi en ce moment ?")
        .pauseFor(2500)
        .start();
}

// Main table function
function mainTable(data) {
    // Get window height
    var height = $(window).height()

    // Get table localStorage object
    var datatablesData = JSON.parse(window.localStorage.getItem("DataTables_table"))

    // If datatablesData get datatablesData columns
    if (datatablesData) var columns = datatablesData.columns

    // Define criticNamesArray
    for (var criticNamesArray = [], criticNamesArrayLength = Object.keys(data.critics).length, i = 0; i < criticNamesArrayLength; i++) criticNamesArray.push(data.critics[i][i])

    // Define columns critic names
    var columnsVisibleState = [],
        columnsKeyNameDynamic = criticNamesArray,
        columnsKeyName = columnsKeyNameDynamic.slice()

    // Define extra columns number
    var extraColumns = columnNumberStart + extraRightColumns - 1

    // Define total columns number
    var columnNumberOrder = columnsKeyNameDynamic.length + extraColumns

    // Define last critic column number
    var columnNumber = columnNumberOrder - extraRightColumns

    // Define target array
    var targetsArray = [columnNumberStart - 3, columnNumberStart - 2, columnNumberStart - 1, columnNumber + 1, columnNumber + 2, columnNumber + 3, columnNumber + 4]

    // Get columns visible state array
    for (var column in columns) columns.hasOwnProperty(column) && column >= columnNumberStart && column <= columnNumber && columnsVisibleState.push(columns[column].visible)

    // Get columns not visible indexes
    columnsNotVisibleIndexes = columnsVisibleState.multiIndexOf(false)

    // Get new array with only visible critic
    for (var i = columnsNotVisibleIndexes.length - 1; i >= 0; i--) columnsKeyNameDynamic.splice(columnsNotVisibleIndexes[i], 1)

    // If width > 1290, fix the last extra right columns
    var rightColumns = width > 1290 ? extraRightColumns : 0

    // Set datatables data
    var data = {
        ajax: "https://yaquoiaucine.fr/assets/js/data.json",
        columns: [{
            className: "moviesRank",
            orderable: !1,
            data: null
        }, {
            data: null,
            render: function(data, type, row) {
                var res;
                return data.title !== void 0 && data.title !== "" ? res = '<a href="' + data.url + '" target="_blank">' + data.title + "</a>" : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: "date[0].dateName"
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[0]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[1]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[2]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[3]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[4]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[5]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[6]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[7]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[8]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[9]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[10]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[11]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[12]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[13]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[14]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[15]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[16]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[17]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[18]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[19]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[20]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[21]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[22]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[23]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[24]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[25]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[26]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[27]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[28]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[29]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[30]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[31]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[32]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[33]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[34]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[35]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[36]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[37]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[38]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[39]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[40]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[41]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[42]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[43]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[44]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[45]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[46]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[47]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[48]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[49]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[50]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[51]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[52]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[53]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[54]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[55]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[56]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[57]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[58]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[59]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[60]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[61]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[62]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[63]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[64]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[65]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[66]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[67]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[68]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[69]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[70]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[71]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[72]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[73]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[74]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[75]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[76]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[77]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[78]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[79]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[80]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[81]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[82]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[83]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[84]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[85]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[86]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[87]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[88]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[89]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[90]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[91]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[92]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[93]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[94]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[95]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[96]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[97]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[98]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[99]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[100]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[101]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[102]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[103]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[104]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[105]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[106]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[107]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[108]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[109]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[110]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[111]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[112]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[113]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[114]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[115]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[116]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[117]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[118]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[119]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[120]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[121]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[122]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[123]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[124]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[125]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[126]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[127]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[128]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[129]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[130]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[131]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[132]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[133]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[134]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[135]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[136]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[137]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[138]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[139]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[140]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[141]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[142]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            className: "critic",
            render: function(data, type, row) {
                var rowcolumnsKeyName = row.criticNames[columnsKeyName[143]],
                    res;
                return rowcolumnsKeyName !== void 0 && rowcolumnsKeyName !== "" ? res = parseFloat(rowcolumnsKeyName).toFixed(1) : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            render: function(data, type, row) {
                for (var res = 0, columnsKeyNameLength = 0, id = data.url.match(/=(.*)\./).pop(), i = 0; i < columnsKeyNameDynamic.length; i++) row.criticNames[columnsKeyNameDynamic[i]] !== void 0 && row.criticNames[columnsKeyNameDynamic[i]] !== "" && (res += parseFloat(row.criticNames[columnsKeyNameDynamic[i]]), columnsKeyNameLength += 1);
                return res !== 0 ? resTotal = resTotal = '<a href="https://www.allocine.fr/film/fichefilm-' + id + '/critiques/presse/" target="_blank">' + (res / columnsKeyNameLength).toFixed(2) + "</a>" : resTotal = "&nbsp;&nbsp;-&nbsp;&nbsp;", resTotal
            }
        }, {
            data: null,
            render: function(data, type, row) {
                var id = data.url.match(/=(.*)\./).pop(),
                    res;
                return row.user !== void 0 && row.user !== "" ? res = '<a href="https://www.allocine.fr/film/fichefilm-' + id + '/critiques/spectateurs/" target="_blank">' + parseFloat(row.user).toFixed(2) + "</a>" : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            render: function(data, type, row) {
                var res;
                return row.imdbRating !== void 0 && row.imdbRating !== "" ? res = '<a href="https://www.imdb.com/title/' + data.imdbId + '" target="_blank">' + parseFloat(row.imdbRating).toFixed(2) / 2 + "</a>" : res = "&nbsp;&nbsp;-&nbsp;&nbsp;", res
            }
        }, {
            data: null,
            render: function(data, type, row) {
                for (var resBis = 0, columnsKeyNameLengthBis = 0, i = 0, resCritic, newResCritic, newRowUser, newImdbRating, resTotal; i < columnsKeyNameDynamic.length; i++) row.criticNames[columnsKeyNameDynamic[i]] !== void 0 && row.criticNames[columnsKeyNameDynamic[i]] !== "" && (resBis += parseFloat(row.criticNames[columnsKeyNameDynamic[i]]), columnsKeyNameLengthBis += 1);
                return resCritic = resBis / columnsKeyNameLengthBis, newResCritic = parseFloat(resCritic), newRowUser = parseFloat(row.user), newImdbRating = parseFloat(row.imdbRating) / 2, resBis != 0 && row.user != "" && row.imdbRating != "" ? resTotal = (newResCritic + newRowUser + newImdbRating) / 3 : resBis != 0 && row.user != "" && row.imdbRating == "" ? resTotal = (newResCritic + newRowUser) / 2 : resBis == 0 && row.user !== "" && row.imdbRating != "" ? resTotal = (newRowUser + newImdbRating) / 2 : resBis != 0 && row.user == "" && row.imdbRating != "" ? resTotal = (newResCritic + newImdbRating) / 2 : resBis != 0 && row.user == "" && row.imdbRating == "" ? resTotal = newResCritic : resBis == 0 && row.user != "" && row.imdbRating == "" ? resTotal = newRowUser : resBis == 0 && row.user == "" && row.imdbRating != "" ? resTotal = newImdbRating : resTotal = parseFloat(0), resTotal.toFixed(2)
            }
        }],
        dom: "Brtip",
        stateSave: !0,
        stateSaveParams: function(settings, data) {
            data.search.search = ""
        },
        stateSaveCallback: function(settings, data) {
            localStorage.setItem("DataTables_" + settings.sInstance, JSON.stringify(data))
        },
        stateLoadCallback: function(settings) {
            return JSON.parse(localStorage.getItem("DataTables_" + settings.sInstance))
        },
        buttons: [{
            extend: "collection",
            className: "periodListArrayButton",
            collectionLayout: "four-column",
            text: "<i class='far fa-calendar-alt'></i> Période",
            buttons: [{
                text: "Les 7 derniers jours",
                action: function(e, dt, node, config) {
                    window.localStorage.setItem("filterValue", "7"), setInputsDates(node), table.columns.adjust().draw()
                }
            }, {
                text: "Les 2 dernières semaines",
                action: function(e, dt, node, config) {
                    window.localStorage.setItem("filterValue", "14"), setInputsDates(node), table.columns.adjust().draw()
                }
            }, {
                text: "Les 3 dernières semaines",
                action: function(e, dt, node, config) {
                    window.localStorage.setItem("filterValue", "21"), setInputsDates(node), table.columns.adjust().draw()
                }
            }, {
                text: "Les 30 derniers jours",
                action: function(e, dt, node, config) {
                    window.localStorage.setItem("filterValue", "30"), setInputsDates(node), table.columns.adjust().draw()
                }
            }, {
                text: "Les 90 derniers jours",
                action: function(e, dt, node, config) {
                    window.localStorage.setItem("filterValue", "90"), setInputsDates(node), table.columns.adjust().draw()
                }
            }, {
                text: "En " + buttonYear,
                action: function(e, dt, node, config) {
                    window.localStorage.setItem("filterValue", buttonYear), setInputsDates(node), table.columns.adjust().draw()
                }
            }, {
                text: "En " + parseInt(buttonYear - 1),
                action: function(e, dt, node, config) {
                    window.localStorage.setItem("filterValue", parseInt(buttonYear - 1)), setInputsDates(node), table.columns.adjust().draw()
                }
            }, {
                text: "En " + parseInt(buttonYear - 2),
                action: function(e, dt, node, config) {
                    window.localStorage.setItem("filterValue", parseInt(buttonYear - 2)), setInputsDates(node), table.columns.adjust().draw()
                }
            }, {
                text: "En " + parseInt(buttonYear - 3),
                action: function(e, dt, node, config) {
                    window.localStorage.setItem("filterValue", parseInt(buttonYear - 3)), setInputsDates(node), table.columns.adjust().draw()
                }
            }, {
                text: "Depuis toujours",
                action: function(e, dt, node, config) {
                    window.localStorage.setItem("filterValue", "365000"), setInputsDates(node), table.columns.adjust().draw()
                }
            }]
        }, {
            extend: "colvis",
            columnText: function(dt, idx, title) {
                for (var columnsKeyNameButton = [], i = 0; i < columnsKeyName.length; i++) columnsKeyNameButton[i] = replaceCriticsTitle(columnsKeyName[i]);
                return columnsKeyNameButton[idx - columnNumberStart]
            },
            columns: ":not(.noVis)",
            collectionLayout: "four-column",
            text: "<i class='fas fa-tasks'></i> Mes critiques",
            className: "customButton"
        }, {
            text: "<i class='fas fa-eye'></i> Toutes les critiques",
            className: "customButtonDisplay",
            action: function(e, dt, node, config) {}
        }, {
            text: "<i class='fas fa-eye-slash'></i> Aucunes critiques",
            className: "customButtonHide",
            action: function(e, dt, node, config) {}
        }, {
            text: "<i class='fas fa-trash-alt'></i> Remettre à zéro",
            action: function(e, dt, node, config) {
                clearLocalStorage(this)
            }
        }],
        columnDefs: [{
            targets: targetsArray,
            className: "noVis"
        }],
        paging: !1,
        info: !1,
        destroy: !0,
        language: {
            emptyTable: '<p style="margin: 10px auto">Chargement, veuillez patienter<span class="one">.</span><span class="two">.</span><span class="three">.</span></p>',
            infoEmpty: "Aucun film trouvé, veuillez réessayer...",
            zeroRecords: "Aucun film trouvé, veuillez réessayer..."
        },
        initComplete: function(data) {
            var localTableVersion = window.localStorage.getItem("tableVersion"),
                toastShow1;
            localTableVersion || window.localStorage.setItem("tableVersion", tableVersion), localTableVersion != tableVersion && (window.localStorage.setItem("tableVersion", tableVersion), clearLocalStorage(this)), table.columns(".critic").every(function(index) {
                var data, res, i;
                if (index <= columnNumber - columnNumberStart) {
                    data = this.data(), res = 0;
                    for (i = 0; i < data.length; i++) newIndex = index - columnNumberStart, data[i].criticNames[columnsKeyName[newIndex]] !== void 0 && (res += parseFloat(data[i].criticNames[columnsKeyName[newIndex]]));
                    res === 0 && table.column(index).visible(!1, !1)
                }
            }), toastShow1 = window.localStorage.getItem("toastShow1"), toastShow1 == null && toastr.info("<br>Légende : <i class='far fa-newspaper' title='Notes de la presse'></i>  Notes de la presse, <i class='fas fa-users' title='Notes des spectateurs'></i>  Notes des spectateurs, <i class='fab fa-imdb' title='Notes IMDb'></i>  Notes IMDb, <i class='fas fa-equals' title='Moyenne de la presse et des spectateurs'></i>  Moyenne de la presse et des spectateurs.<br><br>Les notes de la presse sont calculées à partir des critiques sélectionnées dans <i>Mes critiques</i>.<br><br>Les notes IMDb sont rapportées sur 5.", "Informations")
            typewriter()
        }
    }

    // Display table
    var table = $("#table").DataTable(data)

    // Hide release date on load
    table.columns("#releaseDateColumn").visible(!1)

    // Sort table last column
    table.column(columnNumberOrder).order("desc").draw()

    // Display movies rank on order and search
    table.on("order.dt search.dt", function() {
        table.column(0, {
            search: "applied",
            order: "applied"
        }).nodes().each(function(cell, i) {
            cell.innerHTML = i + 1
        })
    }).draw()

    // Clear localStorage on datatables errors
    $.fn.dataTable.ext.errMode = function(settings, helpPage, message) {
        var localTableVersion = window.localStorage.getItem("tableVersion");
        localTableVersion || window.localStorage.setItem("tableVersion", tableVersion), localTableVersion != tableVersion && (window.localStorage.setItem("tableVersion", tableVersion), clearLocalStorage(this))
    }

    // Extend dataTables search
    $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
        var min = $("#min").val(),
            max = $("#max").val(),
            releaseDate = splitDate(data[2]) || 0;
        return !!(min == "" || max == "" || dayjs(releaseDate).isSameOrAfter(min) && dayjs(releaseDate).isSameOrBefore(max))
    })

    // Trigger search on input key up
    $("#inputSearch").keyup(function() {
        table.search($(this).val()).draw()
    })

    // Unhide all critics columns
    $(".customButtonDisplay").on("click", function() {
        table.columns(".critic").visible(!0), window.location.reload(!0)
    })

    // Hide all critics columns
    $(".customButtonHide").on("click", function() {
        table.columns(".critic").visible(!1), window.location.reload(!0)
    })

    /* Custom css rules */
    // Search options with device width
    width <= 1290 && $(".fa-search").on("click", function() {
        $(".fa-twitter").hasClass("hideicon") ? setTimeout(function() {
            $("#inputSearchSpan").toggleClass("expanded"), $(".fa-twitter, .fa-youtube, .fa-github, #credits a, .vertical").toggleClass("hideicon")
        }, 400) : ($("#inputSearchSpan").toggleClass("expanded"), $(".fa-twitter, .fa-youtube, .fa-github, #credits a, .vertical").toggleClass("hideicon")), $(".fa-search").hasClass("fa-search") ? $("#inputSearch").css({
            visibility: "visible",
            width: "100%"
        }) : $("#inputSearch").css({
            visibility: "hidden",
            width: "0"
        }), $("#inputSearch").focus(), $(this).toggleClass("fa-search fa-times-circle")
    })

    // Change font-size for really small devices
    width < 350 && ($(".fa-twitter, .fa-youtube, .fa-github, .fa-search, .fa-times-circle").removeClass("fa-lg"), $(".fa-twitter, .fa-youtube, .fa-github").next().css("font-size", "14px"))

    // Set custom table width regarding device width
    width > 1290 ? ($("#table, #table_wrapper").css("max-width", width - 516), $("#quotes").css("width", 500), $("#credits").css("width", $("#table").width())) : $("#table, #table_wrapper").css("max-width", 1274)

    // Toastr options
    toastr.options = {
        closeButton: !0,
        debug: !1,
        newestOnTop: !1,
        progressBar: !0,
        positionClass: "toast-top-right",
        preventDuplicates: !1,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "0",
        extendedTimeOut: "0",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
        onCloseClick: function() {
            toastMessage = $(".toast-message").text(), toastMessage == "Légende : Notes de la presse  Notes de la presse, Notes des spectateurs  Notes des spectateurs, Notes IMDb  Notes IMDb, Moyenne de la presse et des spectateurs  Moyenne de la presse et des spectateurs.Les notes de la presse sont calculées à partir des critiques sélectionnées dans Mes critiques.Les notes IMDb sont rapportées sur 5." ? window.localStorage.setItem("toastShow1", "closed") : toastMessage == "Les critiques ne possédant pas de notes sont automatiquement désélectionnées." && window.localStorage.setItem("toastShow2", "closed")
        }
    }

    // Set default filterValue if doesn't exist
    filterValue || window.localStorage.setItem("filterValue", "7")
    filterValueFunction()

    deactivateAllCriticsColumns()
    defaultDate()
    movieQuotesFunction()
    periodListArrayButton()
    setInputsDates()
}

// Display logo screen and call main function
$(document).ready(function() {
    $("body").addClass("noscroll"), setTimeout(function() {
        $(".mainContent").css("visibility", "visible"), $("#loadingOverlay, #loadingOverlayImg").css("display", "none"), $("body").removeClass("noscroll")
    }, 1e3), $.getJSON("https://yaquoiaucine.fr/assets/js/critics.json", mainTable)
})