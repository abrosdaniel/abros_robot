"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const telegraf_1 = require("telegraf");
const telegram_update_1 = require("./telegram.update");
const telegram_service_1 = require("./telegram.service");
const database_module_1 = require("../database/database.module");
let TelegramModule = class TelegramModule {
};
exports.TelegramModule = TelegramModule;
exports.TelegramModule = TelegramModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            database_module_1.DatabaseModule,
            nestjs_telegraf_1.TelegrafModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    token: configService.get('BOT_TOKEN'),
                    middlewares: [
                        (0, telegraf_1.session)({
                            defaultSession: () => ({}),
                            getSessionKey: (ctx) => ctx.from?.id.toString(),
                        }),
                    ],
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [telegram_update_1.TelegramUpdate, telegram_service_1.TelegramService],
        exports: [telegram_update_1.TelegramUpdate, telegram_service_1.TelegramService],
    })
], TelegramModule);
//# sourceMappingURL=telegram.module.js.map