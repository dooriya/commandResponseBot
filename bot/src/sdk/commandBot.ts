// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { BotFrameworkAdapter, TeamsActivityHandler, TeamsInfo, TurnContext, WebRequest, WebResponse } from "botbuilder";
import { TeamsFxBotCommandHandler } from "./interface";
import { CommandResponseMiddleware } from "./middleware";

export type HttpMiddlewareHandler = (
  req: WebRequest,
  res: WebResponse,
  next: () => any
) => any;

export interface CommandBotOptions {
  appId?: string;
  appPassword?: string;
  commands?: TeamsFxBotCommandHandler[];
  sendWelcomeMessage?: boolean;
}
/**
 * A command bot for receiving command and sending a response.
 * @beta
 */
export class CommandBot {
  public readonly adapter: BotFrameworkAdapter;
  public readonly activityHandler: TeamsActivityHandler;
  private readonly middleware: CommandResponseMiddleware;
  public readonly defaultRoute = "/api/messages";
  private readonly options: CommandBotOptions;

  /**
   * Creates a new instance of the `CommandBot`.
   *
   * @beta
   */
  constructor(options: CommandBotOptions) {
    const { appId, appPassword } = (this.options = {
      sendWelcomeMessage: true,
      appId: process.env.BOT_ID,
      appPassword: process.env.BOT_PASSWORD,
      ...options,
    });
    const { commands } = options;
    this.middleware = new CommandResponseMiddleware(commands);
      
    this.adapter = new BotFrameworkAdapter({
      appId,
      appPassword,
    });

    this.adapter.use(this.middleware);
    this.adapter.onTurnError = this.handleTurnError.bind(this);
  }

  public registerCommand(commandHandler: TeamsFxBotCommandHandler): void {
    if (commandHandler) {
      this.middleware.commandHandlers.push(commandHandler);
    }
  }

  public registerCommands(commandHandlers: TeamsFxBotCommandHandler[]): void {
    if (commandHandlers) {
      this.middleware.commandHandlers.push(...commandHandlers);
    }
  }

  protected async handleTurnError(context: TurnContext, error: Error) {
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights.
    console.error(`\n [onTurnError] unhandled error: ${error}`);

    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity(
        "OnTurnError Trace",
        `${error}`,
        "https://www.botframework.com/schemas/error",
        "TurnError"
    );

    // Send a message to the user
    await context.sendActivity(`The bot encountered unhandled error:\n ${error.message}`);
    await context.sendActivity("To continue to run this bot, please fix the bot source code.");
  }

  requestMiddleware(): HttpMiddlewareHandler {
    return async (req, res, next) => {
      try {
        await this.adapter.processActivity(req, res, async (context) => {
          try {
            await this.activityHandler?.run(context);
          } catch (err) {
            console.error(err);
          }
        });
      } catch (err) {
        // Error message including "412" means it is waiting for user's consent, which is a normal process of SSO, sholdn't throw this error.
        if (!err.message.includes("412")) {
          console.error(err);
        }
      }
    };
  }
}
