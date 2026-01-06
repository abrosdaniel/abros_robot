import { Injectable } from '@nestjs/common';
import { readItems } from '@directus/sdk';
import { DirectusService } from './directus.service';

@Injectable()
export class DataBotService {
  constructor(private readonly directusService: DirectusService) {}

  async getDataBot(): Promise<any> {
    const client = this.directusService.getClient() as any;
    const item = await client.request(
      // @ts-ignore
      readItems('bot', {
        fields: ['status', 'users.*'],
        limit: 1,
      }),
    );
    return item;
  }

  async validateAPIKey(key: string): Promise<any> {
    const client = this.directusService.getClient() as any;
    const item = await client.request(
      // @ts-ignore
      readItems('api_keys', {
        fields: ['*'],
        filter: {
          id: {
            _eq: key,
          },
          status: {
            _eq: 'active',
          },
          product: {
            _eq: 'telegram_bot',
          },
          date_expires: {
            _gte: new Date().toISOString(),
          },
        },
        limit: 1,
      }),
    );
    if (item.length > 0) {
      return true;
    }
    return false;
  }
}
