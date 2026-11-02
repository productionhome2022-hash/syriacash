import React, { useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function MerchantGatewayModule({ user }) {
  const [storeName, setStoreName] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [apiKey, setApiKey] = useState(null);

  const generateMerchantApiKey = async (e) => {
    e.preventDefault();
    try {
      const generatedKey = 'syriacash_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      await addDoc(collection(db, "merchants_gateways"), {
        ownerId: user.uid,
        storeName: storeName,
        storeUrl: storeUrl,
        apiKey: generatedKey,
        status: 'active',
        createdAt: new Date()
      });

      setApiKey(generatedKey);
    } catch (error) {
      console.error("خطأ:", error);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-emerald-500/30 shadow-lg mt-6">
      <h3 className="text-xl font-bold text-emerald-400 mb-2">بوابة ربط المتاجر والشركات (E-Commerce Gateway)</h3>
      <p className="text-slate-300 text-sm mb-6">اربط متجرك المحلي أو منصتك العالمية بقبض المدفوعات الآمنة عبر Syriacash.</p>

      {!apiKey ? (
        <form onSubmit={generateMerchantApiKey} className="space-y-4">
          <input 
            type="text" 
            placeholder="اسم المتجر أو المؤسسة" 
            value={storeName} 
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full p-3 bg-slate-900 rounded-xl border border-slate-700 text-white text-sm" 
            required 
          />
          <input 
            type="url" 
            placeholder="رابط المتجر (https://mystore.com)" 
            value={storeUrl} 
            onChange={(e) => setStoreUrl(e.target.value)}
            className="w-full p-3 bg-slate-900 rounded-xl border border-slate-700 text-white text-sm" 
            required 
          />
          <button type="submit" className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition">
            توليد مفتاح الربط البرمجي (API Key)
          </button>
        </form>
      ) : (
        <div className="p-4 bg-slate-900 rounded-xl border border-emerald-500/50">
          <p className="text-xs text-slate-400 mb-1">مفتاح الربط السري الخاص بمتجرك:</p>
          <div className="p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-lg select-all mb-4 break-all">
            {apiKey}
          </div>
        </div>
      )}
    </div>
  );
}
