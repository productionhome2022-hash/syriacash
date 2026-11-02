import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase/firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import TransactionLedger from './components/Transactions/TransactionLedger';
import RoscaSavingsModule from './components/Savings/RoscaSavingsModule';
import QRTransfer from './components/Transactions/QRTransfer';
import MerchantGatewayModule from './components/Merchant/MerchantGatewayModule';
import SupportTicketModule from './components/Support/SupportTicketModule';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('ledger');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert("خطأ في تسجيل الدخول: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-emerald-400 font-mono">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          جاري تحميل منصة Syriacash الآمنة...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 p-8 rounded-3xl border border-emerald-500/30 shadow-2xl">
          <h1 className="text-3xl font-black text-emerald-400 mb-2 text-center">Syriacash</h1>
          <p className="text-slate-400 text-sm mb-6 text-center">تسجيل الدخول إلى المنصة المالية الرقمية الفاخرة</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="email" 
              placeholder="البريد الإلكتروني" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-slate-950 rounded-xl border border-slate-700 text-white text-sm outline-none" 
              required 
            />
            <input 
              type="password" 
              placeholder="كلمة المرور" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-slate-950 rounded-xl border border-slate-700 text-white text-sm outline-none" 
              required 
            />
            <button type="submit" className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition">
              دخول آمن
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* شريط علوي */}
        <div className="flex justify-between items-center bg-slate-900 p-6 rounded-2xl border border-slate-800 mb-6">
          <div>
            <h1 className="text-2xl font-black text-emerald-400">Syriacash Dashboard</h1>
            <p className="text-xs text-slate-400 mt-1">المستخدم: {user.email}</p>
          </div>
          <button onClick={() => signOut(auth)} className="px-4 py-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl text-xs font-bold transition">
            تسجيل الخروج
          </button>
        </div>

        {/* أزرار التنقل بين الأقسام */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
          <button onClick={() => setActiveTab('ledger')} className={`p-3 rounded-xl text-xs font-bold transition ${activeTab === 'ledger' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-300'}`}>سجل المعاملات</button>
          <button onClick={() => setActiveTab('transfer')} className={`p-3 rounded-xl text-xs font-bold transition ${activeTab === 'transfer' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-300'}`}>التحويل السريع</button>
          <button onClick={() => setActiveTab('savings')} className={`p-3 rounded-xl text-xs font-bold transition ${activeTab === 'savings' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-300'}`}>منصة ادخار</button>
          <button onClick={() => setActiveTab('merchant')} className={`p-3 rounded-xl text-xs font-bold transition ${activeTab === 'merchant' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-300'}`}>بوابة المتاجر</button>
          <button onClick={() => setActiveTab('support')} className={`p-3 rounded-xl text-xs font-bold transition ${activeTab === 'support' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-300'}`}>الدعم الفني</button>
        </div>

        {/* عرض القسم النشط */}
        <div className="transition-all duration-300">
          {activeTab === 'ledger' && <TransactionLedger user={user} />}
          {activeTab === 'transfer' && <QRTransfer user={user} />}
          {activeTab === 'savings' && <RoscaSavingsModule user={user} />}
          {activeTab === 'merchant' && <MerchantGatewayModule user={user} />}
          {activeTab === 'support' && <SupportTicketModule user={user} />}
        </div>
      </div>
    </div>
  );
}
