import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { subjectStats } = await req.json();
    
    let advice = "📊 Attendance Analysis:\n\n";
    
    Object.entries(subjectStats).forEach(([subject, stats]) => {
      const currentPct = (stats.attended / stats.total) * 100;
      const semesterTotal = stats.semesterTotal || stats.total;
      const remainingClasses = semesterTotal - stats.total;
      
      // Calculate how many more classes can be bunked
      const requiredAttendance = Math.ceil(semesterTotal * 0.75);
      const canBunk = Math.max(0, stats.attended + remainingClasses - requiredAttendance);
      
      advice += `📚 ${subject}:\n`;
      advice += `   Current: ${currentPct.toFixed(1)}% (${stats.attended}/${stats.total})\n`;
      
      if (remainingClasses > 0) {
        advice += `   Remaining classes: ${remainingClasses}\n`;
        
        if (currentPct >= 75) {
          if (canBunk > 0) {
            advice += `   ✅ You can bunk ${canBunk} more classes\n`;
          } else {
            advice += `   ⚠️ Attend all remaining classes to maintain 75%\n`;
          }
        } else {
          const needToAttend = requiredAttendance - stats.attended;
          if (needToAttend <= remainingClasses) {
            advice += `   🚨 Must attend ${needToAttend} out of ${remainingClasses} remaining classes\n`;
          } else {
            advice += `   💀 Cannot reach 75% even if you attend all remaining classes\n`;
          }
        }
      } else {
        if (currentPct >= 75) {
          advice += `   ✅ Safe - Above 75%\n`;
        } else {
          advice += `   🚨 Below 75% - Contact advisor\n`;
        }
      }
      advice += "\n";
    });
    
    return NextResponse.json({ advice });
  } catch (error) {
    return NextResponse.json({ advice: 'Unable to generate advice.' }, { status: 500 });
  }
}
