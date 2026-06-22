import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center px-6 bg-slate-100">
      <p className="text-6xl font-bold text-brand-600">404</p>
      <h1 className="text-xl font-semibold text-slate-800">Página não encontrada</h1>
      <p className="text-slate-500">A página que você procura não existe ou foi movida.</p>
      <Link to="/" className="mt-2 text-brand-600 font-medium hover:underline">
        Voltar ao início
      </Link>
    </div>
  );
}
