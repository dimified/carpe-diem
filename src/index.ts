import {
    ErrorHandler,
    HandlerInput,
    RequestHandler,
    SkillBuilders,
} from 'ask-sdk-core';
import { CustomSkill } from 'ask-sdk-core/dist/skill/CustomSkill';
import {
    Context,
    RequestEnvelope,
    Response,
    SessionEndedRequest,
} from 'ask-sdk-model';

console.log('hello world');

const LaunchRequestHandler: RequestHandler = {
    canHandle: (handlerInput: HandlerInput) =>
        handlerInput.requestEnvelope.request.type === 'LaunchRequest',
    handle: (handlerInput: HandlerInput): Response =>
        handlerInput.responseBuilder.speak('Hello World!').getResponse(),
};

const RealTimeCheckIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return (
            request.type === 'IntentRequest' &&
            request.intent.name === 'SeizeTheDayIntent'
        );
    },
    handle(handlerInput: HandlerInput): Response {
        return handlerInput.responseBuilder
            .speak('Hello World!')
            .withShouldEndSession(true)
            .getResponse();
    },
};

let skill: CustomSkill;

// exports.handler = SkillBuilders.custom()
//     .addRequestHandlers(
//         LaunchRequestHandler,
//         AskWeatherIntentHandler,
//         HelpIntentHandler,
//         CancelAndStopIntentHandler,
//         SessionEndedRequestHandler,
//     )
//     .addErrorHandlers(ErrorHandler)
//     .lambda();

exports.handler = async (event: RequestEnvelope, context: Context) => {
    console.log(`REQUEST++++${JSON.stringify(event)}`);

    if (!skill) {
        skill = SkillBuilders.custom()
            .addRequestHandlers(
                LaunchRequestHandler,
                RealTimeCheckIntentHandler,
            )
            .create();
    }

    const response = skill.invoke(event, context);
    console.log(`RESPONSE++++${JSON.stringify(response)}`);

    return response;
};
