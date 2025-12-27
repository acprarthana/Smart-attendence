// app/page.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './lib/firebase';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  return null;
}
