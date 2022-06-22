import { Activity, TurnContext } from "botbuilder";
import { CommandMessage, TeamsFxBotCommandHandler, TriggerPatterns } from "./sdk/interface";
import { MessageBuilder } from "./sdk/messageBuilder";
import helloWorldCard from "./adaptiveCards/helloworldCommand.json";


export class HelloWorldCommandHandler implements TeamsFxBotCommandHandler {
    triggerPatterns: TriggerPatterns = ["helloWorld", "hi"];

    async handleCommandReceived(context: TurnContext, message: CommandMessage): Promise<string | Partial<Activity> | void> {
        // verify the command arguments which are received from the client if needed.
        console.log(message.text);

        // do something to process your command and return an adaptive card or a text message.
        const payload = {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.4",
            "body": [
                {
                    "type": "TextBlock",
                    "text": "Your Hello World Bot is Running",
                    "size": "Large",
                    "weight": "Bolder",
                    "wrap": true
                },
                {
                    "type": "TextBlock",
                    "text": "Congratulations! Your hello world bot is running. Here are some common commands to get you started.",
                    "isSubtle": true,
                    "wrap": true
                }
            ]
        };
        
        //await context.sendActivity(`Hi ${context.activity.from.name}!`);
        //await context.sendActivity(MessageBuilder.attachAdaptiveCardWithoutData(payload));
        return MessageBuilder.attachAdaptiveCardWithoutData(helloWorldCard);
    }
}
