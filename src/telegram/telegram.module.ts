import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';

import { TelegramUpdate } from './telegram.update';
import { TelegramService } from './telegram.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('TELEGRAM_BOT_TOKEN'),
        middlewares: [
          session({
            defaultSession: () => ({}),
            getSessionKey: (ctx) => ctx.from?.id.toString(),
          }),
        ],
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TelegramUpdate, TelegramService],
  exports: [TelegramUpdate, TelegramService],
})
export class TelegramModule {}
