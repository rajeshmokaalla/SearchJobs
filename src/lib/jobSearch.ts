import { Job, JobSearchResult } from '@/types/jobs';

// MyCareersFuture — Singapore's official government jobs portal, free, no key needed
export async function searchMyCareersFuture(query: string): Promise<JobSearchResult> {
  const url = `https://api.mycareersfuture.gov.sg/v2/jobs?search=${encodeURIComponent(query)}&limit=20&page=0&sortBy=new_posting_date`;
  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      const text = await res.text();
      return { jobs: [], total: 0, source: 'MyCareersFuture', error: `MyCareersFuture error ${res.status}: ${text.slice(0, 200)}` };
    }
    const data = await res.json();

    const jobs: Job[] = (data.results || []).map((item: MCFJob) => {
      const salaryMin = item.salary?.minimum;
      const salaryMax = item.salary?.maximum;
      const salaryType = item.salary?.type || 'monthly';
      let salary: string | undefined;
      if (salaryMin && salaryMax) salary = `S$${salaryMin.toLocaleString()} – S$${salaryMax.toLocaleString()} / ${salaryType}`;
      else if (salaryMin) salary = `From S$${salaryMin.toLocaleString()} / ${salaryType}`;

      const location = [
        item.address?.building,
        item.address?.street,
        item.address?.postalCode ? `Singapore ${item.address.postalCode}` : 'Singapore',
      ].filter(Boolean).join(', ') || 'Singapore';

      const title = item.title || '';
      const company = item.company?.name || '';
      const linkedInUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(title + (company ? ' ' + company : ''))}&location=Singapore`;

      return {
        id: item.uuid || item.metadata?.jobPostId || String(Math.random()),
        title,
        company: company || 'Unknown Company',
        location,
        description: item.description?.replace(/<[^>]*>/g, '').slice(0, 500) || '',
        salary,
        postedDate: item.metadata?.newPostingDate,
        url: linkedInUrl,
        source: 'MyCareersFuture',
        jobType: item.employmentTypes?.[0] || '',
      };
    });

    return { jobs, total: data.total ?? jobs.length, source: 'MyCareersFuture' };
  } catch (err) {
    return { jobs: [], total: 0, source: 'MyCareersFuture', error: String(err) };
  }
}

interface MCFJob {
  uuid?: string;
  title?: string;
  description?: string;
  company?: { name: string };
  salary?: { minimum?: number; maximum?: number; type?: string };
  address?: { block?: string; street?: string; building?: string; postalCode?: string };
  metadata?: { jobPostId?: string; newPostingDate?: string };
  employmentTypes?: string[];
  positionLevels?: string[];
}
