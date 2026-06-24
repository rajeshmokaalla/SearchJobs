'use client';

import { useRef, useState, DragEvent } from 'react';
import { ResumeData } from '@/types/jobs';

interface Props {
  onParsed: (data: ResumeData, filename: string) => void;
  onLoading: (loading: boolean) => void;
}

export default function ResumeUpload({ onParsed, onLoading }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [filename, setFilename] = useState('');

  async function handleFile(file: File) {
    setError('');
    setFilename(file.name);
    onLoading(true);
    const form = new FormData();
    form.append('resume', file);
    try {
      const res = await fetch('/api/parse-resume', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Failed to parse resume');
      } else {
        onParsed(data, file.name);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      onLoading(false);
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`cursor-pointer border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 ${
          dragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/50'
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          {filename ? (
            <div>
              <p className="font-semibold text-slate-700">{filename}</p>
              <p className="text-sm text-slate-500 mt-1">Click to replace</p>
            </div>
          ) : (
            <div>
              <p className="font-semibold text-slate-700">Drop your resume here</p>
              <p className="text-sm text-slate-500 mt-1">or click to browse</p>
              <p className="text-xs text-slate-400 mt-2">PDF, DOCX, or TXT · Max 10MB</p>
            </div>
          )}
        </div>
        <input ref={inputRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
      )}
    </div>
  );
}
