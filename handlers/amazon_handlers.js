'use strict';
const QueryHandlers = require('./query_handlers');
const query_mongo = require('../helper_functions/query_mongo');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    async handle(handlerInput) {
        const result = await query_mongo.queryMongoDB({amazon_user: handlerInput.requestEnvelope.session.user.userId}, 'Users');
        let speechText;
        if (result.length === 0) {
            speechText = 'Hallo, willkommen bei Casimir! Hier kannst du Kontakte und Termine anlegen, Verkaufschancen abändern, Informationen zu Mitarbeitern' +
                ', Kunden, aktuellen Projekten, oder Terminen in Erfahrung bringen. Sage zum Beispiel: Was sind meine nächsten Termine. Falls du Hilfe benötigst, kannst du jederzeit Hilfe sagen.';
            query_mongo.insertIntoMongo({amazon_user: handlerInput.requestEnvelope.session.user.userId}, 'Users');
        } else speechText = 'Hallo, guten Tag!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const YesIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent');
    },
    handle(handlerInput) {
        const sessionattributes = handlerInput.attributesManager.getSessionAttributes();
        let speechText = '';
        if (sessionattributes.LastIntent !== undefined && !sessionattributes.LastIntent.NoMoreInfos) {
            if (sessionattributes.LastIntent.name === 'QueryAppointmentIntent') {
                return QueryHandlers.QueryAppointmentIntentHandler.handle(handlerInput);
            } else if (sessionattributes.LastIntent.name === 'QueryProjectIntent') {
                return QueryHandlers.MoreInfoIntentHandler.handle(handlerInput); // Kann ich hier sessionAttributes.LastIntent übergeben?
            } else if (sessionattributes.LastIntent.name === 'QueryPhoneIntent'
                || sessionattributes.LastIntent.name === 'QuerySalaryIntent'
                || sessionattributes.LastIntent.name === 'QueryDateOfJoiningIntent'
                || sessionattributes.LastIntent.name === 'QueryEmailIntent'
                || sessionattributes.LastIntent.name === 'QueryInfoEmployeeIntent') {
                speechText = sessionattributes.LastIntent.speechText;
            } else speechText = 'Ok, was möchtest du tun?'
        } else {
            speechText = 'Ok, was möchtest du tun?';
        }

        //handlerInput.attributesManager.setSessionAttributes(sessionattributes);

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

/*
    Wenn ich irgendwo "Nein" sage und ich möchte den Skill nicht schließen, dann check ich auf Previous-Intent und returne ShouldEndSession false.
 */
const NoIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent');
    },
    handle(handlerInput) {
        const speechText = 'Ok, du bist jetzt wieder im Menü.';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'Du kannst zum Beispiel sagen: Neuen Kontakt anlegen, neuen Termin anlegen, Verkaufschance ändern, gib mir Infos zu Mitarbeiter <say-as interpret-as="spell-out">XY</say-as>, ' +
            'gib mir die Kunden mit dem höchsten Umsatz, wie glücklich sind meine Kunden, welche Projekte habe ich und welche Termine habe ich heute.';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const CancelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent');
    },
    handle(handlerInput) {
        const speechText = 'Ok, abgebrochen. Du bist jetzt wieder im Menü.';

        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const StopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Ciao mit V'; //Auf Wiedersehen!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

const FallbackHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('Tut mir leid, das verstehe ich nicht. Bitte starte erneut.')
            .reprompt('Das habe ich nicht verstanden. Bitte starte erneut.')
            .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        //any cleanup logic goes here
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);
        const repromptText = 'Bitte wiederhole es.';
        const speechText = 'Tut mir leid, es ist ein Fehler aufgetreten. Bitte wiederhole es.';

        const debug = true;
        const stack = error.stack.split('\n');
        console.log(stack[0]);
        console.log(stack[1]);

        let errorLoc = stack[1].substring(stack[1].lastIndexOf('/') + 1, 900);

        errorLoc = errorLoc.slice(0, -1);

        const file = errorLoc.substring(0, errorLoc.indexOf(':'));
        let line = errorLoc.substring(errorLoc.indexOf(':') + 1, 900);
        line = line.substring(0, line.indexOf(':'));

        let speechOutput = 'Sorry, an error occurred. ';
        if (debug) {
            speechOutput += error.message + ' in ' + file + ', line ' + line;
        }

        console.log(speechOutput);

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptText)
            .getResponse();
    },
};

module.exports = {
    LaunchRequestHandler,
    YesIntentHandler,
    NoIntentHandler,
    HelpIntentHandler,
    CancelIntentHandler,
    StopIntentHandler,
    FallbackHandler,
    SessionEndedRequestHandler,
    ErrorHandler
}