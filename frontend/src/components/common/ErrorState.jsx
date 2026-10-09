export default function ErrorState({ message = 'Something went wrong', onRetry = null }) {
  return (
    <div className="text-center" style={{ padding: '40px 20px' }}>
      <div style={{ fontSize: 40, marginBottom: 10 }}>⚠️</div>
      <p className="muted" style={{ marginBottom: 16 }}>{message}</p>
      {onRetry && (
        <button className="btn btn-outline" onClick={onRetry}>Retry</button>
      )}
    </div>
  )
}