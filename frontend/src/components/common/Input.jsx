export default function Input({
  label,
  name,
  error,
  required = false,
  type = 'text',
  className = '',
  ...rest
}) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={name}>
          {label} {required && <span className="req">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        className={`form-control ${error ? 'error' : ''} ${className}`}
        {...rest}
      />
      {error && <div className="form-error">{error}</div>}
    </div>
  )
}