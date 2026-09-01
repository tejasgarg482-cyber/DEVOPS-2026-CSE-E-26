import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import StarRating from '../components/StarRating';
import RequestSwapModal from '../components/RequestSwapModal';

export default function Profile() {
  const { id } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [swapSkill, setSwapSkill] = useState(null);

  useEffect(() => {
    api.get(`/auth/user/${id}`).then(({ data }) => setProfileUser(data));
    api.get('/skills', { params: { excludeSelf: 'false' } }).then(({ data }) => {
      setSkills(data.filter((s) => s.user._id === id));
    });
    api.get(`/reviews/user/${id}`).then(({ data }) => setReviews(data));
  }, [id]);

  if (!profileUser) return <div className="container"><p>Loading profile...</p></div>;

  const teach = skills.filter((s) => s.type === 'teach');
  const want = skills.filter((s) => s.type === 'want');

  return (
    <div className="container">
      <div className="card">
        <h2>{profileUser.name}</h2>
        <p style={{ color: 'var(--ink-muted)', fontSize: 13 }}>{profileUser.location}</p>
        <p style={{ marginTop: 8 }}>{profileUser.bio}</p>
        <p style={{ marginTop: 8 }}>★ {profileUser.trustScore || 'No ratings yet'} · {profileUser.completedSwapsCount} completed swaps</p>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 10 }}>Can Teach</h3>
        {teach.length === 0 && <p style={{ color: 'var(--ink-muted)', fontSize: 13 }}>Nothing listed yet.</p>}
        {teach.map((s) => (
          <div key={s._id} style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{s.title} <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>({s.level})</span></span>
            <button className="btn btn-sm" onClick={() => setSwapSkill(s)}>Request Swap</button>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 10 }}>Wants to Learn</h3>
        {want.length === 0 && <p style={{ color: 'var(--ink-muted)', fontSize: 13 }}>Nothing listed yet.</p>}
        {want.map((s) => <div key={s._id}>{s.title}</div>)}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 10 }}>Reviews</h3>
        {reviews.length === 0 && <p style={{ color: 'var(--ink-muted)', fontSize: 13 }}>No reviews yet.</p>}
        {reviews.map((r) => (
          <div key={r._id} style={{ marginBottom: 12, borderBottom: '1px solid #334155', paddingBottom: 10 }}>
            <StarRating value={r.rating} readOnly />
            <p style={{ fontSize: 13, marginTop: 4 }}>{r.comment}</p>
            <p style={{ fontSize: 11, color: 'var(--ink-muted)' }}>— {r.reviewer.name}</p>
          </div>
        ))}
      </div>

      {swapSkill && <RequestSwapModal skill={{ ...swapSkill, user: profileUser }} onClose={() => setSwapSkill(null)} />}
    </div>
  );
}
