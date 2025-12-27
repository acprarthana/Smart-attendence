// app/dashboard/page.js
'use client';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { auth, db } from '../lib/firebase';
import DashboardCard from '../components/DashboardCard';
import AddAttendance from '../components/AddAttendance';

export default function DashboardPage() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const router = useRouter();

  const fetchAttendance = () => {
    if (!auth.currentUser) return;
    
    const userKey = `attendanceData_${auth.currentUser.uid}`;
    const localData = localStorage.getItem(userKey);
    if (localData) {
      setAttendanceRecords(JSON.parse(localData));
    } else {
      setAttendanceRecords([]);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/login');
        return;
      }
      fetchAttendance();
    });
    return () => unsubscribe();
  }, [router]);

  const handleAttendanceAdded = () => {
    fetchAttendance();
  };

  const seedDemoData = () => {
    if (!auth.currentUser) return;
    
    const demoData = [
      {
        subject: 'Mathematics',
        totalSemesterClasses: 60,
        classesTakenSoFar: 40,
        classesAttended: 32,
        percentage: 80
      },
      {
        subject: 'Physics',
        totalSemesterClasses: 50,
        classesTakenSoFar: 30,
        classesAttended: 22,
        percentage: 73.3
      },
      {
        subject: 'Chemistry',
        totalSemesterClasses: 45,
        classesTakenSoFar: 25,
        classesAttended: 15,
        percentage: 60
      },
      {
        subject: 'Computer Science',
        totalSemesterClasses: 70,
        classesTakenSoFar: 35,
        classesAttended: 33,
        percentage: 94.3
      },
      {
        subject: 'English',
        totalSemesterClasses: 40,
        classesTakenSoFar: 20,
        classesAttended: 12,
        percentage: 60
      }
    ];
    
    const userKey = `attendanceData_${auth.currentUser.uid}`;
    localStorage.setItem(userKey, JSON.stringify(demoData));
    setAttendanceRecords(demoData);
    alert('Demo data added: 5 subjects!');
  };

  // Calculate subject-wise attendance
  const subjectStats = attendanceRecords.reduce((acc, record) => {
    if (!acc[record.subject]) {
      acc[record.subject] = { total: 0, attended: 0, semesterTotal: 0 };
    }
    
    acc[record.subject].total = record.classesTakenSoFar;
    acc[record.subject].attended = record.classesAttended;
    acc[record.subject].semesterTotal = record.totalSemesterClasses;
    
    return acc;
  }, {});

  const totalClasses = Object.values(subjectStats).reduce((sum, stats) => sum + stats.total, 0);
  const attendedClasses = Object.values(subjectStats).reduce((sum, stats) => sum + stats.attended, 0);
  const attendancePct = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
  const allowedAbsences = totalClasses * 0.25;
  const missedClasses = totalClasses - attendedClasses;
  const atRisk = missedClasses > allowedAbsences;

  const getAdvice = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/aiRisk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectStats })
      });
      
      if (!res.ok) throw new Error('Failed');
      
      const json = await res.json();
      setAdvice(json.advice);
    } catch (err) {
      setAdvice("Unable to get advice.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      setError('Failed to logout.');
    }
  };

  if (dataLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', backgroundColor: '#f8f4ff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px solid #e6d9ff' }}>
        <h1 style={{ color: '#6b46c1', fontSize: '2rem' }}>Smart Attendance Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Logout</button>
      </div>
      
      {error && (
        <div style={{
          background: '#fee2e2',
          color: '#dc2626',
          padding: '1rem',
          borderRadius: '6px',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <DashboardCard title="Overall Attendance" value={`${attendancePct.toFixed(1)}%`} />
        <DashboardCard title="Total Classes" value={`${attendedClasses} / ${totalClasses}`} />
      </div>
      
      {Object.keys(subjectStats).length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#6b46c1', marginBottom: '1rem', textAlign: 'center' }}>Subject-wise Attendance</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {Object.entries(subjectStats).map(([subject, stats]) => {
              const subjectPct = stats.total > 0 ? (stats.attended / stats.total) * 100 : 0;
              return (
                <div key={subject} style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', textAlign: 'center', borderLeft: '4px solid #a855f7' }}>
                  <h4 style={{ color: '#6b46c1', marginBottom: '0.5rem', fontSize: '1rem' }}>{subject}</h4>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#a855f7', marginBottom: '0.25rem' }}>{subjectPct.toFixed(1)}%</p>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>{stats.attended} / {stats.total} classes</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {totalClasses === 0 ? (
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', marginBottom: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: '500', color: '#6b46c1' }}>📚 No attendance records found. Start tracking your attendance!</p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={seedDemoData} style={{ padding: '10px 20px', backgroundColor: '#a855f7', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Add Demo Data
            </button>
            <button onClick={() => setShowAddForm(!showAddForm)} style={{ padding: '10px 20px', backgroundColor: '#6b46c1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              {showAddForm ? 'Hide Form' : 'Add Record'}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', marginBottom: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: '500', color: '#6b46c1' }}>
            {atRisk
              ? "⚠️ You have exceeded 25% absences (College requires ≥75% attendance)."
              : "✅ Attendance is within the safe range."}
          </p>
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button onClick={() => setShowAddForm(!showAddForm)} style={{ padding: '10px 20px', backgroundColor: '#6b46c1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              {showAddForm ? 'Hide Form' : 'Add New Record'}
            </button>
          </div>
        </div>
      )}
      
      {showAddForm && (
        <AddAttendance onAttendanceAdded={handleAttendanceAdded} />
      )}
      
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
        <button 
          onClick={getAdvice} 
          disabled={loading || totalClasses === 0} 
          style={{ padding: '12px 24px', backgroundColor: loading || totalClasses === 0 ? '#9ca3af' : '#a855f7', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: loading || totalClasses === 0 ? 'not-allowed' : 'pointer', marginBottom: '1rem' }}
        >
          {loading ? 'Getting Advice...' : 'Get AI Advice'}
        </button>
        {advice && (
          <div style={{ background: '#f3e8ff', padding: '1rem', borderRadius: '6px', borderLeft: '4px solid #a855f7', textAlign: 'left' }}>
            <h3 style={{ color: '#6b46c1', marginBottom: '0.5rem' }}>AI Suggestion:</h3>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: '#6b46c1', lineHeight: '1.6' }}>{advice}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
