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
                "Harry Potter à l'école des sorciers"
            ],
            excludeCriticnames = [
                "20 Minutes2",
                "Cahiers du Cinéma2",
                "Elle2",
                "L&#039;Express2",
                "La Croix2",
                "Le Figaro2",
                "Le Journal du Dimanche2",
                "Le Monde2",
                "Le Nouvel Observateur2",
                "Le Parisien2",
                "Le Point2",
                "Les Fiches du Cinéma2",
                "Libération2",
                "Marie Claire2",
                "Ouest France2",
                "Paris Match2",
                "Positif2",
                "Première2",
                "Studio Magazine2",
                "Sud Ouest2",
                "Télérama2"
            ],
            criticNamesObject = data.data[i].criticNames,
            criticNamesObjectLength = Object.keys(criticNamesObject).length,
            criticNamesRealLength = data.data[i].criticNumber,
            criticBis = "2",
            sum = 0,
            columnNumber = 0,
            newSum = 0;

        if (criticNamesObjectLength != criticNamesRealLength) {
            text += "<li><a href=\"" + data.data[i].url + "\">" + data.data[i].title + "</a> : " + criticNamesObjectLength + " sur " + criticNamesRealLength + "</li>";
        }

        if (criticNamesObjectLength > 0) {
            for (var key in data.data[i].criticNames) {
                if (data.data[i].criticNames[key] !== undefined && data.data[i].criticNames[key] !== "") {
                    sum += parseInt(data.data[i].criticNames[key]);
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

        if (data.data[i].critic != newSum && !excludeTitles.some(str => data.data[i].title.includes(str))) {
            text += "<li><a href=\"" + data.data[i].url + "\">" + data.data[i].title + "</a> : " + (sum / columnNumber) + " / " + newSum + " / " + data.data[i].critic + "</li>";
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

    var resDataTemp1 = data.data.filter((resDataTemp2, index, self) =>
        index === self.findIndex((t) => (t.url === resDataTemp2.url)));

    for (var i = 0; i < numberDaysArray.length; i++) {
        var numberDays = numberDaysArray[i];
        var endDate = new Date();
        var startDate = new Date();
        startDate.setDate(endDate.getDate() - parseInt(numberDays));

        var resDataTemp3 = resDataTemp1.filter(function(d) {
            var date = splitDate(d.date[0].dateName);
            var newDate = new Date(date);

            return newDate >= startDate && newDate <= endDate;
        });

        var resData = JSON.stringify(resDataTemp1);
        var resData2 = JSON.stringify(resDataTemp3);

        fs.writeFileSync("./assets/js/data.json", resData);
        var dataFile = fs.readFileSync("./assets/js/data.json");
        var fd = fs.openSync("./assets/js/data.json", "w+");
        var insert = Buffer.from("{\"data\":");
        fs.writeSync(fd, insert, 0, insert.length, 0);
        fs.writeSync(fd, dataFile, 0, dataFile.length, insert.length);
        fs.appendFileSync("./assets/js/data.json", "}");
        fs.close(fd, (err) => {
            if (err) throw err;
        });

        fs.writeFileSync("./assets/js/data" + numberDays + ".json", resData2);
        var dataFile = fs.readFileSync("./assets/js/data" + numberDays + ".json");
        var fd = fs.openSync("./assets/js/data" + numberDays + ".json", "w+");
        var insert = Buffer.from("{\"data\":");
        fs.writeSync(fd, insert, 0, insert.length, 0);
        fs.writeSync(fd, dataFile, 0, dataFile.length, insert.length);
        fs.appendFileSync("./assets/js/data" + numberDays + ".json", "}");
        fs.close(fd, (err) => {
            if (err) throw err;
        });
    }
});
