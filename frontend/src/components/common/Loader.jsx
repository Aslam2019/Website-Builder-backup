export default function Loader({ full = false }) {
  return (
    <div
      className="loader-wrap"
      style={full ? { minHeight: '100vh' } : undefined}
    >
      <div className="spinner" />
    </div>
  )
}