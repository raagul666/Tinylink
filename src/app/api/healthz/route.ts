import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    //  check DB connection
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      ok: true,
      version: '1.0',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV,
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      ok: false,
      version: '1.0',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: 'Health check failed',
    }, { status: 500 });
  }
}
