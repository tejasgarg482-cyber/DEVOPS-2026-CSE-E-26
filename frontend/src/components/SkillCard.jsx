const CATEGORY_ICON = {
  Tech: '💻', Music: '🎸', Language: '🗣️', Fitness: '🏋️', Art: '🎨', Cooking: '🍳', Academic: '📚', Other: '✨',
};

export default function SkillCard({ skill, actions }) {
  return (
    <div className="ticket">
      <div className="ticket-eyebrow">{CATEGORY_ICON[skill.category] || '✨'} {skill.category} · {skill.level}</div>
      <div className="ticket-title">{skill.title}</div>
      {skill.description && <p style={{ fontSize: 13, color: 'var(--paper-muted)', marginBottom: 8 }}>{skill.description}</p>}
      <div className="ticket-divider" />
      <div className="ticket-row">
        <div style={{ fontSize: 12, color: 'var(--paper-muted)' }}>
          {skill.user ? `By ${skill.user.name}${skill.user.trustScore ? ` · ★ ${skill.user.trustScore}` : ''}` : skill.mode}
        </div>
        {actions}
      </div>
    </div>
  );
}
