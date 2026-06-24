import { Job, JobSearchResult } from '@/types/jobs';

// MyCareersFuture — Singapore's official government jobs portal, free, no key needed
export async function searchMyCareersFuture(query: string): Promise<JobSearchResult> {
  const url = `https://api.mycareersfuture.gov.sg/v2/jobs?search=${encodeURIComponent(query)}&limit=20&offset=0`;
  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Origin': 'https://www.mycareersfuture.gov.sg',
        'Referer': 'https://www.mycareersfuture.gov.sg/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      const text = await res.text();
      return { jobs: [], total: 0, source: 'MyCareersFuture', error: `MCF API ${res.status}: ${text.slice(0, 300)}` };
    }
    const data = await res.json();

    const topKeys = Object.keys(data).join(', ');
    const rawTotal = data.total ?? data.count ?? data.totalCount ?? '?';

    if (!data.results) {
      return { jobs: [], total: 0, source: 'MyCareersFuture', error: `MCF keys: [${topKeys}] sample=${JSON.stringify(data).slice(0, 300)}` };
    }

    if (data.results.length === 0) {
      return { jobs: [], total: 0, source: 'MyCareersFuture', error: `MCF returned 0 results (total=${rawTotal}, countWithoutFilters=${data.countWithoutFilters ?? '?'}, keys=[${topKeys}])` };
    }

    const jobs: Job[] = (data.results as MCFJob[]).map((item) => {
      const salaryMin = item.salary?.minimum;
      const salaryMax = item.salary?.maximum;
      const salaryType = item.salary?.type?.salaryType || 'monthly';
      let salary: string | undefined;
      if (salaryMin && salaryMax) salary = `S$${salaryMin.toLocaleString()} – S$${salaryMax.toLocaleString()} / ${salaryType}`;
      else if (salaryMin) salary = `From S$${salaryMin.toLocaleString()} / ${salaryType}`;

      const districts = item.address?.districts?.map((d) => d.district).join(', ');
      const location = item.address?.isOverseas
        ? item.address.overseasCountry || 'Overseas'
        : districts || 'Singapore';

      const title = item.title || '';
      const company = item.postedCompany?.name || item.company?.name || '';
      const linkedInUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(title + (company ? ' ' + company : ''))}&location=Singapore`;

      return {
        id: item.uuid || item.metadata?.jobPostId || String(Math.random()),
        title,
        company: company || 'Unknown Company',
        location,
        description: item.description?.replace(/<[^>]*>/g, '').slice(0, 500) || '',
        salary,
        postedDate: item.metadata?.newPostingDate || item.metadata?.createdAt,
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
  postedCompany?: { name: string; uen?: string };
  company?: { name: string };
  salary?: { minimum?: number; maximum?: number; type?: { salaryType?: string } };
  address?: {
    isOverseas?: boolean;
    overseasCountry?: string;
    districts?: { district: string }[];
  };
  metadata?: { jobPostId?: string; newPostingDate?: string; createdAt?: string };
  employmentTypes?: string[];
  positionLevels?: { position: string }[];
  minimumYearsExperience?: number;
}
