'use client';

interface Props {
  skills: string[];
  keywords: string[];
  jobTitle: string;
}

export default function SkillBadge({ skills, jobTitle }: Props) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span className="text-sm font-semibold text-blue-800">Resume extracted</span>
      </div>
      {jobTitle && (
        <p className="text-sm text-slate-700 mb-2">
          <span className="font-medium">Searching for:</span> <span className="italic">"{jobTitle}"</span>
        </p>
      )}
      {skills.length > 0 && (
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1.5">Skills detected</p>
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 15).map((skill) => (
              <span key={skill} className="text-xs bg-white border border-blue-200 text-blue-700 px-2 py-0.5 rounded-full font-medium">{skill}</span>
            ))}
            {skills.length > 15 && <span className="text-xs text-slate-500 px-2 py-0.5">+{skills.length - 15} more</span>}
          </div>
        </div>
      )}
    </div>
  );
}
