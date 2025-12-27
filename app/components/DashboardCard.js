// app/components/DashboardCard.js
export default function DashboardCard({ title, value }) {
  return (
    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
      <h3 style={{ color: '#6b46c1', marginBottom: '1rem', fontSize: '1.1rem' }}>{title}</h3>
      <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#a855f7' }}>{value}</p>
    </div>
  );
}
