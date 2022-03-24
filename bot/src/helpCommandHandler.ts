import { Activity, TurnContext } from "botbuilder";
import { TeamsFxBotCommandHandler } from "./sdk/interface";
import { MessageBuilder } from "./sdk/messageBuilder";
import helpCard from "./adaptiveCards/helpCommand.json"
import listCard from "./adaptiveCards/listCard.json"

export interface HelpCardData {
    items: string[]
}

export class HelpCommandHandler implements TeamsFxBotCommandHandler {
    commandNameOrPattern: string | RegExp = /help*/;

    async handleCommandReceived(context: TurnContext, receivedText: string): Promise<string | Partial<Activity>> {
        // verify the command arguments which are received from the client if needed.
        console.log(receivedText);
        console.log(context.activity.from.name);

        // do something to process your command and return an adaptive card or a text message.
        // You can use the `MessageBuilder` helper to build the message.
        switch (true) {
            case (receivedText.indexOf("ad-card") != -1):
                const acMessage = MessageBuilder.attachAdaptiveCard<HelpCardData>(() => {
                    return {
                        items: [
                            '- List my ToDo items: **list**',
                            '- Set item as completed: **set-complete <id>**',
                            '- Create new item: **create <title> <description>**',
                            '- Delete a to-do item: **delete <id>**'
                        ]
                    }
                }, helpCard);
                return acMessage;
            case (receivedText.indexOf("hero-card") != -1):
                const heroCard = MessageBuilder.attachHeroCard(
                    "Sample Hero Card Title", // title
                    [ "https://www.fanpop.com/clubs/cats/images/18565791/title/kitten-wallpaper" ] //image urls
                );
                return heroCard;
            case (receivedText.indexOf("o365-card") != -1):
                return MessageBuilder.attachO365ConnectorCard({
                    title: "Card Title",
                    text: "O365 connector card descrption"
                });
            case (receivedText.indexOf("list-card") != -1):
                return MessageBuilder.attachContent(listCard);
            
            default:
                return `**You typed**: ${receivedText}, **Supported Command Pattern**: help <ad-card | hero-card | list-card>`
        }
    }
}
