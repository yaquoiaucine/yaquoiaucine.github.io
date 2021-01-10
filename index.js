function splitDate(date) {
    var newDate = date.split(" ");

    if (newDate.length === 2) {
        monthNumber = newDate[0];
        yearNumber = newDate[1];
    } else {
        dayNumber = newDate[0];
        monthNumber = newDate[1];
        yearNumber = newDate[2];
    }

    switch (monthNumber) {
        case "janvier":
            monthNumber = "01";
            break;
        case "février":
            monthNumber = "02";
            break;
        case "mars":
            monthNumber = "03";
            break;
        case "avril":
            monthNumber = "04";
            break;
        case "mai":
            monthNumber = "05";
            break;
        case "juin":
            monthNumber = "06";
            break;
        case "juillet":
            monthNumber = "07";
            break;
        case "août":
            monthNumber = "08";
            break;
        case "septembre":
            monthNumber = "09";
            break;
        case "octobre":
            monthNumber = "10";
            break;
        case "novembre":
            monthNumber = "11";
            break;
        case "décembre":
            monthNumber = "12";
            break;
        default:
            monthNumber = "";
            break;
    }

    if (newDate.length === 2) {
        var newFormat = monthNumber + "/" + "1/" + yearNumber;
    } else {
        var newFormat = monthNumber + "/" + dayNumber + "/" + yearNumber;
    }

    return newFormat;
}

const getJSON = require("get-json");
const mailgun = require("mailgun-js");
const fs = require("fs");

getJSON("https://yaquoiaucine.fr/assets/js/data.json", function(error, response) {
    var data = response,
        dataLength = data.data.length,
        text = "<ul>",
        totalKey = "",
        numberDaysArray = [30];

    const DOMAIN = process.env.DOMAIN_KEY;
    const mg = mailgun({
        apiKey: process.env.API_KEY,
        domain: DOMAIN
    });

    for (var i = 0; i < dataLength; i++) {
        var excludeTitles = [
                "Adam",
                "Calvaire",
                "Dragons",
                "Family Romance, LLC",
                "Harry Potter à l'école des sorciers",
                "Raoul Taburin",
                "Shrek 2"
            ],
            excludeCriticnames = [
                "20 Minutes2",
                "CNews2",
                "Cahiers du Cinéma2",
                "Charlie Hebdo2",
                "Chronic&#039;art.com2",
                "CinemaTeaser2",
                "Culturopoing.com2",
                "Ecran Large2",
                "Elle2",
                "L&#039;Ecran Fantastique2",
                "L&#039;Express2",
                "L&#039;Humanité2",
                "La Croix2",
                "Le Figaro2",
                "Le Journal du Dimanche2",
                "Le Monde2",
                "Le Nouvel Observateur2",
                "Le Parisien2",
                "Le Point2",
                "Les Echos2",
                "Les Fiches du Cinéma2",
                "Inrockuptibles2",
                "Libération2",
                "MCinéma.com2",
                "Mad Movies2",
                "Marie Claire2",
                "Metro2",
                "Obejctif-Cinema.com2",
                "Ouest France2",
                "Paris Match2",
                "Positif2",
                "Première2",
                "Rolling Stone2",
                "Starfix2",
                "Studio Ciné Live2",
                "Studio Magazine2",
                "Sud Ouest2",
                "TéléCinéObs2",
                "Télérama2",
                "VSD2",
                "Zurban2"
            ],
            criticNamesObject = data.data[i].allocineData.criticNames,
            criticNamesObjectLength = Object.keys(criticNamesObject).length,
            criticNamesRealLength = data.data[i].allocineData.criticNumber,
            criticBis = "2",
            sum = 0,
            columnNumber = 0,
            newSum = 0;

        if (criticNamesObjectLength != criticNamesRealLength) {
            text += "<li><a href=\"" + data.data[i].allocineData.url + "\">" + data.data[i].allocineData.title + "</a> : " + criticNamesObjectLength + " sur " + criticNamesRealLength + "</li>";
        }

        if (criticNamesObjectLength > 0) {
            for (var key in data.data[i].allocineData.criticNames) {
                if (data.data[i].allocineData.criticNames[key] !== undefined && data.data[i].allocineData.criticNames[key] !== "") {
                    sum += parseInt(data.data[i].allocineData.criticNames[key]);
                    columnNumber += 1;
                }

                if (key.endsWith(criticBis) && !excludeCriticnames.some(str => key.includes(str))) {
                    totalKey += key + ", ";
                }

                newSum = (sum / columnNumber).toFixed(1);
            }
        } else {
            newSum = 0;
        }

        if (data.data[i].allocineData.critic != newSum && !excludeTitles.some(str => data.data[i].allocineData.title.includes(str))) {
            text += "<li><a href=\"" + data.data[i].allocineData.url + "\">" + data.data[i].allocineData.title + "</a> : " + (sum / columnNumber) + " / " + newSum + " / " + data.data[i].allocineData.critic + "</li>";
        }
    }

    text += "<li>Presses non rajoutées : " + totalKey + "</li></ul>";

    const mailgunData = {
        from: process.env.FROM_KEY,
        to: process.env.TO_KEY,
        subject: "Y'a quoi au ciné logs",
        html: text
    };

    if (text != "<ul><li>Presses non rajoutées : </li></ul>") {
        console.log(text);

        mg.messages().send(mailgunData, function(error, body) {
            console.log(body);
        });
    }
});

const compress_images = require("compress-images");
const INPUT_path_to_your_images = "assets/pictures/*.{jpg,JPG,jpeg,JPEG}";
const OUTPUT_path = "assets/pictures/new/";

compress_images(INPUT_path_to_your_images, OUTPUT_path, {
        compress_force: false,
        statistic: true,
        autoupdate: true
    }, false, {
        jpg: {
            engine: "mozjpeg",
            command: ["-quality", "60"]
        }
    }, {
        png: {
            engine: "pngquant",
            command: ["--quality=20-50", "-o"]
        }
    }, {
        svg: {
            engine: "svgo",
            command: "--multipass"
        }
    }, {
        gif: {
            engine: "gifsicle",
            command: ["--colors", "64", "--use-col=web"]
        }
    },
    function(error, completed, statistic) {
        console.log("-------------");
        console.log(error);
        console.log(completed);
        console.log(statistic);
        console.log("-------------");
    }
);