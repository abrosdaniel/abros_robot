import {
  Controller,
  Post,
  Headers,
  Body,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ExchangeService } from './database/exchange.service';
import { TelegramService } from './telegram/telegram.service';
import { DataBotService } from './database/databot.service';
import { Telegraf } from 'telegraf';

@Controller('api/v1')
export class AppController {
  private bot: Telegraf;

  constructor(
    private readonly exchangeService: ExchangeService,
    private readonly telegramService: TelegramService,
    private readonly dataBotService: DataBotService,
  ) {}

  @Post('exchange')
  async handleWebhook(
    @Headers('x-abrosbot-key') apiKey: string,
    @Body() body: any,
    @Res() res: Response,
  ) {
    console.log('Received webhook:', JSON.stringify(body, null, 2));
    console.log('Event type:', body?.event);
    if (!apiKey) {
      console.log('Access denied: API key is missing');
      return res.status(HttpStatus.FORBIDDEN).json({
        error: 'Access denied: API key is missing',
      });
    }

    const isValidKey = await this.dataBotService.validateAPIKey(apiKey);
    if (!isValidKey) {
      console.log('Access denied: Invalid API key');
      return res.status(HttpStatus.FORBIDDEN).json({
        error: 'Access denied: Invalid API key',
      });
    }

    if (body.event === 'exchange_publish_rates') {
      try {
        const exchange = await this.exchangeService.getExchange();
        if (!exchange) {
          return res.status(HttpStatus.NOT_FOUND).json({
            error: 'Exchange data not found',
            message: 'No exchange data available',
          });
        }

        const publishResult = await this.telegramService.publishRates(exchange);

        return res.status(HttpStatus.OK).json({
          status: 'success',
          message: 'Exchange rates published successfully',
          publish: publishResult,
        });
      } catch (error) {
        console.error('Error processing currency update:', error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: 'Failed to process currency update',
          message: error.message,
        });
      }
    }

    return res.status(HttpStatus.BAD_REQUEST).json({
      error: 'Unsupported event type',
    });
  }
}
