export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  loading = false,
  disabled = false,
  ...rest
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size !== 'md' ? `btn-${size}` : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : null}
      {children}
    </button>
  )
}