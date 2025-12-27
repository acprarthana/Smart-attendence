'use client';
import { useState } from 'react';
import { auth } from '../lib/firebase';

export default function AddAttendance({ onAttendanceAdded }) {
  const [subject, setSubject] = useState('');
  const [totalSemesterClasses, setTotalSemesterClasses] = useState('');
  const [classesTakenSoFar, setClassesTakenSoFar] = useState('');
  const [classesAttended, setClassesAttended] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    const semesterTotal = parseInt(totalSemesterClasses);
    const takenSoFar = parseInt(classesTakenSoFar);
    const attended = parseInt(classesAttended);
    
    if (attended > takenSoFar || takenSoFar > semesterTotal) {
      alert('Invalid input: Check your numbers');
      return;
    }
    
    const newRecord = {
      subject,
      totalSemesterClasses: semesterTotal,
      classesTakenSoFar: takenSoFar,
      classesAttended: attended,
      percentage: (attended / takenSoFar) * 100
    };
    
    const userKey = `attendanceData_${auth.currentUser.uid}`;
    const existing = JSON.parse(localStorage.getItem(userKey) || '[]');
    existing.push(newRecord);
    localStorage.setItem(userKey, JSON.stringify(existing));
    
    setSubject('');
    setTotalSemesterClasses('');
    setClassesTakenSoFar('');
    setClassesAttended('');
    
    onAttendanceAdded();
    alert('Record added!');
  };

  return (
    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
      <h3 style={{ color: '#6b46c1', marginBottom: '1rem', textAlign: 'center' }}>Add Attendance Record</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          required
          style={{ padding: '12px', border: '2px solid #e6d9ff', borderRadius: '6px', fontSize: '1rem' }}
        />
        <input
          type="number"
          placeholder="Total classes in semester"
          value={totalSemesterClasses}
          onChange={e => setTotalSemesterClasses(e.target.value)}
          required
          style={{ padding: '12px', border: '2px solid #e6d9ff', borderRadius: '6px', fontSize: '1rem' }}
        />
        <input
          type="number"
          placeholder="Classes taken so far"
          value={classesTakenSoFar}
          onChange={e => setClassesTakenSoFar(e.target.value)}
          required
          style={{ padding: '12px', border: '2px solid #e6d9ff', borderRadius: '6px', fontSize: '1rem' }}
        />
        <input
          type="number"
          placeholder="Classes attended"
          value={classesAttended}
          onChange={e => setClassesAttended(e.target.value)}
          required
          style={{ padding: '12px', border: '2px solid #e6d9ff', borderRadius: '6px', fontSize: '1rem' }}
        />
        <button type="submit" style={{ padding: '12px', backgroundColor: '#a855f7', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer' }}>
          Add Record
        </button>
      </form>
    </div>
  );
}