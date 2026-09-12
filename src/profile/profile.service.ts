import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { profile } from './profile.data';
import { Profile } from './profile.types';

export interface SiteMeta {
  title: string;
  description: string;
  url: string;
  canonical: string;
}

@Injectable()
export class ProfileService {
  constructor(private readonly config: ConfigService) {}

  getProfile(): Profile {
    return profile;
  }

  getMeta(): SiteMeta {
    const url = this.config.get<string>('SITE_URL', 'http://localhost:3000').replace(/\/$/, '');
    return {
      title: `${profile.name} — ${profile.role}`,
      description: profile.intro,
      url,
      canonical: `${url}/`,
    };
  }

  /** schema.org Person payload, rendered inline for search engines. */
  getStructuredData(): string {
    const meta = this.getMeta();
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile.name,
      jobTitle: profile.role,
      description: profile.intro,
      email: `mailto:${profile.email}`,
      url: meta.url,
      address: { '@type': 'PostalAddress', addressLocality: 'Durham', addressCountry: 'GB' },
      sameAs: profile.socials.filter((s) => !s.url.startsWith('mailto:')).map((s) => s.url),
      alumniOf: profile.education.map((e) => ({
        '@type': 'EducationalOrganization',
        name: e.institution,
      })),
      worksFor: { '@type': 'Organization', name: profile.experience[0].company },
      knowsLanguage: profile.languages.map((l) => l.name),
    });
  }
}
