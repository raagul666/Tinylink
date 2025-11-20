import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    const link = await prisma.link.findUnique({ where: { code } });
    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }
    return NextResponse.json(link, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    const link = await prisma.link.findUnique({ where: { code } });
    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }
    await prisma.link.update({ where: { code }, data: { isActive: false } });
    return NextResponse.json({ message: 'Link deleted successfully', code }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    const body = await request.json();
    const { isActive } = body;
    const link = await prisma.link.findUnique({ where: { code } });
    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }
    const updatedLink = await prisma.link.update({ where: { code }, data: { isActive } });
    return NextResponse.json(updatedLink, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}