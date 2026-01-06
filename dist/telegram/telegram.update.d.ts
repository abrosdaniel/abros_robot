import { Telegraf } from 'telegraf';
import { DataBotService } from '../database/databot.service';
export declare class TelegramUpdate {
    private bot;
    private readonly dataBotService;
    constructor(bot: Telegraf, dataBotService: DataBotService);
    private userTelegram;
    private userBot;
    start(ctx: any): Promise<void>;
    onCallbackQuery(ctx: any): Promise<void>;
}
