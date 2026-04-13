import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import os from 'os';
import fs from 'fs/promises';

const execAsync = promisify(exec);

export async function POST(req) {
  let tmpPath = null;
  try {
    const body = await req.json();
    const { url, color = 'white' } = body;

    if (!url) {
      return NextResponse.json({ error: 'Missing target URL' }, { status: 400 });
    }

    // Prepare paths
    // Go up from src/app/api/generate to project root, then execution/generate_qr.py
    // Process cwd in nextjs is usually the root folder where package.json is (web)
    // So execution is at `../execution/generate_qr.py`
    const pythonScript = path.resolve(process.cwd(), '../execution/generate_qr.py');
    tmpPath = path.join(os.tmpdir(), `qr_${Date.now()}_${Math.random().toString(36).substring(7)}.png`);

    // Execute python script
    // E.g. python ../execution/generate_qr.py "http://locallhost:3000/r/abcdef" "C:/tmp/file.png" "#ffffff"
    const command = `python "${pythonScript}" "${url}" "${tmpPath}" "${color}"`;
    
    // Check if the script exists
    try {
      await fs.access(pythonScript);
    } catch {
      return NextResponse.json({ error: `Python script not found at ${pythonScript}` }, { status: 500 });
    }

    try {
      await execAsync(command);
    } catch (execError) {
      console.error('Python execution error:', execError);
      return NextResponse.json({ error: 'Failed to generate QR code via backend script' }, { status: 500 });
    }

    // Read generated PNG
    const fileBuffer = await fs.readFile(tmpPath);
    
    // Return the PNG image
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="qr_code.png"'
      }
    });
  } catch (error) {
    console.error('POST /api/generate error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    // Cleanup Temp File
    if (tmpPath) {
      try {
        await fs.unlink(tmpPath);
      } catch (cleanupError) {
        // Just ignore if it was already deleted or doesn't exist
      }
    }
  }
}
