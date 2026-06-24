'use client';

import { useState } from 'react';
import ResumeUpload from '@/components/ResumeUpload';
import JobCard from '@/components/JobCard';
import SkillBadge from '@/components/SkillBadge';
import { Job, ResumeData } from '@/types/jobs';

type SourceSummary = { source: string; count: number; error?: string };

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [sources, setSources] = useState<SourceSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [filter, setFilter] = useState('');

  function handleParsed(data: ResumeData) {
    setResumeData(data);
    setSearchQuery(data.jobTitle || data.keywords.slice(0, 3).join(' '));
  }

  async function handleSearch() {
    const query = searchQuery.trim();
    if (!query) { setError('Please upload a resume or enter a search query.'); return; }
    setError('');
    setLoading(true);
    setSearched(false);
    try {
      const res = await fetch('/api/search-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.error && !data.jobs?.length) {
        setError(data.error);
        setJobs([]);
      } else {
        setJobs(data.jobs || []);
        setSources(data.sources || []);
        setTotal(data.total || 0);
        if (data.error) setError(data.error);
      }
    } catch {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }

  const filteredJobs = filter
    ? jobs.filter(j => j.source.toLowerCase().includes(filter.toLowerCase()))
    : jobs;

  const allSources = [...new Set(jobs.map(j => j.source))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">SearchJobs</h1>
              <p className="text-xs text-slate-500">🇸🇬 Singapore · MyCareersFuture</p>
            </div>
          </div>
          {searched && total > 0 && (
            <div className="text-sm text-slate-600 font-medium">
              {total} jobs found
            </div>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Find Singapore jobs matching your resume</h2>
          <p className="text-sm text-slate-500 mb-5">Powered by MyCareersFuture — Singapore&apos;s official government jobs portal</p>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Upload Resume</label>
              <ResumeUpload onParsed={handleParsed} onLoading={setParsing} />
            </div>
            {resumeData && <SkillBadge skills={resumeData.skills} keywords={resumeData.keywords} jobTitle={resumeData.jobTitle} />}
            {parsing && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Parsing resume...
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Title / Keywords</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="e.g. Senior QE Lead, Software Engineer..."
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {error && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                <strong>Note:</strong> {error}
              </div>
            )}
            <button
              onClick={handleSearch}
              disabled={loading || parsing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Searching...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Jobs
                </>
              )}
            </button>
          </div>
        </div>

        {searched && (
          <div>
            {sources.some(s => s.error && s.count === 0) && (
              <div className="mb-4 space-y-1">
                {sources.filter(s => s.error && s.count === 0).map(s => (
                  <div key={s.source} className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <span className="font-semibold">{s.source}:</span> {s.error}
                  </div>
                ))}
              </div>
            )}
            {allSources.length > 1 && jobs.length > 0 && (
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-sm text-slate-500 font-medium">Filter:</span>
                <button onClick={() => setFilter('')}
                  className={`text-sm px-3 py-1 rounded-full border transition-colors ${!filter ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'}`}>
                  All ({jobs.length})
                </button>
                {allSources.map(src => (
                  <button key={src} onClick={() => setFilter(src === filter ? '' : src)}
                    className={`text-sm px-3 py-1 rounded-full border transition-colors ${filter === src ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'}`}>
                    {src} ({jobs.filter(j => j.source === src).length})
                  </button>
                ))}
              </div>
            )}
            {filteredJobs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-600 font-medium">No jobs found</p>
                <p className="text-sm text-slate-400 mt-1">Try different keywords</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredJobs.map((job) => <JobCard key={job.id + job.url} job={job} />)}
              </div>
            )}
          </div>
        )}

        {!searched && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            {[
              { title: 'Upload Resume', desc: 'PDF, DOCX, or TXT. Job title and skills extracted automatically.' },
              { title: 'Search Singapore Jobs', desc: 'Searches MyCareersFuture — the official Singapore government portal.' },
              { title: 'Apply Directly', desc: 'Click Apply on any card to go straight to the job posting.' },
            ].map((step, i) => (
              <div key={step.title} className="bg-white rounded-xl border border-slate-200 p-5 text-center">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">{i + 1}</div>
                <h3 className="font-semibold text-slate-800 mb-1">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-xs text-slate-400 mt-8">
        Jobs sourced from MyCareersFuture (mycareersfuture.gov.sg) · Singapore only
      </footer>
    </div>
  );
}
