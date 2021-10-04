var DOMLoaded = function() {
    var Shuffle = window.Shuffle;
    var shuffleInstance;

    var genreArray = Array.from(document.querySelectorAll('.filter-options button'));
    var periodArray = Array.from(document.querySelectorAll('.period-options option'));
    var criticArray = Array.from(document.querySelectorAll('.nav-item.criticButton:not(.mainToggle)'));
    var nationalityArray = Array.from(document.querySelectorAll('.nav-item.nationalityButton:not(.mainToggleNationality)'));
    var durationArray = Array.from(document.querySelectorAll('.nav-item.durationButton:not(.mainToggleDuration)'));
    var starsArray = Array.from(document.querySelectorAll('.nav-item.starsButton:not(.mainToggleStars)'));

    var gridContainerElement = document.querySelector('#grid');

    var criticInput = document.querySelector('.nav-item.criticAllocine');
    var nationalityInput = document.querySelector('.nav-item.mainToggleNationality');
    var durationInput = document.querySelector('.nav-item.mainToggleDuration');
    var starsInput = document.querySelector('.nav-item.mainToggleStars');

    var criticToggle0 = document.querySelector('#criticToggle0').parentNode.parentNode;
    var nationalityButton0 = document.querySelector('#nationalityButton0').parentNode.parentNode;
    var durationButton0 = document.querySelector('#durationButton0').parentNode.parentNode;
    var starsButton0 = document.querySelector('#starsButton0').parentNode.parentNode;

    var userRatingLi = document.querySelector('.nav-item.userRating');
    var imdbUserRatingLi = document.querySelector('.nav-item.imdbUserRating');
    var betaseriesUserRatingLi = document.querySelector('.nav-item.betaseriesUserRating');
    var periodOption = document.querySelector('.period-options');
    var criticLi = document.querySelector('.criticRatings');
    var nationalityLi = document.querySelector('.nationalityPreferences');
    var durationLi = document.querySelector('.durationPreferences');
    var starsLi = document.querySelector('.starsPreferences');

    var tglDarkmode = document.querySelector('.tgl-darkmode');

    var criticNull = false;

    var criticNumberBool = false;
    var nationalityNumberBool = false;
    var durationNumberBool = false;
    var starsNumberBool = false;

    var localbuttonCriticNameNumber = 0;
    var localbuttonNationalityNameNumber = 0;
    var localbuttonDurationNameNumber = 0;
    var localbuttonStarsNameNumber = 0;

    const options = {
        mixColor: '#FFFFFF',
        backgroundColor: '#EDEDED',
        autoMatchOsTheme: false
    };

    const darkmode = new Darkmode(options);

    const url = new URL(window.location);
    const params = new URLSearchParams(url.search);

    localStorage.setItem('yqac_menu.' + 'menuBool', false);

    fetch('https://yaquoiaucine.fr/assets/js/data.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            var data = response.data;
            var cinemaIdParam = paramsURL('cinemaId');
            getMoviesIdsWithTheaterCode(cinemaIdParam)
                .then(function(result) {
                    var dataFilteredWithTheater = data;
                    if (result !== null) {
                        dataFilteredWithTheater = data.filter((item) => result.includes(item.allocineData.url));
                    }

                    menuCriticsOnLoad();

                    var markup = getItemMarkup(dataFilteredWithTheater);
                    appendMarkupToGrid(markup);

                    shuffleInstance = new Shuffle(gridContainerElement, {
                        itemSelector: '.picture-item',
                        sizer: '.my-sizer-element'
                    });

                    filters = {
                        periodArray: [],
                        genreArray: [],
                        nationalityArray: ['No nationality'],
                        durationArray: ['No duration'],
                        starsArray: ['No stars']
                    };

                    var mode = localStorage.getItem('yqac_mode.' + 'mode');
                    var filterLabel = document.querySelector('.filter-label');

                    if (mode === 'additive') {
                        filterLabel.innerHTML = 'Genre (cumuler <input id="inputToggle" type="checkbox" checked><label for="inputToggle">)</label>';
                    } else {
                        filterLabel.innerHTML = 'Genre (cumuler <input id="inputToggle" type="checkbox"><label for="inputToggle">)</label>';
                    }

                    removeItems();
                    addSearchFilter();
                    addSorting();
                    addPeriodFilter();
                    bindPeriodAndGenreListeners();
                    clickToggleMode();
                    darkmodePref();
                    defaultInputClick();
                    displayOverlay();
                    focusSearchInput();
                    getDarkmodeStatus();
                    getTglButtons();
                    menuButtonsChecked();
                    menuNationalityOnLoad();
                    menuDurationOnLoad();
                    menuStarsOnLoad();
                    ratingInfoDetails();
                    reset();
                    searchShortcut();
                    setMenuButtonAll();
                    typewriter();
                });
        });

    function getMoviesIdsWithTheaterCode(cinemaIdParam) {
        if (cinemaIdParam !== null) {
            return fetch(`https://cors-anywhere.herokuapp.com/https://www.allocine.fr/_/showtimes/theater-${cinemaIdParam}/d-0/`)
                .then(function(response) {
                    return response.json();
                })
                .then(function(response) {
                    var data = response.results;
                    var dataLength = data.length;
                    var internalIdArray = [];
                    for (var i = 0; i < dataLength; i++) {
                        var internalId = data[i].movie.internalId;
                        internalIdArray.push(`https://www.allocine.fr/film/fichefilm_gen_cfilm=${internalId}.html`);
                    }

                    if (dataLength === 15) {
                        return fetch(`https://cors-anywhere.herokuapp.com/https://www.allocine.fr/_/showtimes/theater-${cinemaIdParam}/d-0/p-2`)
                            .then(function(response) {
                                return response.json();
                            })
                            .then(function(response) {
                                var data = response.results;
                                var dataLength = data.length;
                                for (var i = 0; i < dataLength; i++) {
                                    var internalId = data[i].movie.internalId;
                                    internalIdArray.push(`https://www.allocine.fr/film/fichefilm_gen_cfilm=${internalId}.html`);
                                }
                                return internalIdArray;
                            });
                    } else {
                        return internalIdArray;
                    }
                });
        } else {
            return Promise.resolve(null);
        }
    }

    // Set or unset active critic on load
    function menuCriticsOnLoad() {
        criticArray.forEach(function(button) {
            button.children[0].children[0].addEventListener('click', setLocalStorageCritics.bind(this), false);

            var buttonCriticName = button.children[0].children[0].textContent;
            var localbuttonCriticName = localStorage.getItem('yqac_critic.' + buttonCriticName);

            if (localbuttonCriticName == 'true' || localbuttonCriticName == null) {
                criticNumberBool = true;
                localbuttonCriticNameNumber++;
                if (localbuttonCriticName == null) {
                    localStorage.setItem('yqac_critic.' + buttonCriticName, 'true');
                }
            } else if (localbuttonCriticName == 'false') {
                button.children[0].children[0].children[0].children[0].removeAttribute('checked');
            }
        });

        if (localbuttonCriticNameNumber > 0) {
            criticLi.children[1].children[0].innerHTML = '<i class="fas fa-newspaper fa-lg"></i> Presse AlloCiné<span class="criticNumber">' + localbuttonCriticNameNumber + '</span>';
        } else {
            criticLi.children[1].children[0].innerHTML = '<i class="fas fa-newspaper fa-lg"></i> Presse AlloCiné<span class="criticNumber criticNumberZero">0</span>';
        }

        if (criticNumberBool) {
            localStorage.setItem('yqac_critic.' + 'criticAllocine', 'true');
            criticInput.children[0].children[0].innerHTML = 'Tout désélectionner<span><input id="criticToggle0" type="checkbox" checked="checked"><label for="criticToggle0"></label></span>';
        } else {
            localStorage.setItem('yqac_critic.' + 'criticAllocine', 'false');
            criticInput.children[0].children[0].innerHTML = 'Tout sélectionner<span><input id="criticToggle0" type="checkbox"><label for="criticToggle0"></label></span>';
        }
    }

    // Set yqac_localStorage for each critics button
    function setLocalStorageCritics(item) {
        localStorage.setItem('yqac_menu.' + 'menuBool', true);

        var buttonCriticName = item.currentTarget.innerText;
        var localbuttonCriticName = localStorage.getItem('yqac_critic.' + buttonCriticName);

        if (localbuttonCriticName == 'true') {
            item.currentTarget.children[0].children[0].removeAttribute('checked');
            localStorage.setItem('yqac_critic.' + buttonCriticName, 'false');
            localbuttonCriticNameNumber--;
        } else {
            item.currentTarget.children[0].children[0].setAttribute('checked', 'checked');
            localStorage.setItem('yqac_critic.' + buttonCriticName, 'true');
            localbuttonCriticNameNumber++;
        }

        if (localbuttonCriticNameNumber > 0) {
            criticLi.children[1].children[0].innerHTML = '<i class="fas fa-newspaper fa-lg"></i> Presse AlloCiné<span class="criticNumber">' + localbuttonCriticNameNumber + '</span>';
        } else {
            criticLi.children[1].children[0].innerHTML = '<i class="fas fa-newspaper fa-lg"></i> Presse AlloCiné<span class="criticNumber criticNumberZero">0</span>';
        }
    }

    // Retrieve all items from data object
    function getItemMarkup(items) {
        return items.reduce(function(str, item) {
            return str + getMarkupFromData(item);
        }, '');
    }

    // Get selected data from data object
    function getMarkupFromData(dataForSingleItem) {
        var filmId = dataForSingleItem.id,
            url = dataForSingleItem.allocineData.url,
            titleTemp = dataForSingleItem.allocineData.title,
            creationDate = dataForSingleItem.allocineData.creationDate,
            duration = dataForSingleItem.imdbData.duration,
            picture = dataForSingleItem.allocineData.picture,
            filmTrailerId = dataForSingleItem.allocineData.filmTrailerId,
            criticNames = dataForSingleItem.allocineData.criticNames,
            criticFix = dataForSingleItem.allocineData.critic,
            user = dataForSingleItem.allocineData.user,
            userRatingsNumber = dataForSingleItem.allocineData.userRatingsNumber,
            seasonsCritic = dataForSingleItem.allocineData.seasonsCritic,
            betaseriesRatingTemp = dataForSingleItem.betaseriesData.betaseriesRating,
            betaseriesId = dataForSingleItem.betaseriesData.betaseriesId,
            imdbId = dataForSingleItem.imdbData.imdbId,
            imdbUserRatings = dataForSingleItem.imdbData.imdbUserRatings,
            imdbRating = dataForSingleItem.imdbData.imdbRating,
            divisionNumber = 0,
            genre, title, rating;

        var floatCriticNames = Object.keys(criticNames).reduce(function(obj, key) {
            var value = criticNames[key];
            obj[key] = isNumeric(value) ? Number(value) : value;

            return obj;
        }, {});
        var criticNamesNew = Object.fromEntries(
            Object.entries(floatCriticNames).sort(([, a], [, b]) => b - a)
        );
        var criticNamesKeysTemp = '';
        var criticNamesValuesTemp = '';
        for (var key in criticNamesNew) criticNamesKeysTemp += key.replace(/2$/, ' Contre') + ',';
        for (key in criticNamesNew) criticNamesValuesTemp += criticNamesNew[key] + ',';
        if (user != '') {
            criticNamesKeysTemp += 'Note AlloCiné,';
            criticNamesValuesTemp += user + ',';
        }
        if (userRatingsNumber != '') {
            criticNamesKeysTemp += 'Nombre notes AlloCiné,';
            criticNamesValuesTemp += userRatingsNumber + ',';
        }
        if (betaseriesRatingTemp != '') {
            criticNamesKeysTemp += 'Note BetaSeries,';
            criticNamesValuesTemp += betaseriesRatingTemp.replace(',', '.') + ',';
        }
        if (imdbRating != '') {
            criticNamesKeysTemp += 'Note IMDb,';
            criticNamesValuesTemp += imdbRating + ',';
        }
        if (imdbUserRatings != '') {
            criticNamesKeysTemp += 'Nombre notes IMDb,';
            criticNamesValuesTemp += imdbUserRatings + ',';
        }
        var criticNamesKeys = criticNamesKeysTemp.replace(/,\s*$/, '');
        var criticNamesValues = criticNamesValuesTemp.replace(/,\s*$/, '');

        var seasonsCriticValue = '';
        var seasonsCriticDetails = '';
        if (seasonsCritic !== undefined) {
            seasonsCriticValue = dataForSingleItem.allocineData.seasonsCritic.seasonsCriticValue;
            seasonsCriticDetails = dataForSingleItem.allocineData.seasonsCritic.seasonsCriticDetails;
        }
        var seasonsCriticDetailsArray = getseasonsCritic(seasonsCriticDetails);
        var seasonsCriticArray = getseasonsCritic(seasonsCriticValue);

        var urlId = dataForSingleItem.allocineData.url.match(/=(.*)\./).pop();

        if (dataForSingleItem.allocineData.genre !== undefined) {
            if (dataForSingleItem.allocineData.genre.id3 !== undefined) {
                genre = dataForSingleItem.allocineData.genre.id1 + ',' + dataForSingleItem.allocineData.genre.id2 + ',' + dataForSingleItem.allocineData.genre.id3;
            } else if (dataForSingleItem.allocineData.genre.id2 !== undefined) {
                genre = dataForSingleItem.allocineData.genre.id1 + ',' + dataForSingleItem.allocineData.genre.id2;
            } else if (dataForSingleItem.allocineData.genre.id1 !== undefined) {
                genre = dataForSingleItem.allocineData.genre.id1;
            } else {
                genre = 'Non renseigné';
            }
        } else {
            genre = 'Non renseigné';
        }

        if (dataForSingleItem.allocineData.nationality !== undefined) {
            if (dataForSingleItem.allocineData.nationality.id3 !== undefined) {
                nationality = dataForSingleItem.allocineData.nationality.id1 + ',' + dataForSingleItem.allocineData.nationality.id2 + ',' + dataForSingleItem.allocineData.nationality.id3;
            } else if (dataForSingleItem.allocineData.nationality.id2 !== undefined) {
                nationality = dataForSingleItem.allocineData.nationality.id1 + ',' + dataForSingleItem.allocineData.nationality.id2;
            } else if (dataForSingleItem.allocineData.nationality.id1 !== undefined) {
                nationality = dataForSingleItem.allocineData.nationality.id1;
            } else {
                nationality = 'Non renseignée';
            }
        } else {
            nationality = 'Non renseignée';
        }

        if (dataForSingleItem.allocineData.duration !== undefined) {
            if (!dataForSingleItem.allocineData.duration.includes('h ')) {
                duration = '1 heure et moins';
            } else if (dataForSingleItem.allocineData.duration.includes('1h ')) {
                duration = 'De 1 à 2 heures';
            } else if (dataForSingleItem.allocineData.duration.includes('2h ')) {
                duration = 'De 2 à 3 heures';
            } else if (dataForSingleItem.allocineData.duration.includes('3h ')) {
                duration = 'De 3 à 4 heures';
            } else if (dataForSingleItem.allocineData.duration.includes('h ')) {
                duration = 'Plus de 4 heures';
            } else {
                duration = 'Non renseignée';
            }
        } else {
            duration = 'Non renseignée';
        }

        var dateFormatted = '';
        if (creationDate != '') {
            dateFormatted = splitDate(creationDate);
        } else {
            dateFormatted = '01/01/1970';
        }

        var today = new Date();
        var todayNewTemp = String(today);
        var todayNew = splitDate(todayNewTemp);
        today.setDate(today.getDate() - 7);
        var last7Days = ((today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear());
        var isDateIncludedlast7Days = dateCheck(last7Days, todayNew, dateFormatted);

        var today2 = new Date();
        var todayNewTem2 = String(today2);
        var todayNew2 = splitDate(todayNewTem2);
        today2.setDate(today2.getDate() - 14);
        var last14Days = ((today2.getMonth() + 1) + '/' + today2.getDate() + '/' + today2.getFullYear());
        var isDateIncludedlast14Days = dateCheck(last14Days, todayNew2, dateFormatted);

        var today3 = new Date();
        var todayNewTemp3 = String(today3);
        var todayNew3 = splitDate(todayNewTemp3);
        today3.setDate(today3.getDate() - 30);
        var last30Days = ((today3.getMonth() + 1) + '/' + today3.getDate() + '/' + today3.getFullYear());
        var isDateIncludedlast30Days = dateCheck(last30Days, todayNew3, dateFormatted);

        var today4 = new Date();
        var todayNewTemp4 = String(today4);
        var todayNew4 = splitDate(todayNewTemp4);
        today4.setDate(today4.getDate() - 182);
        var last6Months = ((today4.getMonth() + 1) + '/' + today4.getDate() + '/' + today4.getFullYear());
        var isDateIncludedlast6Months = dateCheck(last6Months, todayNew4, dateFormatted);

        var isDateIncluded2018 = dateCheck('01/01/2018', '12/31/2018', dateFormatted);
        var isDateIncluded2019 = dateCheck('01/01/2019', '12/31/2019', dateFormatted);
        var isDateIncluded2020 = dateCheck('01/01/2020', '12/31/2020', dateFormatted);
        var isDateIncluded2021 = dateCheck('01/01/2021', '12/31/2021', dateFormatted);

        dateFormattedFilter = statusFilter(
            isDateIncludedlast7Days,
            isDateIncludedlast14Days,
            isDateIncludedlast30Days,
            isDateIncludedlast6Months,
            isDateIncluded2018,
            isDateIncluded2019,
            isDateIncluded2020,
            isDateIncluded2021);

        critic = getActiveCritics(criticFix, criticNames);
        if (user == '') user = 0;
        if (imdbRating == '') imdbRating = 0;
        var betaseriesRating = betaseriesRatingTemp.replace(',', '.');
        if (betaseriesRating == '') betaseriesRating = 0;

        var criticActive = localStorage.getItem('yqac_critic.' + 'criticAllocine');
        var userActive = localStorage.getItem('yqac_critic.' + 'usersAllocine');
        var usersImdbActive = localStorage.getItem('yqac_critic.' + 'usersImdb');
        var usersBetaseriesActive = localStorage.getItem('yqac_critic.' + 'usersBetaseries');

        var userInput = document.querySelector('.nav-item.usersAllocine');
        var userImdbInput = document.querySelector('.nav-item.usersImdb');
        var userBetaseriesInput = document.querySelector('.nav-item.usersBetaseries');

        ratingTempTotal = 0;
        divisionNumber = 0;

        if (retrieveLocalData(criticActive)) {
            divisionNumber++;
            if (critic == 0) {
                divisionNumber--;
                criticDetails = '/';
            } else {
                criticDetails = parseFloat(critic).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1') + '<span>/5</span>';
            }

            ratingTempTotal += parseFloat(critic);
        } else {
            criticDetails = '/';
            criticInput.children[0].children[0].children[0].children[0].removeAttribute('checked');
        }

        if (retrieveLocalData(userActive)) {
            divisionNumber++;
            if (user == 0) {
                divisionNumber--;
                userDetails = '/';
            } else {
                userDetails = user + '<span>/5</span>';
            }

            ratingTempTotal += parseFloat(user);

            userRatingLi.children[1].children[0].innerHTML = '<i class="fas fa-users fa-lg"></i> Spectateurs AlloCiné<span class="criticNumber">1</span>';
        } else {
            userDetails = '/';
            userInput.children[0].children[0].children[0].children[0].removeAttribute('checked');
            userRatingLi.children[1].children[0].innerHTML = '<i class="fas fa-users fa-lg"></i> Spectateurs AlloCiné<span class="criticNumber criticNumberZero">0</span>';
        }

        if (retrieveLocalData(usersImdbActive)) {
            divisionNumber++;
            if (imdbRating == 0) {
                divisionNumber--;
                imdbDetails = '/';
            } else {
                imdbDetails = imdbRating + '<span>/10</span>';
            }

            ratingTempTotal += parseFloat(imdbRating / 2);

            imdbUserRatingLi.children[1].children[0].innerHTML = '<i class="fab fa-imdb fa-lg"></i> Spectateurs IMDb<span class="criticNumber">1</span>';
        } else {
            imdbDetails = '/';
            userImdbInput.children[0].children[0].children[0].children[0].removeAttribute('checked');
            imdbUserRatingLi.children[1].children[0].innerHTML = '<i class="fab fa-imdb fa-lg"></i> Spectateurs IMDb<span class="criticNumber criticNumberZero">0</span>';
        }

        if (retrieveLocalData(usersBetaseriesActive)) {
            divisionNumber++;
            if (betaseriesRating == 0) {
                divisionNumber--;
                betaseriesDetails = '/';
            } else {
                betaseriesDetails = betaseriesRating + '<span>/5</span>';
            }

            ratingTempTotal += parseFloat(betaseriesRating);

            betaseriesUserRatingLi.children[1].children[0].innerHTML = '<i class="icon-betaseries"></i> Spectateurs Betaseries<span class="criticNumber">1</span>';
        } else {
            betaseriesDetails = '/';
            userBetaseriesInput.children[0].children[0].children[0].children[0].removeAttribute('checked');
            betaseriesUserRatingLi.children[1].children[0].innerHTML = '<i class="icon-betaseries"></i> Spectateurs Betaseries<span class="criticNumber criticNumberZero">0</span>';
        }

        ratingTemp = ratingTempTotal / divisionNumber;

        ratingTemp = ratingTemp || 0;
        ratingToFixed = ratingTemp.toFixed(2);
        ratingToFixedOne = parseInt(ratingToFixed, 10);
        rating = ratingToFixed.replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1') + '<span>/5</span>';

        if (titleTemp.length > 15) {
            title = titleTemp.substring(0, 14) + '...';
        } else {
            title = dataForSingleItem.allocineData.title;
        }

        var titleTwitter = titleTemp.replace('&amp;', '%26');
        var ratingTwitter = rating
            .replace('<span>/5</span>', '')
            .replace('.', ',');
        if (parseInt(filmId) == 1) {
            localStorage.setItem('yqac_twitter.' + 'title1', titleTwitter);
            localStorage.setItem('yqac_twitter.' + 'rating1', ratingTwitter);
        }

        if (parseInt(filmId) == 2) {
            localStorage.setItem('yqac_twitter.' + 'title2', titleTwitter);
            localStorage.setItem('yqac_twitter.' + 'rating2', ratingTwitter);
        }

        if (parseInt(filmId) == 3) {
            localStorage.setItem('yqac_twitter.' + 'title3', titleTwitter);
            localStorage.setItem('yqac_twitter.' + 'rating3', ratingTwitter);
        }

        if (parseInt(filmId) == 4) {
            localStorage.setItem('yqac_twitter.' + 'title4', titleTwitter);
            localStorage.setItem('yqac_twitter.' + 'rating4', ratingTwitter);
        }

        if (parseInt(filmId) == 5) {
            localStorage.setItem('yqac_twitter.' + 'title5', titleTwitter);
            localStorage.setItem('yqac_twitter.' + 'rating5', ratingTwitter);
        }

        if (parseInt(filmId) == 6) {
            var title1 = localStorage.getItem('yqac_twitter.' + 'title1');
            var rating1 = localStorage.getItem('yqac_twitter.' + 'rating1');
            var title2 = localStorage.getItem('yqac_twitter.' + 'title2');
            var rating2 = localStorage.getItem('yqac_twitter.' + 'rating2');
            var title3 = localStorage.getItem('yqac_twitter.' + 'title3');
            var rating3 = localStorage.getItem('yqac_twitter.' + 'rating3');
            var title4 = localStorage.getItem('yqac_twitter.' + 'title4');
            var rating4 = localStorage.getItem('yqac_twitter.' + 'rating4');
            var title5 = localStorage.getItem('yqac_twitter.' + 'title5');
            var rating5 = localStorage.getItem('yqac_twitter.' + 'rating5');
            twitterTops(title1, rating1, title2, rating2, title3, rating3, title4, rating4, title5, rating5);
        }

        var criticDetailsUrl = '';
        if (criticDetails == '/') {
            criticDetailsUrl = '<a href="javascript:void(0)"><i class="fas fa-newspaper"></i>' + criticDetails + '</a>';
        } else {
            criticDetailsUrl = '<a href="https://www.allocine.fr/film/fichefilm-' + urlId + '/critiques/presse/" target="_blank"><i class="fas fa-newspaper"></i>' + criticDetails + '</a>';
        }

        var userDetailsUrl = '';
        if (userDetails == '/') {
            userDetailsUrl = '<a href="javascript:void(0)"><i class="fas fa-users"></i>' + userDetails + '</a>';
        } else {
            userDetailsUrl = '<a href="https://www.allocine.fr/film/fichefilm-' + urlId + '/critiques/" target="_blank"><i class="fas fa-users"></i>' + userDetails + '</a>';
        }

        var imdbDetailsUrl = '';
        if (imdbDetails == '/') {
            imdbDetailsUrl = '<a href="javascript:void(0)"><i class="fab fa-imdb"></i>' + imdbDetails + '</a>';
        } else {
            imdbDetailsUrl = '<a href="https://www.imdb.com/title/' + imdbId + '/" target="_blank"><i class="fab fa-imdb"></i>' + imdbDetails + '</a>';
        }

        var betaseriesDetailsUrl = '';
        if (betaseriesDetails == '/') {
            betaseriesDetailsUrl = '<a href="javascript:void(0)"><i class="icon-betaseries"></i>' + betaseriesDetails + '</a>';
        } else {
            betaseriesDetailsUrl = '<a href="https://www.betaseries.com/' + betaseriesId + '" target="_blank"><i class="icon-betaseries"></i>' + betaseriesDetails + '</a>';
        }

        /* beautify ignore:start */
        return [
            '<figure class="col-3@xs col-4@sm col-3@md picture-item shuffle-item shuffle-item--visible" data-genre="' + genre + '" data-nationality="' + nationality + '" data-duration="' + duration + '" data-date-formatted="' + dateFormattedFilter + '" data-stars="' + ratingToFixedOne + '" data-critic="' + ratingToFixed + '" data-seasons-critic="' + seasonsCriticArray +  '" data-seasons-critic-details="' + seasonsCriticDetailsArray + '" data-critic-keys="' + criticNamesKeys + '" data-critic-values="' + criticNamesValues + '" data-popularity="' + filmId + '" data-creationdate="' + creationDate + '" data-filmTrailerId="' + filmTrailerId + '" style="position: absolute; top: 0px; left: 0px; visibility: visible; will-change: transform; opacity: 1; transition-duration: 250ms; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-property: transform, opacity;">',
                '<div class="picture-item__inner">',
                    '<div class="aspect aspect--16x9">',
                        '<div class="aspect__inner">',
                            '<a href="javascript:void(0)" title="' + dataForSingleItem.allocineData.title + '">',
                                '<img src="' + picture + '" srcset="' + picture + '" alt="' + title + '">',
                            '</a>',
                            '<img class="picture-item__blur" src="' + picture + '" srcset="' + picture + '" alt="">',
                            '<div class="aspect__inner overlayInfos displayNone">',
                                criticDetailsUrl,
                                userDetailsUrl,
                                imdbDetailsUrl,
                                betaseriesDetailsUrl,
                            '</div>',
                            '<div class="aspect__inner overlayMoreInfos displayNone">',
                                '<a href="javascript:void(0)" class="read-more">Plus d\'infos</a>',
                            '</div>',
                        '</div>',
                    '</div>',
                    '<div class="picture-item__details">',
                        '<figcaption class="picture-item__title">',
                            '<a href="' + url + '" target="_blank" rel="noopener" title="' + dataForSingleItem.allocineData.title + '">' + title + '</a>',
                        '</figcaption>',
                        '<a href="javascript:void(0)">',
                            '<p class="picture-item__tags">' + rating + '</p>',
                        '</a>',
                    '</div>',
                '</div>',
            '</figure>'
        ].join('');
        /* beautify ignore:end */
    }

    // Check if number and parse to float
    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    // Return seasons critic values
    function getseasonsCritic(seasonsCritic) {
        if (seasonsCritic != undefined) {
            var seasonsCriticLength = Object.keys(seasonsCritic).length;
            var seasonsCriticArrayTemp = [];
            for (var seasonsCriticIndex = 1; seasonsCriticIndex <= seasonsCriticLength; seasonsCriticIndex++) {
                var seasonsCriticValue = seasonsCritic['id' + seasonsCriticIndex];
                seasonsCriticArrayTemp.push(seasonsCriticValue);
            }

            return seasonsCriticArrayTemp;
        }
    }

    // Remove accents from characters
    function normalizeStr(str) {
        var map = {
            '_': ' |-',
            'a': 'ä|á|à|ã|â|Ä|À|Á|Ã|Â',
            'e': 'ë|é|è|ê|Ë|É|È|Ê',
            'i': 'ï|í|ì|î|Ï|Í|Ì|Î',
            'o': 'ö|ó|ò|ô|õ|Ö|Ó|Ò|Ô|Õ',
            'u': 'ú|ù|û|ü|Ú|Ù|Û|Ü',
            'c': 'ç|Ç',
            'n': 'ñ|Ñ'
        };

        if (str != null) {
            for (var pattern in map) {
                str = str.replace(new RegExp(map[pattern], 'g'), pattern);
            }
        }

        return str;
    }

    // Change french date format to mm/dd/yyyy
    function splitDate(date) {
        var newDate = date.split(' ');
        var altFormat = true;

        switch (newDate[1]) {
            case 'Jan':
                newDate[1] = '01';
                break;
            case 'janvier':
                newDate[1] = '01';
                break;
            case 'Feb':
                newDate[1] = '02';
                break;
            case 'février':
                newDate[1] = '02';
                break;
            case 'Mar':
                newDate[1] = '03';
                break;
            case 'mars':
                newDate[1] = '03';
                break;
            case 'Apr':
                newDate[1] = '04';
                break;
            case 'avril':
                newDate[1] = '04';
                break;
            case 'May':
                newDate[1] = '05';
                break;
            case 'mai':
                newDate[1] = '05';
                break;
            case 'Jun':
                newDate[1] = '06';
                break;
            case 'juin':
                newDate[1] = '06';
                break;
            case 'Jul':
                newDate[1] = '07';
                break;
            case 'juillet':
                newDate[1] = '07';
                break;
            case 'Aug':
                newDate[1] = '08';
                break;
            case 'août':
                newDate[1] = '08';
                break;
            case 'Sep':
                newDate[1] = '09';
                break;
            case 'septembre':
                newDate[1] = '09';
                break;
            case 'Oct':
                newDate[1] = '10';
                break;
            case 'octobre':
                newDate[1] = '10';
                break;
            case 'Nov':
                newDate[1] = '11';
                break;
            case 'novembre':
                newDate[1] = '11';
                break;
            case 'Dec':
                newDate[1] = '12';
                break;
            case 'décembre':
                newDate[1] = '12';
                break;
            default:
                newDate[1] = '';
                break;
        }

        if (newDate[0] == 'Mon' ||
            newDate[0] == 'Tue' ||
            newDate[0] == 'Wed' ||
            newDate[0] == 'Thu' ||
            newDate[0] == 'Fri' ||
            newDate[0] == 'Sat' ||
            newDate[0] == 'Sun') {
            altFormat = false;
        }

        if (altFormat) {
            return newDate[1] + '/' + newDate[0] + '/' + newDate[2];
        } else {
            return newDate[1] + '/' + newDate[2] + '/' + newDate[3];
        }
    }

    // Parse start date, end date and date to check
    function dateCheck(firstDate, lastDate, dateToCheck) {
        var firstDateNew, lastDateNew, dateToCheckNew;

        firstDateNew = Date.parse(firstDate);
        lastDateNew = Date.parse(lastDate);
        dateToCheckNew = Date.parse(dateToCheck);

        return (dateToCheckNew <= lastDateNew && dateToCheckNew >= firstDateNew);
    }

    // Return status for filtering
    function statusFilter(isDateIncludedlast7Days,
        isDateIncludedlast14Days,
        isDateIncludedlast30Days,
        isDateIncludedlast6Months,
        isDateIncluded2018,
        isDateIncluded2019,
        isDateIncluded2020,
        isDateIncluded2021) {
        var text = '',
            text2 = '';

        if (isDateIncludedlast7Days) {
            text = 'Les 7 derniers jours,Les 2 dernières semaines,Les 30 derniers jours,Les 6 derniers mois';
        } else if (isDateIncludedlast14Days) {
            text = 'Les 2 dernières semaines,Les 30 derniers jours,Les 6 derniers mois';
        } else if (isDateIncludedlast30Days) {
            text = 'Les 30 derniers jours,Les 6 derniers mois';
        } else if (isDateIncludedlast6Months) {
            text = 'Les 6 derniers mois';
        } else {
            text = '';
        }

        if (isDateIncluded2021) {
            text2 = 'En 2021';
        } else if (isDateIncluded2020) {
            text2 = 'En 2020';
        } else if (isDateIncluded2019) {
            text2 = 'En 2019';
        } else if (isDateIncluded2018) {
            text2 = 'En 2018';
        } else {
            text2 = '';
        }

        if (text == '') {
            return text2;
        } else if (text2 == '') {
            return text;
        } else {
            return text + ',' + text2;
        }
    }

    // Return active critics
    function getActiveCritics(criticFix, criticNames) {
        var critic = 0;
        var criticNumber = 0;
        var res = 0;
        var buttonCriticNameNew;

        if (Object.keys(criticNames).length > 0) {
            criticArray.forEach(function(button) {
                var buttonCriticName = button.children[0].children[0].textContent;
                var localbuttonCriticName = localStorage.getItem('yqac_critic.' + buttonCriticName);
                var last7Char = buttonCriticName.substr(buttonCriticName.length - 7);

                if (last7Char == ' Contre') {
                    buttonCriticNameTemp = buttonCriticName.replace(' Contre', '2');
                } else {
                    buttonCriticNameTemp = buttonCriticName;
                }

                buttonCriticNameNew = buttonCriticNameTemp.replace('\'', '&#039;');

                if (localbuttonCriticName == 'true' && criticNames[buttonCriticNameNew] != undefined) {
                    res += parseFloat(criticNames[buttonCriticNameNew]);
                    criticNumber++;
                } else if (localbuttonCriticName == null) {
                    criticNull = true;
                }
            });

            if (criticNull) {
                critic = criticFix;
            } else {
                critic = parseFloat(res / criticNumber);
                critic = critic || 0;
            }
        } else {
            critic = 0;
        }

        return critic;
    }

    // Set yqac_localStorage for critic and user main buttons
    function retrieveLocalData(item) {
        if (item == 'true') {
            return true;
        } else if (item == 'false') {
            return false;
        } else {
            localStorage.setItem('yqac_critic.' + 'criticAllocine', 'true');
            localStorage.setItem('yqac_critic.' + 'usersAllocine', 'true');
            localStorage.setItem('yqac_critic.' + 'usersImdb', 'true');
            localStorage.setItem('yqac_critic.' + 'usersBetaseries', 'true');
            return true;
        }
    }

    // Send top titles and ratings to Twitter new tweet
    function twitterTops(title1, rating1, title2, rating2, title3, rating3, title4, rating4, title5, rating5) {
        var date = new Date();
        var weekdate = date.getDay();
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();
        var monthNames = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        var weekdateNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

        var text = '';
        text += '🏆 Top 5 des films les %2B distribués en 🇫🇷 France le ' + weekdateNames[weekdate] + ' ' + day + ' ' + monthNames[month] + ' ' + year + ' !';
        text += '%0a%0a🥇 %23' + hashtagFormatted(title1) + ' avec ' + rating1 + '⭐️ /5';
        text += '%0a🥈 %23' + hashtagFormatted(title2) + ' avec ' + rating2 + '⭐️ /5';
        text += '%0a🥉 %23' + hashtagFormatted(title3) + ' avec ' + rating3 + '⭐️ /5';
        text += '%0a4. %23' + hashtagFormatted(title4) + ' avec ' + rating4 + '⭐️ /5';
        text += '%0a5. %23' + hashtagFormatted(title5) + ' avec ' + rating5 + '⭐️ /5';
        text += '%0a%0ahttps://yaquoiaucine.fr?trier_par=popularite';
        text += '%0a%0a%23YQAC';

        var twitterButton = document.querySelector('.fa-twitter');
        var twitterButtonParent = document.querySelector('.fa-twitter').parentNode;
        twitterButton.addEventListener('click', function() {
            twitterButtonParent.href = 'https://twitter.com/intent/tweet?text=' + text;
        }, false);
    }

    // Remove characters for hashtags
    function hashtagFormatted(string) {
        return string
            .replace(/\s+/g, '')
            .replace('\'', '')
            .replace('?', '')
            .replace(',', '')
            .replace('-', '')
            .replace(':', '');
    }

    // Display retrieved data in grid div
    function appendMarkupToGrid(markup) {
        gridContainerElement.insertAdjacentHTML('beforeend', markup);
    }

    // Remove yqac_localStorage items
    function removeItems() {
        localStorage.removeItem('yqac_sort.' + 'critic');
        localStorage.removeItem('yqac_sort.' + 'creationdate');
        localStorage.removeItem('yqac_sort.' + 'popularity');
    }

    // Search function
    function addSearchFilter() {
        var searchInput = document.querySelector('.js-shuffle-search');
        var searchParam = paramsURL('recherche');

        if (!searchInput) {
            return;
        }

        if (paramsURLCheck('recherche')) {
            setTimeout(function() {
                document.querySelector('.js-shuffle-search').value = searchParam;
                handleSearchKeyup(searchParam);
            }, 200);
        }

        searchInput.addEventListener('input', handleSearchKeyup.bind(this));
    }

    // Add keyup listeners for search
    function handleSearchKeyup(evt) {
        var searchText;

        if (evt.target == undefined) {
            searchText = evt;
        } else {
            searchText = evt.target.value.toLowerCase();
        }

        shuffleInstance.filter(function(element, shuffle) {

            if (shuffle.group !== Shuffle.ALL_ITEMS) {
                var groups = JSON.parse(element.getAttribute('data-groups'));
                var isElementInCurrentGroup = groups.indexOf(shuffle.group) !== -1;

                if (!isElementInCurrentGroup) {
                    return false;
                }
            }

            var titleElement = element.querySelector('.picture-item__title');
            var titleText = titleElement.textContent.toLowerCase().trim();

            return titleText.indexOf(searchText) !== -1;
        });
    }

    // Sort function
    function addSorting() {
        var buttonGroup = document.querySelector('.sort-options');

        if (!buttonGroup) {
            return;
        }

        buttonGroup.addEventListener('change', handleSortChange.bind(this));
    }

    // Add or remove active class for sort change
    function handleSortChange(evt) {
        var buttons = Array.from(evt.currentTarget.children);
        buttons.forEach(function(button) {
            if (button.querySelector('input').value === evt.target.value) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        var value = evt.target.value;
        var options = {};

        function sortByPopularity(element) {
            return parseInt(element.getAttribute('data-popularity'));
        }

        function sortByCreationDate(element) {
            return Date.parse(splitDate(element.getAttribute('data-creationdate')));
        }

        function sortCritic(element) {
            return element.getAttribute('data-critic');
        }

        if (value === 'popularity') {
            var popularity = localStorage.getItem('yqac_sort.' + 'popularity');

            if (popularity === 'true') {
                options = {
                    reverse: true,
                    by: sortByPopularity,
                };

                evt.target.parentNode.innerHTML = '<input id="defaultInputpopularity" type="radio" name="sort-value" value="popularity"> Popularité <i class="fas fa-arrow-up"></i>';
                localStorage.setItem('yqac_sort.' + 'popularity', 'false');
                localStorage.removeItem('yqac_sort.' + 'creationdate');
                localStorage.removeItem('yqac_sort.' + 'critic');
                localStorage.setItem('yqac_sort.' + 'defaultInput', 'popularity');
            } else {
                options = {
                    reverse: false,
                    by: sortByPopularity,
                };

                evt.target.parentNode.innerHTML = '<input id="defaultInputpopularity" type="radio" name="sort-value" value="popularity"> Popularité <i class="fas fa-arrow-down"></i>';
                localStorage.setItem('yqac_sort.' + 'popularity', 'true');
                localStorage.removeItem('yqac_sort.' + 'creationdate');
                localStorage.removeItem('yqac_sort.' + 'critic');
                localStorage.setItem('yqac_sort.' + 'defaultInput', 'popularity');
            }
        } else if (value === 'creationdate') {
            var creationdate = localStorage.getItem('yqac_sort.' + 'creationdate');

            if (creationdate === 'true') {
                options = {
                    reverse: false,
                    by: sortByCreationDate,
                };

                evt.target.parentNode.innerHTML = '<input id="defaultInputcreationdate" type="radio" name="sort-value" value="creationdate"> Date <i class="fas fa-arrow-up"></i>';
                localStorage.setItem('yqac_sort.' + 'creationdate', 'false');
                localStorage.removeItem('yqac_sort.' + 'popularity');
                localStorage.removeItem('yqac_sort.' + 'critic');
                localStorage.setItem('yqac_sort.' + 'defaultInput', 'creationdate');
            } else {
                options = {
                    reverse: true,
                    by: sortByCreationDate,
                };

                evt.target.parentNode.innerHTML = '<input id="defaultInputcreationdate" type="radio" name="sort-value" value="creationdate"> Date <i class="fas fa-arrow-down"></i>';
                localStorage.setItem('yqac_sort.' + 'creationdate', 'true');
                localStorage.removeItem('yqac_sort.' + 'popularity');
                localStorage.removeItem('yqac_sort.' + 'critic');
                localStorage.setItem('yqac_sort.' + 'defaultInput', 'creationdate');
            }
        } else if (value === 'critic') {
            var critic = localStorage.getItem('yqac_sort.' + 'critic');

            if (critic === 'true') {
                options = {
                    reverse: false,
                    by: sortCritic,
                };

                evt.target.parentNode.innerHTML = '<input id="defaultInputcritic" type="radio" name="sort-value" value="critic"> Note <i class="fas fa-arrow-up"></i>';
                localStorage.setItem('yqac_sort.' + 'critic', 'false');
                localStorage.removeItem('yqac_sort.' + 'popularity');
                localStorage.removeItem('yqac_sort.' + 'creationdate');
                localStorage.setItem('yqac_sort.' + 'defaultInput', 'critic');
            } else {
                options = {
                    reverse: true,
                    by: sortCritic,
                };

                evt.target.parentNode.innerHTML = '<input id="defaultInputcritic" type="radio" name="sort-value" value="critic"> Note <i class="fas fa-arrow-down"></i>';
                localStorage.setItem('yqac_sort.' + 'critic', 'true');
                localStorage.removeItem('yqac_sort.' + 'popularity');
                localStorage.removeItem('yqac_sort.' + 'creationdate');
                localStorage.setItem('yqac_sort.' + 'defaultInput', 'critic');
            }
        }

        shuffleInstance.sort(options);
    }

    // Set active period filter
    function addPeriodFilter() {
        var activePeriod = normalizeStr(paramsURL('diffusion'));

        if (activePeriod == 'les_7_derniers_jours') {
            activePeriod = 'Les 7 derniers jours';
        } else if (activePeriod == 'les_2_dernieres_semaines') {
            activePeriod = 'Les 2 dernières semaines';
        } else if (activePeriod == 'les_30_derniers_jours') {
            activePeriod = 'Les 30 derniers jours';
        } else if (activePeriod == 'les_6_derniers_mois') {
            activePeriod = 'Les 6 derniers mois';
        } else if (activePeriod == 'en_2021' || activePeriod == '2021') {
            activePeriod = 'En 2021';
        } else if (activePeriod == 'en_2020' || activePeriod == '2020') {
            activePeriod = 'En 2020';
        } else if (activePeriod == 'en_2019' || activePeriod == '2019') {
            activePeriod = 'En 2019';
        } else if (activePeriod == 'en_2018' || activePeriod == '2018') {
            activePeriod = 'En 2018';
        } else {
            activePeriod = localStorage.getItem('yqac_period.' + 'activePeriod');
            if (activePeriod == null) {
                activePeriod = 'NoFilter';
            }
        }

        setTimeout(function() {
            periodOption.value = activePeriod;
            periodOption.options[periodOption.selectedIndex].setAttribute('selected', 'selected');
            localStorage.setItem('yqac_period.' + 'activePeriod', activePeriod);
            handleOptionChange();
        }, 100);
    }

    // Get current option filters and filter
    function handleOptionChange() {
        filters.periodArray = getCurrentOptionFilters();

        if (filters.periodArray == 'NoFilter') filters.periodArray = [];

        filter();
    }

    // Return selected option value
    function getCurrentOptionFilters() {
        return periodArray.filter(function(option) {
            return option.selected;
        }).map(function(option) {
            return option.value;
        });
    }

    // Add events on options changes and buttons clicks
    function bindPeriodAndGenreListeners() {
        periodOption.addEventListener('change', function() {
            periodOption.options[periodOption.selectedIndex].setAttribute('selected', 'selected');
            handleOptionChange();
            activePeriod = periodOption.options[periodOption.selectedIndex].value;
            localStorage.setItem('yqac_period.' + 'activePeriod', activePeriod);
        });

        genreArray.forEach(function(button) {
            button.addEventListener('click', handleButtonChange.bind(this));
        }, false);
    }

    // Handle button change with additive and exclusive mode
    function handleButtonChange(evt) {
        var mode = localStorage.getItem('yqac_mode.' + 'mode');

        if (mode == undefined) {
            localStorage.setItem('yqac_mode.' + 'mode', 'exclusive');
        }

        var btn = evt.currentTarget;
        var isActive = btn.classList.contains('active');
        var btnGroup = btn.getAttribute('data-group');

        if (mode === 'additive') {
            if (isActive) {
                filters.genreArray.splice(filters.genreArray.indexOf(btnGroup), 1);
            } else {
                filters.genreArray.push(btnGroup);
            }

            btn.classList.toggle('active');

            filter();

        } else {
            removeActiveClassFromChildren(btn.parentNode);

            if (isActive) {
                btn.classList.remove('active');
                filters.genreArray = [];
            } else {
                btn.classList.add('active');
                filters.genreArray = getCurrentButtonFilters();
            }

            filter();
        }
    }

    // Remove active class from children
    function removeActiveClassFromChildren(parent) {
        var children = parent.children;
        for (var i = children.length - 1; i >= 0; i--) {
            children[i].classList.remove('active');
        }
    }

    // Get current button filters
    function getCurrentButtonFilters() {
        return genreArray.filter(function(button) {
            return button.classList.contains('active');
        }).map(function(button) {
            return button.getAttribute('data-group');
        });
    }

    // Filter matching items
    function filter() {
        if (hasActiveFilters()) {
            shuffleInstance.filter(itemPassesFilters.bind(this));
        } else {
            shuffleInstance.filter(Shuffle.ALL_ITEMS);
        }
    }

    // Check active filters length
    function hasActiveFilters() {
        return Object.keys(filters).some(function(key) {
            return filters[key].length > 0;
        }, this);
    }

    // Select matching items
    function itemPassesFilters(element) {
        var periodArray = filters.periodArray;
        var genreArray = filters.genreArray;
        var nationalityArray = filters.nationalityArray;
        var durationArray = filters.durationArray;
        var starsArray = filters.starsArray;
        var option = element.getAttribute('data-date-formatted');
        var optionNew = option.split(',');
        var button = element.getAttribute('data-genre');
        var buttonNew = button.split(',');
        var nationality = element.getAttribute('data-nationality');
        var nationalityNew = nationality.split(',');
        var duration = element.getAttribute('data-duration');
        var durationNew = duration.split(',');
        var stars = element.getAttribute('data-stars');
        var starsNew = stars.split(',');

        if (periodArray.length > 0 && !periodArray.some(r => optionNew.includes(r))) {
            return false;
        }

        if (genreArray.length > 0 && !genreArray.some(r => buttonNew.includes(r))) {
            return false;
        }

        if (nationalityArray.length > 0 && !nationalityArray.some(r => nationalityNew.includes(r))) {
            return false;
        }

        if (durationArray.length > 0 && !durationArray.some(r => durationNew.includes(r))) {
            return false;
        }

        if (starsArray.length > 0 && !starsArray.some(r => starsNew.includes(r))) {
            return false;
        }

        return true;
    }

    // Add additive/exclusive click listener
    function clickToggleMode() {
        var inputToggle = document.querySelector('#inputToggle');
        inputToggle.addEventListener('click', toggleMode, false);
    }

    // Set additive/exclusive toggle
    function toggleMode() {
        var mode = localStorage.getItem('yqac_mode.' + 'mode');

        if (mode === 'additive') {
            localStorage.setItem('yqac_mode.' + 'mode', 'exclusive');
        } else {
            localStorage.setItem('yqac_mode.' + 'mode', 'additive');
        }
    }

    // Add click listener
    function darkmodePref() {
        var darkmodeActive = localStorage.getItem('darkmode');
        if (darkmodeActive == null) {
            darkmode.toggle();
        }

        tglDarkmode.addEventListener('click', toggleDarkmode, false);
    }

    // Trigger darkmode function
    function toggleDarkmode() {
        darkmode.toggle();
        getDarkmodeStatus();
    }

    // Display overlay with trailer
    function displayOverlay() {
        var imgsLink = document.querySelectorAll('.overlayMoreInfos');

        var slider = tns({
            'container': '#slider',
            'items': 1,
            'loop': false,
            'swipeAngle': false,
            'speed': 400,
            'controls': true,
            'controlsPosition': 'bottom',
            'controlsText': ['Précédent', 'Suivant'],
            'nav': false,
            'mouseDrag': false,
            'arrowKeys': true
        });

        imgsLink.forEach(function(link) {
            link.addEventListener('click', function() {
                document.querySelector('#overlay').style.display = 'block';
                document.body.style.overflow = 'hidden';

                slider.goTo(0);

                var filmTrailerId = link.parentNode.parentNode.parentNode.parentNode.getAttribute('data-filmTrailerId');
                var criticKeys = link.parentNode.parentNode.parentNode.parentNode.getAttribute('data-critic-keys');
                var criticKeysNew = criticKeys.split(',');
                var criticValues = link.parentNode.parentNode.parentNode.parentNode.getAttribute('data-critic-values');
                var criticValuesNew = criticValues.split(',');

                document.querySelector('iframe').src = 'https://player.allocine.fr/' + filmTrailerId + '.html';

                if (filmTrailerId == '') {
                    document.querySelector('.slide-unavailable').style.display = 'block';
                    document.querySelector('p.slide-available').style.display = 'none';
                    document.querySelector('div.slide-available').style.display = 'none';
                } else {
                    document.querySelector('.slide-unavailable').style.display = 'none';
                    document.querySelector('p.slide-available').style.display = 'block';
                    document.querySelector('div.slide-available').style.display = 'block';
                }

                var htmlTagCriticRecap = '<ul>';
                var criticKeysNewLength = 0;

                if (criticKeysNew.includes('Note AlloCiné') ||
                    criticKeysNew.includes('Note BetaSeries') ||
                    criticKeysNew.includes('Note IMDb')) {
                    htmlTagCriticRecap += '<p>Notes des utilisateurs : </p>';
                }

                if (criticKeysNew.includes('Note AlloCiné')) {
                    htmlTagCriticRecap += '<li>' + convertNumberToStars(parseFloat(criticValuesNew[criticKeysNew.indexOf('Note AlloCiné')]));
                    htmlTagCriticRecap += ' (' + criticValuesNew[criticKeysNew.indexOf('Note AlloCiné')] + '/5) AlloCiné';
                    htmlTagCriticRecap += ' (' + criticValuesNew[criticKeysNew.indexOf('Nombre notes AlloCiné')] + ' notes)</li>';
                }

                if (criticKeysNew.includes('Note BetaSeries') &&
                    parseFloat(criticValuesNew[criticKeysNew.indexOf('Note BetaSeries')]) !== 0) {
                    htmlTagCriticRecap += '<li>' + convertNumberToStars(parseFloat(criticValuesNew[criticKeysNew.indexOf('Note BetaSeries')])) + ' (' + criticValuesNew[criticKeysNew.indexOf('Note BetaSeries')] + '/5) BetaSeries</li>';
                }

                if (criticKeysNew.includes('Note IMDb')) {
                    htmlTagCriticRecap += '<li>' + convertNumberToStars(parseFloat(criticValuesNew[criticKeysNew.indexOf('Note IMDb')]) / 2) + ' (' + criticValuesNew[criticKeysNew.indexOf('Note IMDb')] + '/10) IMDb';
                    htmlTagCriticRecap += ' (' + criticValuesNew[criticKeysNew.indexOf('Nombre notes IMDb')] + ' notes)</li>';
                }

                if (criticKeysNew != '' &&
                    criticKeysNew[0] != 'Note AlloCiné' &&
                    criticKeysNew[0] != 'Nombre notes AlloCiné' &&
                    criticKeysNew[0] != 'Note BetaSeries' &&
                    criticKeysNew[0] != 'Note IMDb' &&
                    criticKeysNew[0] != 'Nombre notes IMDb') {
                    htmlTagCriticRecap += '<p>Notes de la presse : </p>';
                    criticKeysNewLength = criticKeysNew.length;
                    for (var htmlTagCriticRecapIndex = 0; htmlTagCriticRecapIndex < criticKeysNewLength; htmlTagCriticRecapIndex++) {
                        if (criticKeysNew[htmlTagCriticRecapIndex] != 'Note AlloCiné' &&
                            criticKeysNew[htmlTagCriticRecapIndex] != 'Nombre notes AlloCiné' &&
                            criticKeysNew[htmlTagCriticRecapIndex] != 'Note BetaSeries' &&
                            criticKeysNew[htmlTagCriticRecapIndex] != 'Note IMDb' &&
                            criticKeysNew[htmlTagCriticRecapIndex] != 'Nombre notes IMDb') {
                            htmlTagCriticRecap += '<li>' + convertNumberToStars(parseFloat(criticValuesNew[htmlTagCriticRecapIndex])) + ' ' + criticKeysNew[htmlTagCriticRecapIndex] + '</li>';
                        }
                    }
                }

                htmlTagCriticRecap += '</ul>';

                document.querySelector('.slide-critics-recap').innerHTML = htmlTagCriticRecap;

                if (criticKeysNewLength > 13) {
                    document.querySelector('.slide-critics-recap ul').style.height = '80vh';
                } else {
                    document.querySelector('.slide-critics-recap ul').style.height = '';
                }
            }, false);
        });

        var overlay = document.querySelector('#overlay');
        overlay.addEventListener('click', function(e) {
            if (e.target.localName == 'div' ||
                e.target.id == 'close-button') {
                document.querySelector('#overlay').style.display = 'none';
                document.querySelector('iframe').src = '';
                document.body.style.overflow = 'scroll';
            }
        });
    }

    // Convert rating number to font awesome stars
    function convertNumberToStars(ratingTemp) {
        if (ratingTemp % 1 != 0.5 && ratingTemp % 1 != 0) {
            rating = Math.round(ratingTemp);
        } else {
            rating = ratingTemp;
        }

        var output = [];
        for (let index = 1; index <= rating; index++) {
            output.push('<i class="fas fa-star"></i>');
        }
        if (!Number.isInteger(rating)) {
            output.push('<i class="fas fa-star-half-alt"></i>');
        }
        for (let index = 1; index <= (5 - rating); index++) {
            output.push('<i class="far fa-star"></i>');
        }
        return output.join('');
    }

    // Get darkmode status and set icon
    function getDarkmodeStatus() {
        var body = document.body;
        var darkmodeActive = localStorage.getItem('yqac_darkmode.' + 'darkmode');

        if (darkmodeActive == 'true' || body.classList.contains('darkmode--activated')) {
            tglDarkmode.classList.add('far');
            tglDarkmode.classList.remove('fas');
        } else {
            tglDarkmode.classList.remove('far');
            tglDarkmode.classList.add('fas');
        }
    }

    // Set on load default sort on critic
    function defaultInputClick() {
        removeItems();

        var activeSort = normalizeStr(paramsURL('trier_par'));
        if (activeSort == 'note') {
            localStorage.setItem('yqac_sort.' + 'defaultInput', 'critic');
        } else if (activeSort == 'popularite') {
            localStorage.setItem('yqac_sort.' + 'defaultInput', 'popularity');
        } else if (activeSort == 'date_de_creation' ||
            activeSort == 'date_creation' ||
            activeSort == 'creation') {
            localStorage.setItem('yqac_sort.' + 'defaultInput', 'creationdate');
        } else {
            activeSort = localStorage.getItem('yqac_sort.' + 'defaultInput');
            if (activeSort == null) {
                localStorage.setItem('yqac_sort.' + 'defaultInput', 'critic');
            }
        }

        var defaultInput = localStorage.getItem('yqac_sort.' + 'defaultInput');
        var defaultInputValue = document.getElementById('defaultInput' + defaultInput);
        defaultInputValue.click();
    }

    // Display shortcut on search input focus
    function focusSearchInput() {
        var shortcutId = document.getElementById('shortcut');
        var textfieldInput = document.querySelector('.textfield');

        textfieldInput.addEventListener('focus', function() {
            shortcutId.classList.remove('displayNone');
        });

        textfieldInput.addEventListener('focusout', function() {
            shortcutId.classList.add('displayNone');
        });
    }

    // Add click listener on menu toggles
    function getTglButtons() {
        var tglCriticArray = Array.from(document.querySelectorAll('.nav-item.mainToggle'));
        var tglNationalityArray = Array.from(document.querySelectorAll('.nav-item.mainToggleNationality'));
        var tglDurationArray = Array.from(document.querySelectorAll('.nav-item.mainToggleDuration'));
        var tglStarsArray = Array.from(document.querySelectorAll('.nav-item.mainToggleStars'));

        tglCriticArray.forEach(function(toggle) {
            toggle.children[0].children[0].addEventListener('click', toggleLocalData.bind(this), false);
        });

        tglNationalityArray.forEach(function(toggle) {
            toggle.children[0].children[0].addEventListener('click', toggleLocalData.bind(this), false);
        });

        tglDurationArray.forEach(function(toggle) {
            toggle.children[0].children[0].addEventListener('click', toggleLocalData.bind(this), false);
        });

        tglStarsArray.forEach(function(toggle) {
            toggle.children[0].children[0].addEventListener('click', toggleLocalData.bind(this), false);
        });
    }

    // Set yqac_localStorage toggles
    function toggleLocalData(item) {
        var classListName = item.currentTarget.parentNode.parentNode.classList[1];
        var classListNameActive = localStorage.getItem('yqac_critic.' + classListName);
        var getItemType = classListName.replace('mainToggle', '').toLowerCase();
        var classListNameActive2 = localStorage.getItem('yqac_' + getItemType + '.' + classListName);

        if (classListName == 'criticAllocine' ||
            classListName == 'usersAllocine' ||
            classListName == 'usersImdb' ||
            classListName == 'usersBetaseries') {
            localStorage.setItem('yqac_menu.' + 'menuBool', true);
        }

        if (classListName == 'criticAllocine') {
            if (classListNameActive == 'true') {
                item.currentTarget.innerHTML = 'Tout sélectionner<span><input id="criticToggle0" type="checkbox"><label for="criticToggle0"></label></span>';
                item.currentTarget.children[0].children[0].removeAttribute('checked');
                localStorage.setItem('yqac_critic.' + classListName, 'false');
            } else {
                item.currentTarget.innerHTML = 'Tout désélectionner<span><input id="criticToggle0" type="checkbox"><label for="criticToggle0"></label></span>';
                item.currentTarget.children[0].children[0].setAttribute('checked', 'checked');
                localStorage.setItem('yqac_critic.' + classListName, 'true');
            }
        } else if (classListName == 'usersAllocine') {
            if (classListNameActive == 'true') {
                userRatingLi.children[1].children[0].innerHTML = '<i class="fas fa-users fa-lg"></i> Spectateurs AlloCiné<span class="criticNumber criticNumberZero">0</span>';
                item.currentTarget.children[0].children[0].removeAttribute('checked');
                localStorage.setItem('yqac_critic.' + classListName, 'false');
            } else {
                userRatingLi.children[1].children[0].innerHTML = '<i class="fas fa-users fa-lg"></i> Spectateurs AlloCiné<span class="criticNumber">1</span>';
                item.currentTarget.children[0].children[0].setAttribute('checked', 'checked');
                localStorage.setItem('yqac_critic.' + classListName, 'true');
            }
        } else if (classListName == 'usersImdb') {
            if (classListNameActive == 'true') {
                imdbUserRatingLi.children[1].children[0].innerHTML = '<i class="fab fa-imdb fa-lg"></i> Spectateurs IMDb<span class="criticNumber criticNumberZero">0</span>';
                item.currentTarget.children[0].children[0].removeAttribute('checked');
                localStorage.setItem('yqac_critic.' + classListName, 'false');
            } else {
                imdbUserRatingLi.children[1].children[0].innerHTML = '<i class="fab fa-imdb fa-lg"></i> Spectateurs IMDb<span class="criticNumber">1</span>';
                item.currentTarget.children[0].children[0].setAttribute('checked', 'checked');
                localStorage.setItem('yqac_critic.' + classListName, 'true');
            }
        } else if (classListName == 'usersBetaseries') {
            if (classListNameActive == 'true') {
                betaseriesUserRatingLi.children[1].children[0].innerHTML = '<i class="icon-betaseries"></i> Spectateurs Betaseries<span class="criticNumber criticNumberZero">0</span>';
                item.currentTarget.children[0].children[0].removeAttribute('checked');
                localStorage.setItem('yqac_critic.' + classListName, 'false');
            } else {
                betaseriesUserRatingLi.children[1].children[0].innerHTML = '<i class="icon-betaseries"></i> Spectateurs Betaseries<span class="criticNumber">1</span>';
                item.currentTarget.children[0].children[0].setAttribute('checked', 'checked');
                localStorage.setItem('yqac_critic.' + classListName, 'true');
            }
        } else if (classListName == 'mainToggleNationality') {
            if (classListNameActive2 == 'true') {
                item.currentTarget.innerHTML = 'Tout sélectionner<span><input id="nationalityButton0" type="checkbox"><label for="nationalityButton0"></label></span>';
                item.currentTarget.children[0].children[0].removeAttribute('checked');
                localStorage.setItem('yqac_' + getItemType + '.' + classListName, 'false');
            } else {
                item.currentTarget.innerHTML = 'Tout désélectionner<span><input id="nationalityButton0" type="checkbox"><label for="nationalityButton0"></label></span>';
                item.currentTarget.children[0].children[0].setAttribute('checked', 'checked');
                localStorage.setItem('yqac_' + getItemType + '.' + classListName, 'true');
            }
        } else if (classListName == 'mainToggleDuration') {
            if (classListNameActive2 == 'true') {
                item.currentTarget.innerHTML = 'Tout sélectionner<span><input id="durationButton0" type="checkbox"><label for="durationButton0"></label></span>';
                item.currentTarget.children[0].children[0].removeAttribute('checked');
                localStorage.setItem('yqac_' + getItemType + '.' + classListName, 'false');
            } else {
                item.currentTarget.innerHTML = 'Tout désélectionner<span><input id="durationButton0" type="checkbox"><label for="durationButton0"></label></span>';
                item.currentTarget.children[0].children[0].setAttribute('checked', 'checked');
                localStorage.setItem('yqac_' + getItemType + '.' + classListName, 'true');
            }
        } else if (classListName == 'mainToggleStars') {
            if (classListNameActive2 == 'true') {
                item.currentTarget.innerHTML = 'Tout sélectionner<span><input id="starsButton0" type="checkbox"><label for="starsButton0"></label></span>';
                item.currentTarget.children[0].children[0].removeAttribute('checked');
                localStorage.setItem('yqac_' + getItemType + '.' + classListName, 'false');
            } else {
                item.currentTarget.innerHTML = 'Tout désélectionner<span><input id="starsButton0" type="checkbox"><label for="starsButton0"></label></span>';
                item.currentTarget.children[0].children[0].setAttribute('checked', 'checked');
                localStorage.setItem('yqac_' + getItemType + '.' + classListName, 'true');
            }
        }
    }

    // Move to top of ul checked critics
    function menuButtonsChecked() {
        var menuAllChecked = document.querySelectorAll('.nav-item.criticButton:not(.mainToggle)');
        var menuAllCheckedArray = Array.from(menuAllChecked);
        var i = 1;

        menuAllCheckedArray.forEach(function(button) {
            var buttonCriticName = button.children[0].children[0].textContent;
            var localbuttonCriticName = localStorage.getItem('yqac_critic.' + buttonCriticName);

            button.children[0].children[0].addEventListener('click', function() {
                var ulList = this.parentNode.parentNode.parentNode;
                var liItem = this.parentNode.parentNode;
                var secondListItem = this.parentNode.parentNode.parentNode.childNodes[1];
                if (this.children[0].children[0].getAttribute('checked') == 'checked') {
                    ulList.insertBefore(liItem, secondListItem);
                }
            }, false);

            if (localbuttonCriticName == 'true') {
                var ulListLoad = button.parentNode;
                var secondListItemLoad = button.parentNode.childNodes[i];
                ulListLoad.insertBefore(button, secondListItemLoad);
                i++;
            }
        });
    }

    // Set or unset active nationality on load
    function menuNationalityOnLoad() {
        nationalityArray.forEach(function(nationality) {
            nationality.children[0].children[0].addEventListener('click', setLocalStorageNationality.bind(this), false);

            var buttonNationalityName = nationality.children[0].children[0].textContent;
            var localbuttonNationalityName = localStorage.getItem('yqac_nationality.' + buttonNationalityName);

            if (localbuttonNationalityName == 'true' || localbuttonNationalityName == null) {
                nationalityNumberBool = true;
                localbuttonNationalityNameNumber++;
                if (localbuttonNationalityName == null) {
                    localStorage.setItem('yqac_nationality.' + buttonNationalityName, 'true');
                }

                filters.nationalityArray.push(buttonNationalityName);

                filter();
            } else if (localbuttonNationalityName == 'false') {
                nationality.children[0].children[0].children[0].children[0].removeAttribute('checked');
            }
        });

        if (localbuttonNationalityNameNumber > 0) {
            nationalityLi.children[1].children[0].innerHTML = '<i class="fas fa-flag fa-lg"></i> Nationalités<span class="criticNumber">' + localbuttonNationalityNameNumber + '</span>';
        } else {
            nationalityLi.children[1].children[0].innerHTML = '<i class="fas fa-flag fa-lg"></i> Nationalités<span class="criticNumber criticNumberZero">0</span>';
        }

        if (nationalityNumberBool) {
            localStorage.setItem('yqac_nationality.' + 'mainToggleNationality', 'true');
            nationalityInput.children[0].children[0].innerHTML = 'Tout désélectionner<span><input id="nationalityButton0" type="checkbox" checked="checked"><label for="nationalityButton0"></label></span>';
        } else {
            localStorage.setItem('yqac_nationality.' + 'mainToggleNationality', 'false');
            nationalityInput.children[0].children[0].innerHTML = 'Tout sélectionner<span><input id="nationalityButton0" type="checkbox"><label for="nationalityButton0"></label></span>';
        }
    }

    // Set yqac_localStorage for each nationality button
    function setLocalStorageNationality(evt) {
        var buttonNationalityName = evt.currentTarget.textContent;
        var isActive = evt.currentTarget.children[0].children[0].getAttribute('checked');

        if (isActive == 'checked') {
            filters.nationalityArray.splice(filters.nationalityArray.indexOf(buttonNationalityName), 1);
            evt.currentTarget.children[0].children[0].removeAttribute('checked');
            localStorage.setItem('yqac_nationality.' + buttonNationalityName, 'false');
            localbuttonNationalityNameNumber--;
        } else {
            filters.nationalityArray.push(buttonNationalityName);
            evt.currentTarget.children[0].children[0].setAttribute('checked', 'checked');
            localStorage.setItem('yqac_nationality.' + buttonNationalityName, 'true');
            localbuttonNationalityNameNumber++;
        }

        filter();

        if (localbuttonNationalityNameNumber > 0) {
            nationalityLi.children[1].children[0].innerHTML = '<i class="fas fa-flag fa-lg"></i> Nationalités<span class="criticNumber">' + localbuttonNationalityNameNumber + '</span>';
        } else {
            nationalityLi.children[1].children[0].innerHTML = '<i class="fas fa-flag fa-lg"></i> Nationalités<span class="criticNumber criticNumberZero">0</span>';
        }
    }

    // Set or unset active duration on load
    function menuDurationOnLoad() {
        durationArray.forEach(function(duration) {
            duration.children[0].children[0].addEventListener('click', setLocalStorageDuration.bind(this), false);

            var buttonDurationName = duration.children[0].children[0].textContent;
            var localbuttonDurationName = localStorage.getItem('yqac_duration.' + buttonDurationName);

            if (localbuttonDurationName == 'true' || localbuttonDurationName == null) {
                durationNumberBool = true;
                localbuttonDurationNameNumber++;
                if (localbuttonDurationName == null) {
                    localStorage.setItem('yqac_duration.' + buttonDurationName, 'true');
                }

                filters.durationArray.push(buttonDurationName);

                filter();
            } else if (localbuttonDurationName == 'false') {
                duration.children[0].children[0].children[0].children[0].removeAttribute('checked');
            }
        });

        if (localbuttonDurationNameNumber > 0) {
            durationLi.children[1].children[0].innerHTML = '<i class="fas fa-clock fa-lg"></i> Durées<span class="criticNumber">' + localbuttonDurationNameNumber + '</span>';
        } else {
            durationLi.children[1].children[0].innerHTML = '<i class="fas fa-clock fa-lg"></i> Durées<span class="criticNumber criticNumberZero">0</span>';
        }

        if (durationNumberBool) {
            localStorage.setItem('yqac_duration.' + 'mainToggleDuration', 'true');
            durationInput.children[0].children[0].innerHTML = 'Tout désélectionner<span><input id="durationButton0" type="checkbox" checked="checked"><label for="durationButton0"></label></span>';
        } else {
            localStorage.setItem('yqac_duration.' + 'mainToggleDuration', 'false');
            durationInput.children[0].children[0].innerHTML = 'Tout sélectionner<span><input id="durationButton0" type="checkbox"><label for="durationButton0"></label></span>';
        }
    }

    // Set yqac_localStorage for each duration button
    function setLocalStorageDuration(evt) {
        var buttonDurationName = evt.currentTarget.textContent;
        var isActive = evt.currentTarget.children[0].children[0].getAttribute('checked');

        if (isActive == 'checked') {
            filters.durationArray.splice(filters.durationArray.indexOf(buttonDurationName), 1);
            evt.currentTarget.children[0].children[0].removeAttribute('checked');
            localStorage.setItem('yqac_duration.' + buttonDurationName, 'false');
            localbuttonDurationNameNumber--;
        } else {
            filters.durationArray.push(buttonDurationName);
            evt.currentTarget.children[0].children[0].setAttribute('checked', 'checked');
            localStorage.setItem('yqac_duration.' + buttonDurationName, 'true');
            localbuttonDurationNameNumber++;
        }

        filter();

        if (localbuttonDurationNameNumber > 0) {
            durationLi.children[1].children[0].innerHTML = '<i class="fas fa-clock fa-lg"></i> Durées<span class="criticNumber">' + localbuttonDurationNameNumber + '</span>';
        } else {
            durationLi.children[1].children[0].innerHTML = '<i class="fas fa-clock fa-lg"></i> Durées<span class="criticNumber criticNumberZero">0</span>';
        }
    }

    // Set or unset active ratings on load
    function menuStarsOnLoad() {
        starsArray.forEach(function(stars) {
            stars.children[0].children[0].addEventListener('click', setLocalStorageStars.bind(this), false);

            var buttonStarsName = stars.children[0].children[0].parentNode.parentNode.classList[2].replace('datanumber', '');
            var localbuttonStarsName = localStorage.getItem('yqac_stars.' + buttonStarsName);

            if (localbuttonStarsName == 'true' || localbuttonStarsName == null) {
                starsNumberBool = true;
                localbuttonStarsNameNumber++;
                if (localbuttonStarsName == null) {
                    localStorage.setItem('yqac_stars.' + buttonStarsName, 'true');
                }

                filters.starsArray.push(buttonStarsName);

                filter();
            } else if (localbuttonStarsName == 'false') {
                stars.children[0].children[0].children[5].children[0].removeAttribute('checked');
            }
        });

        if (localbuttonStarsNameNumber > 0) {
            starsLi.children[1].children[0].innerHTML = '<i class="fas fa-star fa-lg"></i> Notes<span class="criticNumber">' + localbuttonStarsNameNumber + '</span>';
        } else {
            starsLi.children[1].children[0].innerHTML = '<i class="fas fa-star fa-lg"></i> Notes<span class="criticNumber criticNumberZero">0</span>';
        }

        if (starsNumberBool) {
            localStorage.setItem('yqac_stars.' + 'mainToggleStars', 'true');
            starsInput.children[0].children[0].innerHTML = 'Tout désélectionner<span><input id="starsButton0" type="checkbox" checked="checked"><label for="starsButton0"></label></span>';
        } else {
            localStorage.setItem('yqac_stars.' + 'mainToggleStars', 'false');
            starsInput.children[0].children[0].innerHTML = 'Tout sélectionner<span><input id="starsButton0" type="checkbox"><label for="starsButton0"></label></span>';
        }
    }

    // Set yqac_localStorage for each ratings button
    function setLocalStorageStars(evt) {
        var buttonStarsName = evt.currentTarget.parentNode.parentNode.classList[2].replace('datanumber', '');
        var isActive = evt.currentTarget.children[5].children[0].getAttribute('checked');

        if (isActive == 'checked') {
            filters.starsArray.splice(filters.starsArray.indexOf(buttonStarsName), 1);
            evt.currentTarget.children[5].children[0].removeAttribute('checked');
            localStorage.setItem('yqac_stars.' + buttonStarsName, 'false');
            localbuttonStarsNameNumber--;
        } else {
            filters.starsArray.push(buttonStarsName);
            evt.currentTarget.children[5].children[0].setAttribute('checked', 'checked');
            localStorage.setItem('yqac_stars.' + buttonStarsName, 'true');
            localbuttonStarsNameNumber++;
        }

        filter();

        if (localbuttonStarsNameNumber > 0) {
            starsLi.children[1].children[0].innerHTML = '<i class="fas fa-star fa-lg"></i> Notes<span class="criticNumber">' + localbuttonStarsNameNumber + '</span>';
        } else {
            starsLi.children[1].children[0].innerHTML = '<i class="fas fa-star fa-lg"></i> Notes<span class="criticNumber criticNumberZero">0</span>';
        }
    }

    // Return params values
    function paramsURL(param) {
        return params.get(param);
    }

    // Check if URL has params
    function paramsURLCheck(param) {
        return params.has(param);
    }

    // Add ratings info details
    function ratingInfoDetails() {
        var tags = document.querySelectorAll('.picture-item__tags');
        var imgParent = document.querySelectorAll('.aspect--16x9');

        tags.forEach(function(tag) {
            tag.addEventListener('click', function() {
                tag.parentNode.parentNode.parentNode.children[0].children[0].children[2].classList.toggle('displayNone');
            }, false);
        });

        imgParent.forEach(function(tag) {
            tag.addEventListener('mouseenter', function() {
                if (tag.children[0].children[2].classList.contains('displayNone')) {
                    tag.children[0].children[3].classList.remove('displayNone');
                }
            }, false);
        });

        imgParent.forEach(function(tag) {
            tag.addEventListener('mouseleave', function() {
                if (tag.children[0].children[2].classList.contains('displayNone')) {
                    tag.children[0].children[3].classList.add('displayNone');
                }
            }, false);
        });
    }

    // Clear yqac_localStorage on click trash icon
    function reset() {
        var trashIcon = document.querySelector('.fa-trash-alt');

        trashIcon.addEventListener('click', function() {
            Swal.fire({
                title: 'Êtes-vous sûr de vouloir remettre à zéro vos préférences ?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'var(--green-color)',
                cancelButtonColor: '#d33',
                confirmButtonText: '<i class="fas fa-thumbs-up"></i> OK',
                cancelButtonText: '<i class="fas fa-thumbs-down"></i> Annuler'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Vos préférences ont été remises à zéro !',
                        text: 'La page en cours va être rechargée...',
                        timer: 5000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                        icon: 'success'
                    }).then((_result) => {
                        localStorage.clear();
                        window.location = 'https://yaquoiaucine.fr';
                    });
                }
            });
        }, false);
    }

    // Focus search bar on CMD/CTRL + F keys
    function searchShortcut() {
        onkeydown = onkeyup = function(e) {
            if (e.ctrlKey == true && e.key == 'f' || e.metaKey == true && e.key == 'f') {
                e.preventDefault();
                if (e.ctrlKey == true && e.metaKey == true && e.key == 'f') return;
                document.getElementById('filters-search-input').focus();
            } else if (e.key == 'Escape') {
                e.preventDefault();
                document.getElementById('filters-search-input').blur();
                document.querySelector('#overlay').style.display = 'none';
                document.querySelector('iframe').src = '';
                document.body.style.overflow = 'scroll';
            }
        };
    }

    // Set or unset all critic buttons
    function setMenuButtonAll() {
        var criticButtonNumber = document.querySelectorAll('.nav-item.criticButton:not(.mainToggle)').length;
        var nationalityNumber = document.querySelectorAll('.nav-item.nationalityButton:not(.mainToggleNationality)').length;
        var durationNumber = document.querySelectorAll('.nav-item.durationButton:not(.mainToggleDuration)').length;
        var starsNumber = document.querySelectorAll('.nav-item.starsButton:not(.mainToggleStars)').length;

        criticToggle0.addEventListener('click', function() {
            localStorage.setItem('yqac_menu.' + 'menuBool', true);

            criticArray.forEach(function(button) {
                var buttonCriticName = button.children[0].children[0].textContent;

                if (criticNumberBool) {
                    button.children[0].children[0].children[0].children[0].removeAttribute('checked');
                    localStorage.setItem('yqac_critic.' + buttonCriticName, 'false');
                    localbuttonCriticNameNumber = 0;
                    criticLi.children[1].children[0].innerHTML = '<i class="fas fa-newspaper fa-lg"></i> Presse AlloCiné<span class="criticNumber criticNumberZero">0</span>';
                } else {
                    button.children[0].children[0].children[0].children[0].setAttribute('checked', 'checked');
                    localStorage.setItem('yqac_critic.' + buttonCriticName, 'true');
                    localbuttonCriticNameNumber = criticButtonNumber;
                    criticLi.children[1].children[0].innerHTML = '<i class="fas fa-newspaper fa-lg"></i> Presse AlloCiné<span class="criticNumber">' + localbuttonCriticNameNumber + '</span>';
                }
            });

            if (criticNumberBool) {
                criticNumberBool = false;
            } else {
                criticNumberBool = true;
            }
        }, false);

        nationalityButton0.addEventListener('click', function() {
            nationalityArray.forEach(function(nationality) {
                var nationalityButtonName = nationality.children[0].children[0].textContent;

                if (nationalityNumberBool) {
                    nationality.children[0].children[0].children[0].children[0].removeAttribute('checked');
                    localStorage.setItem('yqac_nationality.' + nationalityButtonName, 'false');
                    localbuttonNationalityNameNumber = 0;
                    nationalityLi.children[1].children[0].innerHTML = '<i class="fas fa-flag fa-lg"></i> Nationalités<span class="criticNumber criticNumberZero">0</span>';
                    filters.nationalityArray = ['No nationality'];
                } else {
                    nationality.children[0].children[0].children[0].children[0].setAttribute('checked', 'checked');
                    localStorage.setItem('yqac_nationality.' + nationalityButtonName, 'true');
                    localbuttonNationalityNameNumber = nationalityNumber;
                    nationalityLi.children[1].children[0].innerHTML = '<i class="fas fa-flag fa-lg"></i> Nationalités<span class="criticNumber">' + localbuttonNationalityNameNumber + '</span>';
                    filters.nationalityArray.push(nationalityButtonName);
                }
            });

            filter();

            if (nationalityNumberBool) {
                nationalityNumberBool = false;
            } else {
                nationalityNumberBool = true;
            }
        }, false);

        durationButton0.addEventListener('click', function() {
            durationArray.forEach(function(duration) {
                var durationButtonName = duration.children[0].children[0].textContent;

                if (durationNumberBool) {
                    duration.children[0].children[0].children[0].children[0].removeAttribute('checked');
                    localStorage.setItem('yqac_duration.' + durationButtonName, 'false');
                    localbuttonDurationNameNumber = 0;
                    durationLi.children[1].children[0].innerHTML = '<i class="fas fa-clock fa-lg"></i> Durées<span class="criticNumber criticNumberZero">0</span>';
                    filters.durationArray = ['No duration'];
                } else {
                    duration.children[0].children[0].children[0].children[0].setAttribute('checked', 'checked');
                    localStorage.setItem('yqac_duration.' + durationButtonName, 'true');
                    localbuttonDurationNameNumber = durationNumber;
                    durationLi.children[1].children[0].innerHTML = '<i class="fas fa-clock fa-lg"></i> Durées<span class="criticNumber">' + localbuttonDurationNameNumber + '</span>';
                    filters.durationArray.push(durationButtonName);
                }
            });

            filter();

            if (durationNumberBool) {
                durationNumberBool = false;
            } else {
                durationNumberBool = true;
            }
        }, false);

        starsButton0.addEventListener('click', function() {
            starsArray.forEach(function(stars) {
                var starsButtonName = stars.classList[2].replace('datanumber', '');

                if (starsNumberBool) {
                    stars.children[0].children[0].children[5].children[0].removeAttribute('checked');
                    localStorage.setItem('yqac_stars.' + starsButtonName, 'false');
                    localbuttonStarsNameNumber = 0;
                    starsLi.children[1].children[0].innerHTML = '<i class="fas fa-star fa-lg"></i> Notes<span class="criticNumber criticNumberZero">0</span>';
                    filters.starsArray = ['No stars'];
                } else {
                    stars.children[0].children[0].children[5].children[0].setAttribute('checked', 'checked');
                    localStorage.setItem('yqac_stars.' + starsButtonName, 'true');
                    localbuttonStarsNameNumber = starsNumber;
                    starsLi.children[1].children[0].innerHTML = '<i class="fas fa-star fa-lg"></i> Notes<span class="criticNumber">' + localbuttonStarsNameNumber + '</span>';
                    filters.starsArray.push(starsButtonName);
                }
            });

            filter();

            if (starsNumberBool) {
                starsNumberBool = false;
            } else {
                starsNumberBool = true;
            }
        }, false);
    }

    // Typewriter function
    function typewriter() {
        var app = document.getElementById('typewriter'),
            typewriter = new Typewriter(app, {
                loop: !0,
                delay: 50
            });
        typewriter.typeString('"T\'as vu quoi comme bon film récemment ?"').pauseFor(2500).deleteAll().typeString('"C\'est quoi LE film à ne pas manquer ?"').pauseFor(2500).deleteAll().typeString('"T\'as vu quoi dernièrement ?"').pauseFor(2500).start();
    }
};

// Load ratings menu and ShuffleJS grid
document.addEventListener('DOMContentLoaded', function() {
    var Nav = new hcOffcanvasNav('#main-nav', {
        customToggle: '.fa-bars',
        width: 290,
        closeOnClick: false,
        levelSpacing: 0,
        navTitle: 'Préférences',
        labelBack: 'Retour',
        ariaLabels: {
            open: 'Ouvrir menu',
            close: 'Fermer menu',
            submenu: 'Sous-menu'
        }
    });

    Nav.on('close', function() {
        var menuBool = localStorage.getItem('yqac_menu.' + 'menuBool');

        if (menuBool == 'true') {
            document.location.reload();
            menuBool = localStorage.setItem('yqac_menu.' + 'menuBool', false);
        }
    });

    window.main = new DOMLoaded(document.getElementById('grid'));
});