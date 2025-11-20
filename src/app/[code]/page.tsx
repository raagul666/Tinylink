import { redirect } from 'next/navigation';
import prisma from '@/lib/db';

// Helper: Ensure URL has protocol
function ensureProtocol(url: string): string {
  if (!url) return '/';
  
  // If URL already has protocol, return as is
  if (url.match(/^https?:\/\//i)) {
    return url;
  }
  
  // Add https:// if missing
  return `https://${url}`;
}

export default async function RedirectPage({ 
  params 
}: { 
  params: Promise<{ code: string }> 
}) {
  try {
    // ✅ MUST await params (Next.js 15+)
    const { code } = await params;
    
    console.log('🔍 Redirect request for:', code);

    // Find the link in database
    const link = await prisma.link.findUnique({
      where: { code },
    });

    // If link not found
    if (!link) {
      console.log('❌ Link not found:', code);
      redirect('/');
    }

    // If link is inactive
    if (!link.isActive) {
      console.log('⚠️ Link inactive:', code);
      redirect('/');
    }

    // ✅ Ensure URL has proper protocol
    const targetUrl = ensureProtocol(link.url);
    
    console.log('🔗 Original URL:', link.url);
    console.log('✅ Redirect URL:', targetUrl);

    // Update click count and timestamp
    await prisma.link.update({
      where: { code },
      data: {
        clicks: link.clicks + 1,
        lastClickedAt: new Date(),
      },
    });

    // Redirect to the target URL
    redirect(targetUrl);
    
  } catch (error: any) {
    console.error('❌ Redirect error:', error);
    
    // If it's a redirect error, let it propagate
    if (error.digest?.includes('NEXT_REDIRECT')) {
      throw error;
    }
    
    // Otherwise redirect to home
    redirect('/');
  }
}