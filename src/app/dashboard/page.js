"use client";

import { useEffect, useState, useRef } from 'react';
import { Link2, Image as ImageIcon, Wallet, Nfc, ExternalLink, Activity, Edit2, Save, X, Trash2, Trash, RefreshCw, Download } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';
import { QRCodeSVG } from 'qrcode.react';

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
  const { data: session, status } = useSession();
  const [qrs, setQrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: '', targetData: '' });
  const [viewQr, setViewQr] = useState(null);
  const svgRef = useRef(null);

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

  const deleteQR = async (id) => {
    if (!window.confirm("Are you sure you want to delete this QR code?")) return;
    try {
      const res = await fetch(`/api/qr/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setQrs(qrs.filter(q => q.id !== id));
      }
    } catch (e) {
      console.error("Failed to delete QR", e);
    }
  };

  const clearDashboard = async () => {
    if (!window.confirm("Are you sure you want to delete ALL QR codes? This cannot be undone.")) return;
    try {
      const res = await fetch('/api/qr', { method: 'DELETE' });
      if (res.ok) {
        setQrs([]);
      }
    } catch (e) {
      console.error("Failed to clear dashboard", e);
    }
  };

  const refreshData = async () => {
    if (status !== 'authenticated') return;
    setLoading(true);
    try {
      const res = await fetch('/api/qr');
      if (res.ok) {
        const data = await res.json();
        setQrs(data.qrs || []);
      }
    } catch (e) {
      console.error("Failed to refresh data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') refreshData();
    else if (status === 'unauthenticated') setLoading(false);
  }, [status]);

  if (status === "loading") {
    return <div className="w-full flex items-center justify-center p-20 mt-20"><Activity className="animate-spin text-foreground" size={48} /></div>;
  }
  
  if (status === "unauthenticated") {
    return (
      <div className="w-full flex flex-col items-center mt-32 space-y-6 animate-fade-in relative z-20">
        <h2 className="text-4xl md:text-5xl font-black text-foreground">Login Required</h2>
        <p className="text-foreground/70 text-lg font-medium text-center">You must sign in with Google to view and manage your generated QRs.</p>
        <button onClick={() => signIn("google")} className="btn-3d flex items-center gap-2 px-8 py-3 mt-4 text-lg">
           Sign in to Dashboard
        </button>
      </div>
    );
  }

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

      <div className="w-full max-w-6xl flex justify-end px-4 gap-4">
        <button 
          onClick={refreshData}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border-[3px] font-bold text-sm transition-all duration-200 ${
            loading
              ? 'bg-neutral-200 border-neutral-300 text-neutral-400 cursor-not-allowed dark:bg-surface dark:border-neutral-700 dark:text-neutral-500'
              : 'bg-primary border-foreground text-foreground shadow-[3px_3px_0_var(--foreground)] hover:-translate-y-1 hover:brightness-110'
          }`}
        >
          <RefreshCw size={16} strokeWidth={2.5} className={loading ? "animate-spin" : ""} />
          Refresh Scans
        </button>
        <button 
          onClick={clearDashboard}
          disabled={qrs.length === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border-[3px] font-bold text-sm transition-all duration-200 ${
            qrs.length === 0 
              ? 'bg-neutral-200 border-neutral-300 text-neutral-400 cursor-not-allowed dark:bg-surface dark:border-neutral-700 dark:text-neutral-500'
              : 'bg-red-500 border-foreground text-white shadow-[3px_3px_0_var(--foreground)] hover:-translate-y-1 hover:brightness-110'
          }`}
        >
          <Trash size={16} strokeWidth={2.5} />
          Clear Dashboard
        </button>
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
                        <button onClick={() => setViewQr(qr)} className="hover:underline focus:outline-none text-left flex items-center gap-2">
                          {qr.name}
                          {qr.isProfileQR && <span className="text-[10px] bg-primary text-foreground px-2 py-0.5 rounded-full uppercase border-2 border-foreground font-black whitespace-nowrap">Profile</span>}
                        </button>
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
                            href={`/r/${qr.id}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-flex p-2 rounded-xl bg-primary border-[3px] border-foreground text-foreground shadow-[3px_3px_0_var(--foreground)] hover:brightness-110 transform hover:-translate-y-1 transition-all"
                            title="Visit Link"
                          >
                            <ExternalLink size={18} strokeWidth={2.5} />
                          </a>
                          <button onClick={() => deleteQR(qr.id)} className="inline-flex p-2 rounded-xl bg-surface border-[3px] border-foreground text-red-500 shadow-[3px_3px_0_var(--foreground)] hover:bg-red-50 transform hover:-translate-y-1 transition-all" title="Delete QR">
                            <Trash2 size={18} strokeWidth={2.5} />
                          </button>
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

      {viewQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-3xl border-[4px] border-foreground shadow-[8px_8px_0_var(--foreground)] w-full max-w-sm p-8 flex flex-col items-center relative animate-scale-up">
            <button onClick={() => setViewQr(null)} className="absolute top-4 right-4 p-2 bg-neutral-200 hover:bg-neutral-300 text-foreground rounded-full border-[3px] border-foreground hover:-translate-y-1 transition-transform">
              <X size={20} strokeWidth={3} />
            </button>
            <h3 className="text-2xl font-black mb-4 w-full text-center truncate">{viewQr.name}</h3>
            
            <div className="bg-white p-4 rounded-2xl border-[3px] border-foreground shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] mb-6 flex justify-center items-center" ref={svgRef}>
              <QRCodeSVG
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/r/${viewQr.id}`}
                size={220}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"}
              />
            </div>
            
            <p className="text-xs font-bold font-mono text-foreground/50 mb-6 w-full text-center uppercase tracking-widest">ID: {viewQr.id}</p>
            
            <div className="flex gap-4 w-full">
               <button onClick={async () => {
                  try {
                    const res = await fetch('/api/generate', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        url: `${typeof window !== 'undefined' ? window.location.origin : ''}/r/${viewQr.id}`,
                        color: 'white' 
                      })
                    });
                    
                    if (!res.ok) {
                      console.error("Failed to generate QR via backend.");
                      return;
                    }

                    const blob = await res.blob();
                    const downloadUrl = window.URL.createObjectURL(blob);
                    
                    const downloadLink = document.createElement("a");
                    downloadLink.download = `QR_${viewQr.name.replace(/\s+/g, '_')}_Pro.png`;
                    downloadLink.href = downloadUrl;
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    downloadLink.remove();
                    window.URL.revokeObjectURL(downloadUrl);
                  } catch (e) {
                    console.error("Error downloading QR:", e);
                  }
               }} className="btn-3d flex items-center justify-center gap-2 w-full py-3 flex-row text-sm">
                 <Download size={18} strokeWidth={3} /> Download Pro PNG
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
