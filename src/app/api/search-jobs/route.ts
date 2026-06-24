import { NextRequest, NextResponse } from 'next/server';
import { searchMyCareersFuture } from '@/lib/jobSearch';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query) return NextResponse.json({ error: 'Query is required' }, { status: 400 });

    const result = await searchMyCareersFuture(query);
    const sourcesSummary = [{ source: result.source, count: result.jobs.length, error: result.error }];

    const topError = result.jobs.length === 0 && result.error ? result.error : undefined;
    return NextResponse.json({
      jobs: result.jobs,
      total: result.total,
      sources: sourcesSummary,
      error: topError,
      _debug: result.jobs.length === 0 ? result.error || `MCF returned total=${result.total}, jobs=0` : undefined,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Search failed: ' + String(err) }, { status: 500 });
  }
}
