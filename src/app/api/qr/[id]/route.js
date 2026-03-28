import { NextResponse } from 'next/server';
import { updateQR, getQR } from '@/lib/db';

export async function PUT(req, props) {
  try {
    const params = await props.params;
    const { id } = params;
    const body = await req.json();
    const { targetData, name } = body;

    const existingQR = getQR(id);
    if (!existingQR) {
      return NextResponse.json({ error: 'QR not found' }, { status: 404 });
    }

    const updatedData = {};
    if (targetData !== undefined) updatedData.targetData = targetData;
    if (name !== undefined) updatedData.name = name;

    const savedQR = updateQR(id, updatedData);

    return NextResponse.json({ success: true, qr: savedQR });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update QR' }, { status: 500 });
  }
}
