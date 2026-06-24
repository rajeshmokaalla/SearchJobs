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
