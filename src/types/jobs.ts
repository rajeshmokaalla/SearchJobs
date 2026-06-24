export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  postedDate?: string;
  url: string;
  source: string;
  jobType?: string;
}

export interface JobSearchResult {
  jobs: Job[];
  total: number;
  source: string;
  error?: string;
}

export interface ResumeData {
  text: string;
  skills: string[];
  jobTitle: string;
  keywords: string[];
}

export const COUNTRIES: Record<string, { name: string; code: string; flag: string }> = {
  us: { name: 'United States', code: 'us', flag: '🇺🇸' },
  gb: { name: 'United Kingdom', code: 'gb', flag: '🇬🇧' },
  ca: { name: 'Canada', code: 'ca', flag: '🇨🇦' },
  au: { name: 'Australia', code: 'au', flag: '🇦🇺' },
  de: { name: 'Germany', code: 'de', flag: '🇩🇪' },
  fr: { name: 'France', code: 'fr', flag: '🇫🇷' },
  nl: { name: 'Netherlands', code: 'nl', flag: '🇳🇱' },
  sg: { name: 'Singapore', code: 'sg', flag: '🇸🇬' },
  in: { name: 'India', code: 'in', flag: '🇮🇳' },
  nz: { name: 'New Zealand', code: 'nz', flag: '🇳🇿' },
  za: { name: 'South Africa', code: 'za', flag: '🇿🇦' },
  br: { name: 'Brazil', code: 'br', flag: '🇧🇷' },
  mx: { name: 'Mexico', code: 'mx', flag: '🇲🇽' },
  at: { name: 'Austria', code: 'at', flag: '🇦🇹' },
  be: { name: 'Belgium', code: 'be', flag: '🇧🇪' },
};
