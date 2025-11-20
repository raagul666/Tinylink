import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { nanoid } from 'nanoid';

// Helper: Validate and normalize URL
function normalizeUrl(url: string): string {
  let normalized = url.trim();
  
  // Add https:// if no protocol
  if (!normalized.match(/^https?:\/\//i)) {
    normalized = `https://${normalized}`;
  }
  
  // Validate URL
  try {
    new URL(normalized);
    return normalized;
  } catch {
    throw new Error('Invalid URL format');
  }
}

// Helper: Validate custom code
function validateCode(code: string): boolean {
  return /^[A-Za-z0-9]{3,8}$/.test(code);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { url, code } = body;

    console.log('Received request:', { url, customCode: code });

    // Validate URL
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // ✅ Normalize URL (add https:// if missing)
    try {
      url = normalizeUrl(url);
    } catch (error: any) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Generate or validate custom code
    if (code) {
      if (!validateCode(code)) {
        return NextResponse.json(
          { error: 'Code must be 3-8 characters (letters and numbers only)' },
          { status: 400 }
        );
      }

      // Check if code already exists
      const existing = await prisma.link.findUnique({
        where: { code },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'This code is already in use' },
          { status: 409 }
        );
      }
    } else {
      // Generate unique code
      let attempts = 0;
      while (attempts < 5) {
        code = nanoid(6);
        const existing = await prisma.link.findUnique({
          where: { code },
        });
        if (!existing) break;
        attempts++;
      }
    }

    // Create link in database
    const link = await prisma.link.create({
      data: {
        url,
        code,
      },
    });

    console.log('Link created:', link);

    return NextResponse.json(
      { 
        code: link.code, 
        url: link.url,
        shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${link.code}`
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}