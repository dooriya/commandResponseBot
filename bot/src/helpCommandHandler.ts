import { Activity, TurnContext } from "botbuilder";
import helpCard from "./adaptiveCards/helpCommand.json"
import listCard from "./adaptiveCards/listCard.json"
import { TeamsFxBotCommandHandler } from "./sdk/interface";
import { MessageBuilder } from "./sdk/messageBuilder";

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

        // for Adaptive Card you can use the `buildAdaptiveCardMessage` API to build the message.
        // for other card types, you can use the `CardFactory` helper. Please reference to https://docs.microsoft.com/en-us/javascript/api/botbuilder-core/cardfactory?view=botbuilder-ts-latest.

        switch (true) {
            case (receivedText.indexOf("ad-card") != -1):
                const acMessage = MessageBuilder.attachedAdaptiveCard<HelpCardData>(() => {
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
                const heroCard = MessageBuilder.AttachHeroCard(
                    "Sample Hero Card Title", // title
                    [ "https://www.fanpop.com/clubs/cats/images/18565791/title/kitten-wallpaper" ] //image urls
                );
                return heroCard;
            case (receivedText.indexOf("o365-card") != -1):
                return MessageBuilder.AttachO365ConnectorCard({
                    title: "Card Title",
                    text: "O365 connector card descrption"
                });
            case (receivedText.indexOf("list-card") != -1):
                return MessageBuilder.attachCard(listCard);
            
            default:
                return `**You typed**: ${receivedText}, ` + `**Supported Command Pattern**: help <ad-card | hero-card | list-card>`
        }
    }
}
