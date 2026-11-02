import React, { useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function RoscaSavingsModule({ user }) {
  const [tier, setTier] = useState('individual');
  const [amount, setAmount] = useState(10);
  const [cycle, setCycle] = useState('monthly');

  const joinRoscaPool = async () => {
    try {
      await addDoc(collection(db, "rosca_savings"), {
        userId: user.uid,
        accountType: tier,
        monthlyContribution: amount,
        cycleType: cycle,
        status: 'active',
        createdAt: new Date()
      });
      alert("تم الانضمام لنظام الادخار التدويري بنجاح!");
    } catch (e) {
      console.error("خطأ في الانضمام للادخار:", e);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-emerald-500/30 shadow-lg mt-6">
      <h3 className="text-xl font-bold text-emerald-400 mb-4">منصة "ادخار" الذكية (نظام الجمعيات التدويرية ROSCAs)</h3>
      <p className="text-slate-300 text-sm mb-6">شارك في تدوير الأموال الجماعية بأمان تام، مع تصنيفات مرنة للأفراد والشركات.</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <button 
          onClick={() => setTier('individual')}
          className={`p-3 rounded-xl font-semibold border ${tier === 'individual' ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-slate-900 text-slate-300 border-slate-700'}`}>
          اشتراك أفراد
        </button>
        <button 
          onClick={() => setTier('corporate')}
          className={`p-3 rounded-xl font-semibold border ${tier === 'corporate' ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-slate-900 text-slate-300 border-slate-700'}`}>
          اشتراك شركات ومؤسسات
        </button>
      </div>

      <div className="mb-4 text-sm">
        <label className="text-slate-300 block mb-2">شريحة القسط الدوري:</label>
        <select value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full p-3 bg-slate-900 rounded-xl border border-slate-700 text-white">
          <option value={10}>10$ - شريحة أساسية</option>
          <option value={50}>50$ - شريحة برونزية</option>
          <option value={100}>100$ - شريحة فضية</option>
          <option value={300}>300$ - شريحة في اي بي (VIP)</option>
        </select>
      </div>

      <button onClick={joinRoscaPool} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold rounded-xl shadow-md hover:opacity-90">
        الانضمام لحلقة الادخار الآمنة
      </button>
    </div>
  );
}
