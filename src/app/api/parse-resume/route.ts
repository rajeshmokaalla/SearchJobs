import { NextRequest, NextResponse } from 'next/server';
import { extractResumeData } from '@/lib/resumeParser';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('resume') as File | null;
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.toLowerCase();
    let text = '';

    if (fileName.endsWith('.pdf')) {
      const { extractText } = await import('unpdf');
      const pages = await extractText(new Uint8Array(buffer), { mergePages: true });
      text = Array.isArray(pages.text) ? pages.text.join('\n') : String(pages.text);
    } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (fileName.endsWith('.txt')) {
      text = buffer.toString('utf-8');
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF, DOCX, or TXT.' },
        { status: 400 }
      );
    }

    if (!text.trim()) {
      return NextResponse.json({ error: 'Could not extract text from the file.' }, { status: 400 });
    }

    return NextResponse.json(extractResumeData(text));
  } catch (err) {
    console.error('Resume parse error:', err);
    return NextResponse.json({ error: 'Failed to parse resume: ' + String(err) }, { status: 500 });
  }
}
