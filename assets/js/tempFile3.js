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

                        if (row.critic != resTotal.toFixed(1)) {
                            console.log("Check critic rating : " + row.title)
                        }

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
                        columnsKeyNameButton[i] = columnsKeyName[i]
                            .replace(/L&#039;Express2/g, "L&#039;Express Contre")
                            .replace(/Le Figaro2/g, "Le Figaro Contre")
                            .replace(/Le Journal du Dimanche2/g, "Le Journal du Dimanche Contre")
                            .replace(/Télérama2/g, "Télérama Contre")
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
            var parentClass = $(e.target).parent().attr("class");

            if (
                parentClass === "dt-button buttons-columnVisibility active" ||
                parentClass === "dt-button buttons-columnVisibility" ||
                parentClass === "dt-button-collection four-column" ||
                $(e.target).is(".dt-button.buttons-columnVisibility.active") ||
                $(e.target).is(".dt-button.buttons-columnVisibility") ||
                $(e.target).is('div[role="menu"]')) {
                increment = 2;
            } else if (
                $(e.target).is("td.details")
            ) {
                increment = 0;
            } else {
                window.location.reload(false);
            };
        });

        if (increment === 3) {
            window.location.reload(false);
        }
    });

    $(".customButtonDisplay, .customButtonHide").on("click", function() {
        window.location.reload(false);
    });
}

// Get window width
var width = $(window).width();

$(document).ready(function() {

    // If width > 767
    if (width > 767) {

        // Display movies quotes
        var randomQuoteNumber = makeRandomNumber(),
            random = randomQuotes.quotes[randomQuoteNumber],
            randomQuotesTitle = "<p><i class=\"fas fa-quote-left\"></i> " + random.title + " <i class=\"fas fa-fw fa-quote-right\"></i>",
            randomQuotesMovieandYear = "<span id=\"movieandyear\"> - " + random.movie + ", " + random.year + "</span></p>";

        window.localStorage.setItem("uniqueRandomNumber", JSON.stringify(uniqueRandomNumber));

        $("#quotes").css("width", width - 900);
        document.getElementById("quotes").innerHTML = randomQuotesTitle + randomQuotesMovieandYear;

        // Check critic ratings number
        $.getJSON('https://yaquoiaucine.fr/assets/js/data.json', function(data) {
            var dataLength = data.data.length;

            for (var i = 0; i < dataLength; i++) {
                var criticNamesObject = data.data[i].criticNames,
                    criticNamesObjectLength = Object.keys(criticNamesObject).length,
                    criticNamesRealLength = data.data[i].criticNumber;

                if (criticNamesObjectLength != criticNamesRealLength) {
                    console.log(data.data[i].title + ": " + criticNamesObjectLength + " sur " + criticNamesRealLength)
                }
            }
        });
    }

    // Display movie details
    $("#table").on("click", "td.details", function() {
        setTimeout(function() {
            var dataTables_scrollBody = $("div.dataTables_scrollBody").height();
            $("div.DTFC_RightBodyWrapper").height(dataTables_scrollBody);
        }, 500);

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

        var videoSrc = row.data().player;

        $("#myModal").on("shown.bs.modal", function (e) {
          $("#video").attr("src", videoSrc);
        });

        $("#myModal").on("hide.bs.modal", function (e) {
          $("#video").attr("src", videoSrc);
        });
    });

    // Call main function
    $.getJSON('https://yaquoiaucine.fr/assets/js/critics.json', mainTable);
});
