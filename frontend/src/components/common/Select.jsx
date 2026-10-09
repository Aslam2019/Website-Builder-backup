export default function Select({
  label,
  name,
  error,
  required = false,
  options = [],
  placeholder = 'Select...',
  ...rest
}) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={name}>
          {label} {required && <span className="req">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        className={`form-control ${error ? 'error' : ''}`}
        {...rest}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <div className="form-error">{error}</div>}
    </div>
  )
}