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

                    var resCritic = resBis / columnsKeyNameLengthBis;

                    if (resBis === 0 && row.user === "") {
                        var resTotal = parseFloat(0);
                    } else if (resBis === 0) {
                        var resTotal = parseFloat(row.user);
                    } else if (row.user === "") {
                        var resTotal = parseFloat(resCritic);
                    } else {
                        var resTotal = (parseFloat(resCritic) + parseFloat(row.user)) / 2;
                    }

                    return resTotal.toFixed(2);
                }
            }
        ],
        "dom": "Brtip",
        "stateSave": true,
        "stateSaveParams": function(settings, data) {
            data.search.search = "";
        },
        "stateSaveCallback": function(settings, data) {
            localStorage.setItem("DataTables_" + settings.sInstance, JSON.stringify(data))
        },
        "stateLoadCallback": function(settings) {
            return JSON.parse(localStorage.getItem("DataTables_" + settings.sInstance))
        },
        "columnDefs": [{
            "targets": [0, 1, 2, columnNumber + 1, columnNumber + 2, columnNumber + 3],
            "className": "noVis"
        }],
        "buttons": [{
                "extend": "collection",
                "className": "periodListArrayButton",
                "collectionLayout": "four-column",
                "text": "Filtrer par date de sortie",
                "buttons": [{
                        "text": "Les 7 derniers jours",
                        "action": function(e, dt, node, config) {
                            window.localStorage.setItem("filterValue", "7");
                            setInputsDates(node);
                            table.draw();
                        }
                    },
                    {
                        "text": "Les 2 dernières semaines",
                        "action": function(e, dt, node, config) {
                            window.localStorage.setItem("filterValue", "14");
                            setInputsDates(node);
                            table.draw();
                        }
                    },
                    {
                        "text": "Les 3 dernières semaines",
                        "action": function(e, dt, node, config) {
                            window.localStorage.setItem("filterValue", "21");
                            setInputsDates(node);
                            table.draw();
                        }
                    },
                    {
                        "text": "Les 30 derniers jours",
                        "action": function(e, dt, node, config) {
                            window.localStorage.setItem("filterValue", "30");
                            setInputsDates(node);
                            table.draw();
                        }
                    },
                    {
                        "text": "Les 90 derniers jours",
                        "action": function(e, dt, node, config) {
                            window.localStorage.setItem("filterValue", "90");
                            setInputsDates(node);
                            table.draw();
                        }
                    },
                    {
                        "text": "En " + buttonYear,
                        "action": function(e, dt, node, config) {
                            window.localStorage.setItem("filterValue", buttonYear);
                            setInputsDates(node);
                            table.draw();
                        }
                    },
                    {
                        "text": "En " + parseInt(buttonYear - 1),
                        "action": function(e, dt, node, config) {
                            window.localStorage.setItem("filterValue", parseInt(buttonYear - 1));
                            setInputsDates(node);
                            table.draw();
                        }
                    },
                    {
                        "text": "En " + parseInt(buttonYear - 2),
                        "action": function(e, dt, node, config) {
                            window.localStorage.setItem("filterValue", parseInt(buttonYear - 2));
                            setInputsDates(node);
                            table.draw();
                        }
                    },
                    {
                        "text": "En " + parseInt(buttonYear - 3),
                        "action": function(e, dt, node, config) {
                            window.localStorage.setItem("filterValue", parseInt(buttonYear - 3));
                            setInputsDates(node);
                            table.draw();
                        }
                    },
                    {
                        "text": "Depuis toujours",
                        "action": function(e, dt, node, config) {
                            window.localStorage.setItem("filterValue", "365000");
                            setInputsDates(node);
                            table.draw();
                        }
                    }
                ]
            }, {
                "extend": "colvis",
                "columnText": function(dt, idx, title) {
                    var columnsKeyNameButton = [];

                    for (var i = 0; i < columnsKeyName.length; i++) {
                        columnsKeyNameButton[i] = replaceCriticsTitle(columnsKeyName[i]);
                    }

                    return columnsKeyNameButton[idx - 3];
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
            },
            {
                "text": "Effacer les préférences",
                "action": function(e, dt, node, config) {
                    clearLocalStorage(this);
                }
            }
        ],
        "scrollX": true,
        "fixedColumns": {
            "leftColumns": 0,
            "rightColumns": rightColumns
        },
        "paging": false,
        "info": false,
        "destroy": true,
        "language": {
            "emptyTable": "Chargement, veuillez patienter...",
            "infoEmpty": "Aucun film correspondant, veuillez réessayer...",
            "zeroRecords": "Aucun film correspondant, veuillez réessayer..."
        },
        "initComplete": function(data) {

            // If small width ignore span.sr-only
            if (width <= 1290) {
                $(".mainContent").css("visibility", "visible");
                $("#loadingOverlay, #loadingOverlayImg").css("display", "none");
                $("body").removeClass("noscroll");
            }

            // Set and/or retrieve table version
            var localTableVersion = window.localStorage.getItem("tableVersion");

            // If localTableVersion doesn't exist set it to current version
            if (!localTableVersion) window.localStorage.setItem("tableVersion", tableVersion);

            if (localTableVersion != tableVersion) {
                window.localStorage.setItem("tableVersion", tableVersion);
                clearLocalStorage(this);
            }

            $("*").on("click", function(e) {
              if ($(e.target).attr("class") != "customButton" && $("button.deactivate").length > 0) $("button.deactivate").remove();
            });

            $("button.customButton").on("click", function(e) {
                if ($("button.deactivate").length == 0) {
                    $("<button class=\"dt-button buttons-collection deactivate\" tabindex=\"0\" aria-controls=\"table\" type=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\"><span>Désélectionner toutes les notes</span></button>").insertBefore('div[role="menu"] button:first-child');
                }

                $("button.deactivate").on("click", function() {
                    $(".mainContent").css("visibility", "hidden");
                    $("#loadingOverlay, #loadingOverlayImg").css("display", "block");
                    $("body").addClass("noscroll");
                    $("#loadingOverlayImg figcaption#clearLocalStorage").html("Votre sélection est en cours<br>de mise à jour, veuillez patienter.")

                    setTimeout(function() {
                        $(".dt-button.buttons-columnVisibility.active").click();
                    }, 100);

                    setTimeout(function() {
                        $(".mainContent").css("visibility", "visible");
                        $("#loadingOverlay, #loadingOverlayImg").css("display", "none");
                        $("body").removeClass("noscroll");
                    }, 100);
                });
            });

            // Hide columns with no data
            table.columns(".critic").every(function(index) {
                if (index <= columnNumber - columnNumberStart) {
                    var data = this.data(),
                        res = 0;

                    for (var i = 0; i < data.length; i++) {
                        newIndex = index - columnNumberStart;

                        if (data[i].criticNames[columnsKeyName[newIndex]] !== undefined) res += parseFloat(data[i].criticNames[columnsKeyName[newIndex]]);
                    }

                    if (res === 0) table.column(index).visible(false, false);
                }
            });

            // Adjust column sizing and redraw
            table.columns.adjust().draw();
        }
    }

    // Display table
    var table = $("#table").DataTable(data);

    table.columns("#releaseDateColumn").visible(false);

    $("#inputSearch").keyup(function() {
        table.search($(this).val()).draw();
    });

    if (width <= 1290) {
        $(".fa-search").on("click", function() {
            if ($(".fa-twitter").hasClass("hideicon")) {
                setTimeout(function() {
                    $("#inputSearchSpan").toggleClass("expanded");
                    $(".fa-twitter, .fa-youtube, .fa-github, #credits a, .vertical").toggleClass("hideicon");
                }, 400);
            } else {
                $("#inputSearchSpan").toggleClass("expanded");
                $(".fa-twitter, .fa-youtube, .fa-github, #credits a, .vertical").toggleClass("hideicon");
            }

            if ($(".fa-search").hasClass("fa-search")) {
                $("#inputSearch").css({
                    "visibility": "visible",
                    "width": "100%"
                });
            } else {
                $("#inputSearch").css({
                    "visibility": "hidden",
                    "width": "0"
                });
            }

            $("#inputSearch").focus();
            $(this).toggleClass("fa-search fa-times-circle");
        });
    }

    // Change font-size for really small devices
    if (width < 350) {
        $(".fa-twitter, .fa-youtube, .fa-github, .fa-search, .fa-times-circle").removeClass("fa-lg");
        $(".fa-twitter, .fa-youtube, .fa-github").next().css("font-size", "14px");
    }

    $.fn.dataTable.ext.errMode = function(settings, helpPage, message) {
        window.localStorage.setItem("tableVersion", tableVersion);
        clearLocalStorage(this);
    };

    // Extend dataTables search
    $.fn.dataTable.ext.search.push(
        function(settings, data, dataIndex) {
            var min = $("#min").val(),
                max = $("#max").val(),
                releaseDate = splitDate(data[2]) || 0;

            if (
                (min == "" || max == "") ||
                (dayjs(releaseDate).isSameOrAfter(min) && dayjs(releaseDate).isSameOrBefore(max))
            ) {
                return true;
            }
            return false;
        }
    );

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

    $(".customButton, .periodListArrayButton").on("click", function(e) {
        $("button.dt-button").on("click", filterValueFunction);

        var filterValue = window.localStorage.getItem("filterValue");

        switch (filterValue) {
            case "7":
                var childNumber = 0;
                break;
            case "14":
                var childNumber = 1;
                break;
            case "21":
                var childNumber = 2;
                break;
            case "30":
                var childNumber = 3;
                break;
            case "90":
                var childNumber = 4;
                break;
            case String(buttonYear):
                var childNumber = 5;
                break;
            case String(buttonYear - 1):
                var childNumber = 6;
                break;
            case String(buttonYear - 2):
                var childNumber = 7;
                break;
            case String(buttonYear - 3):
                var childNumber = 8;
                break;
            case "365000":
                var childNumber = 9;
                break;
        }

        if ($(".periodListArrayButton").next().attr("class") == "dt-button buttons-collection buttons-colvis customButton") {
          var dtbuttonChild = $(".periodListArrayButton").next().next().next().find(".dt-button:eq(" + childNumber + ")").addClass("clickedFilter");
        }
        else {
          dtbuttonChild = $(".periodListArrayButton").next().next().find(".dt-button:eq(" + childNumber + ")").addClass("clickedFilter");
        }
        if (!$(".periodListArrayButton").next().next().find(".dt-button:eq(" + childNumber + ")").hasClass("clickedFilter")) dtbuttonChild;

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

                if (!$(".customButton").hasClass("customButtonSubmit") && $(e.target).parent().attr("class") != "dt-button-collection four-column") {
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
                window.location.reload(true);
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
            window.location.reload(true);
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
            window.location.reload(true);
        }, 10000);
    });
}

// Get window width
var width = $(window).width(),
    randomQuotesLength = randomQuotes.quotes.length,
    uniqueRandomNumber = JSON.parse(window.localStorage.getItem("uniqueRandomNumber"));

if (uniqueRandomNumber === null) uniqueRandomNumber = [];

if (width > 1290) {
    $(document).arrive("div.DTFC_RightHeadWrapper table thead tr th.sorting_desc span.sr-only", function() {
        // Adjust column width and hide loading overlay
        $("div.DTFC_RightHeadWrapper").find("span.sr-only:eq(2)").click().click();
        $(".mainContent").css("visibility", "visible");
        $("#loadingOverlay, #loadingOverlayImg").css("display", "none");
        $("body").removeClass("noscroll");
        Arrive.unbindAllArrive();
    });
}

$(document).ready(function() {

    // Disable scroll until loading is complet
    $("body").addClass("noscroll");

    setTimeout(function() {
        $("figcaption#clearLocalStorage").css("display", "block");
    }, 5000);

    $("figcaption#clearLocalStorage span").on("click", function(e) {
        clearLocalStorage(e);
        $(".mainContent").css("visibility", "visible");
        $("#loadingOverlay, #loadingOverlayImg").css("display", "none");
        Arrive.unbindAllArrive();
    });

    var filterValue = window.localStorage.getItem("filterValue");

    if (!filterValue) {
        window.localStorage.setItem("filterValue", "7");
        var zipCode = window.localStorage.getItem("filterValue");
    }

    filterValueFunction();

    var zipCode = window.localStorage.getItem("zipCode");
    if (!zipCode) {
        window.localStorage.setItem("zipCode", "Paris");
        var zipCode = window.localStorage.getItem("zipCode");
    }
    $("#zipCodeValue").text(zipCode);

    setInputsDates();

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

        $("#table").on("mouseover", "td.noVis", function(e) {
            $("table#hoverDetailsTable").remove();

            // Get DataTable API instance
            var table = $("#table").DataTable(),
                tr = $(this).closest("tr"),
                row = table.row(tr),
                previousSiblingClass = $(e.target).prev().attr("class"),
                parentHoverClass = $(e.target).parent().attr("class"),
                trIndex = parseInt(tr.index()),
                trShownIndex = parseInt($(this).parent().prevAll("tr.odd.shown:first, tr.even.shown:first").index("tr.odd.shown, tr.even.shown")),
                trOddHeight = parseInt($('tr.odd[role="row"]').css("height")),
                trHeight = parseInt($('tr[role="row"]').css("height")),
                trShownHeight = $(this).parent().prevAll("tr.odd.shown:first, tr.even.shown:first").next().height();

            if (previousSiblingClass == " details" && (parentHoverClass == "odd" || parentHoverClass == "even")) {
                if (trShownHeight > 100) {
                    arrayHeight.splice(trShownIndex, 1, trShownHeight);

                    newTrShownHeight = getAllBefore(trShownHeight);
                    newSumTrShownHeightTemp = newTrShownHeight.reduce((a, b) => a + b, 0);
                    newSumTrShownHeight = newSumTrShownHeightTemp - ((trShownIndex + 1) * trOddHeight);

                    $(".dataTables_scroll").append(hoverFormat(row.data()));
                    $("table#hoverDetailsTable").find("span").css("top", trIndex * trOddHeight + 37 + newSumTrShownHeight);
                    $("table#hoverDetailsTable").find("img").css("top", trIndex * trOddHeight - 103.5 + newSumTrShownHeight);
                } else {
                    $(".dataTables_scroll").append(hoverFormat(row.data()));
                    $("table#hoverDetailsTable").find("span").css("top", trIndex * trOddHeight + 37);
                    $("table#hoverDetailsTable").find("img").css("top", trIndex * trOddHeight - 103.5);
                }

                if (tr.is(":nth-last-child(1)")) {
                    $("table#hoverDetailsTable").find("img").css("top", trIndex * trOddHeight - 103.5 - (trOddHeight * 4));
                }
                if (tr.is(":nth-last-child(2)")) {
                    $("table#hoverDetailsTable").find("img").css("top", trIndex * trOddHeight - 103.5 - (trOddHeight * 3));
                }
                if (tr.is(":nth-last-child(3)")) {
                    $("table#hoverDetailsTable").find("img").css("top", trIndex * trOddHeight - 103.5 - (trOddHeight * 2));
                }
                if (tr.is(":nth-last-child(4)")) {
                    $("table#hoverDetailsTable").find("img").css("top", trIndex * trOddHeight - 103.5 - (trOddHeight * 1));
                }
            }
        });

        $("#table").on("mouseleave", "td.noVis", function() {
            $("table#hoverDetailsTable").remove();
        });
    }

    // Display movie details
    $("#table").on("click", "td.details, td.noVis", function() {
        if ($("table#hoverDetailsTable").length > 0) $("table#hoverDetailsTable").remove();

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

        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const localization_city_url = "https://www.allocine.fr/_/localization_city/";
        const showtimes_url = "https://www.allocine.fr/_/showtimes/movie-";
        const postalCode = window.localStorage.getItem("zipCode");
        var html = "";

        var getPostalCode = async () => {
            var requestAllocineCities = await fetch(proxyurl + localization_city_url + postalCode);
            var data = await requestAllocineCities.json();

            return data.values.cities[0].node.id;
        };

        var getTheaterInfo = async () => {
            var cityId = await getPostalCode();
            var url = row.data().url;
            var movieId = url.substring(
                url.lastIndexOf("=") + 1,
                url.lastIndexOf(".")
            );

            var requestAllocineShowtimes = await fetch(proxyurl + showtimes_url + movieId + "/near-" + cityId + "/d-0/");
            var dataAllocine = await requestAllocineShowtimes.json();
            var results = dataAllocine.results;

            if (results.length > 0) {
                for (var i = 0; i < results.length; i++) {
                    if (i < 5) {
                        html += "<p>Cinéma : <a href=\"https://www.allocine.fr/seance/salle_gen_csalle=" + results[i].theater.internalId + ".html\" target=\"_blank\">" + results[i].theater.name +
                            "</a><br />Adresse : <a href=\"http://maps.google.com/maps?q=" + results[i].theater.location.address + " " + results[i].theater.location.city + "\" target=\"_blank\">" + results[i].theater.location.address + " à " + results[i].theater.location.city +
                            "</a><br />Horaires pour aujourd'hui : ";

                        for (var j = 0; j < results[i].showtimes.multiple.length; j++) {
                            var startsAt = results[i].showtimes.multiple[j].startsAt.substring(
                                results[i].showtimes.multiple[j].startsAt.lastIndexOf("T") + 1,
                                results[i].showtimes.multiple[j].startsAt.lastIndexOf(":")
                            )

                            var d = new Date();
                            var m = d.getMinutes();
                            var h = d.getHours();
                            if (h == "0") h = 24;
                            var currentTime = h + "." + m;

                            var time = startsAt.split(":");
                            var hour = time[0];
                            var min = time[1];
                            var inputTime = hour + "." + min;

                            var totalTime = currentTime - inputTime;

                            if (results[i].showtimes.multiple[j].data.ticketing.length > 0 && results[i].showtimes.multiple[j].data.ticketing[0].urls[0] !== "" && totalTime < 0) {
                                html += "<a href=\"" + results[i].showtimes.multiple[j].data.ticketing[0].urls + "\" target=\"_blank\">" + startsAt + "</a> / ";
                            } else {
                                html += startsAt + " / ";
                            }
                        }

                        html = html.replace(/\s\/\s*$/, "");
                        html += "</p>";
                    }
                }
            } else {
                html += "<p>Aucunes séances à proximité de : " + postalCode + "</p>"
            }

            $(this).parent().next().find("span#showtimesInfo").html(html);
        };

        getTheaterInfo();

        if ($(this).parent().next().find(".secondTd").find("ul").text() === "") $(this).parent().next().find(".secondTd").remove();
        if ($(this).parent().next().find(".secondTd").find("li").text() === " ") $(this).parent().next().find(".secondTd").remove();
        if ($(this).parent().next().find(".secondTd").prev().find("li").length === 0) {
            $(this).parent().next().find(".secondTd").find("p").html("<strong>Informations techniques :</strong>");
            $(this).parent().next().find(".secondTd").prev().remove();
        }
    });

    $("#myModal").on("show.bs.modal", function(e) {
        $("body, .modal").addClass("noscroll");
    });

    $("#myModal").on("hide.bs.modal", function(e) {
        $("body, .modal").removeClass("noscroll");
    });

    $("#zipcodeLink").on("click", function() {
        $("#zipCodeInput").toggleClass("expanded");
        document.getElementById("zipCodeInput").focus();
    });

    $("#defaultDate").on("click", function(e) {
        $("button.periodListArrayButton").click();
        if (e) e.stopPropagation();
    });

    $("#zipCodeInput").on("change paste keyup", function() {
        if (event.key === "Enter") {
            var input = document.getElementById("zipCodeInput").value;
            window.localStorage.setItem("zipCode", input);
            window.location.reload(true);
        } else {
            autoComplete();
        }
    });

    $(".tutorial").on("click", tutorialShow);

    $("body").on("click", function(e) {
        elementClass = $(e.target).attr("class");

        if (e.target.id === "overlay") tutorialHide();

        if (elementClass === "modal fade" || elementClass === "fa fa-times-circle") $("#video").prop("src", "");
        if (elementClass === "td_picture") $("#video").prop("src", $(e.target).parent().attr("data-src"));
        if (elementClass === "video-thumbnail") $("#video").prop("src", $(e.target).attr("data-src"));
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
