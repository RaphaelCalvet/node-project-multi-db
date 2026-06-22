import { useEffect, useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Spinner from '../components/Spinner';
import userService from '../services/userService';
import { extractErrorMessage } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const emptyForm = { name: '', email: '', password: '', role: 'user' };

// Badge colorida para o papel do usuário.
function RoleBadge({ role }) {
  const styles =
    role === 'admin'
      ? 'bg-rose-50 text-rose-700 ring-rose-200'
      : 'bg-emerald-50 text-emerald-700 ring-emerald-200';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ring-1 ${styles}`}>
      {role}
    </span>
  );
}

export default function UsersPage() {
  const toast = useToast();
  const { user: currentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await userService.getAll();
      setItems(data);
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Erro ao carregar usuários.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (u) => {
    setForm({ name: u.name, email: u.email, password: '', role: u.role });
    setEditingId(u.id);
    setShowForm(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Nome e e-mail são obrigatórios.');
      return;
    }
    if (!editingId && form.password.length < 6) {
      toast.error('A senha deve ter ao menos 6 caracteres.');
      return;
    }
    const payload = { name: form.name.trim(), email: form.email.trim(), role: form.role };
    if (form.password) payload.password = form.password; // só envia se alterar

    setSaving(true);
    try {
      if (editingId) {
        await userService.update(editingId, payload);
        toast.success('Usuário atualizado.');
      } else {
        await userService.create(payload);
        toast.success('Usuário criado.');
      }
      resetForm();
      await load();
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Erro ao salvar usuário.'));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (u) => {
    if (u.id === currentUser?.id) {
      toast.error('Você não pode remover a própria conta.');
      return;
    }
    if (!window.confirm(`Remover o usuário "${u.name}"?`)) return;
    try {
      await userService.remove(u.id);
      toast.success('Usuário removido.');
      setItems((prev) => prev.filter((x) => x.id !== u.id));
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Erro ao remover usuário.'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Usuários</h1>
          <p className="text-slate-500 text-sm">Gerencie contas e permissões (MongoDB).</p>
        </div>
        {!showForm && (
          <Button onClick={() => { resetForm(); setShowForm(true); }}>+ Novo usuário</Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={onSubmit} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h2 className="font-semibold text-slate-700">
            {editingId ? 'Editar usuário' : 'Novo usuário'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="name"
              label="Nome"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              id="email"
              type="email"
              label="E-mail"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              id="password"
              type="password"
              label={editingId ? 'Nova senha (deixe vazio para manter)' : 'Senha'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={editingId ? '••••••' : 'Mínimo 6 caracteres'}
            />
            <div className="w-full">
              <label className="block text-sm font-medium text-slate-700 mb-1">Papel</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" loading={saving}>
              {editingId ? 'Salvar alterações' : 'Criar usuário'}
            </Button>
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancelar
            </Button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <Spinner />
        ) : items.length === 0 ? (
          <p className="text-center text-slate-400 py-12">Nenhum usuário cadastrado.</p>
        ) : (
          <>
            {/* Tabela no desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium">Nome</th>
                    <th className="px-4 py-3 font-medium">E-mail</th>
                    <th className="px-4 py-3 font-medium">Papel</th>
                    <th className="px-4 py-3 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-800 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-slate-600">{u.email}</td>
                      <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="secondary" onClick={() => startEdit(u)}>Editar</Button>
                          <Button size="sm" variant="danger" onClick={() => onDelete(u)}>Remover</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards no mobile */}
            <ul className="sm:hidden divide-y divide-slate-100">
              {items.map((u) => (
                <li key={u.id} className="p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-slate-800">{u.name}</span>
                    <RoleBadge role={u.role} />
                  </div>
                  <span className="text-sm text-slate-500 break-all">{u.email}</span>
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" variant="secondary" className="flex-1" onClick={() => startEdit(u)}>Editar</Button>
                    <Button size="sm" variant="danger" className="flex-1" onClick={() => onDelete(u)}>Remover</Button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
