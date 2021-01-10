var DOMLoaded = function() {
    var Shuffle = window.Shuffle;
    var shuffleInstance;
    var gridContainerElement = document.getElementById('grid');

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
                filterLabel.innerHTML = "Genre (cumuler <input id=\"inputToggle\" type=\"checkbox\" checked> )";
            } else {
                filterLabel.innerHTML = "Genre (cumuler <input id=\"inputToggle\" type=\"checkbox\"> )";
            }

            clickToggleMode();
            addFilterButtons();
            addSorting();
            addSearchFilter();
            typewriter();
            removeItems();
            defaultInputClick();
            searchShortcut();
            addDarkmodeWidget();
        });

    function clickToggleMode() {
        var inputToggle = document.querySelector('#inputToggle');
        inputToggle.addEventListener('click', toggleMode);
    }

    function toggleMode() {
        var mode = localStorage.getItem('mode');

        if (mode === 'additive') {
            localStorage.setItem('mode', 'exclusive');
        } else {
            localStorage.setItem('mode', 'additive');
        }
    };

    function getMarkupFromData(dataForSingleItem) {
        var id = dataForSingleItem.id,
            titleTemp = dataForSingleItem.allocineData.title,
            picture = dataForSingleItem.allocineData.picture,
            url = dataForSingleItem.allocineData.url,
            date = dataForSingleItem.allocineData.date,
            critic = dataForSingleItem.allocineData.critic,
            genre1 = dataForSingleItem.allocineData.genre.id1,
            genre2 = dataForSingleItem.allocineData.genre.id2,
            genre3 = dataForSingleItem.allocineData.genre.id3,
            genre, title;

        if (genre3 !== undefined) {
            genre = dataForSingleItem.allocineData.genre.id1 + '&quot;, &quot;' + dataForSingleItem.allocineData.genre.id2 + '&quot;, &quot;' + dataForSingleItem.allocineData.genre.id3;
        } else if (genre2 !== undefined) {
            genre = dataForSingleItem.allocineData.genre.id1 + '&quot;, &quot;' + dataForSingleItem.allocineData.genre.id2;
        } else if (genre1 !== undefined) {
            genre = dataForSingleItem.allocineData.genre.id1;
        } else {
            genre = "";
        }

        titleTemp.length > 15 ? title = titleTemp.substring(0, 14) + "..." : title = dataForSingleItem.allocineData.title;

        return [
            '<figure class="col-3@xs col-3@sm col-3@md picture-item shuffle-item shuffle-item--visible" data-groups="[&quot;' + genre + '&quot;]" data-critic="' + critic + '" data-date-created="' + date + '" data-title="' + title + '" style="position: absolute; top: 0px; left: 0px; visibility: visible; will-change: transform; opacity: 1; transition-duration: 250ms; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-property: transform, opacity;">',
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
            '<p class="picture-item__tags">' + critic + '</p>',
            '</div>',
            '</div>',
            '</figure>'
        ].join('');
    }

    function getItemMarkup(items) {
        return items.reduce(function(str, item) {
            return str + getMarkupFromData(item);
        }, '');
    }

    function appendMarkupToGrid(markup) {
        gridContainerElement.insertAdjacentHTML('beforeend', markup);
    }

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

    function addSorting() {
        var buttonGroup = document.querySelector('.sort-options');

        if (!buttonGroup) {
            return;
        }

        buttonGroup.addEventListener('change', handleSortChange.bind(this));
    };

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

    function addSearchFilter() {
        var searchInput = document.querySelector('.js-shuffle-search');

        if (!searchInput) {
            return;
        }

        searchInput.addEventListener('input', handleSearchKeyup.bind(this));
    };

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

    // Typewriter function
    function typewriter() {
        var app = document.getElementById("typewriter"),
            typewriter = new Typewriter(app, {
                loop: !0,
                delay: 50
            });
        typewriter.typeString('"T\'as vu quoi comme bon film récemment ?"').pauseFor(2500).deleteAll().typeString('"C\'est quoi le film à ne pas manquer ?"').pauseFor(2500).deleteAll().typeString('"Tu me recommandes quoi en ce moment ?"').pauseFor(2500).start()
    }

    function removeItems() {
        localStorage.removeItem('critic');
        localStorage.removeItem('title');
        localStorage.removeItem('dateCreated');
    }

    function defaultInputClick() {
        removeItems();
        var defaultInput = document.getElementById('defaultInput');
        defaultInput.click();
    }

    // Focus search bar on CMD/CTRL + F keys
    function searchShortcut() {
        var map = {};
        onkeydown = onkeyup = function(e) {
            e = e || event;
            map[e.keyCode] = e.type == "keydown";

            if (map["70"] == true && e.ctrlKey == true || map["70"] == true && e.metaKey == true) {
                e.preventDefault();
                document.getElementById("filters-search-input").focus();
                map["70"] = false;
            } else if (map["27"] == true) {
                e.preventDefault();
                document.getElementById("filters-search-input").blur();
                map["27"] = false;
            }
        }
    }

    function addDarkmodeWidget() {
        const options = {
            bottom: '30px',
            right: '30px',
            left: 'unset',
            time: '0.5s',
            mixColor: '#fff',
            backgroundColor: '#fff',
            buttonColorDark: '#fff',
            buttonColorLight: '#000',
            saveInCookies: true,
            label: '<i class="fas fa-moon" style="color: #28a745"></i>',
            autoMatchOsTheme: true
        }

        const darkmode = new Darkmode(options);
        darkmode.showWidget();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.main = new DOMLoaded(document.getElementById('grid'));
});