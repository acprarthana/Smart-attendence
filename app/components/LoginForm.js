// app/components/LoginForm.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../lib/firebase';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Account created successfully!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.replace('/dashboard');
    } catch (error) {
      alert((isRegister ? 'Registration' : 'Login') + ' failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ textAlign: 'center', color: '#6b46c1', marginBottom: '1rem' }}>{isRegister ? 'Register' : 'Login'}</h2>
        <input
          type="email" 
          placeholder="Email"
          value={email} 
          onChange={e => setEmail(e.target.value)}
          required 
          style={{ padding: '12px', border: '2px solid #e6d9ff', borderRadius: '6px', fontSize: '1rem' }}
        />
        <input
          type="password" 
          placeholder="Password"
          value={password} 
          onChange={e => setPassword(e.target.value)}
          required 
          style={{ padding: '12px', border: '2px solid #e6d9ff', borderRadius: '6px', fontSize: '1rem' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '12px', backgroundColor: '#a855f7', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? (isRegister ? 'Creating Account...' : 'Signing In...') : (isRegister ? 'Create Account' : 'Sign In')}
        </button>
        <button 
          type="button" 
          onClick={() => setIsRegister(!isRegister)}
          style={{ padding: '10px', background: 'transparent', color: '#a855f7', border: '2px solid #a855f7', borderRadius: '6px', fontSize: '0.9rem', cursor: 'pointer', marginTop: '0.5rem' }}
        >
          {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
        </button>
      </form>
    </div>
  );
}
