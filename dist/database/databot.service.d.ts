import { DirectusService } from './directus.service';
export declare class DataBotService {
    private readonly directusService;
    constructor(directusService: DirectusService);
    getDataBot(): Promise<any>;
    validateAPIKey(key: string): Promise<any>;
}
