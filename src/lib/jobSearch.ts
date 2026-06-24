import { Job, JobSearchResult, COUNTRIES } from '@/types/jobs';

export async function searchAdzuna(
  query: string, country: string, appId: string, appKey: string, page = 1, resultsPerPage = 20
): Promise<JobSearchResult> {
  const url = `https://api.adzuna.com/v1/api/jobs/${country.toLowerCase()}/search/${page}?app_id=${appId}&app_key=${appKey}&results_per_page=${resultsPerPage}&what=${encodeURIComponent(query)}&content-type=application/json`;
  try {
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) {
      const text = await res.text();
      return { jobs: [], total: 0, source: 'Adzuna', error: `Adzuna API error ${res.status}: ${text.slice(0, 200)}` };
    }
    const data = await res.json();
    const jobs: Job[] = (data.results || []).map((item: AdzunaJob) => ({
      id: item.id, title: item.title,
      company: item.company?.display_name || 'Unknown Company',
      location: item.location?.display_name || '',
      description: item.description || '',
      salary: formatSalary(item.salary_min, item.salary_max, item.salary_is_predicted),
      postedDate: item.created, url: item.redirect_url, source: 'Adzuna',
      jobType: item.contract_type || item.contract_time || '',
    }));
    return { jobs, total: data.count || jobs.length, source: 'Adzuna' };
  } catch (err) {
    return { jobs: [], total: 0, source: 'Adzuna', error: String(err) };
  }
}

interface AdzunaJob {
  id: string; title: string;
  company?: { display_name: string };
  location?: { display_name: string };
  description?: string;
  salary_min?: number; salary_max?: number; salary_is_predicted?: number;
  created?: string; redirect_url: string;
  contract_type?: string; contract_time?: string;
}

function formatSalary(min?: number, max?: number, predicted?: number): string | undefined {
  if (!min && !max) return undefined;
  const tag = predicted === 1 ? ' (est.)' : '';
  if (min && max) return `$${Math.round(min / 1000)}k - $${Math.round(max / 1000)}k${tag}`;
  if (min) return `From $${Math.round(min / 1000)}k${tag}`;
  if (max) return `Up to $${Math.round(max / 1000)}k${tag}`;
}

export async function searchJSearch(
  query: string, country: string, apiKey: string, page = 1
): Promise<JobSearchResult> {
  const countryName = COUNTRIES[country]?.name || country;
  // Include country name in query and pass country code param for stricter filtering
  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query + ' in ' + countryName)}&page=${page}&num_pages=1&date_posted=all&country=${country.toUpperCase()}`;
  try {
    const res = await fetch(url, {
      headers: { 'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': 'jsearch.p.rapidapi.com' },
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      const text = await res.text();
      return { jobs: [], total: 0, source: 'JSearch', error: `JSearch API error ${res.status}: ${text.slice(0, 200)}` };
    }
    const data = await res.json();
    const jobs: Job[] = (data.data || []).map((item: JSearchJob) => ({
      id: item.job_id, title: item.job_title,
      company: item.employer_name || 'Unknown Company',
      location: [item.job_city, item.job_state, item.job_country].filter(Boolean).join(', '),
      description: item.job_description || '',
      salary: formatJSearchSalary(item),
      postedDate: item.job_posted_at_datetime_utc,
      url: item.job_apply_link || item.job_google_link || '',
      source: item.job_publisher || 'JSearch',
      jobType: item.job_employment_type || '',
    }));
    return { jobs, total: jobs.length, source: 'JSearch' };
  } catch (err) {
    return { jobs: [], total: 0, source: 'JSearch', error: String(err) };
  }
}

interface JSearchJob {
  job_id: string; job_title: string; employer_name?: string;
  job_city?: string; job_state?: string; job_country?: string;
  job_description?: string;
  job_min_salary?: number; job_max_salary?: number; job_salary_currency?: string;
  job_posted_at_datetime_utc?: string;
  job_apply_link?: string; job_google_link?: string;
  job_publisher?: string; job_employment_type?: string;
}

function formatJSearchSalary(job: JSearchJob): string | undefined {
  const { job_min_salary: min, job_max_salary: max, job_salary_currency: currency = 'USD' } = job;
  if (!min && !max) return undefined;
  const sym = currency === 'USD' ? '$' : currency;
  if (min && max) return `${sym}${Math.round(min / 1000)}k - ${sym}${Math.round(max / 1000)}k`;
  if (min) return `From ${sym}${Math.round(min / 1000)}k`;
  if (max) return `Up to ${sym}${Math.round(max / 1000)}k`;
}

export async function searchRemotive(query: string, country: string): Promise<JobSearchResult> {
  const url = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}&limit=40`;
  try {
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) return { jobs: [], total: 0, source: 'Remotive', error: `Remotive error ${res.status}` };
    const data = await res.json();
    const countryName = (COUNTRIES[country]?.name || '').toLowerCase();

    const allJobs: Job[] = (data.jobs || []).map((item: RemotiveJob) => ({
      id: String(item.id), title: item.title, company: item.company_name,
      location: item.candidate_required_location || 'Remote',
      description: item.description?.replace(/<[^>]*>/g, '').slice(0, 500) || '',
      salary: item.salary || undefined,
      postedDate: item.publication_date, url: item.url,
      source: 'Remotive', jobType: item.job_type || 'Remote',
    }));

    const loc = (j: Job) => j.location.toLowerCase();
    const isCountryMatch = (j: Job) => countryName && loc(j).includes(countryName);
    const isWorldwide = (j: Job) => !loc(j) || ['worldwide', 'anywhere', 'global', 'remote'].some(w => loc(j).includes(w));

    const preferred = allJobs.filter(j => isCountryMatch(j) || isWorldwide(j));
    const jobs = (preferred.length >= 5 ? preferred : allJobs).slice(0, 20);

    return { jobs, total: jobs.length, source: 'Remotive' };
  } catch (err) {
    return { jobs: [], total: 0, source: 'Remotive', error: String(err) };
  }
}

interface RemotiveJob {
  id: number; title: string; company_name: string;
  candidate_required_location?: string; description?: string;
  salary?: string; publication_date?: string; url: string; job_type?: string;
}
