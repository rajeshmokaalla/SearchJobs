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
  'selenium', 'cypress', 'playwright', 'appium', 'junit', 'testng',
  'quality assurance', 'quality engineering', 'test automation',
];

const JOB_TITLE_PATTERNS = [
  // QA / QE / Testing — checked first so "Senior QE Lead" wins over generic software patterns
  /(?:senior|junior|lead|principal|staff)?\s*(?:qe|qa|quality\s*(?:assurance|engineer(?:ing)?)|test(?:ing)?)\s*(?:lead|manager|engineer|analyst|architect|specialist)/gi,
  /(?:senior|junior|lead|principal|staff)?\s*(?:automation|manual|performance|sdet)\s*(?:test(?:er|ing)?|engineer|analyst)/gi,
  /(?:software\s*)?test\s*(?:lead|manager|architect)/gi,
  // Software engineering
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

  // Try the first 10 lines (header/summary) first so the candidate's own title wins
  // over any role mentioned deeper in job descriptions or bullet points.
  const firstLines = text.split('\n').slice(0, 10).join('\n');
  let jobTitle = '';

  for (const pattern of JOB_TITLE_PATTERNS) {
    pattern.lastIndex = 0;
    const match = firstLines.match(pattern);
    if (match?.[0]) { jobTitle = match[0].trim(); break; }
  }

  if (!jobTitle) {
    for (const pattern of JOB_TITLE_PATTERNS) {
      pattern.lastIndex = 0;
      const match = text.match(pattern);
      if (match?.[0]) { jobTitle = match[0].trim(); break; }
    }
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
