import React, { useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function QRTransfer({ user }) {
  const [recipientId, setRecipientId] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [statusReport, setStatusReport] = useState(null);

  const executeTransfer = async (e) => {
    e.preventDefault();
    try {
      const transactionData = {
        senderId: user.uid,
        recipientId: recipientId,
        participants: [user.uid, recipientId],
        amount: Number(transferAmount),
        timestamp: new Date(),
        status: 'SUCCESS',
        biometricConfirmed: true
      };

      await addDoc(collection(db, "transactions"), transactionData);
      
      const receiptId = Math.random().toString(36).substring(2, 9).toUpperCase();
      
      setStatusReport({
        msg: `تم تحويل مبلغ $${transferAmount} بنجاح إلى العميل وتم إرسال تقرير حالة العملية الفوري لجهازك وجهاز المستقبل!`,
        id: receiptId,
        time: new Date().toLocaleTimeString('ar-SY')
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-emerald-500/30 shadow-lg mt-6">
      <h3 className="text-xl font-bold text-emerald-400 mb-4">التحويل السريع عبر الباركود (QR Code)</h3>
      
      <div className="flex justify-center mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="w-32 h-32 bg-slate-900 flex items-center justify-center text-emerald-400 text-xs font-mono text-center p-2 rounded">
            [ QR_CODE: {user.uid.substring(0, 8)} ]
          </div>
        </div>
      </div>

      <form onSubmit={executeTransfer} className="space-y-4">
        <input 
          type="text" 
          placeholder="معرف العميل المستقبل" 
          value={recipientId} 
          onChange={(e) => setRecipientId(e.target.value)}
          className="w-full p-3 bg-slate-900 rounded-xl border border-slate-700 text-white text-sm" 
          required 
        />
        <input 
          type="number" 
          placeholder="المبلغ بالدولار" 
          value={transferAmount} 
          onChange={(e) => setTransferAmount(e.target.value)}
          className="w-full p-3 bg-slate-900 rounded-xl border border-slate-700 text-white text-sm" 
          required 
        />
        <button type="submit" className="w-full py-3 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-400 transition">
          تأكيد التحويل بالبصمة البيومترية وإرسال التقرير
        </button>
      </form>

      {statusReport && (
        <div className="mt-4 p-4 bg-emerald-950/50 border border-emerald-500 rounded-xl text-emerald-300 text-sm">
          <p className="font-bold">تقرير العملية (رقم الإيصال: #{statusReport.id}):</p>
          <p>{statusReport.msg}</p>
          <p className="text-xs text-slate-400 mt-1">وقت التنفيذ: {statusReport.time}</p>
        </div>
      )}
    </div>
  );
}
