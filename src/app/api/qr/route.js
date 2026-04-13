import { NextResponse } from 'next/server';
import { addQR, getAllQRsByUser, clearAllQRsByUser, syncUserProfileQR } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

function sanitizeString(str, maxLen = 500) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen);
}

const ALLOWED_TYPES = ['link', 'image', 'wallet', 'nfc', 'wifi', 'vcard', 'email', 'whatsapp', 'sms', 'call', 'text', 'pdf'];

export async function POST(req) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userEmail = session.user.email;

    const body = await req.json();
    let { name, type, targetData } = body;

    name = sanitizeString(name, 100);
    type = sanitizeString(type, 20);
    targetData = sanitizeString(targetData, 2048);

    if (!name || !type || !targetData) {
      return NextResponse.json({ error: 'Missing required fields: name, type, targetData' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(type)) {
      return NextResponse.json({ error: `Invalid type. Must be one of: ${ALLOWED_TYPES.join(', ')}` }, { status: 400 });
    }

    const newQR = {
      id: uuidv4().substring(0, 8),
      name,
      type,
      targetData,
      scans: 0,
      createdAt: new Date().toISOString(),
    };

    await addQR(newQR, userEmail);

    return NextResponse.json({ success: true, qr: newQR }, { status: 201 });
  } catch (error) {
    console.error('POST /api/qr error:', error);
    return NextResponse.json({ error: 'Failed to create QR' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userEmail = session.user.email;

    // Force creation of the profile QR if they don't have one 
    await syncUserProfileQR(userEmail);
    
    const qrs = await getAllQRsByUser(userEmail);
    return NextResponse.json({ qrs });
  } catch (error) {
    console.error('GET /api/qr error:', error);
    return NextResponse.json({ error: 'Failed to fetch QRs' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userEmail = session.user.email;

    await clearAllQRsByUser(userEmail);
    // recreate profile QR immediately so it's never truly empty for a user unless they log out
    await syncUserProfileQR(userEmail);

    return NextResponse.json({ success: true, message: 'All QR codes deleted for user' });
  } catch (error) {
    console.error('DELETE /api/qr error:', error);
    return NextResponse.json({ error: 'Failed to clear dashboard' }, { status: 500 });
  }
}
