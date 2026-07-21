import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/features/auth/context/AuthContext';

export const Dashboard = () => {
  const { user, isHydrating } = useAuth();
  const role = user?.role ?? 'user';

  if (isHydrating) {
    return (
      <div className="app-shell">
        <main className="app-shell__content">Loading session…</main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar role={role} />
      <main className="app-shell__content">
        <h1>Hello world</h1>
      </main>
      <Footer role={role} />
    </div>
  );
};