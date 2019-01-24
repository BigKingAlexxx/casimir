'use strict';
const logic = require('../helper_functions/logic');

function getEmployeeSpeechText(intent, result) {
    let speechText = '';
    let email = result[0].email;

    switch (intent) {
        case 'salary':
            speechText = 'Das Gehalt von ' + result[0].firstName + ' ' + result[0].lastName + ' beträgt ' + '<say-as interpret-as="cardinal">' + result[0]['salary'] + '</say-as>';
            speechText += '. Soll ich es wiederholen?';
            break;

        case 'phone':
            speechText = 'Die Nummer von ' + result[0].firstName + ' ' + result[0].lastName + ' lautet ' + '<say-as interpret-as="digits">' + (result[0]['phone']).replace(/(.{3})/g, '$&' + '<break time="0.3s" />');
            speechText += '</say-as>' + '. Soll ich es wiederholen?';
            break;

        case 'date of joining':
            speechText = result[0].firstName + ' ' + result[0].lastName + ' ist am ' + (result[0]['date of joining']) + ' in die Firma eingetreten';
            speechText += '. Soll ich es wiederholen?';
            break;

        case 'email':
            if (email.includes('@cas.de')) {
                email = email.substring(0, email.indexOf('@'));
                email += '@<say-as interpret-as="spell-out">cas.de</say-as>'
                speechText = 'Die Email-Adresse von ' + result[0].firstName + ' ' + result[0].lastName + ' lautet ' + email;
                speechText += '. Soll ich es wiederholen?';
            } else {
                speechText = 'Die Email-Adresse von ' + result[0].firstName + ' ' + result[0].lastName + ' lautet ' + (result[0]['email']);
                speechText += '. Soll ich es wiederholen?';
            }

            break;

        case 'allInfo':
            if (email.includes('@cas.de')) {
                email = email.substring(0, email.indexOf('@'));
                email += '@<say-as interpret-as="spell-out">cas.de</say-as>'
                speechText = result[0].firstName + ' ' + result[0].lastName + ' ist am ' + result[0]['date of joining'] + ' in die Firma eingetreten.';
                speechText += ' Das Gehalt beträgt ' + '<say-as interpret-as="cardinal">' + result[0]['salary'] + '</say-as>'
                speechText += ', die Nummer ist ' + '<say-as interpret-as="digits">' + (result[0]['phone']).replace(/(.{3})/g, '$&' + '<break time="0.3s" />') + '</say-as>';
                speechText += ' und die Email-Adresse lautet ' + email;
                speechText += '. Soll ich es wiederholen?';
            } else {
                speechText = result[0].firstName + ' ' + result[0].lastName + ' ist am ' + result[0]['date of joining'] + ' in die Firma eingetreten.';
                speechText += ' Das Gehalt beträgt ' + '<say-as interpret-as="cardinal">' + result[0]['salary'] + '</say-as>'
                speechText += ', die Nummer ist ' + '<say-as interpret-as="digits">' + (result[0]['phone']).replace(/(.{3})/g, '$&' + '<break time="0.3s" />') + '</say-as>';
                speechText += ' und die Email-Adresse lautet ' + (result[0]['email']);
                speechText += '. Soll ich es wiederholen?';
            }
            break;
    }
    return speechText;
}

function getAppointmentSpeechText(slot, i, date) {
    let speechText = '';
    if (slot === 'dayOfWeek' || slot === 'date') {
        if (date.length === 7) {
            if (i.place === 'weiter' && i.description !== 'weiter') {
                speechText += `Termin <emphasis> ${i.name} </emphasis> am ${i.date} zwischen ${i.startTime}` +
                    ` und ${i.endTime}. Die Beschreibung lautet: ${i.description}. `
            } else if (i.description === 'weiter' && i.place !== 'weiter') {
                speechText += `Termin <emphasis> ${i.name} </emphasis> am ${i.date} zwischen ${i.startTime}` +
                    ` und ${i.endTime} in ${i.place}.`
            } else if ((i.place === 'weiter') && (i.description === 'weiter')) {
                speechText += `Termin <emphasis> ${i.name} </emphasis> am ${i.date} zwischen ${i.startTime}` +
                    ` und ${i.endTime}. `
            } else {
                speechText += `Termin <emphasis> ${i.name} </emphasis> am ${i.date} zwischen ${i.startTime}` +
                    ` und ${i.endTime} in ${i.place}. Die Beschreibung lautet: ${i.description}. `
            }
        } else {
            if (i.place === 'weiter' && i.description !== 'weiter') {
                speechText += `Termin <emphasis> ${i.name} </emphasis> zwischen ${i.startTime}` +
                    ` und ${i.endTime}. Die Beschreibung lautet: ${i.description}. `
            } else if (i.description === 'weiter' && i.place !== 'weiter') {
                speechText += `Termin <emphasis> ${i.name} </emphasis> zwischen ${i.startTime}` +
                    ` und ${i.endTime} in ${i.place}.`
            } else if ((i.place === 'weiter') && (i.description === 'weiter')) {
                speechText += `Termin <emphasis> ${i.name} </emphasis> zwischen ${i.startTime}` +
                    ` und ${i.endTime}. `
            } else {
                speechText += `Termin <emphasis> ${i.name} </emphasis> zwischen ${i.startTime}` +
                    ` und ${i.endTime} in ${i.place}. Die Beschreibung lautet: ${i.description}. `
            }
        }
    } else {
        if (i.place === 'weiter' && i.description !== 'weiter') {
            speechText += `Du hast den Termin <emphasis> ${i.name} </emphasis> am ${logic.getWeekDay(i.date)} den ${i.date} zwischen ${i.startTime}` +
                ` und ${i.endTime}. Die Beschreibung lautet: ${i.description}. `
        } else if (i.description === 'weiter' && i.place !== 'weiter') {
            speechText += `Du hast den Termin <emphasis> ${i.name} </emphasis> am ${logic.getWeekDay(i.date)} den ${i.date} zwischen ${i.startTime}` +
                ` und ${i.endTime} in ${i.place}. `
        } else if (i.place === 'weiter' && i.description === 'weiter') {
            speechText += `Du hast den Termin <emphasis> ${i.name} </emphasis> am ${logic.getWeekDay(i.date)} den ${i.date} zwischen ${i.startTime}` +
                ` und ${i.endTime}. `
        } else {
            speechText += `Du hast den Termin <emphasis> ${i.name} </emphasis> am ${logic.getWeekDay(i.date)} den ${i.date} zwischen ${i.startTime}` +
                ` und ${i.endTime} in ${i.place}. Die Beschreibung lautet: ${i.description}. `
        }
    }
    return speechText;
}

function getSatisfactionSpeechText(result) {
    let speechText = '';
    let sum = result[0].Fan + result[1].Sympathisant + result[2].Gefangener + result[3].Söldner + result[4].Gegner;
    let fan = Math.round((result[0].Fan / sum) * 100);
    let sympathizer = Math.round((result[1].Sympathisant / sum) * 100);
    let prisoner = Math.round((result[2].Gefangener / sum) * 100);
    let mercenary = Math.round((result[3].Söldner / sum) * 100);
    let enemy = Math.round((result[4].Gegner / sum) * 100);

    speechText = `${fan} % deiner Kunden sind Fans, ${sympathizer} % sind Sympathisanten,` +
        ` ${prisoner} % sind Gefangene, ${mercenary} % sind Söldner und ${enemy} % sind Gegner.`
    return speechText;
}

module.exports = {
    getEmployeeSpeechText,
    getAppointmentSpeechText,
    getSatisfactionSpeechText
}