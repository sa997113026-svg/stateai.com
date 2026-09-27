'use client';
import AppShell from '../../components/AppShell';
import { useEffect, useState } from 'react';
import { getTrainingVideos, TrainingVideo } from '../../lib/services';

export default function TrainingLibrary() {
  const [videos, setVideos] = useState<TrainingVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState('');
  const [difficulty, setDifficulty] = useState('');
  useEffect(() => {
    setLoading(true);
    getTrainingVideos({domain: domain || undefined, difficulty: difficulty || undefined})
      .then(setVideos).finally(() => setLoading(false));
  }, [domain, difficulty]);
  return <AppShell>
    <div className="page-title"><div><h1>Training Video Library</h1><p>Backend-connected catalogue from the supplied training_videos_2.json dataset.</p></div><span className="status">{videos.length} resources</span></div>
    <div className="panel panel-pad"><div className="form-grid">
      <div className="field"><label>Domain</label><select value={domain} onChange={e=>setDomain(e.target.value)}><option value="">All domains</option><option value="statistical">Statistical</option><option value="technical">Technical</option><option value="digital_governance">Digital Governance</option><option value="behavioural">Behavioural</option></select></div>
      <div className="field"><label>Difficulty</label><select value={difficulty} onChange={e=>setDifficulty(e.target.value)}><option value="">All levels</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
    </div></div>
    <div className="spacer24"/>
    {loading ? <div className="panel panel-pad"><p>Loading training catalogue…</p></div> : <div className="course-grid">{videos.map(v=><div className="course-card" key={v.video_id}><div className="course-banner"/><div className="course-body"><div className="course-top"><span>{v.competency_domain.replace('_',' ')}</span><span>{v.difficulty}</span></div><h3>{v.title}</h3><p>{v.description}</p><div className="course-meta"><span>{v.duration_minutes} min</span><span>{v.competency_tag}</span></div><div className="course-footer"><span className="match">{v.source}</span><button className="btn btn-primary">Open</button></div></div></div>)}</div>}
  </AppShell>;
}
