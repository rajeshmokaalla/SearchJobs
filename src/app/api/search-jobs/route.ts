import { NextRequest, NextResponse } from 'next/server';
import { searchAdzuna, searchJSearch, searchRemotive, searchCareerjet } from '@/lib/jobSearch';
import { Job } from '@/types/jobs';

export async function POST(req: NextRequest) {
  try {
    const { query, country } = await req.json();
    if (!query || !country) return NextResponse.json({ error: 'Query and country are required' }, { status: 400 });

    const adzunaAppId = process.env.ADZUNA_APP_ID || '';
    const adzunaAppKey = process.env.ADZUNA_APP_KEY || '';
    const jsearchKey = process.env.JSEARCH_API_KEY || '';

    const promises: Promise<{ jobs: Job[]; total: number; source: string; error?: string }>[] = [];
    if (adzunaAppId && adzunaAppKey) promises.push(searchAdzuna(query, country, adzunaAppId, adzunaAppKey));
    if (jsearchKey) promises.push(searchJSearch(query, country, jsearchKey));
    promises.push(searchCareerjet(query, country));
    promises.push(searchRemotive(query, country));

    const results = await Promise.allSettled(promises);
    let allJobs: Job[] = [];
    const sourcesSummary: { source: string; count: number; error?: string }[] = [];

    for (const result of results) {
      if (result.status === 'fulfilled') {
        allJobs = allJobs.concat(result.value.jobs);
        sourcesSummary.push({ source: result.value.source, count: result.value.jobs.length, error: result.value.error });
      }
    }

    const seen = new Set<string>();
    const deduped = allJobs.filter(job => {
      if (!job.url || seen.has(job.url)) return false;
      seen.add(job.url);
      return true;
    });

    return NextResponse.json({ jobs: deduped, total: deduped.length, sources: sourcesSummary });
  } catch (err) {
    return NextResponse.json({ error: 'Search failed: ' + String(err) }, { status: 500 });
  }
}
