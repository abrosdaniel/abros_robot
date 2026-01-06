import { DirectusClient } from '@directus/sdk';
export declare class DirectusService {
    private readonly client;
    constructor();
    getClient(): DirectusClient<any>;
}
