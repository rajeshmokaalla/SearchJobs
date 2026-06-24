'use client';

import { Job } from '@/types/jobs';
import { useState } from 'react';

const SOURCE_COLORS: Record<string, string> = {
  Adzuna: 'bg-green-100 text-green-700',
  JSearch: 'bg-purple-100 text-purple-700',
  LinkedIn: 'bg-blue-100 text-blue-800',
  Indeed: 'bg-yellow-100 text-yellow-800',
  Glassdoor: 'bg-emerald-100 text-emerald-700',
  ZipRecruiter: 'bg-orange-100 text-orange-700',
  Remotive: 'bg-teal-100 text-teal-700',
};

function sourceColor(source: string) {
  for (const [key, cls] of Object.entries(SOURCE_COLORS)) {
    if (source.toLowerCase().includes(key.toLowerCase())) return cls;
  }
  return 'bg-slate-100 text-slate-600';
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return '';
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function JobCard({ job }: { job: Job }) {
  const [expanded, setExpanded] = useState(false);
  const desc = job.description?.replace(/<[^>]*>/g, '').trim() || '';
  const shortDesc = desc.slice(0, 200);
  const hasMore = desc.length > 200;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sourceColor(job.source)}`}>{job.source}</span>
            {job.jobType && <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{job.jobType}</span>}
            {job.postedDate && <span className="text-xs text-slate-400">{timeAgo(job.postedDate)}</span>}
          </div>
          <h3 className="font-semibold text-slate-900 text-base leading-snug">{job.title}</h3>
          <p className="text-sm text-slate-600 mt-0.5">{job.company}</p>
          {job.location && (
            <div className="flex items-center gap-1 mt-1">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs text-slate-500">{job.location}</span>
            </div>
          )}
          {job.salary && (
            <div className="flex items-center gap-1 mt-1">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-emerald-700 font-medium">{job.salary}</span>
            </div>
          )}
        </div>
        <a href={job.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
          className="shrink-0 inline-flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Apply
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
      {desc && (
        <div className="mt-3 border-t border-slate-100 pt-3">
          <p className="text-sm text-slate-600 leading-relaxed">
            {expanded ? desc : shortDesc}{hasMore && !expanded && '...'}
          </p>
          {hasMore && (
            <button onClick={() => setExpanded(!expanded)}
              className="text-xs text-blue-600 hover:text-blue-700 mt-1 font-medium">
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
