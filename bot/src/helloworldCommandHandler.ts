import { TurnContext } from "botbuilder";
import helloWorldCard from "./adaptiveCards/helloworldCommand.json"
import { BotMessage, TeamsCardType, TeamsFxBotCommandHandler } from "./sdk/interface";


export class HelloWorldCommandHandler implements TeamsFxBotCommandHandler {
    commandNameOrPattern: string | RegExp = "helloWorld";

    async handleCommandReceived(context: TurnContext, commandText: string): Promise<BotMessage> {
        // verify the command arguments which are received from the client if needed.

        // do something to process your command and return an adaptive card or a text message.
        return {
            cardType: TeamsCardType.AdaptiveCard,
            content: helloWorldCard
        };
    }
}
