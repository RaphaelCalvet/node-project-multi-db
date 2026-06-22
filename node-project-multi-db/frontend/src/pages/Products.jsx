import { useEffect, useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Spinner from '../components/Spinner';
import productService from '../services/productService';
import { extractErrorMessage } from '../services/api';
import { useToast } from '../context/ToastContext';

const emptyForm = { name: '', price: '' };

export default function ProductsPage() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll();
      setItems(data);
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Erro ao carregar produtos.'));
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

  const startEdit = (item) => {
    setForm({ name: item.name, price: String(item.price) });
    setEditingId(item.id);
    setShowForm(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      price: parseFloat(form.price)
    };
    if (!payload.name || Number.isNaN(payload.price)) {
      toast.error('Informe nome e preço válidos.');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await productService.update(editingId, payload);
        toast.success('Produto atualizado.');
      } else {
        await productService.create(payload);
        toast.success('Produto criado.');
      }
      resetForm();
      await load();
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Erro ao salvar produto.'));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (item) => {
    if (!window.confirm(`Remover o produto "${item.name}"?`)) return;
    try {
      await productService.remove(item.id);
      toast.success('Produto removido.');
      setItems((prev) => prev.filter((p) => p.id !== item.id));
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Erro ao remover produto.'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Produtos</h1>
          <p className="text-slate-500 text-sm">Cadastre e gerencie os produtos (MySQL).</p>
        </div>
        {!showForm && (
          <Button onClick={() => { resetForm(); setShowForm(true); }}>+ Novo produto</Button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={onSubmit}
          className="bg-white rounded-xl border border-slate-200 p-5 space-y-4"
        >
          <h2 className="font-semibold text-slate-700">
            {editingId ? 'Editar produto' : 'Novo produto'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="name"
              label="Nome"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex.: Notebook"
              required
            />
            <Input
              id="price"
              type="number"
              step="0.01"
              label="Preço"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" loading={saving}>
              {editingId ? 'Salvar alterações' : 'Criar produto'}
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
          <p className="text-center text-slate-400 py-12">Nenhum produto cadastrado.</p>
        ) : (
          <>
            {/* Tabela no desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium">Nome</th>
                    <th className="px-4 py-3 font-medium">Preço</th>
                    <th className="px-4 py-3 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-800">{p.name}</td>
                      <td className="px-4 py-3 text-slate-600">
                        R$ {Number(p.price).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="secondary" onClick={() => startEdit(p)}>
                            Editar
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => onDelete(p)}>
                            Remover
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards no mobile */}
            <ul className="sm:hidden divide-y divide-slate-100">
              {items.map((p) => (
                <li key={p.id} className="p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-slate-800">{p.name}</span>
                    <span className="font-semibold text-brand-700">
                      R$ {Number(p.price).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" variant="secondary" className="flex-1" onClick={() => startEdit(p)}>
                      Editar
                    </Button>
                    <Button size="sm" variant="danger" className="flex-1" onClick={() => onDelete(p)}>
                      Remover
                    </Button>
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
