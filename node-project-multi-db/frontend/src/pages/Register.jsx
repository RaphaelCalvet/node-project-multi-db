import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import authService from '../services/authService';
import { extractErrorMessage } from '../services/api';

export default function RegisterPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('A senha deve ter ao menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      const { token, user } = await authService.register({
        name: name.trim(),
        email: email.trim(),
        password
      });
      login(token, user);
      toast.success('Conta criada com sucesso.');
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Não foi possível cadastrar.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Crie sua conta"
      subtitle="Comece a gerenciar seus dados em segundos."
      footer={
        <>
          Já tem conta?{' '}
          <Link to="/login" className="font-medium text-accent-600 hover:text-accent-700">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          id="name"
          label="Nome completo"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <Input
          id="password"
          type="password"
          label="Senha"
          placeholder="Mínimo de 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          hint="Use ao menos 6 caracteres."
        />
        <Button type="submit" loading={loading} fullWidth size="lg">
          Criar conta
        </Button>
      </form>
    </AuthShell>
  );
}
