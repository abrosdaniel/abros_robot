import { Response } from 'express';
import { ExchangeService } from './database/exchange.service';
import { TelegramService } from './telegram/telegram.service';
import { DataBotService } from './database/databot.service';
export declare class AppController {
    private readonly exchangeService;
    private readonly telegramService;
    private readonly dataBotService;
    private bot;
    constructor(exchangeService: ExchangeService, telegramService: TelegramService, dataBotService: DataBotService);
    handleWebhook(apiKey: string, body: any, res: Response): Promise<Response<any, Record<string, any>>>;
}
