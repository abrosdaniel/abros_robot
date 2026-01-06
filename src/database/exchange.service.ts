import { Injectable } from '@nestjs/common';
import { readItems } from '@directus/sdk';
import { DirectusService } from './directus.service';

@Injectable()
export class ExchangeService {
  constructor(private readonly directusService: DirectusService) {}

  async getExchange(): Promise<any> {
    const client = this.directusService.getClient() as any;
    const item = await client.request(
      // @ts-ignore
      readItems('exchange', {
        fields: ['status', 'currencys.*', 'resources.*'],
        limit: 1,
      }),
    );
    return item;
  }
}
