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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const exchange_service_1 = require("./database/exchange.service");
const telegram_service_1 = require("./telegram/telegram.service");
const databot_service_1 = require("./database/databot.service");
let AppController = class AppController {
    constructor(exchangeService, telegramService, dataBotService) {
        this.exchangeService = exchangeService;
        this.telegramService = telegramService;
        this.dataBotService = dataBotService;
    }
    async handleWebhook(apiKey, body, res) {
        console.log('Received webhook:', JSON.stringify(body, null, 2));
        console.log('Event type:', body?.event);
        if (!apiKey) {
            console.log('Access denied: API key is missing');
            return res.status(common_1.HttpStatus.FORBIDDEN).json({
                error: 'Access denied: API key is missing',
            });
        }
        const isValidKey = await this.dataBotService.validateAPIKey(apiKey);
        if (!isValidKey) {
            console.log('Access denied: Invalid API key');
            return res.status(common_1.HttpStatus.FORBIDDEN).json({
                error: 'Access denied: Invalid API key',
            });
        }
        if (body.event === 'exchange_publish_rates') {
            try {
                const exchange = await this.exchangeService.getExchange();
                if (!exchange) {
                    return res.status(common_1.HttpStatus.NOT_FOUND).json({
                        error: 'Exchange data not found',
                        message: 'No exchange data available',
                    });
                }
                const publishResult = await this.telegramService.publishRates(exchange);
                return res.status(common_1.HttpStatus.OK).json({
                    status: 'success',
                    message: 'Exchange rates published successfully',
                    publish: publishResult,
                });
            }
            catch (error) {
                console.error('Error processing currency update:', error);
                return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                    error: 'Failed to process currency update',
                    message: error.message,
                });
            }
        }
        return res.status(common_1.HttpStatus.BAD_REQUEST).json({
            error: 'Unsupported event type',
        });
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Post)('exchange'),
    __param(0, (0, common_1.Headers)('x-abrosbot-key')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "handleWebhook", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)('api/v1'),
    __metadata("design:paramtypes", [exchange_service_1.ExchangeService,
        telegram_service_1.TelegramService,
        databot_service_1.DataBotService])
], AppController);
//# sourceMappingURL=app.controller.js.map