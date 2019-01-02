'use strict';
const mongodb = require('mongodb');
const numberLiterals = [{ "wert": "0", "wort": "null" }, { "wert": "1", "wort": "eins" }, { "wert": "2", "wort": "zwei" }, { "wert": "3", "wort": "drei" }, { "wert": "4", "wort": "vier" }, { "wert": "5", "wort": "fünf" }, { "wert": "6", "wort": "sechs" }, { "wert": "7", "wort": "sieben" }, { "wert": "8", "wort": "acht" }, { "wert": "9", "wort": "neun" }, { "wert": "10", "wort": "zehn" }, { "wert": "11", "wort": "elf" }, { "wert": "12", "wort": "zwölf" }, { "wert": "13", "wort": "dreizehn" }, { "wert": "14", "wort": "vierzehn" }, { "wert": "15", "wort": "fünfzehn" }, { "wert": "16", "wort": "sechzehn" }, { "wert": "17", "wort": "siebzehn" }, { "wert": "18", "wort": "achtzehn" }, { "wert": "19", "wort": "neunzehn" }, { "wert": "20", "wort": "zwanzig" }, { "wert": "21", "wort": "einundzwanzig" }, { "wert": "22", "wort": "zweiundzwanzig" }, { "wert": "23", "wort": "dreiundzwanzig" }, { "wert": "24", "wort": "vierundzwanzig" }, { "wert": "25", "wort": "fünfundzwanzig" }, { "wert": "26", "wort": "sechsundzwanzig" }, { "wert": "27", "wort": "siebenundzwanzig" }, { "wert": "28", "wort": "achtundzwanzig" }, { "wert": "29", "wort": "neunundzwanzig" }, { "wert": "30", "wort": "dreißig" }, { "wert": "31", "wort": "einunddreißig" }, { "wert": "32", "wort": "zweiunddreißig" }, { "wert": "33", "wort": "dreiunddreißig" }, { "wert": "34", "wort": "vierunddreißig" }, { "wert": "35", "wort": "fünfunddreißig" }, { "wert": "36", "wort": "sechsunddreißig" }, { "wert": "37", "wort": "siebenunddreißig" }, { "wert": "38", "wort": "achtunddreißig" }, { "wert": "39", "wort": "neununddreißig" }, { "wert": "40", "wort": "vierzig" }, { "wert": "41", "wort": "einundvierzig" }, { "wert": "42", "wort": "zweiundvierzig" }, { "wert": "43", "wort": "dreiundvierzig" }, { "wert": "44", "wort": "vierundvierzig" }, { "wert": "45", "wort": "fünfundvierzig" }, { "wert": "46", "wort": "sechsundvierzig" }, { "wert": "47", "wort": "siebenundvierzig" }, { "wert": "48", "wort": "achtundvierzig" }, { "wert": "49", "wort": "neunundvierzig" }, { "wert": "50", "wort": "fünfzig" }, { "wert": "51", "wort": "einundfünfzig" }, { "wert": "52", "wort": "zweiundfünfzig" }, { "wert": "53", "wort": "dreiundfünfzig" }, { "wert": "54", "wort": "vierundfünfzig" }, { "wert": "55", "wort": "fünfundfünfzig" }, { "wert": "56", "wort": "sechsundfünfzig" }, { "wert": "57", "wort": "siebenundfünfzig" }, { "wert": "58", "wort": "achtundfünfzig" }, { "wert": "59", "wort": "neunundfünfzig" }, { "wert": "60", "wort": "sechzig" }, { "wert": "61", "wort": "einundsechzig" }, { "wert": "62", "wort": "zweiundsechzig" }, { "wert": "63", "wort": "dreiundsechzig" }, { "wert": "64", "wort": "vierundsechzig" }, { "wert": "65", "wort": "fünfundsechzig" }, { "wert": "66", "wort": "sechsundsechzig" }, { "wert": "67", "wort": "siebenundsechzig" }, { "wert": "68", "wort": "achtundsechzig" }, { "wert": "69", "wort": "neunundsechzig" }, { "wert": "70", "wort": "siebzig" }, { "wert": "71", "wort": "einundsiebzig" }, { "wert": "72", "wort": "zweiundsiebzig" }, { "wert": "73", "wort": "dreiundsiebzig" }, { "wert": "74", "wort": "vierundsiebzig" }, { "wert": "75", "wort": "fünfundsiebzig" }, { "wert": "76", "wort": "sechsundsiebzig" }, { "wert": "77", "wort": "siebenundsiebzig" }, { "wert": "78", "wort": "achtundsiebzig" }, { "wert": "79", "wort": "neunundsiebzig" }, { "wert": "80", "wort": "achtzig" }, { "wert": "81", "wort": "einundachtzig" }, { "wert": "82", "wort": "zweiundachtzig" }, { "wert": "83", "wort": "dreiundachtzig" }, { "wert": "84", "wort": "vierundachtzig" }, { "wert": "85", "wort": "fünfundachtzig" }, { "wert": "86", "wort": "sechsundachtzig" }, { "wert": "87", "wort": "siebenundachtzig" }, { "wert": "88", "wort": "achtundachtzig" }, { "wert": "89", "wort": "neunundachtzig" }, { "wert": "90", "wort": "neunzig" }, { "wert": "91", "wort": "einundneunzig" }, { "wert": "92", "wort": "zweiundneunzig" }, { "wert": "93", "wort": "dreiundneunzig" }, { "wert": "94", "wort": "vierundneunzig" }, { "wert": "95", "wort": "fünfundneunzig" }, { "wert": "96", "wort": "sechsundneunzig" }, { "wert": "97", "wort": "siebenundneunzig" }, { "wert": "98", "wort": "achtundneunzig" }, { "wert": "99", "wort": "neunundneunzig" }, { "wert": "100", "wort": "einhundert" }, { "wert": "200", "wort": "zweihundert" }, { "wert": "300", "wort": "dreihundert" }, { "wert": "400", "wort": "vierhundert" }, { "wert": "500", "wort": "fünfhundert" }, { "wert": "600", "wort": "sechshundert" }, { "wert": "700", "wort": "siebenhundert" }, { "wert": "800", "wort": "achthundert" }, { "wert": "900", "wort": "neunhundert" }, { "wert": "1000", "wort": "eintausend" }];

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function replaceEmailSymbols(string) {
    string = string.replace(/\./g, "");

    string = string.replaceAll('\\bat\\b', '@');
    string = string.replaceAll('\\bed\\b', '@');
    string = string.replaceAll('\\bet\\b', '@');
    string = string.replaceAll('\\äh\\b', '@');

    string = string.replaceAll('\\dot\\b', '.');
    string = string.replaceAll('\\punkt\\b', '.');
    string = string.replaceAll('\\minus\\b', '-');
    string = string.replaceAll('\\strich\\b', '-');
    string = string.replaceAll('\\bindestrich\\b', '-');
    string = string.replaceAll('\\unterstrich\\b', '_');
    string = string.replace(/\s/g, "");
    return string;
}

function replaceEmailNames(str, firstName, lastName, companyName) {
    str = str.replaceAll('vorname', firstName);
    str = str.replaceAll('nachname', lastName);
    str = str.replaceAll('firmenname', companyName);

    return str.toLowerCase();
}

function concatName(string) {
    var matches = string.match(/\b(\w)/g); // ['J','S','O','N']
    var acronym = matches.join(''); // JSON
    acronym = acronym.toLowerCase();
    acronym = acronym.charAt(0).toUpperCase() + acronym.slice(1);
    return string.includes(" ") ? acronym : string;
}

function fistLetterUpperCase(string) {
    string = string.charAt(0).toUpperCase() + string.slice(1);
    return string;
}

/* function replaceNumberLiterals(string) {
    var wordCount = getWordCount(string);
    for (var j = 0; j < wordCount; j++) {
        for (var i = 0; i < numberLiterals.length; i++) {
            string = string.replace(numberLiterals[i].wort, numberLiterals[i].wert);
        }
    }
    string = string.replace(/\s/g, "");
    return string;
} */

/* function replaceNumberLiterals(string) {
    for (let i of numberLiterals) {
        if (i.wort === string) return i.wert;
    }
} */

function replaceNumberLiterals(string) {
    let arr = string.split(" ");
    let result = '';
    for (let i = 0; i < arr.length; i++) {
        if (arr[i + 1] === "und") {
            for (let k of numberLiterals) {
                if (k.wort === (arr[i] + arr[i + 1] + arr[i + 2])) result += k.wert;
            }
            i += 2;
        } else if (arr[i + 1] === "hundert") {
            for (let k of numberLiterals) {
                if (k.wort === (arr[i] + arr[i + 1])) result += k.wert;
            }
            i++;
        } else if (arr[i + 1] === "tausend") {
            for (let k of numberLiterals) {
                if (k.wort === (arr[i] + arr[i + 1])) result += k.wert;
            }
            i++;
        } else {
            for (let k of numberLiterals) {
                if (k.wort === arr[i]) result += k.wert;
            }
        }
    }
    return result;
}

console.log(replaceNumberLiterals("null eins sieben sechs acht drei und dreißig sechs und vierzig neun vier sechs fünf hundert ein tausend"));

function getWordCount(string) {
    return string.split(" ").length;
}

function separateFirstLastName(string) {
    let name = string.split(" ");
    console.log(name.length)
    let firstName = '';
    let lastName = '';
    for (let i = 0; i < name.length; i++) {
        if (i === 0) firstName = name[i];
        else lastName += name[i];
    }
    return `${firstName} ${lastName}`;
}

var weekday = new Array(7);
weekday[0] = "Sonntag";
weekday[1] = "Montag";
weekday[2] = "Dienstag";
weekday[3] = "Mittwoch";
weekday[4] = "Donnerstag";
weekday[5] = "Freitag";
weekday[6] = "Samstag";

function getWeekDay(date) {
    var d = new Date(date);
    return weekday[d.getDay()];
}

function getNextDayOfWeekDate(dayOfWeek) {
    let d = weekday.indexOf(dayOfWeek);
    let date = new Date();
    date.setDate(date.getDate() + (d - 1 - date.getDay() + 7) % 7 + 1);
    return date;
}

/**
 * @param {String} date Das Datum 
 */
function getDateString(date) {
    let today = new Date(date || new Date());
    let dd = today.getDate();

    let mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    if (dd < 10) {
        dd = `0${dd}`;
    }

    if (mm < 10) {
        mm = `0${mm}`;
    }
    today = `${yyyy}-${mm}-${dd}`;
    return today;
}

function getDaysInMonth(date) {
    let year = date.substring(0, 4);
    let month = date.substring(5, date.length);
    // Here January is 1 based
    //Day 0 is the last day in the previous month
    return new Date(year, month, 0).getDate();
    // Here January is 0 based
    // return new Date(year, month+1, 0).getDate();
};

function getMonthLiteral(date) {
    let year = date.substring(0, 4);
    let month = date.substring(5, 7);
    const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni",
        "Juli", "August", "September", "Oktober", "November", "Dezember"];
    const d = new Date(year, month, 0);
    return monthNames[d.getMonth()];
}

function getDateOfISOWeek(w, y) {
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}

function checkDateFormat(date) {
    // Januar -> 2019-01
    // letzten Monat -> 2018-11
    // morgen -> 2018-12-18
    // letzte Woche -> 2018-W50
    // vor fünf Tagen -> 2018-12-12
    // erster Januar zwei tausend -> 2000-01-01
    // letztes Jahr -> 2017
    // zwei tausend achtzehn -> 2018-XX-XX

    // if length 4
    // if length 7 
    // if length 10
    // if includes "W"
    // if includes "X"

    if (date.length === 4) {
        return date;
    } else if (date.length === 7) {
        //return getMonthLiteral(date) + " " + new Date(date).getFullYear();
        return date;
    } else if (date.length === 10 && !date.includes("X")) {
        return date;
    } else if (date.includes("W")) {
        let week = date.substring(date.indexOf("W") + 1, date.length);
        let year = date.substring(0, 4);
        return getDateString(getDateOfISOWeek(week, year));
    } else if (date.includes("X")) {
        let year = date.substring(0, 4);
        return year;
    } else {
        return date;
    }
}

function getDaysDiff(date1, date2) {
    return convertMS((new Date(date2) - new Date(date1))).day;
}

function convertMS( milliseconds ) {
    var day, hour, minute, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return {
        day: day,
        hour: hour,
        minute: minute,
        seconds: seconds
    };
}

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false; // return false when Obj is full
    }
    return true; // returns true when Obj is empty
}

function getSlotValue(handlerInput, slot) {
    if (handlerInput.requestEnvelope.request.intent.slots
        && handlerInput.requestEnvelope.request.intent.slots[slot]
        && handlerInput.requestEnvelope.request.intent.slots[slot].resolutions
        && handlerInput.requestEnvelope.request.intent.slots[slot].resolutions.resolutionsPerAuthority[0]
        && handlerInput.requestEnvelope.request.intent.slots[slot].resolutions.resolutionsPerAuthority[0].values
        && handlerInput.requestEnvelope.request.intent.slots[slot].resolutions.resolutionsPerAuthority[0].values[0]
        && handlerInput.requestEnvelope.request.intent.slots[slot].resolutions.resolutionsPerAuthority[0].values[0].value
        && handlerInput.requestEnvelope.request.intent.slots[slot].resolutions.resolutionsPerAuthority[0].values[0].value.name !== undefined) {
        return handlerInput.requestEnvelope.request.intent.slots[slot].resolutions.resolutionsPerAuthority[0].values[0].value.name;
    } else if (handlerInput.requestEnvelope.request.intent.slots
        && handlerInput.requestEnvelope.request.intent.slots[slot]
        && handlerInput.requestEnvelope.request.intent.slots[slot].value) return handlerInput.requestEnvelope.request.intent.slots[slot].value;
    return '';
}

function getSlotID(handlerInput, slot) {
    if (handlerInput.requestEnvelope.request.intent.slots[slot]
        && handlerInput.requestEnvelope.request.intent.slots[slot].resolutions
        && handlerInput.requestEnvelope.request.intent.slots[slot].resolutions.resolutionsPerAuthority[0]
        && handlerInput.requestEnvelope.request.intent.slots[slot].resolutions.resolutionsPerAuthority[0].values
        && handlerInput.requestEnvelope.request.intent.slots[slot].resolutions.resolutionsPerAuthority[0].values[0]
        && handlerInput.requestEnvelope.request.intent.slots[slot].resolutions.resolutionsPerAuthority[0].values[0].value
        && handlerInput.requestEnvelope.request.intent.slots[slot].resolutions.resolutionsPerAuthority[0].values[0].value.name !== undefined) {
        return handlerInput.requestEnvelope.request.intent.slots[slot].resolutions.resolutionsPerAuthority[0].values[0].value.id;
    }
    return '';
}

function calcOpportunityValues(property, entry) {
    let query;
    switch (property.id) {
        case 'unit_cost':
            query = {
                find: { name: entry.name }, set: {
                    $set: {
                        "licences.unit_cost": property.value, "volume_of_orders.value": entry.licences.units * property.value,
                        "weighted_value.value": new mongodb.Double(((entry.probability / 100) * (entry.licences.units * property.value)).toFixed(2))
                    }
                }
            };
            break;

        case 'number_of_licences':
            query = {
                find: { name: entry.name }, set: {
                    $set: {
                        "licences.units": property.value, "volume_of_orders.value": property.value * entry.licences.unit_cost,
                        "weighted_value.value": new mongodb.Double(((entry.probability / 100) * (property.value * entry.licences.unit_cost)).toFixed(2))
                    }
                }
            };
            break;

        case 'volume_of_orders':
            query = {
                find: { name: entry.name }, set: {
                    $set: {
                        "volume_of_orders.value": property.value, "weighted_value.value": new mongodb.Double(((entry.probability / 100) * property.value).toFixed(2))
                    }
                }
            };
            break;

        case 'probability':
            query = {
                find: { name: entry.name }, set: {
                    $set: {
                        probability: property.value, "weighted_value.value": new mongodb.Double(((property.value / 100) * entry.volume_of_orders.value).toFixed(2))
                    }
                }
            };
            break;

        default: throw new Error("calcOpportunityValues(): no matching ID.");
    }
    return query;
}

function spellOut(str) {
    if (str.includes('CAS')) {
        str = str.replace(/CAS/gm, '<say-as interpret-as="spell-out">CAS</say-as>');
        return str;
    }
    return str;
}

module.exports = {
    replaceEmailSymbols,
    concatName,
    fistLetterUpperCase,
    replaceNumberLiterals,
    separateFirstLastName,
    getWeekDay,
    getNextDayOfWeekDate,
    getDateString,
    replaceEmailNames,
    getDaysInMonth,
    getMonthLiteral,
    checkDateFormat,
    getDaysDiff,
    isEmpty,
    getSlotValue,
    getSlotID,
    calcOpportunityValues,
    spellOut
}