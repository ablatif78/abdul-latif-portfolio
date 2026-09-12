import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ContactResult, ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('api/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  /** Five messages per hour from one IP is plenty for a portfolio contact form. */
  @Throttle({ default: { limit: 5, ttl: 3_600_000 } })
  @Post()
  @HttpCode(HttpStatus.OK)
  submit(@Body() dto: CreateContactDto): Promise<ContactResult> {
    return this.contactService.submit(dto);
  }
}
