import { TurnContext } from "botbuilder";
import helpCard from "./adaptiveCards/help-command.json"
import { buildAdaptiveCard } from "./sdk/adaptiveCard";
import { TeamsFxBotCommandHandler } from "./sdk/interface";

export interface HelpCardData {
    items: string[]
}

export class HelpCommandHandler implements TeamsFxBotCommandHandler {
    commandName?: string = "help";
    commandTextPattern?: RegExp;

    async handleCommandReceived(context: TurnContext, commandText: string): Promise<any> {
        // verify the command arguments which is received from the client if needed.

        // do something to process your command and return an adaptive card or a text message.
        const card = buildAdaptiveCard<{ items: string[] }>(() => {
            return {
                items: [
                    '- List my ToDo items: **list**',
                    '- Set item as completed: **set-complete <id>**',
                    '- Create new item: **create <title> <description>**',
                    '- Delete a to-do item: **delete <id>**'
                ]
            }
        }, helpCard);

        return card;
    }
}
