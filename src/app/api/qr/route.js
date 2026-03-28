import { NextResponse } from 'next/server';
import { addQR, getAllQRs } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, type, targetData } = body;

    if (!name || !type || !targetData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newQR = {
      id: uuidv4().substring(0, 8),
      name,
      type, // 'link', 'image', 'wallet', 'nfc'
      targetData,
      scans: 0,
      createdAt: new Date().toISOString()
    };

    addQR(newQR);

    return NextResponse.json({ success: true, qr: newQR });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create QR' }, { status: 500 });
  }
}

export async function GET() {
  const qrs = getAllQRs();
  return NextResponse.json({ qrs });
}
