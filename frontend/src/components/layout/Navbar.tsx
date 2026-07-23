import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useNotifications, useMarkAllAsRead } from '@/features/notifications/hooks/useNotifications';
import { updateUserRequest } from '@/features/auth/api/auth.api';
import type { Notification } from '@/features/notifications/types/notifications.types';

interface NavbarProps {
  role?: 'user' | 'admin';
}

const userLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/my-learning', label: 'My Learning' },
  { to: '/courses', label: 'Courses' },
];

const adminLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/courses', label: 'Courses' },
  { to: '/course-questions', label: 'Questions' },
];

export const Navbar = ({ role }: NavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, user, setSession, clearSession } = useAuth();
  const links = role === 'admin' ? adminLinks : userLinks;

  const { data: notifications = [] } = useNotifications();
  const { mutate: markAllAsRead } = useMarkAllAsRead();

  // Notification dropdown
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [displayNotifications, setDisplayNotifications] = useState<Notification[]>([]);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  // Profile dropdown
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Edit profile modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  const unreadCount = notifications.length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleNotifDropdown = () => {
    if (!isNotifOpen) {
      setDisplayNotifications(notifications);
      setIsNotifOpen(true);
      setIsProfileOpen(false);
      if (notifications.length > 0) {
        const ids = notifications.map((n) => n.id);
        markAllAsRead(ids);
      }
    } else {
      setIsNotifOpen(false);
    }
  };

  const handleToggleProfileDropdown = () => {
    setIsProfileOpen((prev) => !prev);
    setIsNotifOpen(false);
  };

  const handleLogout = () => {
    clearSession();
    navigate('/');
  };

  const handleOpenEditModal = () => {
    setIsProfileOpen(false);
    setEditUsername(user?.username ?? '');
    setEditEmail(user?.email ?? '');
    setEditError('');
    setEditSuccess(false);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setEditLoading(true);
    setEditError('');
    setEditSuccess(false);
    try {
      const updated = await updateUserRequest(token, {
        username: editUsername.trim() || undefined,
        email: editEmail.trim() || undefined,
      });
      // Update session with new user data
      setSession(token, updated);
      setEditSuccess(true);
      setTimeout(() => {
        setIsEditModalOpen(false);
        setEditSuccess(false);
      }, 1200);
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setEditLoading(false);
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      }) + ' ' + date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  // Get initials for avatar
  const getInitials = () => {
    const name = user?.username ?? '';
    return name.slice(0, 2).toUpperCase() || 'U';
  };

  return (
    <>
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

          {token && (
            <>
              {/* Notifications Bell */}
              <div className="nav-notifications" ref={notifDropdownRef}>
                <button
                  className={`nav-notifications__trigger ${isNotifOpen ? 'nav-notifications__trigger--active' : ''}`}
                  onClick={handleToggleNotifDropdown}
                  aria-label="Notifications"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="bell-icon"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  {unreadCount > 0 && (
                    <span className="nav-notifications__badge">{unreadCount}</span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="nav-notifications__dropdown">
                    <div className="nav-notifications__header">
                      <h3>Notifications</h3>
                    </div>
                    <div className="nav-notifications__list">
                      {displayNotifications.length > 0 ? (
                        displayNotifications.map((notif) => (
                          <div key={notif.id} className="nav-notifications__item">
                            <div className="nav-notifications__item-dot" />
                            <div className="nav-notifications__item-content">
                              <p className="nav-notifications__item-message">{notif.message}</p>
                              <span className="nav-notifications__item-time">
                                {formatTime(notif.created_at)}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="nav-notifications__empty">
                          <p>No new notifications</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Avatar & Dropdown */}
              <div className="nav-profile" ref={profileDropdownRef}>
                <button
                  className={`nav-profile__trigger ${isProfileOpen ? 'nav-profile__trigger--active' : ''}`}
                  onClick={handleToggleProfileDropdown}
                  aria-label="User menu"
                  type="button"
                  title={user?.username}
                >
                  {getInitials()}
                </button>

                {isProfileOpen && (
                  <div className="nav-profile__dropdown">
                    <div className="nav-profile__dropdown-header">
                      <div className="nav-profile__dropdown-avatar">{getInitials()}</div>
                      <div>
                        <p className="nav-profile__dropdown-name">{user?.username}</p>
                        <p className="nav-profile__dropdown-email">{user?.email}</p>
                      </div>
                    </div>
                    <div className="nav-profile__dropdown-divider" />
                    <button
                      className="nav-profile__dropdown-item"
                      onClick={handleOpenEditModal}
                      type="button"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      Edit Profile
                    </button>
                    <button
                      className="nav-profile__dropdown-item nav-profile__dropdown-item--danger"
                      onClick={handleLogout}
                      type="button"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </nav>
      </header>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="profile-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsEditModalOpen(false); }}>
          <div className="profile-modal">
            <div className="profile-modal__header">
              <div>
                <p className="profile-modal__eyebrow">Account</p>
                <h2 className="profile-modal__title">Edit Profile</h2>
              </div>
              <button
                className="profile-modal__close"
                onClick={() => setIsEditModalOpen(false)}
                type="button"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form className="profile-modal__form" onSubmit={handleSaveProfile}>
              <div className="profile-modal__field">
                <label htmlFor="profile-username" className="profile-modal__label">Username</label>
                <input
                  id="profile-username"
                  className="profile-modal__input"
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="Username"
                  required
                />
              </div>
              <div className="profile-modal__field">
                <label htmlFor="profile-email" className="profile-modal__label">Email</label>
                <input
                  id="profile-email"
                  className="profile-modal__input"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="Email address"
                  required
                />
              </div>

              {editError && (
                <p className="profile-modal__error">{editError}</p>
              )}
              {editSuccess && (
                <p className="profile-modal__success">Profile updated successfully!</p>
              )}

              <div className="profile-modal__actions">
                <button
                  type="button"
                  className="dashboard-btn dashboard-btn--sunken"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="dashboard-btn dashboard-btn--accent"
                  disabled={editLoading}
                >
                  {editLoading ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
