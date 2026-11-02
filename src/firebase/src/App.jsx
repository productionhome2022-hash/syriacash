import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded-3xl border border-emerald-500/30 shadow-2xl text-center">
        <h1 className="text-3xl font-black text-emerald-400 mb-2">Syriacash</h1>
        <p className="text-slate-400 text-sm mb-6">النظام المالي الرقمي والآمن متصل بنجاح مع سحابة Firebase.</p>
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-emerald-300 font-mono text-xs">
          {user ? `المستخدم مسجل الدخول: ${user.email}` : "يرجى تسجيل الدخول للبدء"}
        </div>
      </div>
    </div>
  );
}
