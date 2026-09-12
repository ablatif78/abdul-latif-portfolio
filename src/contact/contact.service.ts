import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { CreateContactDto } from './dto/create-contact.dto';

export interface ContactResult {
  ok: true;
  message: string;
  delivered: boolean;
}

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private readonly mailService: MailService,
    private readonly config: ConfigService,
  ) {}

  async submit(dto: CreateContactDto): Promise<ContactResult> {
    if (!this.mailService.isConfigured) {
      // Without a Resend key the form still works locally, it just logs instead of sending.
      if (this.config.get<string>('NODE_ENV') === 'production') {
        throw new ServiceUnavailableException('Email delivery is not configured.');
      }

      this.logger.warn(
        `[dry run] Contact message from ${dto.name} <${dto.email}>: ${dto.message.slice(0, 200)}`,
      );
      return {
        ok: true,
        message: 'Message received (development dry run — set RESEND_API_KEY to deliver it).',
        delivered: false,
      };
    }

    const id = await this.mailService.sendContactMessage(dto);
    this.logger.log(`Contact message delivered (${id}) from ${dto.email}`);

    return {
      ok: true,
      message: 'Thanks — your message is on its way. I will get back to you soon.',
      delivered: true,
    };
  }
}
