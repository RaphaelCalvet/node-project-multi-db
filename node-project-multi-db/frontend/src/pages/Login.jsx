import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import authService from '../services/authService';
import { extractErrorMessage } from '../services/api';

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token, user } = await authService.login(email.trim(), password);
      login(token, user);
      toast.success(`Bem-vindo(a), ${user.name.split(' ')[0]}.`);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Falha no login.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Acesse sua conta"
      subtitle="Entre com suas credenciais para continuar."
      footer={
        <>
          Não tem conta?{' '}
          <Link to="/register" className="font-medium text-accent-600 hover:text-accent-700">
            Criar conta
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          id="email"
          type="email"
          label="E-mail"
          placeholder="voce@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <div>
          <Input
            id="password"
            type={showPass ? 'text' : 'password'}
            label="Senha"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <div className="mt-2 flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-zinc-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showPass}
                onChange={(e) => setShowPass(e.target.checked)}
                className="rounded border-zinc-300 text-accent-600 focus:ring-accent-500"
              />
              Mostrar senha
            </label>
          </div>
        </div>

        <Button type="submit" loading={loading} fullWidth size="lg">
          Entrar
        </Button>
      </form>

      {/* Cartão de credenciais de demonstração */}
      <div className="mt-6 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-3.5">
        <p className="text-xs font-medium text-zinc-500 mb-1">Credenciais de demonstração</p>
        <p className="text-xs text-zinc-600 font-mono">admin@example.com · admin123</p>
      </div>
    </AuthShell>
  );
}
