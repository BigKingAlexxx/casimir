'use strict';
const logic = require('../helper_functions/logic');
const koeln = require('../helper_functions/koeln');
const query_mongo = require('../helper_functions/query_mongo');

const NewContactIntentHandler = { //Noch Raumnummer und Abteilung unso einfügen, dass man unterscheiden kann wenn Doppelte gibt.
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'NewContactIntent';
    },
    handle(handlerInput) {

        const request = handlerInput.requestEnvelope.request;
        const currentIntent = handlerInput.requestEnvelope.request.intent;
        var firstName = currentIntent.slots.FirstName.value;
        var lastName = currentIntent.slots.UserInputLastName.value;
        var companyName = logic.getSlotValue(handlerInput, 'CompanyName');//currentIntent.slots.CompanyName.value;
        var mobileNum = currentIntent.slots.MobileNum.value;
        var emailAddress = currentIntent.slots.UserInputEmail.value;

        if (request.dialogState !== 'COMPLETED') {
            return handlerInput.responseBuilder
                .addDelegateDirective(currentIntent)
                .getResponse();
        } else {
            if (!currentIntent.slots.EmailSurrogate.value) { console.log("nicht email Surrogate")
                lastName = logic.concatName(lastName);
                emailAddress = logic.replaceEmailSymbols(emailAddress);
                emailAddress = logic.replaceEmailNames(emailAddress, firstName, lastName, companyName);
            } else { console.log("doch email Surrogate")
                lastName = logic.concatName(lastName);
                emailAddress = logic.replaceEmailSymbols(emailAddress);
            }

            mobileNum = logic.replaceNumberLiterals(mobileNum);
            var data = {
                cologne: { first: koeln(firstName), last: koeln(lastName) },
                "firstName": logic.fistLetterUpperCase(firstName), "lastName": logic.fistLetterUpperCase(lastName), "companyName": companyName, "mobileNum": mobileNum, "email": emailAddress
            };
            query_mongo.insertIntoMongo(data, 'Contacts');
            const speechText = `Ok ich habe ${firstName} ${lastName}, Firma ${logic.spellOut(companyName)}, Nummer <say-as interpret-as="digits">${mobileNum}</say-as>, E-Mail ${emailAddress} hinzugefügt. Kann ich noch was für dich tun?`;

            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .withShouldEndSession(false)
                .getResponse();
        }

    }
};

const NewAppointmentIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'NewAppointmentIntent';
    },
    handle(handlerInput) {

        const userId = handlerInput.requestEnvelope.session.user.userId;
        const request = handlerInput.requestEnvelope.request;
        const currentIntent = handlerInput.requestEnvelope.request.intent;
        var name = currentIntent.slots.AppointmentName.value;
        var date = currentIntent.slots.AppointmentDate.value;
        var startTime = currentIntent.slots.AppointmentStartTime.value;
        var endTime = currentIntent.slots.AppointmentEndTime.value;
        var place = currentIntent.slots.UserInputAppointmentPlace.value;
        var description = currentIntent.slots.AppointmentDescription.value;

        /* wenn ich nicht completed bin delegate ich ganz normal.
        Wenn ich an einer abzweigung bin handle ich manuell.
        am ende ein einzelnes if wenn status completed ist */

        if (request.dialogState !== 'COMPLETED') {
            return handlerInput.responseBuilder
                .addDelegateDirective(currentIntent)
                .getResponse();
        } else {
            var data = { "userId": userId, "name": name, "date": date, "startTime": startTime, "endTime": endTime, "place": place, "description": description };
            query_mongo.insertIntoMongo(data, 'Appointments');

            const speechText = 'Ok ich habe den Termin' + name + ' am ' + date + ' von ' + startTime + ' bis ' + endTime + ' hinzugefügt. Kann ich noch was für dich tun?';

            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .withShouldEndSession(false)
                .getResponse();
        }

    }
};

const EditEntryIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'EditEntryIntent';
    },
    async handle(handlerInput) {
        let sessionattributes = handlerInput.attributesManager.getSessionAttributes();
        const request = handlerInput.requestEnvelope.request;
        const currentIntent = handlerInput.requestEnvelope.request.intent;
        let speechText = '';
        const companyName = logic.getSlotValue(handlerInput, 'EditEntryIntentCorporation');
        const entryPropertyValue = parseInt(logic.getSlotValue(handlerInput, 'EditEntryIntentValue'));
        const entryPropertyName = logic.getSlotValue(handlerInput, 'EditEntryIntentProperty');
        const entryPropertyID = logic.getSlotID(handlerInput, 'EditEntryIntentProperty');
        const entryProperty = { name: entryPropertyName, id: entryPropertyID, value: entryPropertyValue };


        if (entryPropertyID && companyName && entryPropertyValue) {
            try {
                const result = await query_mongo.queryMongoDB({ name: companyName }, 'Opportunities');
                if (result.length === 0 || logic.isEmpty(result[0])) speechText = `Ich habe zu ${companyName} keinen Eintrag gefunden.`
                else {
                    const query = logic.calcOpportunityValues(entryProperty, result[0]);
                    const newResult = await query_mongo.queryAndUpdate(query, 'Opportunities');
                    speechText = `Ok, ich habe den Eintrag ${entryPropertyName} für ${companyName} geändert. Der neue Wert beträgt jetzt <say-as interpret-as='cardinal'>${entryPropertyValue}.</say-as>`;
                }
                speechText += ' Kann ich noch was für dich tun?'
            } catch (error) {
                speechText = 'Tut mir leid, es ist ein Fehler aufgetreten. Bitte versuche es später nochmal.'
                console.log(`Intent: ${handlerInput.requestEnvelope.request.intent.name}: message: ${error.message}`);
            }
        } else {
            speechText = 'Tut mir leid, das habe ich nicht verstanden. Bitte wiederhole es nochmal.'
        }

        //handlerInput.attributesManager.setSessionAttributes(sessionattributes);

        if (request.dialogState !== 'COMPLETED') {
            return handlerInput.responseBuilder
                .addDelegateDirective(currentIntent)
                .getResponse();
        } else {

            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .withShouldEndSession(false)
                .getResponse();
        }
    }
};

const AddNoteIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AddNoteIntent';
    },
    handle(handlerInput) {
        let sessionattributes = handlerInput.attributesManager.getSessionAttributes();
        const request = handlerInput.requestEnvelope.request;
        const currentIntent = handlerInput.requestEnvelope.request.intent;
        let note = logic.getSlotValue(handlerInput, 'Note');
        note = ' ' + note + '.';
        let speechText = '';

        if (sessionattributes.hasOwnProperty('LastIntent') && sessionattributes.LastIntent.name === 'QueryProjectIntent') {
            const result = sessionattributes.LastIntent.result;

            if (sessionattributes.LastIntent.hasOwnProperty('MoreInfoIntentNumber')) {
                const projectNumber = sessionattributes.LastIntent.MoreInfoIntentNumber;
                query_mongo.updateNotes(result[projectNumber - 1].name, note).then().catch(console.error);
                speechText = `Ok, ich habe die Notiz ${note} hinzugefügt.`;
            }

            if (sessionattributes.LastIntent.hasOwnProperty('amountDone')) {
                const amountDone = sessionattributes.LastIntent.amountDone;
                query_mongo.updateNotes(result[amountDone - 1].name, note).then().catch(console.error);
                speechText = `Ok, ich habe die Notiz ${note} hinzugefügt.`;
            }
        }

        speechText += " Kann ich noch was für dich tun?"

        //handlerInput.attributesManager.setSessionAttributes(sessionattributes);
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withShouldEndSession(false)
            .getResponse();

    }
};

module.exports = {
    NewContactIntentHandler,
    NewAppointmentIntentHandler,
    EditEntryIntentHandler,
    AddNoteIntentHandler
}