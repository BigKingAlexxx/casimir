'use strict';
const logic = require('../helper_functions/logic');
const daitchMokotoff = require('talisman/phonetics/daitch-mokotoff');

const ZahlIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'ZahlIntent';
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const currentIntent = handlerInput.requestEnvelope.request.intent;
        let speechText = '';
        var lastName = logic.getSlotValue(handlerInput, 'ZahlIntentLastName');
        var firstName = logic.getSlotValue(handlerInput, 'ZahlIntentFirstName'); // = handlerInput.requestEnvelope.request.intent.slots.ZahlIntentFirstName.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        var name = logic.getSlotValue(handlerInput, 'ZahlIntentFirstName');
        var date = logic.getSlotValue(handlerInput, 'Date');
        var startDate = logic.getSlotValue(handlerInput, 'StartDate');
        var endDate = logic.getSlotValue(handlerInput, 'EndDate');
        var corporation = logic.getSlotValue(handlerInput, 'Corporation');
        var zahl = logic.getSlotValue(handlerInput, 'ZahlIntentZahl');
        let result;
        //name = logic.separateFirstLastName(name);
        firstName = name.substring(0, name.indexOf(' '));
        lastName = name.substring(name.indexOf(' ') + 1, name.length);
        console.log(firstName + " " + daitchMokotoff(firstName))
        console.log(lastName + " " + daitchMokotoff(lastName))
        //var email = getSlotValue(handlerInput, 'ZahlIntentEmail');

        //var result = await queryName(firstName, lastName);

        //name = currentIntent.slots.ZahlIntentName.value;
        //speechText = 'Name ist: ' + logic.concatName(name);

        //speechText = 'Eingabe: ' + firstName + ' ' + lastName + '. Ausgabe: ';

        /* for (let i of result) {
            speechText += i.firstName + ' ' + i.lastName + '. '
        } */

        //speechText += ' Köln ' + '<say-as interpret-as="digits">' + recValFirstName + ' ' + recValLastName + '</say-as>.';
        //speechText += currentIntent.slots.ZahlIntentFirstNameSpell.value;
        /* try {
            result = await findNames(firstName, lastName);
            //result = await findAll(name);
            if (result !== false) {
                speechText = `${result.length - 1} Ergebnisse: `;
                for (let i of result) {
                    if (i.hasOwnProperty('firstName')) speechText += i.firstName + ' ' + i.lastName + '. ';
                    if (i.hasOwnProperty('queryLevel')) speechText += 'Regex-Level: ' + i.queryLevel;
                }
                speechText = `${result.length} Ergebnisse: `;
                for (let i of result) {
                    speechText += i.firstName + ' ' + i.lastName + '. ';
                }
            } else speechText = 'Keine Ergebnisse.'
        } catch (error) {
            speechText = 'Tut mir leid, es ist ein Fehler aufgetreten. Bitte versuche es später nochmal.'
            console.log(`Intent: ${handlerInput.requestEnvelope.request.intent.name}: message: ${error.message}`);
        } */
        speechText = "Start: " + startDate + ", Ende: " + endDate;
        speechText = date;
        speechText = corporation;
        speechText = "Replace: " + logic.replaceNumberLiterals(zahl) + " Literal: " + zahl;
        speechText = corporation;
        speechText = speechText.replaceAll(/&/gm, '&amp;');
        speechText = logic.spellOut(speechText);

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withShouldEndSession(false)
            .getResponse();

    }
};

const TestIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'TestIntent');
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        var slotA = request.intent.slots.TestSlotA;
        var slotAVal = request.intent.slots.TestSlotA.value;

        var slotB = request.intent.slots.TestSlotB;
        var slotBVal = request.intent.slots.TestSlotB.value;

        if (!slotA.hasOwnProperty("value")) {
            return handlerInput.responseBuilder
                .addElicitSlotDirective('TestSlotA')
                .speak('Gib was für A ein.')
                .getResponse();
        } else {
            const speechText = slotAVal;
            console.log(handlerInput.attributesManager.getSessionAttributes());
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .getResponse();
        }
    }
};

module.exports = {
    ZahlIntentHandler,
    TestIntentHandler
}