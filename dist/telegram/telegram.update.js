"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramUpdate = void 0;
const common_1 = require("@nestjs/common");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const telegraf_1 = require("telegraf");
const databot_service_1 = require("../database/databot.service");
let TelegramUpdate = class TelegramUpdate {
    constructor(bot, dataBotService) {
        this.bot = bot;
        this.dataBotService = dataBotService;
    }
    async userTelegram(ctx) {
        const userTelegram = {
            id: ctx.from.id.toString(),
            username: ctx.from.username,
            first_name: ctx.from.first_name,
            last_name: ctx.from.last_name,
            language_code: ctx.from.language_code,
        };
        return userTelegram;
    }
    async userBot(telegramId) {
        const dataBot = await this.dataBotService.getDataBot();
        const user = dataBot.users.find((user) => user.telegram_id === telegramId);
        return user;
    }
    async start(ctx) {
        const userTG = await this.userTelegram(ctx);
        const user = await this.userBot(userTG.id);
        if (!user) {
            await ctx.reply('👋 Привет! Кажется у вас нет доступа к боту.\n\n' +
                'Для регистрации или входа в боте свяжитесь с разработчиком:\n' +
                'https://t.me/abrosdaniel \n\n' +
                `и сообщите ваш ID: ${userTG.id}`);
            return;
        }
        else if (user.status === 'blocked') {
            await ctx.reply('⛔ Ваш аккаунт заблокирован.\n\n' +
                'Для восстановления аккаунта свяжитесь с разработчиком:\n' +
                'https://t.me/abrosdaniel \n\n' +
                `и сообщите ваш ID: ${user.telegram_id}`);
            return;
        }
        else {
            await ctx.reply(`👋🏻 Привет, ${userTG.first_name}!\n\n` +
                `В этом боте собрано много функционала и он постоянно пополняется новыми возможностями.\n\n` +
                `Давай начнем! 🚀`, telegraf_1.Markup.inlineKeyboard([
                [
                    telegraf_1.Markup.button.webApp('📋 Панель управления', 'https://cms.abros.dev'),
                ],
            ]));
        }
    }
    async onCallbackQuery(ctx) {
        const action = ctx.callbackQuery.data;
        const userTG = await this.userTelegram(ctx);
        const user = await this.userBot(userTG.id);
        if (!user) {
            await ctx.answerCbQuery('⚠️ Упс... Перезапустите бота и попробуйте снова.');
            return;
        }
        else if (user.status === 'blocked') {
            await ctx.answerCbQuery('⛔ Ваш аккаунт заблокирован.');
            return;
        }
        if (action === 'your_id') {
            await ctx.editMessageText(`👋🏻 Ваш ID:\n\n${userTG.id}`, telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback('↩️ Назад', 'back_main')],
            ]));
            return;
        }
        if (action === 'back_main') {
            await ctx.editMessageText(`👋🏻 Привет, ${userTG.first_name}!\n\n` +
                `В этом боте собрано много функционала и он постоянно пополняется новыми возможностями.\n\n` +
                `Давай начнем! 🚀`, telegraf_1.Markup.inlineKeyboard([
                [
                    telegraf_1.Markup.button.webApp('📋 Панель управления', 'https://cms.abros.dev'),
                ],
                [telegraf_1.Markup.button.callback('🆔 Ваш ID', 'your_id')],
            ]));
            return;
        }
    }
};
exports.TelegramUpdate = TelegramUpdate;
__decorate([
    (0, nestjs_telegraf_1.Start)(),
    __param(0, (0, nestjs_telegraf_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "start", null);
__decorate([
    (0, nestjs_telegraf_1.On)('callback_query'),
    __param(0, (0, nestjs_telegraf_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onCallbackQuery", null);
exports.TelegramUpdate = TelegramUpdate = __decorate([
    (0, nestjs_telegraf_1.Update)(),
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_telegraf_1.InjectBot)()),
    __metadata("design:paramtypes", [telegraf_1.Telegraf,
        databot_service_1.DataBotService])
], TelegramUpdate);
//# sourceMappingURL=telegram.update.js.map