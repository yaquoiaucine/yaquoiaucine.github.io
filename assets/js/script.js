var DOMLoaded = function() {
    var Shuffle = window.Shuffle;
    var shuffleInstance;
    var buttonsArray = Array.from(document.querySelectorAll('.filter-options button'));
    var criticNumberBool = criticNull = false;
    var divMenu = document.querySelector('[role="menu"]');
    var gridContainerElement = document.getElementById('grid');
    var menuButton = document.querySelectorAll('.criticButton');
    var menuButtonArray = Array.from(menuButton);
    var menuButtonAll = document.querySelector('.criticButtonAll');
    var optionsArray = Array.from(document.querySelectorAll('.period-options option'));
    var optionsButton = document.querySelector('.period-options');
    var overlay = document.getElementById('menu');
    var tglDarkmode = document.querySelector('.tgl-darkmode');

    const options = {
        time: '0.5s',
        mixColor: '#FFFFFF',
        backgroundColor: '#EDEDED'
    }

    const darkmode = new Darkmode(options);

    fetch('https://yaquoiaucine.fr/assets/js/data.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            var data = response.data;

            var markup = getItemMarkup(data);
            appendMarkupToGrid(markup);

            shuffleInstance = new Shuffle(gridContainerElement, {
                itemSelector: '.picture-item',
                sizer: '.my-sizer-element'
            });

            filters = {
                optionsArray: [],
                buttonsArray: []
            };

            var mode = localStorage.getItem('mode');
            var filterLabel = document.querySelector('.filter-label');

            if (mode === 'additive') {
                filterLabel.innerHTML = 'Genre (cumuler <input id="inputToggle" type="checkbox" checked><label for="inputToggle">)</label>';
            } else {
                filterLabel.innerHTML = 'Genre (cumuler <input id="inputToggle" type="checkbox"><label for="inputToggle">)</label>';
            }

            removeItems();
            addSearchFilter();
            addSorting();
            bindEventListeners();
            clickMenuButtonAll();
            clickToggleMode();
            darkmodePref();
            defaultInputClick();
            focusSearchInput();
            getDarkmodeStatus();
            getTglButtons();
            menuButtons();
            searchShortcut();
            settingsClick();
            typewriter();
        });

    // Retrieve all items from data object
    function getItemMarkup(items) {
        return items.reduce(function(str, item) {
            return str + getMarkupFromData(item);
        }, '');
    };

    // Get selected data from data object
    function getMarkupFromData(dataForSingleItem) {
        var id = dataForSingleItem.id,
            titleTemp = dataForSingleItem.allocineData.title,
            picture = dataForSingleItem.allocineData.picture,
            url = dataForSingleItem.allocineData.url,
            date = dataForSingleItem.allocineData.date,
            criticFix = dataForSingleItem.allocineData.critic,
            criticNames = dataForSingleItem.allocineData.criticNames,
            user = dataForSingleItem.allocineData.user,
            genre1 = dataForSingleItem.allocineData.genre.id1,
            genre2 = dataForSingleItem.allocineData.genre.id2,
            genre3 = dataForSingleItem.allocineData.genre.id3,
            genre, title, rating, dateFormatted;

        if (genre3 !== undefined) {
            genre = dataForSingleItem.allocineData.genre.id1 + ',' + dataForSingleItem.allocineData.genre.id2 + ',' + dataForSingleItem.allocineData.genre.id3;
        } else if (genre2 !== undefined) {
            genre = dataForSingleItem.allocineData.genre.id1 + ',' + dataForSingleItem.allocineData.genre.id2;
        } else if (genre1 !== undefined) {
            genre = dataForSingleItem.allocineData.genre.id1;
        } else {
            genre = '';
        }

        var dateFormatted = splitDate(date);

        var today = new Date();
        var todayNewTemp = String(today);
        var todayNew = splitDate(todayNewTemp);
        today.setDate(today.getDate() - 7);
        var last7DaysNew = ((today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear());
        var isDateIncludedlast7Days = dateCheck(last7DaysNew, todayNew, dateFormatted);

        var today = new Date();
        today.setDate(today.getDate() - 14);
        var last2Weeks = ((today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear());
        var isDateIncludedlast2Weeks = dateCheck(last2Weeks, todayNew, dateFormatted);

        var today = new Date();
        today.setDate(today.getDate() - 21);
        var last3Weeks = ((today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear());
        var isDateIncludedlast3Weeks = dateCheck(last3Weeks, todayNew, dateFormatted);

        var today = new Date();
        today.setDate(today.getDate() - 30);
        var last30Days = ((today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear());
        var isDateIncludedlast30Days = dateCheck(last30Days, todayNew, dateFormatted);

        var today = new Date();
        today.setDate(today.getDate() - 90);
        var last90Days = ((today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear());
        var isDateIncludedlast90Days = dateCheck(last90Days, todayNew, dateFormatted);

        var isDateIncluded2018 = dateCheck('01/01/2018', '12/31/2018', dateFormatted);
        var isDateIncluded2019 = dateCheck('01/01/2019', '12/31/2019', dateFormatted);
        var isDateIncluded2020 = dateCheck('01/01/2020', '12/31/2020', dateFormatted);
        var isDateIncluded2021 = dateCheck('01/01/2021', '12/31/2021', dateFormatted);

        dateFormattedFilter = addDateFilter(
            isDateIncludedlast7Days,
            isDateIncludedlast2Weeks,
            isDateIncludedlast3Weeks,
            isDateIncludedlast30Days,
            isDateIncludedlast90Days,
            isDateIncluded2018,
            isDateIncluded2019,
            isDateIncluded2020,
            isDateIncluded2021);

        critic = getActiveCritics(criticFix, criticNames);

        if (user == '') user = 0;

        var criticActive = localStorage.getItem('criticAllocine');
        var userActive = localStorage.getItem('usersAllocine');
        var criticInput = document.querySelector('.criticAllocine');
        var userInput = document.querySelector('.usersAllocine');

        if (retrieveLocalData(criticActive) && retrieveLocalData(userActive)) {
            if (critic == 0) critic = user;
            ratingTemp = (parseFloat(critic) + parseFloat(user)) / 2;
            criticInput.setAttribute('checked', '');
            userInput.setAttribute('checked', '');
        } else if (retrieveLocalData(criticActive)) {
            ratingTemp = parseFloat(critic);
            criticInput.setAttribute('checked', '');
        } else if (retrieveLocalData(userActive)) {
            ratingTemp = parseFloat(user);
            userInput.setAttribute('checked', '');
        } else {
            ratingTemp = 0;
        }

        rating = ratingTemp.toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1');

        titleTemp.length > 15 ? title = titleTemp.substring(0, 14) + '...' : title = dataForSingleItem.allocineData.title;

        return [
            '<figure class="col-3@xs col-3@sm col-3@md picture-item shuffle-item shuffle-item--visible" data-genre="' + genre + '" data-date-formatted="' + dateFormattedFilter + '" data-critic="' + rating + '" data-date-created="' + date + '" data-title="' + title + '" style="position: absolute; top: 0px; left: 0px; visibility: visible; will-change: transform; opacity: 1; transition-duration: 250ms; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-property: transform, opacity;">',
            '<div class="picture-item__inner">',
            '<div class="aspect aspect--16x9">',
            '<div class="aspect__inner">',
            '<img src="assets/pictures/new/' + id + '.jpg" srcset="assets/pictures/new/' + id + '.jpg" alt="' + title + '">',
            '<img class="picture-item__blur" src="assets/pictures/new/' + id + '.jpg" srcset="assets/pictures/new/' + id + '.jpg" alt="" aria-hidden="true">',
            '</div>',
            '</div>',
            '<div class="picture-item__details">',
            '<figcaption class="picture-item__title">',
            '<a href="' + url + '" target="_blank" rel="noopener" title="' + dataForSingleItem.allocineData.title + " / " + date + '">' + title + '</a>',
            '</figcaption>',
            '<p class="picture-item__tags">' + rating + '</p>',
            '</div>',
            '</div>',
            '</figure>'
        ].join('');
    };

    // Change french date format to mm/dd/yyyy
    function splitDate(date) {
        var newDate = date.split(' ');
        var altFormat = false;

        switch (newDate[1]) {
            case 'janvier':
                newDate[1] = '01';
                break;
            case 'Jan':
                newDate[1] = '01';
                altFormat = true;
                break;
            case 'février':
                newDate[1] = '02';
                break;
            case 'Feb':
                newDate[1] = '02';
                altFormat = true;
                break;
            case 'mars':
                newDate[1] = '03';
                break;
            case 'Mar':
                newDate[1] = '03';
                altFormat = true;
                break;
            case 'avril':
                newDate[1] = '04';
                break;
            case 'Apr':
                newDate[1] = '04';
                altFormat = true;
                break;
            case 'mai':
                newDate[1] = '05';
                break;
            case 'May':
                newDate[1] = '05';
                altFormat = true;
                break;
            case 'juin':
                newDate[1] = '06';
                break;
            case 'Jun':
                newDate[1] = '06';
                altFormat = true;
                break;
            case 'juillet':
                newDate[1] = '07';
                break;
            case 'Jul':
                newDate[1] = '07';
                altFormat = true;
                break;
            case 'août':
                newDate[1] = '08';
                break;
            case 'Aug':
                newDate[1] = '08';
                altFormat = true;
                break;
            case 'septembre':
                newDate[1] = '09';
                break;
            case 'Sep':
                newDate[1] = '09';
                altFormat = true;
                break;
            case 'octobre':
                newDate[1] = '10';
                break;
            case 'Oct':
                newDate[1] = '10';
                altFormat = true;
                break;
            case 'novembre':
                newDate[1] = '11';
                break;
            case 'Nov':
                newDate[1] = '11';
                altFormat = true;
                break;
            case 'décembre':
                newDate[1] = '12';
                break;
            case 'Dec':
                newDate[1] = '12';
                altFormat = true;
                break;
            default:
                newDate[1] = '';
                break
        }

        if (altFormat) {
            return newDate[1] + '/' + newDate[2] + '/' + newDate[3];
        } else {
            return newDate[1] + '/' + newDate[0] + '/' + newDate[2];
        }
    };

    // Parse start date, end date and date to check
    function dateCheck(firstDate, lastDate, dateToCheck) {
        var firstDateNew, lastDateNew, dateToCheckNew;

        firstDateNew = Date.parse(firstDate);
        lastDateNew = Date.parse(lastDate);
        dateToCheckNew = Date.parse(dateToCheck);

        return (dateToCheckNew <= lastDateNew && dateToCheckNew >= firstDateNew);
    };

    // Return date values for filtering
    function addDateFilter(
        isDateIncludedlast7Days,
        isDateIncludedlast2Weeks,
        isDateIncludedlast3Weeks,
        isDateIncludedlast30Days,
        isDateIncludedlast90Days,
        isDateIncluded2018,
        isDateIncluded2019,
        isDateIncluded2020,
        isDateIncluded2021) {
        var text = text2 = '';

        if (isDateIncludedlast7Days) {
            text = 'Les 7 derniers jours,Les 2 dernières semaines,Les 3 dernières semaines,Les 30 derniers jours,Les 90 derniers jours';
        } else if (isDateIncludedlast2Weeks) {
            text = 'Les 2 dernières semaines,Les 3 dernières semaines,Les 30 derniers jours,Les 90 derniers jours';
        } else if (isDateIncludedlast3Weeks) {
            text = 'Les 3 dernières semaines,Les 30 derniers jours,Les 90 derniers jours';
        } else if (isDateIncludedlast30Days) {
            text = 'Les 30 derniers jours,Les 90 derniers jours';
        } else if (isDateIncludedlast90Days) {
            text = 'Les 90 derniers jours';
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

        return text + ',' + text2;
    };

    // Return active critics
    function getActiveCritics(criticFix, criticNames) {
        var critic = res = criticNumber = 0;
        var buttonCriticNameNew;

        if (Object.keys(criticNames).length > 0) {
            menuButtonArray.forEach(function(button) {
                var buttonCriticName = button.children[0].innerHTML;
                var localbuttonCriticName = localStorage.getItem(buttonCriticName);
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
    };

    // Set localStorage for critic and user main buttons
    function retrieveLocalData(item) {
        if (item == 'true') {
            return true;
        } else if (item == 'false') {
            return false;
        } else {
            localStorage.setItem('criticAllocine', 'true');
            localStorage.setItem('usersAllocine', 'true');
            return true;
        }
    };

    // Display retrieved data in grid div
    function appendMarkupToGrid(markup) {
        gridContainerElement.insertAdjacentHTML('beforeend', markup);
    };

    // Remove localStorage items
    function removeItems() {
        localStorage.removeItem('critic');
        localStorage.removeItem('title');
        localStorage.removeItem('dateCreated');
    };

    // Search function
    function addSearchFilter() {
        var searchInput = document.querySelector('.js-shuffle-search');

        if (!searchInput) {
            return;
        }

        searchInput.addEventListener('input', handleSearchKeyup.bind(this));
    };

    // Add keyup listeners for search
    function handleSearchKeyup(evt) {
        var searchText = evt.target.value.toLowerCase();

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
    };

    // Sort function
    function addSorting() {
        var buttonGroup = document.querySelector('.sort-options');

        if (!buttonGroup) {
            return;
        }

        buttonGroup.addEventListener('change', handleSortChange.bind(this));
    };

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

        function sortByDate(element) {
            return Date.parse(splitDate(element.getAttribute('data-date-created')));
        }

        function sortByTitle(element) {
            return element.getAttribute('data-title').toLowerCase();
        }

        function sortCritic(element) {
            return element.getAttribute('data-critic');
        }

        if (value === 'date-created') {
            var dateCreated = localStorage.getItem('dateCreated');

            if (dateCreated === 'true') {
                options = {
                    reverse: false,
                    by: sortByDate,
                };

                evt.target.parentNode.innerHTML = '<input type="radio" name="sort-value" value="date-created"> Date de sortie <i class="fas fa-arrow-up"></i>'
                localStorage.setItem('dateCreated', 'false');
            } else {
                options = {
                    reverse: true,
                    by: sortByDate,
                };

                evt.target.parentNode.innerHTML = '<input type="radio" name="sort-value" value="date-created"> Date de sortie <i class="fas fa-arrow-down"></i>'
                localStorage.setItem('dateCreated', 'true');
            }
        } else if (value === 'title') {
            var title = localStorage.getItem('title');

            if (title === 'true') {
                options = {
                    reverse: true,
                    by: sortByTitle,
                };

                evt.target.parentNode.innerHTML = '<input type="radio" name="sort-value" value="title"> Titre <i class="fas fa-arrow-up"></i>'
                localStorage.setItem('title', 'false');
            } else {
                options = {
                    reverse: false,
                    by: sortByTitle,
                };

                evt.target.parentNode.innerHTML = '<input type="radio" name="sort-value" value="title"> Titre <i class="fas fa-arrow-down"></i>'
                localStorage.setItem('title', 'true');
            }
        } else if (value === 'critic') {
            var critic = localStorage.getItem('critic');

            if (critic === 'true') {
                options = {
                    reverse: false,
                    by: sortCritic,
                };

                evt.target.parentNode.innerHTML = '<input type="radio" name="sort-value" value="critic"> Note <i class="fas fa-arrow-up"></i>'
                localStorage.setItem('critic', 'false');
            } else {
                options = {
                    reverse: true,
                    by: sortCritic,
                };

                evt.target.parentNode.innerHTML = '<input type="radio" name="sort-value" value="critic"> Note <i class="fas fa-arrow-down"></i>'
                localStorage.setItem('critic', 'true');
            }
        }

        shuffleInstance.sort(options);
    };

    // Add events on options changes and buttons clicks
    function bindEventListeners() {
        var activePeriod = localStorage.getItem('activePeriod');

        setTimeout(function() {
            if (activePeriod != null) {
                optionsButton.value = activePeriod;
                optionsButton.options[optionsButton.selectedIndex].setAttribute('selected', 'selected');
                handleOptionChange();
            }
        }, 100);

        onButtonChange = handleButtonChange.bind(this);

        optionsButton.addEventListener("change", function() {
            optionsButton.options[optionsButton.selectedIndex].setAttribute('selected', 'selected');
            handleOptionChange();
            activePeriod = optionsButton.options[optionsButton.selectedIndex].value;
            localStorage.setItem('activePeriod', activePeriod);
        });

        buttonsArray.forEach(function(button) {
            button.addEventListener('click', onButtonChange);
        }, this);
    };

    // Get current option filters and filter
    function handleOptionChange() {
        filters.optionsArray = getCurrentOptionFilters();
        if (filters.optionsArray == 'Depuis toujours' ||
            filters.optionsArray == 'Default')
            filters.optionsArray = '';
        filter();
    };

    // Return selected option value
    function getCurrentOptionFilters() {
        return optionsArray.filter(function(option) {
            return option.selected;
        }).map(function(option) {
            return option.value;
        });
    };

    // Handle button change with additive and exclusive mode
    function handleButtonChange(evt) {
        var mode = localStorage.getItem('mode');

        if (mode == undefined) {
            localStorage.setItem('mode', 'exclusive');
            var mode = localStorage.getItem('mode');
        }

        var btn = evt.currentTarget;
        var isActive = btn.classList.contains('active');
        var btnGroup = btn.getAttribute('data-group');

        if (mode === 'additive') {
            if (isActive) {
                filters.buttonsArray.splice(filters.buttonsArray.indexOf(btnGroup));
            } else {
                filters.buttonsArray.push(btnGroup);
            }

            btn.classList.toggle('active');

            filter();

        } else {
            removeActiveClassFromChildren(btn.parentNode);

            if (isActive) {
                btn.classList.remove('active');
            } else {
                btn.classList.add('active');
                filters.buttonsArray = getCurrentButtonFilters();
            }

            filter();
        }
    };

    // Remove active class from children
    function removeActiveClassFromChildren(parent) {
        var children = parent.children;
        for (var i = children.length - 1; i >= 0; i--) {
            children[i].classList.remove('active');
        }
    };

    // Get current button filters
    function getCurrentButtonFilters() {
        return buttonsArray.filter(function(button) {
            return button.classList.contains('active');
        }).map(function(button) {
            return button.getAttribute('data-group');
        });
    };

    // Filter matching items
    function filter() {
        if (hasActiveFilters()) {
            shuffleInstance.filter(itemPassesFilters.bind(this));
        } else {
            shuffleInstance.filter(Shuffle.ALL_ITEMS);
        }
    };

    // Check active filters length
    function hasActiveFilters() {
        return Object.keys(filters).some(function(key) {
            return filters[key].length > 0;
        }, this);
    };

    // Select matching items
    function itemPassesFilters(element) {
        var optionsArray = filters.optionsArray;
        var buttonsArray = filters.buttonsArray;
        var option = element.getAttribute('data-date-formatted');
        var optionNew = option.split(',');
        var button = element.getAttribute('data-genre');
        var buttonNew = button.split(',');

        if (optionsArray.length > 0 && !optionsArray.some(r => optionNew.includes(r))) {
            return false;
        }

        if (buttonsArray.length > 0 && !buttonsArray.some(r => buttonNew.includes(r))) {
            return false;
        }

        return true;
    };

    // Set or unset all critic buttons
    function clickMenuButtonAll() {
        menuButtonAll.addEventListener('click', function() {
            menuButtonArray.forEach(function(button) {
                var buttonCriticName = button.children[0].innerHTML;

                if (criticNumberBool) {
                    button.classList.remove('active');
                    localStorage.setItem(buttonCriticName, 'false');
                } else {
                    button.classList.add('active');
                    localStorage.setItem(buttonCriticName, 'true');
                }
            });

            if (criticNumberBool) {
                menuButtonAll.children[0].innerHTML = '<i class="fas fa-eye" aria-hidden="true"></i> Sélectionner toutes les critiques';
                criticNumberBool = false;
            } else {
                menuButtonAll.children[0].innerHTML = '<i class="fas fa-eye-slash" aria-hidden="true"></i> Désélectionner toutes les critiques';
                criticNumberBool = true;
            }
        }, false);
    };

    // Add additive/exclusive click listener
    function clickToggleMode() {
        var inputToggle = document.querySelector('#inputToggle');
        inputToggle.addEventListener('click', toggleMode, false);
    };

    // Set additive/exclusive toggle
    function toggleMode() {
        var mode = localStorage.getItem('mode');

        if (mode === 'additive') {
            localStorage.setItem('mode', 'exclusive');
        } else {
            localStorage.setItem('mode', 'additive');
        }
    };

    // Add click listener
    function darkmodePref() {
        tglDarkmode.addEventListener('click', toggleDarkmode, false);
    };

    // Trigger darkmode function
    function toggleDarkmode() {
        darkmode.toggle();
        getDarkmodeStatus();
    };

    // Get darkmode status and set icon
    function getDarkmodeStatus() {
        var body = document.body;
        var darkmodeActive = localStorage.getItem('darkmode');

        if (darkmodeActive == 'true' || body.classList.contains('darkmode--activated')) {
            tglDarkmode.classList.add('fa-moon');
            tglDarkmode.classList.remove('fa-sun');
        } else {
            tglDarkmode.classList.remove('fa-moon');
            tglDarkmode.classList.add('fa-sun');
        }
    };

    // Set on load default sort on critic
    function defaultInputClick() {
        removeItems();
        var defaultInput = document.getElementById('defaultInput');
        defaultInput.click();
    };

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
    };

    // Add click listener on menu toggles
    function getTglButtons() {
        var tglBtn = document.querySelectorAll('.tgl-flip');
        var tgl1 = document.getElementById('tgl1');

        if (!tglBtn) {
            return;
        }

        if (tgl1.checked) {
            divMenu.classList.remove('displayNone');
            tgl1.previousElementSibling.style.textDecorationColor = 'var(--green-color)';
        } else {
            divMenu.classList.add('displayNone');
            tgl1.previousElementSibling.style.textDecorationColor = 'var(--red-color)';
        }

        if (tgl2.checked) {
            tgl2.previousElementSibling.style.textDecorationColor = 'var(--green-color)';
        } else {
            tgl2.previousElementSibling.style.textDecorationColor = 'var(--red-color)';
        }

        var tglBtnArray = Array.from(tglBtn);

        tglBtnArray.forEach(function(toggle) {
            toggle.addEventListener('click', toggleLocalData.bind(this), false);
        });
    };

    // Set localStorage toggles
    function toggleLocalData(item) {
        var classListName = item.currentTarget.classList[2];
        var classListNameActive = localStorage.getItem(classListName);

        if (classListName == 'criticAllocine' && classListNameActive == 'true') {
            divMenu.classList.add('displayNone');
        } else if (classListName == 'criticAllocine' && classListNameActive == 'false') {
            divMenu.classList.remove('displayNone');
        }

        if (classListNameActive == 'true') {
            localStorage.setItem(classListName, 'false');
            item.currentTarget.previousElementSibling.style.textDecorationColor = 'var(--red-color)';
        } else {
            localStorage.setItem(classListName, 'true');
            item.currentTarget.previousElementSibling.style.textDecorationColor = 'var(--green-color)';
        }
    };

    // Set or unset active critic on load
    function menuButtons() {
        menuButtonArray.forEach(function(button) {
            button.addEventListener('click', setLocalstorageMenu.bind(this), false);

            var buttonCriticName = button.children[0].innerHTML;
            var localbuttonCriticName = localStorage.getItem(buttonCriticName);

            if (localbuttonCriticName == 'true') {
                button.classList.add('active');
                criticNumberBool = true;
            } else if (localbuttonCriticName == 'false') {
                button.classList.remove('active');
            } else {
                localStorage.setItem(buttonCriticName, 'true');
                button.classList.add('active');
                criticNumberBool = true;
            }
        });

        if (criticNumberBool) {
            menuButtonAll.children[0].innerHTML = '<i class="fas fa-eye-slash" aria-hidden="true"></i> Désélectionner toutes les critiques';
        } else {
            menuButtonAll.children[0].innerHTML = '<i class="fas fa-eye" aria-hidden="true"></i> Sélectionner toutes les critiques';
        }
    };

    // Set localStorage for each button
    function setLocalstorageMenu(item) {
        var buttonCriticName = item.currentTarget.children[0].innerText;
        var localbuttonCriticName = localStorage.getItem(buttonCriticName);

        if (localbuttonCriticName == 'true') {
            item.currentTarget.classList.remove('active');
            localStorage.setItem(buttonCriticName, 'false');
        } else if (localbuttonCriticName == 'false') {
            item.currentTarget.classList.add('active');
            localStorage.setItem(buttonCriticName, 'true');
        } else {
            localStorage.setItem(buttonCriticName, 'true');
        }
    };

    // Focus search bar on CMD/CTRL + F keys
    function searchShortcut() {
        var map = {};

        onkeydown = onkeyup = function(e) {
            e = e || event;
            map[e.keyCode] = e.type == 'keydown';

            if (map['70'] == true && e.ctrlKey == true || map['70'] == true && e.metaKey == true) {
                e.preventDefault();
                document.getElementById('filters-search-input').focus();
                map['70'] = false;
            } else if (map['27'] == true) {
                e.preventDefault();
                if (overlay.classList.contains('overlay')) {
                    document.location.reload();
                } else {
                    document.getElementById('filters-search-input').blur();
                    map['27'] = false;
                }
            }
        }
    };

    // Trigger overlay menu on settings click
    function settingsClick() {
        var burgerMenu = document.getElementById('burger-menu');
        var sliders = document.querySelector('.fa-sliders-h');

        sliders.addEventListener('click', function() {
            burgerMenu.classList.add('close');
            overlay.classList.add('overlay');
            return false;
        });

        burgerMenu.addEventListener('click', function() {
            burgerMenu.classList.remove('close');
            overlay.classList.remove('overlay');
            document.location.reload();
        });
    };

    // Typewriter function
    function typewriter() {
        var app = document.getElementById('typewriter'),
            typewriter = new Typewriter(app, {
                loop: !0,
                delay: 50
            });
        typewriter.typeString('"T\'as vu quoi comme bon film récemment ?"').pauseFor(2500).deleteAll().typeString('"C\'est quoi le film à ne pas manquer ?"').pauseFor(2500).deleteAll().typeString('"Tu me recommandes quoi en ce moment ?"').pauseFor(2500).start()
    };
};

document.addEventListener('DOMContentLoaded', function() {
    window.main = new DOMLoaded(document.getElementById('grid'));
});