import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: fetch link by code
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const link = await prisma.link.findUnique({ where: { code } });

  if (!link) {
    return NextResponse.json(
      { error: 'Link not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(link);
}

// PATCH: update isActive
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { isActive } = await request.json();
    const { code } = await params;

    const updatedLink = await prisma.link.update({
      where: { code },
      data: { isActive },
    });

    return NextResponse.json(updatedLink);
  } catch (error) {
    console.error('Error updating link:', error);
    return NextResponse.json(
      { error: 'Failed to update link' },
      { status: 500 }
    );
  }
}

// DELETE: delete link by code
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    const link = await prisma.link.findUnique({ where: { code } });
    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    await prisma.link.delete({ where: { code } });

    return NextResponse.json({
      message: 'Link deleted successfully',
      code,
    });
  } catch (error) {
    console.error('Error deleting link:', error);
    return NextResponse.json(
      { error: 'Failed to delete link' },
      { status: 500 }
    );
  }
}
