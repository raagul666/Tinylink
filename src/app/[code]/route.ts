import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    console.log('🔗 Redirecting code:', code);

    // Find the link
    const link = await prisma.link.findUnique({
      where: { code },
    });

    // Return 404 if link not found or inactive (soft-deleted)
    if (!link || link.isActive === false) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Link Not Found</title>
            <style>
              body {
                font-family: system-ui, -apple-system, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              }
              .container {
                background: white;
                padding: 2rem;
                border-radius: 1rem;
                text-align: center;
                max-width: 400px;
              }
              h1 { color: #dc2626; margin: 0 0 1rem 0; }
              p { color: #6b7280; margin: 0 0 1.5rem 0; }
              a {
                display: inline-block;
                padding: 0.75rem 1.5rem;
                background: #667eea;
                color: white;
                text-decoration: none;
                border-radius: 0.5rem;
                font-weight: 600;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>404 - Link Not Found</h1>
              <p>This short link does not exist or has been deleted.</p>
              <a href="/">Go to Homepage</a>
            </div>
          </body>
        </html>`,
        { 
          status: 404,
          headers: { 'Content-Type': 'text/html' }
        }
      );
    }

    // Update click count and last clicked timestamp
    prisma.link.update({
      where: { code },
      data: {
        clicks: link.clicks + 1,
        lastClickedAt: new Date(),
      },
    }).catch(err => console.error('Error updating clicks:', err));

    console.log('✅ Redirecting to:', link.url);

    // Return 302 redirect
    return NextResponse.redirect(link.url, { status: 302 });
  } catch (error: any) {
    console.error('❌ Error redirecting:', error);
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Error</title>
        </head>
        <body>
          <h1>500 - Internal Server Error</h1>
          <p>Something went wrong. Please try again later.</p>
        </body>
      </html>`,
      { 
        status: 500,
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }
}
