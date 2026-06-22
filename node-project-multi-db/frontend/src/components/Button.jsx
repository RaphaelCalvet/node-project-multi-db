// Botão com estados refinados. Acento esmeralda contido no primary.
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const variants = {
    primary: 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-soft',
    accent: 'bg-accent-600 text-white hover:bg-accent-700 shadow-soft',
    secondary:
      'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300',
    danger:
      'bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 hover:border-rose-300',
    ghost: 'bg-transparent text-zinc-600 hover:bg-zinc-100'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[13px]',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-[15px]'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...rest}
    >
      {loading && <Spinner size={16} />}
      {children}
    </button>
  );
}

function Spinner({ size = 16 }) {
  return (
    <svg
      className="animate-spin"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
