export interface SocialLink {
  label: string;
  handle: string;
  url: string;
}

export interface Experience {
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  start: string;
  end: string;
  current?: boolean;
  summary: string;
  highlights: string[];
  stack: string[];
}

export interface Project {
  title: string;
  kind: string;
  period: string;
  description: string;
  stack: string[];
  links: { label: string; url: string }[];
}

export interface Publication {
  title: string;
  authors: string;
  venue: string;
  date: string;
  indexed: string;
  url: string;
}

export interface Education {
  degree: string;
  institution: string;
  institutionUrl?: string;
  location: string;
  period: string;
  grade: string;
  details?: string[];
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface Language {
  name: string;
  level: string;
  note: string;
}

export interface TrainingItem {
  title: string;
  organiser: string;
  period: string;
  description: string;
}

export interface VolunteeringItem {
  role: string;
  organisation: string;
  period: string;
  highlights: string[];
}

export interface Stat {
  value: string;
  label: string;
}

export interface NavItem {
  id: string;
  label: string;
}

export interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Cv {
  /** Public route visitors hit. */
  href: string;
  /** File inside public/ that is served. */
  source: string;
  /** Filename the visitor's browser saves it as. */
  filename: string;
}

export interface Profile {
  name: string;
  photo: Photo;
  cv: Cv;
  initials: string;
  role: string;
  tagline: string;
  intro: string;
  about: string[];
  location: string;
  origin: string;
  email: string;
  phone: string;
  availability: string;
  socials: SocialLink[];
  stats: Stat[];
  nav: NavItem[];
  experience: Experience[];
  projects: Project[];
  publications: Publication[];
  education: Education[];
  skills: SkillGroup[];
  languages: Language[];
  awards: string[];
  training: TrainingItem[];
  volunteering: VolunteeringItem[];
  creative: { title: string; description: string; url: string };
}
