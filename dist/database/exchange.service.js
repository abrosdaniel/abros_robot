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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExchangeService = void 0;
const common_1 = require("@nestjs/common");
const sdk_1 = require("@directus/sdk");
const directus_service_1 = require("./directus.service");
let ExchangeService = class ExchangeService {
    constructor(directusService) {
        this.directusService = directusService;
    }
    async getExchange() {
        const client = this.directusService.getClient();
        const item = await client.request((0, sdk_1.readItems)('exchange', {
            fields: ['status', 'currencys.*', 'resources.*'],
            limit: 1,
        }));
        return item;
    }
};
exports.ExchangeService = ExchangeService;
exports.ExchangeService = ExchangeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [directus_service_1.DirectusService])
], ExchangeService);
//# sourceMappingURL=exchange.service.js.map