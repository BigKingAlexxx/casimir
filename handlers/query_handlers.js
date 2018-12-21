'use strict';
const logic = require('../helper_functions/logic');
const speech = require("../helper_functions/speech_text");
const query_mongo = require('../helper_functions/query_mongo');

const QueryPhoneIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'QueryPhoneIntent';
    },
    async handle(handlerInput) {
        const currentIntent = handlerInput.requestEnvelope.request.intent;
        const firstName = logic.getSlotValue(handlerInput, 'QueryPhoneIntentFirstName');
        const lastName = logic.getSlotValue(handlerInput, 'QueryPhoneIntentLastName');
        let personID = logic.getSlotValue(handlerInput, 'PersonID');
        let sessionattributes = handlerInput.attributesManager.getSessionAttributes();
        let speechText = '';
        const object = 'phone';

        if (personID !== '' && personID !== undefined) {
            let result = sessionattributes.LastIntent.result;
            personID = logic.replaceNumberLiterals(personID);
            personID--;

            if (personID >= 0 && personID < result.length) {
                if (sessionattributes.LastIntent.name !== 'QueryCustomersAggregateIntent') speechText = speech.getEmployeeSpeechText(object, result);
                else {
                    speechText = `Die Nummer des <say-as interpret-as="ordinal">${personID + 1}</say-as> Ansprechpartners ${result[personID].contact.name}` +
                        ` ist <say-as interpret-as="telephone">${result[personID].contact.phone}</say-as>. Soll ich es wiederholen?`
                }
            } else {
                speechText = `Die Zahl liegt außerhalb des möglichen Bereichs. Bitte wähle von eins bis ${result.length}.`;
                return handlerInput.responseBuilder
                    .addElicitSlotDirective('PersonID')
                    .speak(speechText)
                    .reprompt(speechText)
                    .getResponse();
            }
        } else {
            try {
                const result = await query_mongo.queryInfoEmployee(firstName, lastName, object);
                if (result.result.length == 0 || logic.isEmpty(result.result[0])) {
                    speechText = result.speechText;
                } else if (result.many) {
                    speechText = result.speechText;
                    sessionattributes.LastIntent = { result: result.result };
                    handlerInput.attributesManager.setSessionAttributes(sessionattributes);
                    return handlerInput.responseBuilder
                        .addElicitSlotDirective('PersonID')
                        .speak(speechText)
                        .reprompt(speechText)
                        .getResponse();
                } else {
                    speechText = result.speechText;
                }
            } catch (error) {
                speechText = 'Tut mir leid, es ist ein Fehler aufgetreten. Bitte versuche es später nochmal.'
                console.log(`Intent: ${handlerInput.requestEnvelope.request.intent.name}: message: ${error.message}`);
            }
        }

        sessionattributes.LastIntent.name = 'QueryPhoneIntent';
        sessionattributes.LastIntent.speechText = speechText;
        handlerInput.attributesManager.setSessionAttributes(sessionattributes);

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const QuerySalaryIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'QuerySalaryIntent';
    },
    async handle(handlerInput) {
        const firstName = logic.getSlotValue(handlerInput, 'QuerySalaryIntentFirstName');
        const lastName = logic.getSlotValue(handlerInput, 'QuerySalaryIntentLastName');
        let personID = logic.getSlotValue(handlerInput, 'PersonID');
        let sessionattributes = handlerInput.attributesManager.getSessionAttributes();
        let speechText = '';
        const object = 'salary';
        console.log(firstName + " " + lastName)
        if (personID !== '') {
            let result = sessionattributes.LastIntent.result;
            personID = logic.replaceNumberLiterals(personID);
            personID--;

            if (personID >= 0 && personID < result.length) {
                speechText = speech.getEmployeeSpeechText(object, result);
            } else {
                speechText = `Die Zahl liegt außerhalb des möglichen Bereichs. Bitte wähle von eins bis ${result.length}.`;
                return handlerInput.responseBuilder
                    .addElicitSlotDirective('PersonID')
                    .speak(speechText)
                    .reprompt(speechText)
                    .getResponse();
            }
        } else {
            try {
                const result = await query_mongo.queryInfoEmployee(firstName, lastName, object);
                if (result.result.length == 0 || isEmpty(result.result[0])) {
                    console.log("result ist MT")
                    speechText = result.speechText;
                } else if (result.many) {
                    speechText = result.speechText;
                    sessionattributes.LastIntent = { result: result.result };
                    handlerInput.attributesManager.setSessionAttributes(sessionattributes);
                    return handlerInput.responseBuilder
                        .addElicitSlotDirective('PersonID')
                        .speak(speechText)
                        .reprompt(speechText)
                        .getResponse();
                } else {
                    speechText = result.speechText
                }
            } catch (error) {
                speechText = 'Tut mir leid, es ist ein Fehler aufgetreten. Bitte versuche es später nochmal.'
                console.log(`Intent: ${handlerInput.requestEnvelope.request.intent.name}: message: ${error.message}`);
            }
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const QueryDateOfJoiningIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'QueryDateOfJoiningIntent';
    },
    async handle(handlerInput) {
        const firstName = logic.getSlotValue(handlerInput, 'QueryDateOfJoiningIntentFirstName');
        const lastName = logic.getSlotValue(handlerInput, 'QueryDateOfJoiningIntentLastName');
        let personID = logic.getSlotValue(handlerInput, 'PersonID');
        let sessionattributes = handlerInput.attributesManager.getSessionAttributes();
        let speechText = '';
        const object = 'date of joining';

        if (personID !== '') {
            let result = sessionattributes.LastIntent.result;
            personID = logic.replaceNumberLiterals(personID);
            personID--;

            if (personID >= 0 && personID < result.length) {
                speechText = speech.getEmployeeSpeechText(object, result);
            } else {
                speechText = `Die Zahl liegt außerhalb des möglichen Bereichs. Bitte wähle von eins bis ${result.length}.`;
                return handlerInput.responseBuilder
                    .addElicitSlotDirective('PersonID')
                    .speak(speechText)
                    .reprompt(speechText)
                    .getResponse();
            }
        } else {
            try {
                const result = await query_mongo.queryInfoEmployee(firstName, lastName, object);
                if (result.result.length == 0 || isEmpty(result.result[0])) {
                    speechText = result.speechText;
                } else if (result.many) {
                    speechText = result.speechText;
                    sessionattributes.LastIntent = { result: result.result };
                    handlerInput.attributesManager.setSessionAttributes(sessionattributes);
                    return handlerInput.responseBuilder
                        .addElicitSlotDirective('PersonID')
                        .speak(speechText)
                        .reprompt(speechText)
                        .getResponse();
                } else {
                    speechText = result.speechText
                }
            } catch (error) {
                speechText = 'Tut mir leid, es ist ein Fehler aufgetreten. Bitte versuche es später nochmal.'
                console.log(`Intent: ${handlerInput.requestEnvelope.request.intent.name}: message: ${error.message}`);
            }
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const QueryEmailIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'QueryEmailIntent';
    },
    async handle(handlerInput) {
        const firstName = logic.getSlotValue(handlerInput, 'QueryEmailIntentFirstName');
        const lastName = logic.getSlotValue(handlerInput, 'QueryEmailIntentLastName');
        let personID = logic.getSlotValue(handlerInput, 'PersonID');
        let sessionattributes = handlerInput.attributesManager.getSessionAttributes();
        let speechText = '';
        const object = 'email';

        if (personID !== '') {
            let result = sessionattributes.LastIntent.result;
            personID = logic.replaceNumberLiterals(personID);
            personID--;

            if (personID >= 0 && personID < result.length) {
                if (sessionattributes.LastIntent.name !== 'QueryCustomersAggregateIntent') speechText = speech.getEmployeeSpeechText(object, result);
                else {
                    speechText = `Die Email des <say-as interpret-as="ordinal">${personID + 1}</say-as> Ansprechpartners ${result[personID].contact.name}` +
                        ` ist ${result[personID].contact.email}.`
                }
            } else {
                speechText = `Die Zahl liegt außerhalb des möglichen Bereichs. Bitte wähle von eins bis ${result.length}.`;
                return handlerInput.responseBuilder
                    .addElicitSlotDirective('PersonID')
                    .speak(speechText)
                    .reprompt(speechText)
                    .getResponse();
            }
        } else {
            try {
                const result = await query_mongo.queryInfoEmployee(firstName, lastName, object);
                if (result.result.length == 0 || logic.isEmpty(result.result[0])) {
                    speechText = result.speechText;
                } else if (result.many) {
                    speechText = result.speechText;
                    sessionattributes.LastIntent = { result: result.result };
                    handlerInput.attributesManager.setSessionAttributes(sessionattributes);
                    return handlerInput.responseBuilder
                        .addElicitSlotDirective('PersonID')
                        .speak(speechText)
                        .reprompt(speechText)
                        .getResponse();
                } else {
                    speechText = result.speechText
                }
            } catch (error) {
                speechText = 'Tut mir leid, es ist ein Fehler aufgetreten. Bitte versuche es später nochmal.'
                console.log(`Intent: ${handlerInput.requestEnvelope.request.intent.name}: message: ${error.message}`);
            }
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const QueryInfoEmployeeIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'QueryInfoEmployeeIntent';
    },
    async handle(handlerInput) {
        const firstName = logic.getSlotValue(handlerInput, 'QueryInfoEmployeeIntentFirstName');
        const lastName = logic.getSlotValue(handlerInput, 'QueryInfoEmployeeIntentLastName');
        let personID = logic.getSlotValue(handlerInput, 'PersonID');
        let sessionattributes = handlerInput.attributesManager.getSessionAttributes();
        let speechText = '';

        if (personID !== '') {
            let result = sessionattributes.LastIntent.result;
            personID = logic.replaceNumberLiterals(personID);
            personID--;

            if (personID >= 0 && personID < result.length) {
                speechText = speech.getEmployeeSpeechText('allInfo', result);
            } else {
                speechText = `Die Zahl liegt außerhalb des möglichen Bereichs. Bitte wähle von eins bis ${result.length}.`;
                return handlerInput.responseBuilder
                    .addElicitSlotDirective('PersonID')
                    .speak(speechText)
                    .reprompt(speechText)
                    .getResponse();
            }
        } else {
            try {
                const result = await query_mongo.queryInfoEmployee(firstName, lastName);
                if (result.result.length == 0 || logic.isEmpty(result.result[0])) {
                    speechText = result.speechText;
                } else if (result.many) {
                    speechText = result.speechText;
                    sessionattributes.LastIntent = { result: result.result };
                    handlerInput.attributesManager.setSessionAttributes(sessionattributes);
                    return handlerInput.responseBuilder
                        .addElicitSlotDirective('PersonID')
                        .speak(speechText)
                        .reprompt(speechText)
                        .getResponse();
                } else {
                    speechText = result.speechText
                }
            } catch (error) {
                speechText = 'Tut mir leid, es ist ein Fehler aufgetreten. Bitte versuche es später nochmal.'
                console.log(`Intent: ${handlerInput.requestEnvelope.request.intent.name}: message: ${error.message}`);
            }
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const QueryAppointmentIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'QueryAppointmentIntent';
    },
    async handle(handlerInput) {
        const currentIntent = handlerInput.requestEnvelope.request.intent;
        const userId = handlerInput.requestEnvelope.session.user.userId;
        var dayOfWeek;
        var date;
        let speechText = '';
        let sessionattributes = handlerInput.attributesManager.getSessionAttributes();

        if (currentIntent.name !== 'AMAZON.YesIntent') {
            dayOfWeek = logic.getSlotValue(handlerInput, 'DayOfWeek');
            date = logic.getSlotValue(handlerInput, 'Date');
        } else {
            dayOfWeek = sessionattributes.LastIntent.slots.DayOfWeek.value;
            date = sessionattributes.LastIntent.slots.Date.value;
        }

        try {
            let result;
            if (dayOfWeek) {
                result = await query_mongo.queryAppointment(userId, logic.getDateString(logic.getNextDayOfWeekDate(dayOfWeek)));
                if (!(sessionattributes.hasOwnProperty('LastIntent'))) {
                    if (result.length === 1) speechText = `Am ${logic.getWeekDay(result[0].date)} den ${result[0].date} hast du ein Termin. `;
                    else if (result.length > 1) speechText = `Am ${logic.getWeekDay(result[0].date)} den ${result[0].date} hast du ${result.length} Termine. `;
                }
            }
            else if (date) {
                result = await query_mongo.queryAppointment(userId, date);
                if (!(sessionattributes.hasOwnProperty('LastIntent'))) {
                    if (result.length === 1) speechText = `Am ${logic.getWeekDay(result[0].date)} den ${result[0].date} hast du ein Termin. `;
                    else if (result.length > 1) speechText = `Am ${logic.getWeekDay(result[0].date)} den ${result[0].date} hast du ${result.length} Termine. `;
                }
            }
            else result = await query_mongo.queryAppointment(userId);

            if (result.length == 0 || logic.isEmpty(result[0])) { // https://en.wiktionary.org/wiki/Wiktionary:Main_Page --> für Phoneme
                speechText = 'Tut mir leid, ich konnte zu deiner Benutzer-<phoneme alphabet="ipa" ph="aɪˈdiː">ID</phoneme> keine Termine finden.';
            } else {
                let amountDone = 0;
                let counter = 0;

                if (sessionattributes.hasOwnProperty('LastIntent')) amountDone = sessionattributes.LastIntent.appointment.amountDone;

                for (amountDone; amountDone < result.length; amountDone++) {
                    console.log("in for schleife result von 3 ist: " + JSON.stringify(result[amountDone]))
                    let i = result[amountDone];
                    if (dayOfWeek) {
                        console.log("Else dayOfWeek: " + dayOfWeek)
                        if (logic.getDateString(logic.getNextDayOfWeekDate(dayOfWeek)) === i.date) {
                            console.log("true hier bei dayofweek")
                            speechText += speech.getAppointmentSpeechText('dayOfWeek', i);
                        }
                    } else if (date) {
                        console.log("Else Date")
                        if (date === i.date) {
                            speechText += speech.getAppointmentSpeechText('date', i);
                        }
                    } else {
                        console.log("Else ALL")
                        speechText += speech.getAppointmentSpeechText('all', i);
                    }
                    if (counter === 2 && ((result.length - (amountDone + 1)) > 0)) {
                        speechText += ` Du hast noch ${result.length - (amountDone + 1)} weitere Termine. Soll ich weiter machen?`
                        sessionattributes.LastIntent = currentIntent;
                        sessionattributes.LastIntent.name = 'QueryAppointmentIntent';
                        sessionattributes.LastIntent.appointment = { 'result': result, 'amountDone': amountDone + 1 };
                        sessionattributes.LastIntent.NoMoreInfo = false;
                        handlerInput.attributesManager.setSessionAttributes(sessionattributes);
                        return handlerInput.responseBuilder
                            .speak(speechText)
                            .reprompt(speechText)
                            .withShouldEndSession(false)
                            .getResponse();

                    } else if (result.length - (amountDone + 1) === 0) {
                        sessionattributes = {};
                        handlerInput.attributesManager.setSessionAttributes(sessionattributes);
                    }
                    counter++;
                }
            }

        } catch (error) {
            speechText = 'Tut mir leid, es ist ein Fehler aufgetreten. Bitte versuche es später nochmal.'
            console.log(`Intent: ${handlerInput.requestEnvelope.request.intent.name}: message: ${error.message}`);
        }

        speechText += ' Kann ich noch was für dich tun?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const QueryCustomersAggregateIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'QueryCustomersAggregateIntent';
    },
    async handle(handlerInput) {
        let sessionattributes = handlerInput.attributesManager.getSessionAttributes();
        const request = handlerInput.requestEnvelope.request;
        const currentIntent = handlerInput.requestEnvelope.request.intent;
        let number = logic.getSlotValue(handlerInput, 'Zahl');
        let ranking = logic.getSlotValue(handlerInput, 'Ranking');
        let customerFeature = logic.getSlotValue(handlerInput, 'CustomerFeature');
        let startDate = logic.getSlotValue(handlerInput, 'StartDate');
        let endDate = logic.getSlotValue(handlerInput, 'EndDate');
        let speechText = '';

        if (number !== '') number = parseInt(logic.replaceNumberLiterals(number));
        if (ranking !== '') {
            if (ranking === 'top' || ranking === 'meisten' || ranking === 'ersten' || ranking === 'besten' || ranking === 'höchsten') ranking = -1;
            else ranking = 1;
        }
        if (customerFeature === 'Umsatz') customerFeature = 'revenue.value';

        try {
            const result = await query_mongo.queryCustomersAggregate(number, ranking, customerFeature, startDate, endDate);
            if (customerFeature === 'glücklich') {
                speechText = speech.getSatisfactionSpeechText(result);
            } else if (startDate !== '' && endDate === '') {
                console.log(startDate)
                if (startDate.length !== 4) speechText = `Im ${logic.checkDateFormat(startDate)} wurden ${result.length} Kunden akquiriert.`;
                else speechText = `In ${startDate} wurden ${result.length} Kunden akquiriert.`;
                for (let i of result) {
                    if (result.indexOf(i) + 1 === result.length) speechText += ` ${i.name}.`;
                    else speechText += ` ${i.name},`;
                }
            } else if (startDate !== '' && endDate !== '') {
                speechText = `Zwischen ${logic.checkDateFormat(startDate)} und ${logic.checkDateFormat(endDate)} wurden ${result.length} Kunden akquiriert.`;
                for (let i of result) {
                    if (result.indexOf(i) + 1 === result.length) speechText += ` ${i.name}.`;
                    else speechText += ` ${i.name},`;
                }
            } else if (ranking) {
                if (ranking === -1) speechText = `Die ${number || ""} Kunden mit dem höchsten Umsatz sind:`;
                else speechText = `Die ${number || ""} Kunden mit dem geringsten Umsatz sind:`;
                for (let i of result) {
                    speechText += ` ${i.name} mit ${i.revenue.value} €.`;
                }
            } else {
                console.log("Else")
                speechText = 'Tut mir leid, ich habe das nicht verstanden.'
            }
            speechText += " Kann ich noch was für dich tun?";
            speechText = speechText.replaceAll(/&/gm, '&amp;');
            sessionattributes.LastIntent = currentIntent;
            sessionattributes.LastIntent.result = result;
        } catch (error) {
            speechText = 'Tut mir leid, es ist ein Fehler aufgetreten. Bitte versuche es später nochmal.'
            console.log(`Intent: ${handlerInput.requestEnvelope.request.intent.name}: message: ${error.message}`);
        }

        handlerInput.attributesManager.setSessionAttributes(sessionattributes);

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const QueryProjectIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'QueryProjectIntent';
    },
    async handle(handlerInput) {
        let sessionattributes = handlerInput.attributesManager.getSessionAttributes();
        const request = handlerInput.requestEnvelope.request;
        const currentIntent = handlerInput.requestEnvelope.request.intent;
        let speechText = '';

        try {
            const result = await query_mongo.queryMongoDB({}, 'Projects');
            if (result.length !== 0 && !logic.isEmpty(result[0])) {
                if (result.length > 1) {
                    speechText = `Du hast aktuell ${result.length} Projekte.`
                    for (let i of result) {
                        speechText += ` Projekt <emphasis>${i.name}</emphasis>, Abschluss ist der ${i.end}.`
                    }
                } else speechText = `Du hast aktuell ein Projekt. Projekt <emphasis>${i.name}</emphasis>, Abschluss ist der ${i.end}.`;
            } else speechText = "Du hast keine aktuellen Projekte."
            speechText += " Kann ich noch was für dich tun?"
            sessionattributes.LastIntent = currentIntent;
            sessionattributes.LastIntent.result = result;
            sessionattributes.LastIntent.amountDone = 0;
        } catch (error) {
            speechText = 'Tut mir leid, es ist ein Fehler aufgetreten. Bitte versuche es später nochmal.'
            console.log(`Intent: ${handlerInput.requestEnvelope.request.intent.name}: message: ${error.message}`);
        }

        handlerInput.attributesManager.setSessionAttributes(sessionattributes);
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withShouldEndSession(false)
            .getResponse();

    }
};

const QueryNotesIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'QueryNotesIntent';
    },
    handle(handlerInput) {
        let sessionattributes = handlerInput.attributesManager.getSessionAttributes();
        const request = handlerInput.requestEnvelope.request;
        const currentIntent = handlerInput.requestEnvelope.request.intent;
        let speechText = '';

        if (sessionattributes.hasOwnProperty('LastIntent') && sessionattributes.LastIntent.name === 'QueryProjectIntent') {
            const result = sessionattributes.LastIntent.result;
            let amountDone = sessionattributes.LastIntent.amountDone;
            speechText = `Die Notiz zum Projekt ${result[amountDone - 1].name} ist: ${result[amountDone - 1].notes}`;
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

const MoreInfoIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'MoreInfoIntent';
    },
    handle(handlerInput) {
        let sessionattributes = handlerInput.attributesManager.getSessionAttributes();
        const request = handlerInput.requestEnvelope.request;
        const currentIntent = handlerInput.requestEnvelope.request.intent;
        let speechText = '';
        let category;
        let number;
        console.log(JSON.stringify(sessionattributes))
        if (currentIntent.name !== 'AMAZON.YesIntent') {
            category = logic.getSlotValue(handlerInput, 'MoreInfoIntentCategory');
            number = logic.getSlotValue(handlerInput, 'MoreInfoIntentNumber');
        } else {
            if (sessionattributes.LastIntent.hasOwnProperty("slots")) {
                category = sessionattributes.LastIntent.slots.MoreInfoIntentCategory.value;
                number = sessionattributes.LastIntent.slots.MoreInfoIntentNumber.value;
            }
        }

        if (sessionattributes.hasOwnProperty('LastIntent') && sessionattributes.LastIntent.name === 'QueryCustomersAggregateIntent') {
            const result = sessionattributes.LastIntent.result;
            for (let i of result) {
                speechText += `${i.name} ist Kunde seit ${i.customer_since} und bezieht das Produkt ${i.product}. Der Umsatz beträgt ${i.revenue.value.$numberDecimal}` +
                    ` ${i.revenue.currency} und der Kunde ist als ${i.satisfaction} eingestuft. Der Ansprechpartner ist ${i.contact.name}. `
            }
            //sessionattributes.LastIntent = currentIntent;
        } else if (sessionattributes.hasOwnProperty('LastIntent') && (sessionattributes.LastIntent.name === 'QueryProjectIntent' || sessionattributes.LastIntent.name === 'MoreInfoIntent')) {
            const result = sessionattributes.LastIntent.result;
            if (category && number) {
                if (number > 0 && number <= result.length) {
                    let i = result[number - 1];
                    if (i.customer_name !== 'intern') {
                        speechText += `Das Projekt <emphasis>${i.name}</emphasis> wurde von ${i.customer_name} in Auftrag gegeben. Der Projektleiter ist ${i.project_manager}. ` +
                            `Die Deadline wird in ${logic.getDaysDiff(new Date(), i.end)} Tagen, am ${i.end} erreicht. Das Budget beträgt ${i.budget.total} ${i.budget.currency}, ` +
                            `davon bleiben noch ${i.budget.left} ${i.budget.currency}. An dem Projekt arbeiten ${i.number_of_employees} Mitarbeiter und die zuständige Abteilung ist ${i.department}. `;
                    }
                    else {
                        speechText += `Das Projekt <emphasis>${i.name}</emphasis> ist ein internes Projekt. Der Projektleiter ist ${i.project_manager}. ` +
                            `Die Deadline wird in ${logic.getDaysDiff(new Date(), i.end)} Tagen, am ${i.end} erreicht. Das Budget beträgt ${i.budget.total} ${i.budget.currency}, ` +
                            `davon bleiben noch ${i.budget.left} ${i.budget.currency}. An dem Projekt arbeiten ${i.number_of_employees} Mitarbeiter und die zuständige Abteilung ist ${i.department}. `;
                    }
                } else speechText = `${number} liegt außerhalb des zulässigen Bereichs. Bitte wähle zwischen 1 und <say-as interpret-as='cardinal'>${result.length}</say-as>. `;
            } else {
                let amountDone = sessionattributes.LastIntent.amountDone;
                for (amountDone; amountDone < result.length; amountDone++) {
                    let i = result[amountDone];
                    if (i.customer_name !== 'intern') {
                        speechText += `Das Projekt <emphasis>${i.name}</emphasis> wurde von ${i.customer_name} in Auftrag gegeben. Der Projektleiter ist ${i.project_manager}. ` +
                            `Die Deadline wird in ${logic.getDaysDiff(new Date(), i.end)} Tagen, am ${i.end} erreicht. Das Budget beträgt ${i.budget.total} ${i.budget.currency}, ` +
                            `davon bleiben noch ${i.budget.left} ${i.budget.currency}. An dem Projekt arbeiten ${i.number_of_employees} Mitarbeiter und die zuständige Abteilung ist ${i.department}. `;
                    }
                    else {
                        speechText += `Das Projekt <emphasis>${i.name}</emphasis> ist ein internes Projekt. Der Projektleiter ist ${i.project_manager}. ` +
                            `Die Deadline wird in ${logic.getDaysDiff(new Date(), i.end)} Tagen, am ${i.end} erreicht. Das Budget beträgt ${i.budget.total} ${i.budget.currency}, ` +
                            `davon bleiben noch ${i.budget.left} ${i.budget.currency}. An dem Projekt arbeiten ${i.number_of_employees} Mitarbeiter und die zuständige Abteilung ist ${i.department}. `;
                    }
                    if (sessionattributes.LastIntent.amountDone !== result.length - 1) {
                        //sessionattributes.LastIntent = currentIntent;
                        sessionattributes.LastIntent.amountDone++;
                        handlerInput.attributesManager.setSessionAttributes(sessionattributes);
                        speechText += "Soll ich weitermachen?";
                        speechText = logic.spellOut(speechText);
                        speechText = speechText.replace(/&/gm, '&amp;');

                        return handlerInput.responseBuilder
                            .speak(speechText)
                            .reprompt(speechText)
                            .withShouldEndSession(false)
                            .getResponse();
                    }
                }
            }
        }
        sessionattributes.LastIntent.amountDone++;
        if (!sessionattributes.hasOwnProperty('LastIntent') && sessionattributes.LastIntent.name !== 'QueryCustomersAggregateIntent') sessionattributes.LastIntent.NoMoreInfos = true;
        handlerInput.attributesManager.setSessionAttributes(sessionattributes);
        speechText += "Kann ich noch was für dich tun?";
        speechText = logic.spellOut(speechText);
        speechText = speechText.replace(/&/gm, '&amp;');

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

module.exports = {
    QueryPhoneIntentHandler,
    QuerySalaryIntentHandler,
    QueryDateOfJoiningIntentHandler,
    QueryEmailIntentHandler,
    QueryInfoEmployeeIntentHandler,
    QueryAppointmentIntentHandler,
    QueryCustomersAggregateIntentHandler,
    QueryProjectIntentHandler,
    QueryNotesIntentHandler,
    MoreInfoIntentHandler
}