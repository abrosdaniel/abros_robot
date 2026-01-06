import { DirectusService } from './directus.service';
export declare class ExchangeService {
    private readonly directusService;
    constructor(directusService: DirectusService);
    getExchange(): Promise<any>;
}
