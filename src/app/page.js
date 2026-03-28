import Link from 'next/link';
import { QrCode, Zap, Shield, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <div className="w-full flex justify-center items-center min-h-[80vh] px-4 animate-fade-in relative z-20">
      <div className="flex flex-col items-center justify-center w-full max-w-5xl space-y-16">
        
        <header className="flex flex-col items-center text-center space-y-8">
          <div className="px-6 py-2 rounded-full border-[3px] border-foreground text-foreground text-sm font-bold bg-secondary">
            Minimalist Edition 3.0
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground leading-tight drop-shadow-sm">
            Dynamic QR <br className="hidden md:block"/> Generator
          </h1>
          
          <p className="max-w-2xl text-lg md:text-xl text-foreground/80 font-medium">
            Create beautiful, soft, and minimalist QR codes instantly. A playful yet powerful way to connect.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
            <Link href="/create" className="btn-3d text-lg w-full sm:w-auto">
              Create Now <Zap size={20} />
            </Link>
            <Link 
              href="/dashboard" 
              className="text-lg font-bold text-foreground/70 hover:text-foreground transition-colors w-full sm:w-auto underline decoration-2 underline-offset-4"
            >
              Go to Dashboard
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-8">
          <div className="card-minimal flex flex-col items-center text-center gap-4 group">
            <div className="p-4 rounded-full bg-primary border-[3px] border-foreground text-foreground group-hover:bg-primary-dark transition-all transform group-hover:-translate-y-1">
              <QrCode size={36} />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground">Dynamic Routing</h3>
            <p className="text-foreground/70 text-sm font-medium">Update URLs behind your QR codes anytime without reprinting.</p>
          </div>
          
          <div className="card-minimal flex flex-col items-center text-center gap-4 group">
            <div className="p-4 rounded-full bg-secondary border-[3px] border-foreground text-foreground group-hover:bg-secondary-dark transition-all transform group-hover:-translate-y-1">
              <Shield size={36} />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground">Secure Links</h3>
            <p className="text-foreground/70 text-sm font-medium">Safe redirection infrastructure keeping data flows secure.</p>
          </div>
          
          <div className="card-minimal flex flex-col items-center text-center gap-4 group">
            <div className="p-4 rounded-full bg-accent border-[3px] border-foreground text-foreground group-hover:bg-accent-dark transition-all transform group-hover:-translate-y-1">
              <BarChart3 size={36} />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground">Live Telemetry</h3>
            <p className="text-foreground/70 text-sm font-medium">Monitor routing telemetry, scan metrics, and engagement easily.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
