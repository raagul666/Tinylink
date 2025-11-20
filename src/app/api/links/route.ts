import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

function generateRandomCode(length: number = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(links, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, code: customCode } = body;

    if (!url || !isValidUrl(url)) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const code = customCode || generateRandomCode(6);

    if (!/^[A-Za-z0-9]{6,8}$/.test(code)) {
      return NextResponse.json({ error: 'Code must be 6-8 alphanumeric characters' }, { status: 400 });
    }

    const existingLink = await prisma.link.findUnique({ where: { code } });
    if (existingLink) {
      return NextResponse.json({ error: 'Code already exists' }, { status: 409 });
    }

    const newLink = await prisma.link.create({
      data: { url, code, clicks: 0, isActive: true, lastClickedAt: null },
    });

    return NextResponse.json(newLink, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}