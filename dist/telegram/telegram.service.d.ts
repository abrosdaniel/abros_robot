import { Telegraf } from 'telegraf';
export declare class TelegramService {
    private readonly bot;
    constructor(bot: Telegraf);
    private replaceTemplateVariables;
    private formatChatId;
    publishRates(exchange: any): Promise<any>;
}
