"use client";

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Link2, Image as ImageIcon, Wallet, Nfc, CheckCircle2, Copy, QrCode } from 'lucide-react';

const TABS = [
  { id: 'link', label: 'Link', icon: Link2 },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'nfc', label: 'NFC', icon: Nfc },
];

export default function CreateQR() {
  const [activeTab, setActiveTab] = useState('link');
  const [name, setName] = useState('');
  const [targetData, setTargetData] = useState('');
  const [currency, setCurrency] = useState('ethereum');
  const [qrColor, setQrColor] = useState('#a0c4ff'); // Default pastel blue
  const [loading, setLoading] = useState(false);
  const [createdQr, setCreatedQr] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let finalData = targetData;
    if (activeTab === 'wallet') {
      finalData = `${currency}:${targetData}`;
    }

    try {
      const res = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type: activeTab, targetData: finalData }),
      });
      const data = await res.json();
      if (data.success) {
        setCreatedQr(data.qr);
        setCopied(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTargetUrl = () => {
    if (typeof window === 'undefined' || !createdQr) return '';
    return `${window.location.origin}/${createdQr.id}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getTargetUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="w-full flex flex-col items-center mt-12 space-y-8 animate-fade-in relative z-20">
      
      {/* Header section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground drop-shadow-sm">
          Create Your QR
        </h1>
        <p className="text-lg md:text-xl text-foreground/70 font-medium">
          Generate a beautiful, dynamic link in seconds.
        </p>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-6">
        
        {/* Left Side: Form */}
        <div className="card-minimal w-full flex flex-col gap-6">
          {/* Tabs */}
          <div className="flex gap-2 pb-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`flex-1 flex flex-col items-center justify-center gap-2 py-3 rounded-xl border-[3px] font-bold text-sm transition-all duration-200 ${
                    isActive 
                      ? "bg-primary border-foreground text-foreground shadow-[3px_3px_0_var(--foreground)] transform -translate-y-1" 
                      : "bg-surface border-transparent text-foreground/60 hover:bg-neutral-100 dark:hover:bg-surface/80"
                  }`}
                  onClick={() => { setActiveTab(tab.id); setTargetData(''); }}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">QR Name / Campaign</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. My Website"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {activeTab === 'link' && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-foreground">Target URL</label>
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://example.com"
                  value={targetData}
                  onChange={(e) => setTargetData(e.target.value)}
                  required
                />
              </div>
            )}

            {activeTab === 'wallet' && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-foreground">Wallet Protocol</label>
                  <select
                    className="input-field appearance-none cursor-pointer"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="ethereum">Ethereum (ETH)</option>
                    <option value="bitcoin">Bitcoin (BTC)</option>
                    <option value="solana">Solana (SOL)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-foreground">Public Key</label>
                  <input
                    type="text"
                    className="input-field font-mono text-sm"
                    placeholder="0x..."
                    value={targetData}
                    onChange={(e) => setTargetData(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {activeTab === 'nfc' && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-foreground">Payload Data</label>
                <textarea
                  className="input-field font-mono text-sm"
                  rows={4}
                  placeholder="BEGIN:VCARD..."
                  value={targetData}
                  onChange={(e) => setTargetData(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">QR Core Color</label>
              <div className="flex items-center gap-4">
                <input 
                  type="color" 
                  value={qrColor} 
                  onChange={(e) => setQrColor(e.target.value)} 
                  className="w-12 h-12 p-1 bg-surface border-[3px] border-foreground rounded-lg cursor-pointer transition-transform hover:-translate-y-1 shadow-[2px_2px_0_var(--foreground)]"
                />
                <span className="font-mono text-sm font-bold text-foreground uppercase">{qrColor}</span>
              </div>
            </div>

            <button type="submit" className="btn-3d w-full mt-4" disabled={loading}>
              {loading ? 'Creating...' : 'Generate New QR'}
            </button>
          </form>
        </div>

        {/* Right Side: Preview / Result */}
        <div className="card-minimal w-full flex flex-col items-center justify-center min-h-[500px] gap-8">
          {createdQr ? (
            <div className="flex flex-col items-center space-y-6 w-full animate-fade-in relative z-10">
              <CheckCircle2 color="var(--success)" size={56} className="bg-white rounded-full p-2 border-[3px] border-foreground shadow-[3px_3px_0_var(--foreground)]" />
              <h3 className="text-2xl font-black tracking-tight text-foreground">Success!</h3>
              
              {/* Flat QR View */}
              <div className="relative p-6 bg-white border-[3px] border-foreground rounded-2xl shadow-[6px_6px_0_var(--foreground)] flex items-center justify-center overflow-hidden w-full max-w-[280px] mx-auto my-8 hover:-translate-y-2 transition-transform duration-300">
                <QRCodeSVG 
                  value={getTargetUrl()} 
                  size={220} 
                  level="H"
                  includeMargin={false} 
                  fgColor={qrColor}
                  bgColor="#ffffff"
                />
                
                {/* Central qr.org embedded visual */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white flex items-center justify-center px-4 py-2 rounded-lg border-[3px] border-black shadow-[3px_3px_0_#000]">
                  <span className="font-extrabold text-sm tracking-widest text-black">qr.org</span>
                </div>
              </div>
              
              <div className="w-full flex items-center gap-2">
                <input readOnly value={getTargetUrl()} className="input-field flex-1 font-mono text-sm bg-neutral-100" />
                <button 
                  className={`btn-3d ${copied ? 'btn-3d-secondary' : ''}`}
                  onClick={handleCopy}
                  title="Copy to clipboard"
                  style={{ padding: '14px' }}
                >
                  {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                </button>
              </div>

              <a href="/dashboard" className="btn-3d btn-3d-secondary w-full">
                Go to Dashboard
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center opacity-50 hover:opacity-100 transition-opacity duration-300">
              <div className="p-6 rounded-3xl bg-neutral-100 border-[3px] border-foreground/20 mb-4 animate-float">
                <QrCode size={80} className="text-foreground/40" />
              </div>
              <p className="text-lg font-bold text-foreground/60">Ready to create...</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
