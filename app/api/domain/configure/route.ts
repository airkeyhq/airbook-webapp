import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { workspaces } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';

const CNAME_TARGET = 'cname.getairbook.com';
const A_RECORD_TARGET = '76.76.21.21';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const wsId = await getActiveWorkspaceId(searchParams.get('workspaceId'));
    const [ws] = await db.select().from(workspaces).where(eq(workspaces.id, wsId)).limit(1);
    return NextResponse.json({
      success: true,
      customDomain: ws?.customDomain || null,
      domainVerified: ws?.domainVerified || false,
      sslStatus: ws?.sslStatus || 'pending',
      cnameTarget: CNAME_TARGET,
      aRecordTarget: A_RECORD_TARGET,
      instructions: {
        option1: `Add a CNAME record: ${ws?.customDomain || 'booking.yourdomain.com'} → ${CNAME_TARGET}`,
        option2: `Add an A record: ${ws?.customDomain || 'booking.yourdomain.com'} → ${A_RECORD_TARGET}`,
        ttl: '3600 (1 hour)',
        propagation: 'DNS changes typically propagate within 24-48 hours.',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch domain config.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { customDomain, workspaceId } = body;
    const wsId = await getActiveWorkspaceId(workspaceId);

    if (!customDomain?.trim()) {
      // Clear custom domain
      await db.update(workspaces)
        .set({ customDomain: null, domainVerified: false, sslStatus: 'pending' })
        .where(eq(workspaces.id, wsId));
      return NextResponse.json({ success: true, message: 'Custom domain removed.' });
    }

    // Normalize domain
    const clean = customDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    await db.update(workspaces)
      .set({ customDomain: clean, domainVerified: false, sslStatus: 'pending' })
      .where(eq(workspaces.id, wsId));

    return NextResponse.json({
      success: true,
      customDomain: clean,
      message: `Custom domain ${clean} configured. Add a CNAME → ${CNAME_TARGET} in your DNS provider to activate it.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to configure custom domain.' }, { status: 500 });
  }
}
