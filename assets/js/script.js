var DOMLoaded = function() {
    var Shuffle = window.Shuffle;
    var shuffleInstance;
    var criticNumberBool = criticNull = false;
    var divMenu = document.querySelector('[role="menu"]');
    var gridContainerElement = document.getElementById('grid');
    var menuButton = document.querySelectorAll('.criticButton');
    var menuButtonArray = Array.from(menuButton);
    var menuButtonAll = document.querySelector('.criticButtonAll');
    var overlay = document.getElementById('menu');
    var tglDarkmode = document.querySelector('.tgl-darkmode');

    const options = {
        time: '0.5s',
        mixColor: '#fff',
        backgroundColor: 'rgb(237, 237, 237)',
        saveInCookies: true,
        autoMatchOsTheme: true
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

            activeFilters = [];

            var mode = localStorage.getItem('mode');
            var filterLabel = document.querySelector('.filter-label');

            if (mode === 'additive') {
                filterLabel.innerHTML = 'Genre (cumuler <input id="inputToggle" type="checkbox" checked> )';
            } else {
                filterLabel.innerHTML = 'Genre (cumuler <input id="inputToggle" type="checkbox"> )';
            }

            addFilterButtons();
            addSearchFilter();
            removeItems();
            addSorting();
            clickMenuButtonAll();
            clickToggleMode();
            darkmodePref();
            defaultInputClick();
            getDarkmodeStatus();
            getTglButtons();
            menuButtons();
            searchShortcut();
            settingsClick();
            typewriter();
        });

    function getItemMarkup(items) {
        return items.reduce(function(str, item) {
            return str + getMarkupFromData(item);
        }, '');
    };

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
            genre, title, rating;

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

        if (genre3 !== undefined) {
            genre = dataForSingleItem.allocineData.genre.id1 + '&quot;, &quot;' + dataForSingleItem.allocineData.genre.id2 + '&quot;, &quot;' + dataForSingleItem.allocineData.genre.id3;
        } else if (genre2 !== undefined) {
            genre = dataForSingleItem.allocineData.genre.id1 + '&quot;, &quot;' + dataForSingleItem.allocineData.genre.id2;
        } else if (genre1 !== undefined) {
            genre = dataForSingleItem.allocineData.genre.id1;
        } else {
            genre = '';
        }

        titleTemp.length > 15 ? title = titleTemp.substring(0, 14) + '...' : title = dataForSingleItem.allocineData.title;

        return [
            '<figure class="col-3@xs col-3@sm col-3@md picture-item shuffle-item shuffle-item--visible" data-groups="[&quot;' + genre + '&quot;]" data-critic="' + rating + '" data-date-created="' + date + '" data-title="' + title + '" style="position: absolute; top: 0px; left: 0px; visibility: visible; will-change: transform; opacity: 1; transition-duration: 250ms; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-property: transform, opacity;">',
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

    function appendMarkupToGrid(markup) {
        gridContainerElement.insertAdjacentHTML('beforeend', markup);
    };

    function addFilterButtons() {
        var options = document.querySelector('.filter-options');

        if (!options) {
            return;
        }

        var filterButtons = Array.from(options.children);

        filterButtons.forEach(function(button) {
            button.addEventListener('click', handleFilterClick.bind(this), false);
        });
    };

    function handleFilterClick(evt) {
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
                activeFilters.splice(activeFilters.indexOf(btnGroup));
            } else {
                activeFilters.push(btnGroup);
            }

            btn.classList.toggle('active');

            shuffleInstance.filter(activeFilters);

        } else {
            removeActiveClassFromChildren(btn.parentNode);

            var filterGroup;
            if (isActive) {
                btn.classList.remove('active');
                filterGroup = Shuffle.ALL_ITEMS;
            } else {
                btn.classList.add('active');
                filterGroup = btnGroup;
            }

            shuffleInstance.filter(filterGroup);
        }
    };

    function removeActiveClassFromChildren(parent) {
        var children = parent.children;
        for (var i = children.length - 1; i >= 0; i--) {
            children[i].classList.remove('active');
        }
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

    // Remove localStorage items
    function removeItems() {
        localStorage.removeItem('critic');
        localStorage.removeItem('title');
        localStorage.removeItem('dateCreated');
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

    // Change french date format to mm/dd/yyyy
    function splitDate(date) {
        var newDate = date.split(' ');
        switch (newDate[1]) {
            case 'janvier':
                newDate[1] = '01';
                break;
            case 'février':
                newDate[1] = '02';
                break;
            case 'mars':
                newDate[1] = '03';
                break;
            case 'avril':
                newDate[1] = '04';
                break;
            case 'mai':
                newDate[1] = '05';
                break;
            case 'juin':
                newDate[1] = '06';
                break;
            case 'juillet':
                newDate[1] = '07';
                break;
            case 'août':
                newDate[1] = '08';
                break;
            case 'septembre':
                newDate[1] = '09';
                break;
            case 'octobre':
                newDate[1] = '10';
                break;
            case 'novembre':
                newDate[1] = '11';
                break;
            case 'décembre':
                newDate[1] = '12';
                break;
            default:
                newDate[1] = '';
                break
        }
        return newDate[1] + '/' + newDate[0] + '/' + newDate[2]
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

    // Add click listener on menu toggles
    function getTglButtons() {
        var tglBtn = document.querySelectorAll('.tgl-flip');
        var tgl1 = document.getElementById('tgl1');

        if (!tglBtn) {
            return;
        }

        if (tgl1.checked) {
            divMenu.classList.remove('displayNone');
        } else {
            divMenu.classList.add('displayNone');
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
        } else {
            localStorage.setItem(classListName, 'true');
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