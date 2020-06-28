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

            // Add period list before buttons
            $(".dt-buttons").prepend(
                "<select id=\"periodList\" name=\"periodList\" onchange=\"setInputsDates(event)\">" +
                "<option disabled selected>Filtrer par date de sortie</option>" +
                "<option value=\"7\">Les 7 derniers jours</option>" +
                "<option value=\"30\">Les 30 derniers jours</option>" +
                "<option value=\"90\">Les 3 derniers mois</option>" +
                "<option value=\"365\">Les 12 derniers mois</option>" +
                "</select>"
            );

            // Event listener to the two range filtering inputs to redraw on input
            $("#periodList").change(function() {
                table.draw();
            });
        }
    }

    // Display table
    var table = $("#table").DataTable(data);

    table.columns("#releaseDateColumn").visible(false);

    // Extend dataTables search
    $.fn.dataTable.ext.search.push(
        function(settings, data, dataIndex) {
            var min = $("#min").val(),
                max = $("#max").val(),
                releaseDate = splitDate(data[2]) || 0;

            if (
                (min == "" || max == "") ||
                (moment(releaseDate).isSameOrAfter(min) && moment(releaseDate).isSameOrBefore(max))
            ) {
                return true;
            }
            return false;
        }
    );

    $("#min, #max").datepicker();

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

        if ($(".secondTd").find("li").text() === " ") $(".secondTd").remove();
    });

    if (width > 767) {
        $("p#credits").append("<i class=\"far fa-question-circle\"></i><a class=\"tutorial\" href=\"#\">Aide</a>")
    }

    $(".tutorial").on("click", tutorialShow);

    $("body").on("click", function(e) {
        elementClass = $(e.target).attr("class");

        if (e.target.id === "overlay") {
            tutorialHide();
        }

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
