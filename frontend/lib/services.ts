import { competencies, courses, gaps, questions } from '../data/mock';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';
let token: string | null = null;

function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('statsaksham_token');
}

async function loginDemo() {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ananya.sharma@mospi.gov.in', password: 'StatSaksham@2026' }),
  });
  if (!response.ok) throw new Error('Backend login failed');
  const body = await response.json();
  token = body.data.access_token;
  if (typeof window !== 'undefined') window.localStorage.setItem('statsaksham_token', token!);
  return token!;
}

async function apiFetch(path: string, init: RequestInit = {}, retry = true): Promise<any> {
  token = token || getStoredToken();
  if (!token && path !== '/auth/login') await loginDemo();
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(`${API_BASE}${path}`, { ...init, headers, cache: 'no-store' });
  if (response.status === 401 && retry) {
    token = null;
    if (typeof window !== 'undefined') window.localStorage.removeItem('statsaksham_token');
    await loginDemo();
    return apiFetch(path, init, false);
  }
  if (!response.ok) throw new Error(`API ${response.status}: ${await response.text()}`);
  return response.json();
}

export async function getCompetencyProfile(){
  try { return (await apiFetch('/competencies/me')).data.competencies; }
  catch { return new Promise<typeof competencies>(r=>setTimeout(()=>r(competencies),120)); }
}
export async function getSkillGaps(){
  try { return (await apiFetch('/skill-gaps/me')).data; }
  catch { return new Promise<typeof gaps>(r=>setTimeout(()=>r(gaps),120)); }
}
export async function getCourses(){
  try { return (await apiFetch('/courses')).data; }
  catch { return new Promise<typeof courses>(r=>setTimeout(()=>r(courses),150)); }
}
function mapAssessmentQuestions(items: any[]) {
  return items.map((q) => ({
    id: q.id,
    question: q.text,
    options: (q.options || []).map((o: any) => o.text),
    answer: 0,
    explanation: '',
    competency: q.competency || 'Official Statistics',
    difficulty: q.difficulty === 'Medium' ? 'Medium' : q.difficulty === 'Easy' ? 'Easy' : 'Hard',
    source: q.source ? `${q.source.document_title} · p.${q.source.page_number}` : 'Backend assessment service',
    confidence: Math.round((q.confidence || 0) * 100),
  }));
}
export async function getQuestions(){
  try { return mapAssessmentQuestions((await apiFetch('/assessments/asmt-plfs-2026/start', {method:'POST'})).data.questions); }
  catch { return new Promise<typeof questions>(r=>setTimeout(()=>r(questions),150)); }
}
export async function syncIGOT(){
  try {
    const result = (await apiFetch('/integrations')).data;
    return { status:'Connected' as const, synced: result.length ? 1284 : 0, lastSync:new Date().toLocaleTimeString() };
  } catch {
    return new Promise<{status:'Connected'; synced:number; lastSync:string}>(r=>setTimeout(()=>r({status:'Connected',synced:1284,lastSync:new Date().toLocaleTimeString()}),700));
  }
}
export async function generateAssessment(){
  try { return mapAssessmentQuestions((await apiFetch('/assessments/asmt-plfs-2026/start', {method:'POST'})).data.questions); }
  catch { return new Promise<typeof questions>(r=>setTimeout(()=>r(questions),900)); }
}

export type TrainingVideo = {
  video_id: string; title: string; competency_domain: string; competency_tag: string;
  duration_minutes: number; difficulty: string; source: string; description: string;
};

export async function getTrainingVideos(filters: {domain?: string; competency_tag?: string; difficulty?: string} = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => value && params.set(key, value));
  const suffix = params.toString() ? `?${params.toString()}` : '';
  return (await apiFetch(`/training/videos${suffix}`)).data as TrainingVideo[];
}
