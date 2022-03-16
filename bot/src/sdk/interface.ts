import { Activity, TurnContext } from "botbuilder";

export interface TeamsFxBotCommandHandler {
    /**
     * The command name or RegExp pattern that can trigger this handler.
     */
     commandNameOrPattern: string | RegExp;

    /**
     * Handles a bot command received.
     * @param context The bot context.
     * @param commandText The command text the user types from Teams.
     * @returns a string represent the reponse message or an adapative card payload object.
     */
    handleCommandReceived(context: TurnContext, commandText: string): Promise<BotMessage>;
}

export type Json = Record<string, any>;
export type AdaptiveCard = Json;

export type BotMessage = string | CardMessage | Partial<Activity>;

// Wee can extend the supported card types through this enum definition
export enum TeamsCardType {
    AdaptiveCard = 'application/vnd.microsoft.card.adaptive',
    HeroCard = 'application/vnd.microsoft.card.hero',
    ListCard = 'application/vnd.microsoft.teams.card.list',
    signinCard = 'application/vnd.microsoft.card.signin'
};

export interface CardMessage {
    cardType: TeamsCardType;
    content: Json;
}

export function isCardMessage(object: unknown): object is CardMessage {
    return Object.prototype.hasOwnProperty.call(object, "cardType")
        && Object.prototype.hasOwnProperty.call(object, "content");
}