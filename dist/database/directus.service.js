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
exports.DirectusService = void 0;
const common_1 = require("@nestjs/common");
const sdk_1 = require("@directus/sdk");
let DirectusService = class DirectusService {
    constructor() {
        const directusUrl = process.env.DIRECTUS_URL;
        const directusToken = process.env.DIRECTUS_TOKEN;
        if (!directusUrl || !directusToken) {
            throw new Error('DIRECTUS_URL and DIRECTUS_TOKEN must be set');
        }
        this.client = (0, sdk_1.createDirectus)(directusUrl)
            .with((0, sdk_1.staticToken)(directusToken))
            .with((0, sdk_1.rest)());
    }
    getClient() {
        return this.client;
    }
};
exports.DirectusService = DirectusService;
exports.DirectusService = DirectusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DirectusService);
//# sourceMappingURL=directus.service.js.map