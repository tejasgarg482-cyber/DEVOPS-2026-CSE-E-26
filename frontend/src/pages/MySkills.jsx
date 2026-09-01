import { useEffect, useState } from 'react';
import api from '../api/axios';

const CATEGORIES = ['Tech', 'Music', 'Language', 'Fitness', 'Art', 'Cooking', 'Academic', 'Other'];
const LEVELS = ['Beginner', 'Intermediate', 'Expert'];
const MODES = ['online', 'in-person', 'both'];
const CATEGORY_ICON = { Tech: '💻', Music: '🎸', Language: '🗣️', Fitness: '🏋️', Art: '🎨', Cooking: '🍳', Academic: '📚', Other: '✨' };

export default function MySkills() {
  const [tab, setTab] = useState('teach');
  const [skills, setSkills] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'Tech', description: '', level: 'Beginner', mode: 'both' });
  const [error, setError] = useState('');

  const load = async () => {
    const { data } = await api.get('/skills/mine');
    setSkills(data);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/skills', { ...form, type: tab });
      setForm({ title: '', category: 'Tech', description: '', level: 'Beginner', mode: 'both' });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add this skill');
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/skills/${id}`);
    load();
  };

  const filtered = skills.filter((s) => s.type === tab);

  return (
    <div className="container">
      <h2 style={{ marginBottom: 4 }}>My Skills</h2>
      <p style={{ color: 'var(--ink-muted)', fontSize: 14, marginBottom: 20 }}>
        The skills you list here are what get you matched with other people.
      </p>

      <div className="tabs">
        <div className={`tab ${tab === 'teach' ? 'active' : ''}`} onClick={() => { setTab('teach'); setShowForm(false); }}>I Can Teach</div>
        <div className={`tab ${tab === 'want' ? 'active' : ''}`} onClick={() => { setTab('want'); setShowForm(false); }}>I Want to Learn</div>
      </div>

      {!showForm && (
        <button className="btn" onClick={() => setShowForm(true)} style={{ marginBottom: 20 }}>
          + Add a skill {tab === 'teach' ? 'you can teach' : 'you want to learn'}
        </button>
      )}

      {showForm && (
        <div className="card">
          {error && <p className="error-text">{error}</p>}
          <form onSubmit={handleAdd}>
            <label>Skill title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Guitar, React, Spanish" required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label>Level</label>
                <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                  {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <label>Mode</label>
            <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}>
              {MODES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <label>Description (optional)</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Anything helpful for a potential match to know" />
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn">Save skill</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {filtered.length === 0 && !showForm && (
        <div className="empty-state">
          <div className="icon">{tab === 'teach' ? '🎓' : '🔍'}</div>
          <p>Nothing listed yet under "{tab === 'teach' ? 'I Can Teach' : 'I Want to Learn'}".</p>
        </div>
      )}

      {filtered.map((skill) => (
        <div key={skill._id} className="ticket">
          <div className="ticket-eyebrow">{CATEGORY_ICON[skill.category]} {skill.category} · {skill.level} · {skill.mode}</div>
          <div className="ticket-title">{skill.title}</div>
          {skill.description && <p style={{ fontSize: 13, color: 'var(--paper-muted)', marginTop: 6 }}>{skill.description}</p>}
          <div className="ticket-divider" />
          <div className="ticket-row">
            <span></span>
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(skill._id)}>Remove</button>
          </div>
        </div>
      ))}
    </div>
  );
}
