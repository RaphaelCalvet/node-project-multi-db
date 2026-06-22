import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import productService from '../services/productService';
import userService from '../services/userService';
import { extractErrorMessage } from '../services/api';
import { useToast } from '../context/ToastContext';

// Cartão de estatística com ícone e gradiente sutil.
function StatCard({ label, value, hint, to, icon, accent }) {
  return (
    <Link
      to={to}
      className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-brand-300 transition-all flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <span className={`h-9 w-9 rounded-lg grid place-items-center ${accent}`}>
          {icon}
        </span>
      </div>
      <p className="text-3xl font-bold text-slate-800">
        {value === null ? <span className="text-slate-300">—</span> : value}
      </p>
      <p className="text-xs text-brand-600 font-medium group-hover:translate-x-0.5 transition-transform">
        {hint} →
      </p>
    </Link>
  );
}

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const toast = useToast();
  const [productCount, setProductCount] = useState(null);
  const [userCount, setUserCount] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const results = await Promise.allSettled([
          productService.getAll(),
          isAdmin ? userService.getAll() : Promise.resolve([])
        ]);
        if (!active) return;
        if (results[0].status === 'fulfilled') setProductCount(results[0].value.length);
        if (results[1].status === 'fulfilled') setUserCount(results[1].value.length);
      } catch (err) {
        toast.error(extractErrorMessage(err));
      }
    })();
    return () => {
      active = false;
    };
  }, [isAdmin, toast]);

  const boxIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeLinejoin="round" />
      <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" strokeLinejoin="round" />
    </svg>
  );
  const usersIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div className="space-y-6">
      {/* Banner de boas-vindas */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Olá, {user?.name}! 👋</h1>
        <p className="text-brand-100 text-sm mt-1">
          Bem-vindo(a) ao painel de gerenciamento. Você está logado como{' '}
          <span className="font-medium capitalize">{user?.role}</span>.
        </p>
      </div>

      {/* Cards de estatística */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Produtos"
          value={productCount}
          hint="Gerenciar produtos"
          to="/products"
          icon={boxIcon}
          accent="bg-brand-50 text-brand-600"
        />
        {isAdmin && (
          <StatCard
            label="Usuários"
            value={userCount}
            hint="Gerenciar usuários"
            to="/users"
            icon={usersIcon}
            accent="bg-emerald-50 text-emerald-600"
          />
        )}
      </div>
    </div>
  );
}
