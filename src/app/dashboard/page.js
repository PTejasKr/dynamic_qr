"use client";

import { useEffect, useState } from 'react';
import { Link2, Image as ImageIcon, Wallet, Nfc, ExternalLink, Activity, Edit2, Save, X } from 'lucide-react';

const getTypeIcon = (type) => {
  switch(type) {
    case 'link': return <Link2 size={16} />;
    case 'image': return <ImageIcon size={16} />;
    case 'wallet': return <Wallet size={16} />;
    case 'nfc': return <Nfc size={16} />;
    default: return <Link2 size={16} />;
  }
};

const getTypeColor = (type) => {
  switch(type) {
    case 'link': return 'bg-primary border-foreground text-foreground';
    case 'image': return 'bg-secondary border-foreground text-foreground';
    case 'wallet': return 'bg-accent border-foreground text-foreground';
    case 'nfc': return 'bg-indigo-200 border-foreground text-foreground';
    default: return 'bg-primary border-foreground text-foreground';
  }
};

export default function Dashboard() {
  const [qrs, setQrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: '', targetData: '' });

  const startEdit = (qr) => {
    setEditingId(qr.id);
    setEditData({ name: qr.name, targetData: qr.targetData });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: '', targetData: '' });
  };

  const saveEdit = async (id) => {
    try {
      const res = await fetch(`/api/qr/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      if (res.ok) {
        const data = await res.json();
        setQrs(qrs.map(q => q.id === id ? data.qr : q));
        cancelEdit();
      }
    } catch (e) {
      console.error("Failed to update QR", e);
    }
  };

  useEffect(() => {
    fetch('/api/qr')
      .then(res => res.json())
      .then(data => {
        setQrs(data.qrs || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full flex flex-col items-center mt-12 space-y-8 animate-fade-in relative z-20">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground drop-shadow-sm">
          Your Dashboard
        </h1>
        <p className="text-lg md:text-xl text-foreground/70 font-medium">
          Manage and track your beautiful QR codes.
        </p>
      </div>

      <div className="card-minimal w-full max-w-6xl min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Activity className="animate-spin text-foreground" size={48} />
            <div className="font-bold text-foreground/70 tracking-widest text-sm">Loading Data...</div>
          </div>
        ) : qrs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center opacity-70 hover:opacity-100 transition-opacity duration-300">
            <p className="text-xl font-bold text-foreground/60 mb-6">No QR Codes Created Yet</p>
            <a href="/create" className="btn-3d">Create Your First QR</a>
          </div>
        ) : (
          <div className="w-full overflow-x-auto pb-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-[3px] border-transparent border-b-foreground text-xs font-bold uppercase tracking-wider text-foreground/60">
                  <th className="pb-4 pt-2 px-4 whitespace-nowrap">Name</th>
                  <th className="pb-4 pt-2 px-4 whitespace-nowrap">Type</th>
                  <th className="pb-4 pt-2 px-4 whitespace-nowrap">ID</th>
                  <th className="pb-4 pt-2 px-4 whitespace-nowrap">Created</th>
                  <th className="pb-4 pt-2 px-4 whitespace-nowrap text-right">Scans</th>
                  <th className="pb-4 pt-2 px-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-neutral-100 dark:divide-surface">
                {qrs.map((qr) => {
                  const isEditing = editingId === qr.id;
                  
                  return (
                  <tr key={qr.id} className="hover:bg-neutral-50 dark:hover:bg-surface/50 transition-colors group">
                    <td className="py-5 px-4 font-bold text-foreground group-hover:text-primary-dark transition-colors">
                      {isEditing ? (
                        <input 
                          type="text" 
                          className="input-field text-sm p-2 min-w-[150px]" 
                          value={editData.name} 
                          onChange={(e) => setEditData({...editData, name: e.target.value})} 
                        />
                      ) : (
                        qr.name
                      )}
                    </td>
                    <td className="py-5 px-4">
                      {isEditing ? (
                         <input 
                          type="text" 
                          className="input-field text-sm font-mono p-2 min-w-[200px]" 
                          placeholder="Target Link / Data"
                          value={editData.targetData} 
                          onChange={(e) => setEditData({...editData, targetData: e.target.value})} 
                        />
                      ) : (
                        <div className="flex flex-col gap-1 max-w-[250px]">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border-[2px] shadow-[2px_2px_0_var(--foreground)] ${getTypeColor(qr.type)} w-max`}>
                            {getTypeIcon(qr.type)}
                            <span className="capitalize">{qr.type}</span>
                          </span>
                          <span className="text-xs text-foreground/50 truncate" title={qr.targetData}>{qr.targetData}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-5 px-4 font-mono text-sm font-semibold text-foreground/60">{qr.id}</td>
                    <td className="py-5 px-4 font-mono text-sm font-medium text-foreground/60">{new Date(qr.createdAt).toLocaleDateString()}</td>
                    <td className="py-5 px-4 text-right font-black text-lg text-foreground">{qr.scans}</td>
                    <td className="py-5 px-4 text-right flex justify-end gap-2">
                      {isEditing ? (
                        <>
                          <button onClick={() => saveEdit(qr.id)} className="inline-flex p-2 rounded-xl bg-green-200 border-[3px] border-black text-black shadow-[3px_3px_0_#000] hover:-translate-y-1 transition-all" title="Save Changes">
                            <Save size={18} strokeWidth={2.5} />
                          </button>
                          <button onClick={cancelEdit} className="inline-flex p-2 rounded-xl bg-red-200 border-[3px] border-black text-black shadow-[3px_3px_0_#000] hover:-translate-y-1 transition-all" title="Cancel">
                            <X size={18} strokeWidth={2.5} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(qr)} className="inline-flex p-2 rounded-xl bg-surface border-[3px] border-foreground text-foreground shadow-[3px_3px_0_var(--foreground)] hover:bg-neutral-100 transform hover:-translate-y-1 transition-all" title="Edit Link">
                            <Edit2 size={18} strokeWidth={2.5} />
                          </button>
                          <a 
                            href={`/${qr.id}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-flex p-2 rounded-xl bg-primary border-[3px] border-foreground text-foreground shadow-[3px_3px_0_var(--foreground)] hover:brightness-110 transform hover:-translate-y-1 transition-all"
                            title="Visit Link"
                          >
                            <ExternalLink size={18} strokeWidth={2.5} />
                          </a>
                        </>
                      )}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
