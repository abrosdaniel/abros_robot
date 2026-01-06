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
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const telegraf_1 = require("telegraf");
const marked_1 = require("marked");
let TelegramService = class TelegramService {
    constructor(bot) {
        this.bot = bot;
        marked_1.marked.setOptions({
            gfm: true,
        });
    }
    async convertMarkdownToHtml(markdown) {
        const html = await marked_1.marked.parse(markdown, { gfm: true });
        return (String(html)
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<p>/g, '')
            .replace(/<\/p>/g, '\n')
            .trim());
    }
    replaceTemplateVariables(template, currencies) {
        let result = template;
        const currencyMap = {};
        currencies.forEach((currency) => {
            currencyMap[currency.code] = currency;
        });
        const variableRegex = /\$\{(\w+)\.(\w+)\}/g;
        result = result.replace(variableRegex, (match, code, field) => {
            const currency = currencyMap[code];
            if (currency && currency[field] !== undefined) {
                return currency[field];
            }
            return match;
        });
        return result;
    }
    formatChatId(resource) {
        const id = resource.id;
        if (id.startsWith('@') || id.startsWith('-')) {
            return id;
        }
        const numericId = String(id).replace(/[^0-9]/g, '');
        if (!numericId) {
            return id;
        }
        if (resource.type === 'channel') {
            return `-100${numericId}`;
        }
        if (resource.type === 'group') {
            return `-${numericId}`;
        }
        return numericId;
    }
    async publishRates(exchange) {
        const results = [];
        const telegramResources = (exchange.resources || []).filter((resource) => resource.platform === 'telegram' && resource.status === 'active');
        if (telegramResources.length === 0) {
            console.log('[TelegramService] No active telegram resources found');
            return { sent: 0, results: [] };
        }
        console.log(`[TelegramService] Found ${telegramResources.length} active telegram resources`);
        for (const resource of telegramResources) {
            try {
                let message = this.replaceTemplateVariables(resource.template || '', exchange.currencys || []);
                if (!message.trim()) {
                    console.warn(`[TelegramService] Empty template for resource ${resource.id}`);
                    results.push({
                        resourceId: resource.id,
                        status: 'skipped',
                        reason: 'empty_template',
                    });
                    continue;
                }
                message = await this.convertMarkdownToHtml(message);
                const chatId = this.formatChatId(resource);
                console.log(`[TelegramService] Sending to chat_id: ${chatId} (original: ${resource.id}, type: ${resource.type})`);
                try {
                    await this.bot.telegram.sendMessage(chatId, message, {
                        parse_mode: 'HTML',
                        link_preview_options: {
                            is_disabled: true,
                        },
                    });
                    console.log(`[TelegramService] Message sent successfully to ${resource.id}`);
                    results.push({
                        resourceId: resource.id,
                        status: 'success',
                        sentAs: 'channel',
                    });
                }
                catch (error) {
                    console.error(`[TelegramService] Failed to send to ${resource.id}:`, error.message);
                    results.push({
                        resourceId: resource.id,
                        status: 'failed',
                        error: error.message,
                        errorCode: error.response?.error_code,
                    });
                }
            }
            catch (error) {
                console.error(`[TelegramService] Error processing resource ${resource.id}:`, error.message);
                results.push({
                    resourceId: resource.id,
                    status: 'failed',
                    error: error.message,
                });
            }
        }
        const successCount = results.filter((r) => r.status === 'success').length;
        return {
            sent: successCount,
            total: telegramResources.length,
            results,
        };
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_telegraf_1.InjectBot)()),
    __metadata("design:paramtypes", [telegraf_1.Telegraf])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map