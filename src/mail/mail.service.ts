import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { readSetting } from '../common/config.util';
import { CreateContactDto } from '../contact/dto/create-contact.dto';

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly client: Resend | null;
  private readonly from: string;
  private readonly to: string;
  private readonly sendAcknowledgement: boolean;

  constructor(private readonly config: ConfigService) {
    const apiKey = readSetting(this.config, 'RESEND_API_KEY', '');
    this.client = apiKey ? new Resend(apiKey) : null;
    this.from = readSetting(this.config, 'MAIL_FROM', 'Portfolio <onboarding@resend.dev>');
    this.to = readSetting(this.config, 'MAIL_TO', 'abdullatif.cse@gmail.com');
    this.sendAcknowledgement = readSetting(this.config, 'MAIL_SEND_ACK', 'false') === 'true';

    if (!this.client) {
      this.logger.warn('RESEND_API_KEY is not set — contact emails will not be delivered.');
    } else {
      this.logger.log(`Resend ready. Sending as "${this.from}" to "${this.to}".`);
    }

    if (this.from.includes('onboarding@resend.dev')) {
      this.logger.warn(
        'MAIL_FROM uses onboarding@resend.dev, which only delivers to the address that ' +
          'registered the Resend account. Verify a domain for real delivery.',
      );
    }
  }

  get isConfigured(): boolean {
    return this.client !== null;
  }

  /** Delivers the contact-form message and, optionally, an acknowledgement to the sender. */
  async sendContactMessage(dto: CreateContactDto): Promise<string> {
    if (!this.client) {
      throw new ServiceUnavailableException('Email delivery is not configured.');
    }

    const subject = dto.subject?.length
      ? `Portfolio — ${dto.subject}`
      : `Portfolio — new message from ${dto.name}`;

    const { data, error } = await this.client.emails.send({
      from: this.from,
      to: [this.to],
      replyTo: dto.email,
      subject,
      text: this.buildText(dto),
      html: this.buildHtml(dto),
    });

    if (error) {
      // The full message can name the account's own address, so it stays in the
      // logs; the response carries only the classification.
      this.logger.error(
        `Resend rejected the message (from "${this.from}" to "${this.to}"): ` +
          `${error.name} — ${error.message}`,
      );
      throw new ServiceUnavailableException({
        statusCode: 503,
        error: 'Service Unavailable',
        message: 'The message could not be delivered right now.',
        reason: error.name,
        providerStatus: (error as { statusCode?: number }).statusCode ?? null,
        sender: this.from,
      });
    }

    if (this.sendAcknowledgement) {
      await this.sendAck(dto);
    }

    return data?.id ?? 'sent';
  }

  private async sendAck(dto: CreateContactDto): Promise<void> {
    const { error } = await this.client!.emails.send({
      from: this.from,
      to: [dto.email],
      subject: 'Thanks for getting in touch',
      text:
        `Hi ${dto.name},\n\n` +
        'Thanks for your message — it has landed in my inbox and I will reply shortly.\n\n' +
        'For reference, here is what you sent:\n\n' +
        `${dto.message}\n\n— Abdul Latif`,
    });

    // An acknowledgement failing should never fail the visitor's request.
    if (error) {
      this.logger.warn(`Acknowledgement email failed: ${error.message}`);
    }
  }

  private buildText(dto: CreateContactDto): string {
    return [
      `Name:    ${dto.name}`,
      `Email:   ${dto.email}`,
      `Subject: ${dto.subject ?? '—'}`,
      '',
      dto.message,
      '',
      `Sent from the portfolio contact form · ${new Date().toUTCString()}`,
    ].join('\n');
  }

  private buildHtml(dto: CreateContactDto): string {
    const rows = [
      ['Name', dto.name],
      ['Email', dto.email],
      ['Subject', dto.subject ?? '—'],
    ]
      .map(
        ([label, value]) => `
        <tr>
          <td style="padding:6px 16px 6px 0;color:#6b7280;font-size:13px;white-space:nowrap;">${label}</td>
          <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:500;">${escapeHtml(value)}</td>
        </tr>`,
      )
      .join('');

    return `<!doctype html>
<html>
  <body style="margin:0;padding:32px 16px;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;border:1px solid #e4e4e7;">
      <tr>
        <td style="padding:28px 28px 8px;">
          <p style="margin:0;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#71717a;">New portfolio message</p>
          <h1 style="margin:8px 0 20px;font-size:20px;color:#09090b;">${escapeHtml(dto.name)} got in touch</h1>
          <table role="presentation" cellpadding="0" cellspacing="0">${rows}</table>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 28px 28px;">
          <div style="padding:16px;background:#fafafa;border:1px solid #efeff1;border-radius:10px;color:#27272a;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(dto.message)}</div>
          <p style="margin:20px 0 0;font-size:12px;color:#a1a1aa;">Reply directly to this email to reach ${escapeHtml(dto.email)}.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
  }
}
