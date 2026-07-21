import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  role?: 'user' | 'admin';
}

const userLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/courses', label: 'Courses' },
  { to: '/notifications', label: 'Notifications' },
];

const adminLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/courses', label: 'Courses' },
  { to: '/admin/questions', label: 'Questions' },
];

export const Navbar = ({ role = 'user' }: NavbarProps) => {
  const location = useLocation();
  const links = role === 'admin' ? adminLinks : userLinks;

  return (
    <header className="app-shell__header">
      <div className="brand-block">
        <span className="brand-block__mark">SF</span>
        <div>
          <p className="brand-block__title">SkillForge</p>
          <p className="brand-block__subtitle">{role === 'admin' ? 'Instructor control' : 'Learning workspace'}</p>
        </div>
      </div>
      <nav className="app-shell__nav" aria-label="Primary navigation">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link key={link.to} to={link.to} className={`nav-link ${isActive ? 'nav-link--active' : ''}`}>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
};
