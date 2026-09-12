import { Controller, Get } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Profile } from './profile.types';

@Controller('api/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /** The whole CV as JSON, in case the content is ever needed elsewhere. */
  @Get()
  getProfile(): Profile {
    return this.profileService.getProfile();
  }
}
