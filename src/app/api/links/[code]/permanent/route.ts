import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

//  Permanent DELETE - Remove from database completely
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    console.log('🗑️ Permanently deleting link:', code);

    // Check if link exists
    const link = await prisma.link.findUnique({
      where: { code },
    });

    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    // Hard delete from database
    await prisma.link.delete({
      where: { code },
    });

    console.log('✅ Link permanently deleted:', code);
    return NextResponse.json(
      { message: 'Link permanently deleted', code },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Error permanently deleting link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
