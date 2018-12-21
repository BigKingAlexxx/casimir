'use strict';
const Alexa = require('ask-sdk-core');

// Handler Functions ===========================================================================
const LaunchRequestHandler = require("./handlers/amazon_handlers").LaunchRequestHandler;
const YesIntentHandler = require("./handlers/amazon_handlers").YesIntentHandler;
const NoIntentHandler = require("./handlers/amazon_handlers").NoIntentHandler;
const HelpIntentHandler = require("./handlers/amazon_handlers").HelpIntentHandler;
const CancelIntentHandler = require("./handlers/amazon_handlers").CancelIntentHandler;
const StopIntentHandler = require("./handlers/amazon_handlers").StopIntentHandler;
const FallbackHandler = require("./handlers/amazon_handlers").FallbackHandler;
const SessionEndedRequestHandler = require("./handlers/amazon_handlers").SessionEndedRequestHandler;
const ErrorHandler = require("./handlers/amazon_handlers").ErrorHandler;

const NewContactIntentHandler = require("./handlers/entry_handlers").NewContactIntentHandler;
const NewAppointmentIntentHandler = require("./handlers/entry_handlers").NewAppointmentIntentHandler;
const EditEntryIntentHandler = require("./handlers/entry_handlers").EditEntryIntentHandler;
const AddNoteIntentHandler = require("./handlers/entry_handlers").AddNoteIntentHandler;

const QueryPhoneIntentHandler = require("./handlers/query_handlers").QueryPhoneIntentHandler;
const QuerySalaryIntentHandler = require("./handlers/query_handlers").QuerySalaryIntentHandler;
const QueryDateOfJoiningIntentHandler = require("./handlers/query_handlers").QueryDateOfJoiningIntentHandler;
const QueryEmailIntentHandler = require("./handlers/query_handlers").QueryEmailIntentHandler;
const QueryInfoEmployeeIntentHandler = require("./handlers/query_handlers").QueryInfoEmployeeIntentHandler;
const QueryAppointmentIntentHandler = require("./handlers/query_handlers").QueryAppointmentIntentHandler;
const QueryCustomersAggregateIntentHandler = require("./handlers/query_handlers").QueryCustomersAggregateIntentHandler;
const QueryProjectIntentHandler = require("./handlers/query_handlers").QueryProjectIntentHandler;
const QueryNoteIntentHandler = require("./handlers/query_handlers").QueryNoteIntentHandler;
const MoreInfoIntentHandler = require("./handlers/query_handlers").MoreInfoIntentHandler;

const ZahlIntentHandler = require("./handlers/test_handlers").ZahlIntentHandler;
const TestIntentHandler = require("./handlers/test_handlers").TestIntentHandler;

// Helper Functions ============================================================================

/* queryCustomersAggregate(null, null, 'glücklich')
    .then((msg) => {
        console.log(JSON.stringify(msg));
    }).catch(console.error); */

// Export Functions ============================================================================

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ZahlIntentHandler,
        TestIntentHandler,
        NewContactIntentHandler,
        NewAppointmentIntentHandler,
        EditEntryIntentHandler,
        AddNoteIntentHandler,
        QueryPhoneIntentHandler,
        QuerySalaryIntentHandler,
        QueryDateOfJoiningIntentHandler,
        QueryEmailIntentHandler,
        QueryInfoEmployeeIntentHandler,
        QueryAppointmentIntentHandler,
        QueryCustomersAggregateIntentHandler,
        QueryProjectIntentHandler,
        QueryNoteIntentHandler,
        MoreInfoIntentHandler,
        YesIntentHandler,
        NoIntentHandler,
        HelpIntentHandler,
        CancelIntentHandler,
        StopIntentHandler,
        FallbackHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
