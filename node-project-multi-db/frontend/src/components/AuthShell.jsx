import Logo from './Logo';

// Layout split-screen para telas de autenticação.
// Painel escuro à esquerda (branding) + formulário à direita.
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen flex">
      {/* Painel esquerdo — branding (escondido no mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-950 flex-col justify-between p-12 overflow-hidden">
        {/* Glow esmeralda sutil no fundo */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-accent-600/20 blur-3xl" />
        <div className="absolute bottom-0 -left-24 h-80 w-80 rounded-full bg-accent-700/10 blur-3xl" />

        <div className="relative">
          <Logo size={34} tone="light" />
        </div>

        <div className="relative max-w-md">
          <h2 className="text-3xl font-bold text-white tracking-tight leading-tight">
            Gerencie seus dados com{' '}
            <span className="text-accent-400">precisão</span>.
          </h2>
          <p className="mt-4 text-zinc-400 leading-relaxed">
            Uma plataforma unificada para produtos e usuários, com autenticação
            segura e controle de acesso por papel.
          </p>

          {/* Pequena marca visual de "camadas" */}
          <div className="mt-10 flex items-center gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-1.5 w-12 rounded-full"
                style={{
                  backgroundColor: i === 0 ? '#10b981' : i === 1 ? '#52525b' : '#27272a'
                }}
              />
            ))}
            <span className="ml-2 text-xs text-zinc-500">Multi-database</span>
          </div>
        </div>

        <p className="relative text-xs text-zinc-600">© {new Date().getFullYear()} Nexus. Todos os direitos reservados.</p>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex-1 flex flex-col">
        <div className="lg:hidden p-6">
          <Logo size={30} />
        </div>
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-sm animate-fade-up">
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-zinc-500">{subtitle}</p>}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-6 text-center text-sm text-zinc-500">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
