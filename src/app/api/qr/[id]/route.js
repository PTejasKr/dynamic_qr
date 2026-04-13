import { NextResponse } from 'next/server';
import { getQR, updateQR, deleteQR } from '@/lib/db';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  const { id } = await params;
  try {
    const qr = await getQR(id);
    if (!qr) {
      return NextResponse.json({ error: 'QR not found' }, { status: 404 });
    }
    return NextResponse.json({ qr });
  } catch (error) {
    console.error(`GET /api/qr/${id} error:`, error);
    return NextResponse.json({ error: 'Failed to fetch QR' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = await params;
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const updated = await updateQR(id, body, session.user.email);
    if (!updated) {
      return NextResponse.json({ error: 'QR not found or unauthorized' }, { status: 404 });
    }
    return NextResponse.json({ success: true, qr: updated });
  } catch (error) {
    console.error(`PUT /api/qr/${id} error:`, error);
    return NextResponse.json({ error: 'Failed to update QR' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Prevent delete of Profile QR
    const qrObj = await getQR(id);
    if (qrObj?.isProfileQR) {
      return NextResponse.json({ error: 'Cannot delete primary profile QR' }, { status: 403 });
    }

    const success = await deleteQR(id, session.user.email);
    if (!success) {
      return NextResponse.json({ error: 'QR not found or unauthorized' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'QR deleted' });
  } catch (error) {
    console.error(`DELETE /api/qr/${id} error:`, error);
    return NextResponse.json({ error: 'Failed to delete QR' }, { status: 500 });
  }
}
