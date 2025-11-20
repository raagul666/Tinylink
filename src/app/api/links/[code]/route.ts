import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ✅ GET - Get single link stats
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    console.log('📊 Getting stats for:', code);

    const link = await prisma.link.findUnique({
      where: { code },
    });

    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(link, { status: 200 });
  } catch (error: any) {
    console.error('❌ Error fetching link:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE - Delete link
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    console.log('🗑️ Deleting link:', code);

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

    // Delete the link
    await prisma.link.delete({
      where: { code },
    });

    console.log('✅ Link deleted successfully:', code);

    return NextResponse.json(
      { message: 'Link deleted successfully', code },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Error deleting link:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// ✅ PATCH - Update link status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await request.json();
    const { isActive } = body;

    console.log('🔄 Updating link status:', code, 'to', isActive);

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

    // Update the link
    const updatedLink = await prisma.link.update({
      where: { code },
      data: { isActive },
    });

    console.log('✅ Link status updated:', updatedLink);

    return NextResponse.json(updatedLink, { status: 200 });
  } catch (error: any) {
    console.error('❌ Error updating link:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}