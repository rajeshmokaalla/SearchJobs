'use client';

import { COUNTRIES } from '@/types/jobs';

interface Props {
  value: string;
  onChange: (code: string) => void;
}

export default function CountrySelector({ value, onChange }: Props) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none pl-4 pr-10 py-3 bg-white border border-slate-300 rounded-xl shadow-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer">
          <option value="">Select a country...</option>
          {Object.entries(COUNTRIES).map(([code, info]) => (
            <option key={code} value={code}>{info.flag} {info.name}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
