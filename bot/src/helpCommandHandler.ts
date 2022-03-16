import { TurnContext } from "botbuilder";
import helpCard from "./adaptiveCards/helpCommand.json"
import { buildAdaptiveCard } from "./sdk/adaptiveCard";
import { BotMessage, CardMessage, Json, TeamsCardType, TeamsFxBotCommandHandler } from "./sdk/interface";

export interface HelpCardData {
    items: string[]
}

export class HelpCommandHandler implements TeamsFxBotCommandHandler {
    commandNameOrPattern: string | RegExp = "help";

    async handleCommandReceived(context: TurnContext, commandText: string): Promise<BotMessage> {
        // verify the command arguments which are received from the client if needed.

        // do something to process your command and return an adaptive card or a text message.

        const card = buildAdaptiveCard<HelpCardData>(() => {
            return {
                items: [
                    '- List my ToDo items: **list**',
                    '- Set item as completed: **set-complete <id>**',
                    '- Create new item: **create <title> <description>**',
                    '- Delete a to-do item: **delete <id>**'
                ]
            }
        }, helpCard);

        return {
            cardType: TeamsCardType.AdaptiveCard,
            content: card
        };
    }
}
