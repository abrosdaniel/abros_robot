import { Injectable } from '@nestjs/common';
import {
  createDirectus,
  staticToken,
  rest,
  DirectusClient,
} from '@directus/sdk';

@Injectable()
export class DirectusService {
  private readonly client;

  constructor() {
    const directusUrl = process.env.DIRECTUS_URL;
    const directusToken = process.env.DIRECTUS_TOKEN;

    if (!directusUrl || !directusToken) {
      throw new Error('DIRECTUS_URL and DIRECTUS_TOKEN must be set');
    }

    this.client = createDirectus(directusUrl)
      .with(staticToken(directusToken))
      .with(rest());
  }

  getClient(): DirectusClient<any> {
    return this.client;
  }
}
