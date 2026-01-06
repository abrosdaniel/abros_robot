import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { marked } from 'marked';

@Injectable()
export class TelegramService {
  constructor(@InjectBot() private readonly bot: Telegraf) {
    marked.setOptions({
      gfm: true,
    });
  }

  private async convertMarkdownToHtml(markdown: string): Promise<string> {
    const html = await marked.parse(markdown, { gfm: true });
    return (
      String(html)
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<p>/g, '')
        .replace(/<\/p>/g, '\n')
        // .replace(/<h[1-6]>/g, '<b>')
        // .replace(/<\/h[1-6]>/g, '</b>\n')
        .trim()
    );
  }

  private replaceTemplateVariables(
    template: string,
    currencies: any[],
  ): string {
    let result = template;

    const currencyMap: Record<string, any> = {};
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

  private formatChatId(resource: any): string {
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

  async publishRates(exchange: any): Promise<any> {
    const results = [];

    const telegramResources = (exchange.resources || []).filter(
      (resource: any) =>
        resource.platform === 'telegram' && resource.status === 'active',
    );

    if (telegramResources.length === 0) {
      console.log('[TelegramService] No active telegram resources found');
      return { sent: 0, results: [] };
    }

    console.log(
      `[TelegramService] Found ${telegramResources.length} active telegram resources`,
    );

    for (const resource of telegramResources) {
      try {
        let message = this.replaceTemplateVariables(
          resource.template || '',
          exchange.currencys || [],
        );

        if (!message.trim()) {
          console.warn(
            `[TelegramService] Empty template for resource ${resource.id}`,
          );
          results.push({
            resourceId: resource.id,
            status: 'skipped',
            reason: 'empty_template',
          });
          continue;
        }

        message = await this.convertMarkdownToHtml(message);

        const chatId = this.formatChatId(resource);
        console.log(
          `[TelegramService] Sending to chat_id: ${chatId} (original: ${resource.id}, type: ${resource.type})`,
        );

        try {
          await this.bot.telegram.sendMessage(chatId, message, {
            parse_mode: 'HTML',
            link_preview_options: {
              is_disabled: true,
            },
          });

          console.log(
            `[TelegramService] Message sent successfully to ${resource.id}`,
          );
          results.push({
            resourceId: resource.id,
            status: 'success',
            sentAs: 'channel',
          });
        } catch (error: any) {
          console.error(
            `[TelegramService] Failed to send to ${resource.id}:`,
            error.message,
          );
          results.push({
            resourceId: resource.id,
            status: 'failed',
            error: error.message,
            errorCode: error.response?.error_code,
          });
        }
      } catch (error: any) {
        console.error(
          `[TelegramService] Error processing resource ${resource.id}:`,
          error.message,
        );
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
}
