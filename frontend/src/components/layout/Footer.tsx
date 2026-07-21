interface FooterProps {
  role?: 'user' | 'admin';
}

export const Footer = ({ role }: FooterProps) => (
  <footer className="app-shell__footer">
    <p>SkillForge • {role === 'admin' ? 'Instructor console' : 'Learner workspace'}</p>
    <p>Adaptive learning and assessment platform</p>
  </footer>
);
