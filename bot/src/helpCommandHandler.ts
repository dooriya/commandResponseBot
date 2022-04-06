import { Activity, TurnContext } from "botbuilder";
import { CommandMessage, TeamsFxBotCommandHandler, TriggerPatterns } from "./sdk/interface";
import { MessageBuilder } from "./sdk/messageBuilder";
import helpCard from "./adaptiveCards/helpCommand.json"
import listCard from "./adaptiveCards/listCard.json"

export interface HelpCardData {
    items: string[]
}

export class HelpCommandHandler implements TeamsFxBotCommandHandler {
    triggerPatterns: TriggerPatterns = /^help (.*?)$/i;

    async handleCommandReceived(context: TurnContext, message: CommandMessage): Promise<string | Partial<Activity>> {
        // verify the command arguments which are received from the client if needed.
        console.log(message.text);
        console.log(message.matches);
        console.log(context.activity.from.name);

        // do something to process your command and return an adaptive card or a text message.
        // You can use the `MessageBuilder` helper to build the message.
        const arg = message.matches[1];
        switch (true) {
            case (arg === "ad-card"):
                const acMessage = MessageBuilder.attachAdaptiveCard<HelpCardData>(
                    helpCard, {
                        items: [
                            '- List my ToDo items: **list**',
                            '- Set item as completed: **set-complete <id>**',
                            '- Create new item: **create <title> <description>**',
                            '- Delete a to-do item: **delete <id>**'
                        ]
                    }
                );
                return acMessage;
            case (arg === "hero-card"):
                const heroCard = MessageBuilder.attachHeroCard(
                    "Sample Hero Card Title", // title
                    [ "https://www.fanpop.com/clubs/cats/images/18565791/title/kitten-wallpaper" ] //image urls
                );
                return heroCard;
            case (arg === "o365-card"):
                return MessageBuilder.attachO365ConnectorCard({
                    title: "Card Title",
                    text: "O365 connector card descrption"
                });
            case (arg === "list-card"):
                return MessageBuilder.attachContent(listCard);
            
            default:
                return `**You typed**: ${message.text}, **Supported Command Pattern**: help <ad-card | hero-card | list-card>`
        }
    }
}
