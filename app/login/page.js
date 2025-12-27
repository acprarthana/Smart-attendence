// app/login/page.js
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', backgroundColor: '#f8f4ff' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#6b46c1', marginBottom: '0.5rem' }}>Smart Attendance System</h1>
        <p style={{ color: '#a855f7', fontSize: '1.1rem' }}>Please login to access your dashboard</p>
      </div>
      <LoginForm />
    </div>
  );
}
