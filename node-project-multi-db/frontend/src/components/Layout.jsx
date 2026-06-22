import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

// Ícones de navegação (stroke 1.5, coerentes entre si)
const icons = {
  dashboard: (
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
  ),
  products: (
    <>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" />
    </>
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  )
};

function NavItem({ to, label, icon, onClick }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
          isActive
            ? 'bg-zinc-900 text-white shadow-soft'
            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isActive ? 'text-accent-400' : 'text-zinc-400 group-hover:text-zinc-600'}
          >
            {icon}
          </svg>
          {label}
        </>
      )}
    </NavLink>
  );
}

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const nav = (
    <>
      <NavItem to="/" label="Dashboard" icon={icons.dashboard} onClick={() => setOpen(false)} />
      <NavItem to="/products" label="Produtos" icon={icons.products} onClick={() => setOpen(false)} />
      {isAdmin && (
        <NavItem to="/users" label="Usuários" icon={icons.users} onClick={() => setOpen(false)} />
      )}
    </>
  );

  const initials = (user?.name || '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-zinc-200 bg-white">
        <div className="h-16 flex items-center px-5 border-b border-zinc-200">
          <Logo size={30} />
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">{nav}</nav>

        {/* Perfil no rodapé da sidebar */}
        <div className="p-3 border-t border-zinc-200">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="h-9 w-9 shrink-0 rounded-full bg-zinc-900 text-white grid place-items-center text-xs font-semibold">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-zinc-900 truncate">{user?.name}</p>
              <p className="text-xs text-zinc-400 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-1 w-full flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo (com margem da sidebar no desktop) */}
      <div className="md:pl-64">
        {/* Topbar mobile */}
        <header className="md:hidden sticky top-0 z-30 h-14 flex items-center justify-between px-4 border-b border-zinc-200 bg-white/90 backdrop-blur">
          <Logo size={28} />
          <button
            onClick={() => setOpen(true)}
            className="p-2 -mr-2 rounded-lg text-zinc-600 hover:bg-zinc-100"
            aria-label="Abrir menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto animate-fade-up">
          <Outlet />
        </main>
      </div>

      {/* Drawer mobile */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white flex flex-col animate-scale-in origin-left">
            <div className="h-14 flex items-center justify-between px-5 border-b border-zinc-200">
              <Logo size={28} />
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 flex flex-col gap-1">{nav}</nav>
            <div className="p-3 border-t border-zinc-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-100"
              >
                Sair da conta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
