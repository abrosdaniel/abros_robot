import { Injectable } from '@nestjs/common';
import { Context, InjectBot, On, Start, Update } from 'nestjs-telegraf';
import { Telegraf, Markup } from 'telegraf';
import { DataBotService } from '../database/databot.service';

@Update()
@Injectable()
export class TelegramUpdate {
  constructor(
    @InjectBot()
    private bot: Telegraf,
    private readonly dataBotService: DataBotService,
  ) {}

  private async userTelegram(ctx: any) {
    const userTelegram: any = {
      id: ctx.from.id.toString(),
      username: ctx.from.username,
      first_name: ctx.from.first_name,
      last_name: ctx.from.last_name,
      language_code: ctx.from.language_code,
    };

    return userTelegram;
  }

  private async userBot(telegramId: string) {
    const dataBot = await this.dataBotService.getDataBot();
    const user = dataBot.users.find(
      (user: any) => user.telegram_id === telegramId,
    );
    return user;
  }

  @Start()
  async start(@Context() ctx: any) {
    const userTG = await this.userTelegram(ctx);
    const user = await this.userBot(userTG.id);

    if (!user) {
      await ctx.reply(
        '👋 Привет! Кажется у вас нет доступа к боту.\n\n' +
          'Для регистрации или входа в боте свяжитесь с разработчиком:\n' +
          'https://t.me/abrosdaniel \n\n' +
          `и сообщите ваш ID: ${userTG.id}`,
      );
      return;
    } else if (user.status === 'blocked') {
      await ctx.reply(
        '⛔ Ваш аккаунт заблокирован.\n\n' +
          'Для восстановления аккаунта свяжитесь с разработчиком:\n' +
          'https://t.me/abrosdaniel \n\n' +
          `и сообщите ваш ID: ${user.telegram_id}`,
      );
      return;
    } else {
      await ctx.reply(
        `👋🏻 Привет, ${userTG.first_name}!\n\n` +
          `В этом боте собрано много функционала и он постоянно пополняется новыми возможностями.\n\n` +
          `Давай начнем! 🚀`,
        Markup.inlineKeyboard([
          [
            Markup.button.webApp(
              '📋 Панель управления',
              'https://cms.abros.dev',
            ),
          ],
        ]),
      );
    }
  }

  @On('callback_query')
  async onCallbackQuery(@Context() ctx: any) {
    const action = ctx.callbackQuery.data as string;
    const userTG = await this.userTelegram(ctx);
    const user = await this.userBot(userTG.id);

    if (!user) {
      await ctx.answerCbQuery(
        '⚠️ Упс... Перезапустите бота и попробуйте снова.',
      );
      return;
    } else if (user.status === 'blocked') {
      await ctx.answerCbQuery('⛔ Ваш аккаунт заблокирован.');
      return;
    }

    if (action === 'your_id') {
      await ctx.editMessageText(
        `👋🏻 Ваш ID:\n\n${userTG.id}`,
        Markup.inlineKeyboard([
          [Markup.button.callback('↩️ Назад', 'back_main')],
        ]),
      );
      return;
    }

    if (action === 'back_main') {
      await ctx.editMessageText(
        `👋🏻 Привет, ${userTG.first_name}!\n\n` +
          `В этом боте собрано много функционала и он постоянно пополняется новыми возможностями.\n\n` +
          `Давай начнем! 🚀`,
        Markup.inlineKeyboard([
          [
            Markup.button.webApp(
              '📋 Панель управления',
              'https://cms.abros.dev',
            ),
          ],
          [Markup.button.callback('🆔 Ваш ID', 'your_id')],
        ]),
      );
      return;
    }
  }
}
