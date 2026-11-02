import React, { useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function SupportTicketModule({ user }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submitTicket = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "support_tickets"), {
        userId: user.uid,
        subject: subject,
        message: message,
        status: 'open',
        createdAt: new Date()
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-emerald-500/30 shadow-lg mt-6">
      <h3 className="text-xl font-bold text-emerald-400 mb-2">مركز الدعم الفني ونظام التذاكر (Support Tickets)</h3>
      <p className="text-slate-300 text-sm mb-6">فريق الدعم متاح لمساعدتك في أي استفسار أو عملية مالية على مدار الساعة.</p>

      {!submitted ? (
        <form onSubmit={submitTicket} className="space-y-4">
          <input 
            type="text" 
            placeholder="عنوان المشكلة أو الاستفسار" 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-3 bg-slate-900 rounded-xl border border-slate-700 text-white text-sm" 
            required 
          />
          <textarea 
            placeholder="اشرح تفاصيل طلبك أو مشكلتك هنا..." 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 bg-slate-900 rounded-xl border border-slate-700 text-white text-sm h-32" 
            required 
          />
          <button type="submit" className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition">
            إرسال تذكرة الدعم الفني
          </button>
        </form>
      ) : (
        <div className="p-4 bg-emerald-950/50 border border-emerald-500 rounded-xl text-emerald-300 text-sm text-center">
          <p className="font-bold mb-1">تم إرسال تذكرتك بنجاح تام! 🚀</p>
          <p>سيقوم فريقنا بمراجعة طلبك والرد عليك في أقرب وقت.</p>
        </div>
      )}
    </div>
  );
}
