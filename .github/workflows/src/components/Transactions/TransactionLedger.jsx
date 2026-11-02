import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

export default function TransactionLedger({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "transactions"),
      where("participants", "array-contains", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTransactions(txs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user.uid]);

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-emerald-500/30 shadow-lg mt-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700">
        <div>
          <h3 className="text-xl font-bold text-emerald-400">سجل التحويلات المالي المحمي (Immutable Ledger)</h3>
          <p className="text-slate-400 text-xs">سجل دائم ومحفوظ سحابياً غير قابل للحذف أو التعديل نهائياً.</p>
        </div>
        <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-mono">
          محمي بالكامل
        </span>
      </div>

      {loading ? (
        <div className="text-center py-6 text-slate-400 text-sm">جاري التحميل...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-6 text-slate-500 text-sm">لا توجد تحويلات مسجلة بعد.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-sm">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-xs border-b border-slate-700">
                <th className="p-3">رقم الإيصال</th>
                <th className="p-3">النوع</th>
                <th className="p-3">الطرف الآخر</th>
                <th className="p-3">المبلغ</th>
                <th className="p-3">التاريخ والوقت</th>
                <th className="p-3">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 font-mono text-xs">
              {transactions.map((tx) => {
                const isSender = tx.senderId === user.uid;
                return (
                  <tr key={tx.id} className="hover:bg-slate-900/50">
                    <td className="p-3 text-slate-400">#{tx.id.substring(0, 8)}</td>
                    <td className="p-3">
                      {isSender ? <span className="text-rose-400 font-bold">صادر ⬆️</span> : <span className="text-emerald-400 font-bold">وارد ⬇️</span>}
                    </td>
                    <td className="p-3 text-slate-300">{isSender ? tx.recipientId.substring(0, 8) : tx.senderId.substring(0, 8)}</td>
                    <td className={`p-3 font-bold ${isSender ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {isSender ? `-$${tx.amount}` : `+$${tx.amount}`}
                    </td>
                    <td className="p-3 text-slate-400">{tx.timestamp?.toDate().toLocaleString('ar-SY') || 'الآن'}</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded">موثق</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
