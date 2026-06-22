import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Guarda de rota: redireciona para /login se não autenticado.
// Aceita `roles` para restringir acesso por perfil (ex.: ['admin']).
export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Carregando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-2 text-center px-6">
        <h1 className="text-2xl font-bold text-slate-800">Acesso negado</h1>
        <p className="text-slate-500">
          Você não tem permissão para visualizar esta página.
        </p>
      </div>
    );
  }

  return children;
}
