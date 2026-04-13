import { NextResponse } from 'next/server';
import { getQR, incrementScan } from '@/lib/db';

/**
 * Ensures a URL string is absolute (has a protocol).
 * NextResponse.redirect() requires an absolute URL.
 */
function ensureAbsoluteUrl(url) {
  if (!url) return null;
  const trimmed = url.trim();
  // Already has a protocol (http, https, ethereum, bitcoin, solana, etc.)
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return trimmed;
  }
  // Looks like a domain or localhost — prepend https://
  return `https://${trimmed}`;
}

export async function GET(request, props) {
  try {
    const params = await props.params;
    const { id } = params;

    const qr = await getQR(id);

    if (!qr) {
      return new NextResponse('QR not found or expired', { status: 404 });
    }

    // Increment scan count
    await incrementScan(id);

    const target = ensureAbsoluteUrl(qr.targetData);

    if (!target) {
      return new NextResponse('QR has no target data configured', { status: 400 });
    }

    // Redirect based on type
    if (qr.type === 'link' || qr.type === 'image') {
      return NextResponse.redirect(target);
    }

    if (qr.type === 'wallet') {
      // Wallet URIs (ethereum:0x..., bitcoin:...) — redirect directly
      return NextResponse.redirect(target);
    }

    if (qr.type === 'nfc') {
      // Render text or a vCard
      return new NextResponse(qr.targetData, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      });
    }

    return new NextResponse('Invalid QR Type', { status: 400 });
  } catch (error) {
    console.error('QR redirect error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
