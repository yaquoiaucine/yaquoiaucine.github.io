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
                        "text": "Depuis toujours",
                        "action": function(e, dt, node, config) {
                            window.localStorage.setItem("filterValue", "36500");

                            $("#loading").show();

                            table.ajax.url("https://yaquoiaucine.fr/assets/js/data.json").load();

                            setTimeout(function() {
                                $("#loading").hide();
                            }, 4000);

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
                    localStorage.removeItem("DataTables_table");
                    localStorage.removeItem("filterValue");
                    localStorage.removeItem("uniqueRandomNumber");
                    window.location.reload(false);
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
            "emptyTable": "Chargement, veuillez patienter..."
        },
        "initComplete": function(data) {

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

            var filterValue = window.localStorage.getItem("filterValue");

            if (filterValue == 36500) table.ajax.url("https://yaquoiaucine.fr/assets/js/data.json").load();

            // Adjust column sizing and redraw
            table.columns.adjust().draw();

            $(".dataTables_scrollBody").append("<div class=\"marginbottom\"></div>");
        }
    }

    // Display table
    var table = $("#table").DataTable(data);

    table.columns("#releaseDateColumn").visible(false);

    $("#inputSearch").keyup(function() {
        table.search($(this).val()).draw();
    });

    $(".fa-search").on("click", function() {
        var inputWidth = (width > 1290) ? "180px" : "90px";

        $("#inputSearch").css({
            "visibility": "visible",
            "width": inputWidth,
            "margin": "0 5px"
        });
    });

    $("*").on("click", function(e) {
        if ($("#inputSearch").width() != 0 && e.target.id != "inputSearch") {
            $("#inputSearch").css({
                "visibility": "hidden",
                "width": "0px",
                "margin": "0 5px 0 0"
            });
        };
    });

    $.fn.dataTable.ext.errMode = function(settings, helpPage, message) {
        localStorage.removeItem("DataTables_table");
        localStorage.removeItem("filterValue");
        localStorage.removeItem("uniqueRandomNumber");
        window.location.reload(false);
    };

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
            case "36500":
                var childNumber = 4;
                break;
        }

        if (!$(".periodListArrayButton").next().next().find(".dt-button:eq(" + childNumber + ")").hasClass("clickedFilter")) $(".periodListArrayButton").next().next().find(".dt-button:eq(" + childNumber + ")").addClass("clickedFilter");

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
var width = $(window).width(),
    randomQuotesLength = randomQuotes.quotes.length,
    uniqueRandomNumber = JSON.parse(window.localStorage.getItem("uniqueRandomNumber"));

if (uniqueRandomNumber === null) uniqueRandomNumber = [];

$(document).ready(function() {

    var filterValue = window.localStorage.getItem("filterValue");

    if (!filterValue) window.localStorage.setItem("filterValue", "7");

    if (filterValue == 36500) {
        $("#loading").show();

        setTimeout(function() {
            $("#loading").hide();
        }, 4000);
    }

    setInputsDates();

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

        if ($(".secondTd").find("ul").text() === "") $(".secondTd").remove();
        if ($(".secondTd").find("li").text() === " ") $(".secondTd").remove();
    });

    $(".tutorial").on("click", tutorialShow);

    $("body").on("click", function(e) {
        elementClass = $(e.target).attr("class");

        if (e.target.id === "overlay") tutorialHide();

        if (elementClass === "modal fade") $("#video").prop("src", "");
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
