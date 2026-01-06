import { Module } from '@nestjs/common';
import { DirectusService } from './directus.service';
import { ExchangeService } from './exchange.service';
import { DataBotService } from './databot.service';

@Module({
  providers: [DirectusService, ExchangeService, DataBotService],
  exports: [DirectusService, ExchangeService, DataBotService],
})
export class DatabaseModule {}
