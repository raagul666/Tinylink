import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH: Update link status (e.g., deactivate)
export async function PATCH(request: NextRequest, context: { params: Promise<{ code: string }> }) {
  try {
    const { isActive } = await request.json();
    const { code } = await context.params; // Await here

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

export async function DELETE(request: NextRequest, context: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await context.params; // Await here

    const link = await prisma.link.findUnique({ where: { code } });
    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    await prisma.link.delete({
      where: { code },
    });

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

