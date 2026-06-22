// Campo de formulário com label, hint e erro opcionais.
export default function Input({
  label,
  error,
  hint,
  id,
  className = '',
  ...rest
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-[13px] font-medium text-zinc-700 mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:outline-none focus:ring-4 focus:ring-accent-500/10 focus:border-accent-500 ${
          error ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/10' : 'border-zinc-200'
        } ${className}`}
        {...rest}
      />
      {error ? (
        <p className="mt-1.5 text-xs text-rose-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-zinc-400">{hint}</p>
      ) : null}
    </div>
  );
}
