import { ShowUserProfile } from "./showUserProfileCommand";
import { BotCommand } from "./botCommand";

const commands: BotCommand[] = [
  new ShowUserProfile()
];

export class CommandsHelper {
  static async triggerCommand(userInput: string, parameters: any) {
    for (let command of commands) {
      if (command.expressionMatchesText(userInput)) {
        await command.run(parameters);
        break;
      }
    }
  }
}
