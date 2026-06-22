// Marca do produto: três camadas de dados + eixo esmeralda.
// Funciona sozinha (ícone) ou com o wordmark "Nexus".
export function LogoMark({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="16" fill="currentColor" />
      <rect x="30" y="14" width="4" height="36" rx="2" fill="#10b981" />
      <ellipse cx="32" cy="20" rx="13" ry="5" fill="#ffffff" />
      <ellipse cx="32" cy="32" rx="13" ry="5" fill="#a1a1aa" />
      <ellipse cx="32" cy="44" rx="13" ry="5" fill="#52525b" />
    </svg>
  );
}

// Marca + nome do produto. `tone` controla a cor do quadrado:
// "dark" (preto, padrão) ou "light" (branco, para fundos escuros).
export default function Logo({ size = 32, tone = 'dark', showText = true, className = '' }) {
  const markColor = tone === 'light' ? 'text-white' : 'text-zinc-900';
  const textColor = tone === 'light' ? 'text-white' : 'text-zinc-900';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} className={markColor} />
      {showText && (
        <span className={`text-lg font-bold tracking-tight ${textColor}`}>
          Nexus
        </span>
      )}
    </div>
  );
}
