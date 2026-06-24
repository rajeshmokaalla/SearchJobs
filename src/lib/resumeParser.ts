import { ResumeData } from '@/types/jobs';

const TECH_SKILLS = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'swift', 'kotlin',
  'react', 'angular', 'vue', 'next.js', 'node.js', 'express', 'django', 'flask', 'spring',
  'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ci/cd',
  'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'nlp',
  'html', 'css', 'sass', 'tailwind', 'graphql', 'rest api',
  'git', 'linux', 'agile', 'scrum', 'devops', 'microservices',
  'data analysis', 'tableau', 'power bi', 'excel', 'r', 'scala', 'spark',
  'product management', 'project management', 'jira', 'confluence',
  'figma', 'photoshop', 'ui/ux', 'user research',
  'sales', 'marketing', 'seo', 'google analytics', 'crm', 'salesforce',
  'accounting', 'finance', 'financial modeling',
  'nursing', 'healthcare', 'clinical', 'medical',
  'legal', 'compliance', 'contracts',
];

const JOB_TITLE_PATTERNS = [
  /(?:senior|junior|lead|principal|staff)?\s*(?:software|frontend|backend|full.?stack|mobile|ios|android|web)\s*(?:engineer|developer|architect)/gi,
  /(?:data|ml|ai|machine learning|research)\s*(?:scientist|engineer|analyst)/gi,
  /(?:product|project|program)\s*manager/gi,
  /(?:devops|platform|cloud|infrastructure|site reliability)\s*engineer/gi,
  /(?:ui|ux|product|graphic)\s*designer/gi,
  /(?:marketing|growth|digital)\s*(?:manager|specialist|analyst)/gi,
  /(?:sales|account|business development)\s*(?:manager|executive|representative)/gi,
  /(?:financial|business|data|systems)\s*analyst/gi,
  /(?:registered|licensed)\s*nurse/gi,
  /(?:project|program)\s*coordinator/gi,
  /(?:human resources|hr)\s*(?:manager|specialist|generalist)/gi,
  /(?:chief|head of|vp of|director of)\s*\w+/gi,
];

export function extractResumeData(text: string): ResumeData {
  const lower = text.toLowerCase();
  const foundSkills = TECH_SKILLS.filter(skill => lower.includes(skill.toLowerCase()));

  let jobTitle = '';
  for (const pattern of JOB_TITLE_PATTERNS) {
    const match = text.match(pattern);
    if (match?.[0]) { jobTitle = match[0].trim(); break; }
  }

  const keywords: string[] = [...foundSkills.slice(0, 10)];
  if (jobTitle) jobTitle.split(/\s+/).forEach(w => { if (w.length > 2) keywords.push(w.toLowerCase()); });
  const uniqueKeywords = [...new Set(keywords)].slice(0, 8);

  return {
    text,
    skills: foundSkills,
    jobTitle: jobTitle || uniqueKeywords.slice(0, 3).join(' '),
    keywords: uniqueKeywords,
  };
}

export function buildSearchQuery(resumeData: ResumeData): string {
  return resumeData.jobTitle || resumeData.keywords.slice(0, 4).join(' ') || 'software engineer';
}
