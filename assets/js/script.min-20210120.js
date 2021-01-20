var DOMLoaded=function(){var shuffleInstance,Shuffle=window.Shuffle,buttonsArray=Array.from(document.querySelectorAll(".filter-options button")),criticNumberBool=criticNull=!1,divMenu=document.querySelector('[role="menu"]'),gridContainerElement=document.getElementById("grid"),menuButton=document.querySelectorAll(".criticButton"),menuButtonArray=Array.from(menuButton),menuButtonAll=document.querySelector(".criticButtonAll"),optionsArray=Array.from(document.querySelectorAll(".period-options option")),optionsButton=document.querySelector(".period-options"),overlay=document.getElementById("menu"),tglDarkmode=document.querySelector(".tgl-darkmode");const darkmode=new Darkmode({time:"0.5s",mixColor:"#FFFFFF",backgroundColor:"#EDEDED"});function splitDate(date){var newDate=date.split(" "),altFormat=!1;switch(newDate[1]){case"janvier":newDate[1]="01";break;case"Jan":newDate[1]="01",altFormat=!0;break;case"février":newDate[1]="02";break;case"Feb":newDate[1]="02",altFormat=!0;break;case"mars":newDate[1]="03";break;case"Mar":newDate[1]="03",altFormat=!0;break;case"avril":newDate[1]="04";break;case"Apr":newDate[1]="04",altFormat=!0;break;case"mai":newDate[1]="05";break;case"May":newDate[1]="05",altFormat=!0;break;case"juin":newDate[1]="06";break;case"Jun":newDate[1]="06",altFormat=!0;break;case"juillet":newDate[1]="07";break;case"Jul":newDate[1]="07",altFormat=!0;break;case"août":newDate[1]="08";break;case"Aug":newDate[1]="08",altFormat=!0;break;case"septembre":newDate[1]="09";break;case"Sep":newDate[1]="09",altFormat=!0;break;case"octobre":newDate[1]="10";break;case"Oct":newDate[1]="10",altFormat=!0;break;case"novembre":newDate[1]="11";break;case"Nov":newDate[1]="11",altFormat=!0;break;case"décembre":newDate[1]="12";break;case"Dec":newDate[1]="12",altFormat=!0;break;default:newDate[1]=""}return altFormat?newDate[1]+"/"+newDate[2]+"/"+newDate[3]:newDate[1]+"/"+newDate[0]+"/"+newDate[2]}function dateCheck(firstDateNew,lastDateNew,dateToCheckNew){firstDateNew=Date.parse(firstDateNew),lastDateNew=Date.parse(lastDateNew),dateToCheckNew=Date.parse(dateToCheckNew);return dateToCheckNew<=lastDateNew&&firstDateNew<=dateToCheckNew}function retrieveLocalData(item){return"true"==item||"false"!=item&&(localStorage.setItem("criticAllocine","true"),localStorage.setItem("usersAllocine","true"),1)}function removeItems(){localStorage.removeItem("critic"),localStorage.removeItem("title"),localStorage.removeItem("dateCreated")}function handleOptionChange(){filters.optionsArray=optionsArray.filter(function(option){return option.selected}).map(function(option){return option.value}),"Depuis toujours"!=filters.optionsArray&&"Default"!=filters.optionsArray||(filters.optionsArray=""),filter()}function filter(){!function(){return Object.keys(filters).some(function(key){return 0<filters[key].length},this)}()?shuffleInstance.filter(Shuffle.ALL_ITEMS):shuffleInstance.filter(function(element){var optionsArray=filters.optionsArray,buttonsArray=filters.buttonsArray,optionNew=element.getAttribute("data-date-formatted").split(","),buttonNew=element.getAttribute("data-genre").split(",");if(0<optionsArray.length&&!optionsArray.some(r=>optionNew.includes(r)))return!1;if(0<buttonsArray.length&&!buttonsArray.some(r=>buttonNew.includes(r)))return!1;return!0}.bind(this))}function toggleMode(){"additive"===localStorage.getItem("mode")?localStorage.setItem("mode","exclusive"):localStorage.setItem("mode","additive")}function toggleDarkmode(){darkmode.toggle(),getDarkmodeStatus()}function getDarkmodeStatus(){var body=document.body;"true"==localStorage.getItem("darkmode")||body.classList.contains("darkmode--activated")?(tglDarkmode.classList.add("fa-moon"),tglDarkmode.classList.remove("fa-sun")):(tglDarkmode.classList.remove("fa-moon"),tglDarkmode.classList.add("fa-sun"))}fetch("https://yaquoiaucine.fr/assets/js/data.json").then(function(response){return response.json()}).then(function(app){var tgl1=app.data;!function(markup){gridContainerElement.insertAdjacentHTML("beforeend",markup)}(tgl1.reduce(function(str,item){return str+function(dataForSingleItem){var genre,id=dataForSingleItem.id,title=dataForSingleItem.allocineData.title,url=(dataForSingleItem.allocineData.picture,dataForSingleItem.allocineData.url),date=dataForSingleItem.allocineData.date,criticInput=dataForSingleItem.allocineData.critic,rating=dataForSingleItem.allocineData.criticNames,user=dataForSingleItem.allocineData.user,isDateIncluded2018=dataForSingleItem.allocineData.genre.id1,isDateIncludedlast90Days=dataForSingleItem.allocineData.genre.id2;genre=void 0!==dataForSingleItem.allocineData.genre.id3?dataForSingleItem.allocineData.genre.id1+","+dataForSingleItem.allocineData.genre.id2+","+dataForSingleItem.allocineData.genre.id3:void 0!==isDateIncludedlast90Days?dataForSingleItem.allocineData.genre.id1+","+dataForSingleItem.allocineData.genre.id2:void 0!==isDateIncluded2018?dataForSingleItem.allocineData.genre.id1:"";var userActive=splitDate(date),isDateIncluded2019=new Date,criticActive=splitDate(String(isDateIncluded2019));isDateIncluded2019.setDate(isDateIncluded2019.getDate()-7);var isDateIncludedlast7Days=dateCheck(isDateIncluded2019.getMonth()+1+"/"+isDateIncluded2019.getDate()+"/"+isDateIncluded2019.getFullYear(),criticActive,userActive);(isDateIncluded2019=new Date).setDate(isDateIncluded2019.getDate()-14);var isDateIncludedlast2Weeks=dateCheck(isDateIncluded2019.getMonth()+1+"/"+isDateIncluded2019.getDate()+"/"+isDateIncluded2019.getFullYear(),criticActive,userActive);(isDateIncluded2019=new Date).setDate(isDateIncluded2019.getDate()-21);var isDateIncludedlast3Weeks=dateCheck(isDateIncluded2019.getMonth()+1+"/"+isDateIncluded2019.getDate()+"/"+isDateIncluded2019.getFullYear(),criticActive,userActive);(isDateIncluded2019=new Date).setDate(isDateIncluded2019.getDate()-30);var isDateIncludedlast30Days=dateCheck(isDateIncluded2019.getMonth()+1+"/"+isDateIncluded2019.getDate()+"/"+isDateIncluded2019.getFullYear(),criticActive,userActive);(isDateIncluded2019=new Date).setDate(isDateIncluded2019.getDate()-90);isDateIncludedlast90Days=dateCheck(isDateIncluded2019.getMonth()+1+"/"+isDateIncluded2019.getDate()+"/"+isDateIncluded2019.getFullYear(),criticActive,userActive),isDateIncluded2018=dateCheck("01/01/2018","12/31/2018",userActive),isDateIncluded2019=dateCheck("01/01/2019","12/31/2019",userActive),criticActive=dateCheck("01/01/2020","12/31/2020",userActive),userActive=dateCheck("01/01/2021","12/31/2021",userActive);dateFormattedFilter=function(isDateIncludedlast7Days,isDateIncludedlast2Weeks,isDateIncludedlast3Weeks,isDateIncludedlast30Days,isDateIncludedlast90Days,isDateIncluded2018,isDateIncluded2019,isDateIncluded2020,isDateIncluded2021){var text=text2="";text=isDateIncludedlast7Days?"Les 7 derniers jours,Les 2 dernières semaines,Les 3 dernières semaines,Les 30 derniers jours,Les 90 derniers jours":isDateIncludedlast2Weeks?"Les 2 dernières semaines,Les 3 dernières semaines,Les 30 derniers jours,Les 90 derniers jours":isDateIncludedlast3Weeks?"Les 3 dernières semaines,Les 30 derniers jours,Les 90 derniers jours":isDateIncludedlast30Days?"Les 30 derniers jours,Les 90 derniers jours":isDateIncludedlast90Days?"Les 90 derniers jours":"";text2=isDateIncluded2021?"En 2021":isDateIncluded2020?"En 2020":isDateIncluded2019?"En 2019":isDateIncluded2018?"En 2018":"";return text+","+text2}(isDateIncludedlast7Days,isDateIncludedlast2Weeks,isDateIncludedlast3Weeks,isDateIncludedlast30Days,isDateIncludedlast90Days,isDateIncluded2018,isDateIncluded2019,criticActive,userActive),critic=function(criticFix,criticNames){var buttonCriticNameNew,critic=res=criticNumber=0;critic=0<Object.keys(criticNames).length?(menuButtonArray.forEach(function(last7Char){var buttonCriticName=last7Char.children[0].innerHTML,localbuttonCriticName=localStorage.getItem(buttonCriticName),last7Char=buttonCriticName.substr(buttonCriticName.length-7);buttonCriticNameTemp=" Contre"==last7Char?buttonCriticName.replace(" Contre","2"):buttonCriticName,buttonCriticNameNew=buttonCriticNameTemp.replace("'","&#039;"),"true"==localbuttonCriticName&&null!=criticNames[buttonCriticNameNew]?(res+=parseFloat(criticNames[buttonCriticNameNew]),criticNumber++):null==localbuttonCriticName&&(criticNull=!0)}),criticNull?criticFix:(critic=parseFloat(res/criticNumber))||0):0;return critic}(criticInput,rating),""==user&&(user=0);var criticActive=localStorage.getItem("criticAllocine"),userActive=localStorage.getItem("usersAllocine"),criticInput=document.querySelector(".criticAllocine"),rating=document.querySelector(".usersAllocine");retrieveLocalData(criticActive)&&retrieveLocalData(userActive)?(0==critic&&(critic=user),ratingTemp=(parseFloat(critic)+parseFloat(user))/2,criticInput.setAttribute("checked",""),rating.setAttribute("checked","")):retrieveLocalData(criticActive)?(ratingTemp=parseFloat(critic),criticInput.setAttribute("checked","")):retrieveLocalData(userActive)?(ratingTemp=parseFloat(user),rating.setAttribute("checked","")):ratingTemp=0;return rating=ratingTemp.toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,"$1"),title=15<title.length?title.substring(0,14)+"...":dataForSingleItem.allocineData.title,['<figure class="col-3@xs col-3@sm col-3@md picture-item shuffle-item shuffle-item--visible" data-genre="'+genre+'" data-date-formatted="'+dateFormattedFilter+'" data-critic="'+rating+'" data-date-created="'+date+'" data-title="'+title+'" style="position: absolute; top: 0px; left: 0px; visibility: visible; will-change: transform; opacity: 1; transition-duration: 250ms; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-property: transform, opacity;">','<div class="picture-item__inner">','<div class="aspect aspect--16x9">','<div class="aspect__inner">','<img src="assets/pictures/new/'+id+'.jpg" srcset="assets/pictures/new/'+id+'.jpg" alt="'+title+'">','<img class="picture-item__blur" src="assets/pictures/new/'+id+'.jpg" srcset="assets/pictures/new/'+id+'.jpg" alt="" aria-hidden="true">',"</div>","</div>",'<div class="picture-item__details">','<figcaption class="picture-item__title">','<a href="'+url+'" target="_blank" rel="noopener" title="'+dataForSingleItem.allocineData.title+" / "+date+'">'+title+"</a>","</figcaption>",'<p class="picture-item__tags">'+rating+"</p>","</div>","</div>","</figure>"].join("")}(item)},"")),shuffleInstance=new Shuffle(gridContainerElement,{itemSelector:".picture-item",sizer:".my-sizer-element"}),filters={optionsArray:[],buttonsArray:[]};var shortcutId,map,burgerMenu,app=localStorage.getItem("mode"),tgl1=document.querySelector(".filter-label");tgl1.innerHTML="additive"===app?'Genre (cumuler <input id="inputToggle" type="checkbox" checked><label for="inputToggle">)</label>':'Genre (cumuler <input id="inputToggle" type="checkbox"><label for="inputToggle">)</label>',removeItems(),function(){var searchInput=document.querySelector(".js-shuffle-search");searchInput&&searchInput.addEventListener("input",function(evt){var searchText=evt.target.value.toLowerCase();shuffleInstance.filter(function(element,shuffle){if(shuffle.group!==Shuffle.ALL_ITEMS&&!(-1!==JSON.parse(element.getAttribute("data-groups")).indexOf(shuffle.group)))return!1;return-1!==element.querySelector(".picture-item__title").textContent.toLowerCase().trim().indexOf(searchText)})}.bind(this))}(),function(){var buttonGroup=document.querySelector(".sort-options");buttonGroup&&buttonGroup.addEventListener("change",function(evt){Array.from(evt.currentTarget.children).forEach(function(button){button.querySelector("input").value===evt.target.value?button.classList.add("active"):button.classList.remove("active")});var value=evt.target.value,options={};function sortByDate(element){return Date.parse(splitDate(element.getAttribute("data-date-created")))}function sortByTitle(element){return element.getAttribute("data-title").toLowerCase()}function sortCritic(element){return element.getAttribute("data-critic")}"date-created"===value?"true"===localStorage.getItem("dateCreated")?(options={reverse:!1,by:sortByDate},evt.target.parentNode.innerHTML='<input type="radio" name="sort-value" value="date-created"> Date de sortie <i class="fas fa-arrow-up"></i>',localStorage.setItem("dateCreated","false")):(options={reverse:!0,by:sortByDate},evt.target.parentNode.innerHTML='<input type="radio" name="sort-value" value="date-created"> Date de sortie <i class="fas fa-arrow-down"></i>',localStorage.setItem("dateCreated","true")):"title"===value?"true"===localStorage.getItem("title")?(options={reverse:!0,by:sortByTitle},evt.target.parentNode.innerHTML='<input type="radio" name="sort-value" value="title"> Titre <i class="fas fa-arrow-up"></i>',localStorage.setItem("title","false")):(options={reverse:!1,by:sortByTitle},evt.target.parentNode.innerHTML='<input type="radio" name="sort-value" value="title"> Titre <i class="fas fa-arrow-down"></i>',localStorage.setItem("title","true")):"critic"===value&&("true"===localStorage.getItem("critic")?(options={reverse:!1,by:sortCritic},evt.target.parentNode.innerHTML='<input type="radio" name="sort-value" value="critic"> Note <i class="fas fa-arrow-up"></i>',localStorage.setItem("critic","false")):(options={reverse:!0,by:sortCritic},evt.target.parentNode.innerHTML='<input type="radio" name="sort-value" value="critic"> Note <i class="fas fa-arrow-down"></i>',localStorage.setItem("critic","true")));shuffleInstance.sort(options)}.bind(this))}(),function(){var activePeriod=localStorage.getItem("activePeriod");setTimeout(function(){null!=activePeriod&&(optionsButton.value=activePeriod,optionsButton.options[optionsButton.selectedIndex].setAttribute("selected","selected"),handleOptionChange())},100),onButtonChange=function(btnGroup){{var mode;null==(mode=localStorage.getItem("mode"))&&(localStorage.setItem("mode","exclusive"),mode=localStorage.getItem("mode"))}var btn=btnGroup.currentTarget,isActive=btn.classList.contains("active"),btnGroup=btn.getAttribute("data-group");"additive"===mode?(isActive?filters.buttonsArray.splice(filters.buttonsArray.indexOf(btnGroup)):filters.buttonsArray.push(btnGroup),btn.classList.toggle("active")):(function(){for(var children=btn.parentNode.children,i=children.length-1;0<=i;i--)children[i].classList.remove("active")}(),isActive?btn.classList.remove("active"):(btn.classList.add("active"),filters.buttonsArray=buttonsArray.filter(function(button){return button.classList.contains("active")}).map(function(button){return button.getAttribute("data-group")}))),filter()}.bind(this),optionsButton.addEventListener("change",function(){optionsButton.options[optionsButton.selectedIndex].setAttribute("selected","selected"),handleOptionChange(),activePeriod=optionsButton.options[optionsButton.selectedIndex].value,localStorage.setItem("activePeriod",activePeriod)}),buttonsArray.forEach(function(button){button.addEventListener("click",onButtonChange)},this)}(),menuButtonAll.addEventListener("click",function(){menuButtonArray.forEach(function(button){var buttonCriticName=button.children[0].innerHTML;criticNumberBool?(button.classList.remove("active"),localStorage.setItem(buttonCriticName,"false")):(button.classList.add("active"),localStorage.setItem(buttonCriticName,"true"))}),criticNumberBool=criticNumberBool?!(menuButtonAll.children[0].innerHTML='<i class="fas fa-eye" aria-hidden="true"></i> Sélectionner toutes les critiques'):(menuButtonAll.children[0].innerHTML='<i class="fas fa-eye-slash" aria-hidden="true"></i> Désélectionner toutes les critiques',!0)},!1),document.querySelector("#inputToggle").addEventListener("click",toggleMode,!1),tglDarkmode.addEventListener("click",toggleDarkmode,!1),removeItems(),document.getElementById("defaultInput").click(),shortcutId=document.getElementById("shortcut"),(tgl1=document.querySelector(".textfield")).addEventListener("focus",function(){shortcutId.classList.remove("displayNone")}),tgl1.addEventListener("focusout",function(){shortcutId.classList.add("displayNone")}),getDarkmodeStatus(),app=document.querySelectorAll(".tgl-flip"),tgl1=document.getElementById("tgl1"),app&&(tgl1.checked?(divMenu.classList.remove("displayNone"),tgl1.previousElementSibling.style.textDecorationColor="var(--green-color)"):(divMenu.classList.add("displayNone"),tgl1.previousElementSibling.style.textDecorationColor="var(--red-color)"),tgl2.checked?tgl2.previousElementSibling.style.textDecorationColor="var(--green-color)":tgl2.previousElementSibling.style.textDecorationColor="var(--red-color)",Array.from(app).forEach(function(toggle){toggle.addEventListener("click",function(item){var classListName=item.currentTarget.classList[2],classListNameActive=localStorage.getItem(classListName);"criticAllocine"==classListName&&"true"==classListNameActive?divMenu.classList.add("displayNone"):"criticAllocine"==classListName&&"false"==classListNameActive&&divMenu.classList.remove("displayNone");"true"==classListNameActive?(localStorage.setItem(classListName,"false"),item.currentTarget.previousElementSibling.style.textDecorationColor="var(--red-color)"):(localStorage.setItem(classListName,"true"),item.currentTarget.previousElementSibling.style.textDecorationColor="var(--green-color)")}.bind(this),!1)})),menuButtonArray.forEach(function(button){button.addEventListener("click",function(item){var buttonCriticName=item.currentTarget.children[0].innerText,localbuttonCriticName=localStorage.getItem(buttonCriticName);"true"==localbuttonCriticName?(item.currentTarget.classList.remove("active"),localStorage.setItem(buttonCriticName,"false")):("false"==localbuttonCriticName&&item.currentTarget.classList.add("active"),localStorage.setItem(buttonCriticName,"true"))}.bind(this),!1);var buttonCriticName=button.children[0].innerHTML,localbuttonCriticName=localStorage.getItem(buttonCriticName);"true"==localbuttonCriticName?(button.classList.add("active"),criticNumberBool=!0):"false"==localbuttonCriticName?button.classList.remove("active"):(localStorage.setItem(buttonCriticName,"true"),button.classList.add("active"),criticNumberBool=!0)}),menuButtonAll.children[0].innerHTML=criticNumberBool?'<i class="fas fa-eye-slash" aria-hidden="true"></i> Désélectionner toutes les critiques':'<i class="fas fa-eye" aria-hidden="true"></i> Sélectionner toutes les critiques',map={},onkeydown=onkeyup=function(e){e=e||event,map[e.keyCode]="keydown"==e.type,1==map[70]&&1==e.ctrlKey||1==map[70]&&1==e.metaKey?(e.preventDefault(),document.getElementById("filters-search-input").focus(),map[70]=!1):1==map[27]&&(e.preventDefault(),overlay.classList.contains("overlay")?document.location.reload():(document.getElementById("filters-search-input").blur(),map[27]=!1))},burgerMenu=document.getElementById("burger-menu"),document.querySelector(".fa-sliders-h").addEventListener("click",function(){return burgerMenu.classList.add("close"),overlay.classList.add("overlay"),!1}),burgerMenu.addEventListener("click",function(){burgerMenu.classList.remove("close"),overlay.classList.remove("overlay"),document.location.reload()}),app=document.getElementById("typewriter"),new Typewriter(app,{loop:!0,delay:50}).typeString('"T\'as vu quoi comme bon film récemment ?"').pauseFor(2500).deleteAll().typeString('"C\'est quoi le film à ne pas manquer ?"').pauseFor(2500).deleteAll().typeString('"Tu me recommandes quoi en ce moment ?"').pauseFor(2500).start()})};document.addEventListener("DOMContentLoaded",function(){window.main=new DOMLoaded(document.getElementById("grid"))});