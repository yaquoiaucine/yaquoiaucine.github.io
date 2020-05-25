const getJSON = require("get-json");
const mailgun = require("mailgun-js");

getJSON("https://yaquoiaucine.fr/assets/js/data.json", function(error, response) {
    var data = response,
        dataLength = data.data.length,
        text = "";

    const DOMAIN = process.env.DOMAIN_KEY;
    const mg = mailgun({
        apiKey: process.env.API_KEY,
        domain: DOMAIN
    });

    for (var i = 0; i < dataLength; i++) {
        var criticNamesObject = data.data[i].criticNames,
            criticNamesObjectLength = Object.keys(criticNamesObject).length,
            criticNamesRealLength = data.data[i].criticNumber,
            sum = 0,
            columnNumber = 0,
            newSum = 0;

        if (criticNamesObjectLength != criticNamesRealLength) {
            text += data.data[i].title + ": " + criticNamesObjectLength + " sur " + criticNamesRealLength + "; ";
        }

        if (criticNamesObjectLength > 0) {
            for (var key in data.data[i].criticNames) {
                if (data.data[i].criticNames[key] !== undefined && data.data[i].criticNames[key] !== "") {
                    sum += parseInt(data.data[i].criticNames[key]);
                    columnNumber += 1;
                }

                newSum = (sum / columnNumber).toFixed(1);
            }
        } else {
            newSum = 0;
        }

        if (data.data[i].critic != newSum) {
            text += data.data[i].title + " : " + newSum + " / " + data.data[i].critic + "; ";
        }
    }

    const mailgunData = {
        from: process.env.FROM_KEY,
        to: process.env.TO_KEY,
        subject: "Y'a quoi au ciné logs",
        text: text
    };

    if (text !== "") {
        mg.messages().send(mailgunData, function(error, body) {
            console.log(body);
        });
    }
});