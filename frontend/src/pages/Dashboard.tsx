import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const Dashboard = () => {
  const role = localStorage.getItem('role') === 'admin' ? 'admin' : 'user';

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