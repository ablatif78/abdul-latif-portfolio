import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, Length, MaxLength, ValidateIf } from 'class-validator';

const trim = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CreateContactDto {
  @Transform(trim)
  @IsString()
  @Length(2, 80, { message: 'Please enter your name.' })
  name!: string;

  @Transform(trim)
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  @MaxLength(160)
  email!: string;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(140)
  subject?: string;

  @Transform(trim)
  @IsString()
  @Length(10, 3000, { message: 'Your message should be at least 10 characters.' })
  message!: string;

  /**
   * Honeypot: hidden from real users, so any value means a bot filled it in.
   * Validated (rather than silently ignored) so the request is rejected early.
   */
  @Transform(trim)
  @IsOptional()
  @ValidateIf((_o, value) => value !== undefined && value !== '')
  @Length(0, 0, { message: 'Rejected.' })
  website?: string;
}
