import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { workspaces } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';
import dns from 'dns';
import { promisify } from 'util';

const resolve4 = promisify(dns.resolve4);
const resolveCname = promisify(dns.resolveCname);

export async function POST(req: NextRequest) {
  try {
    const { workspaceId } = await req.json();
    const wsId = await getActiveWorkspaceId(workspaceId);
    const [ws] = await db.select().from(workspaces).where(eq(workspaces.id, wsId)).limit(1);

    if (!ws?.customDomain) {
      return NextResponse.json({ success: false, error: 'No custom domain configured for this workspace.' }, { status: 400 });
    }

    const domain = ws.customDomain;
    let verified = false;
    let method = '';
    let resolvedValue = '';

    try {
      const cnameResult = await resolveCname(domain);
      if (cnameResult.some((r) => r.includes('getairbook.com') || r.includes('airbook'))) {
        verified = true;
        method = 'CNAME';
        resolvedValue = cnameResult[0];
      }
    } catch {}

    if (!verified) {
      try {
        const aResult = await resolve4(domain);
        if (aResult.includes('76.76.21.21')) {
          verified = true;
          method = 'A Record';
          resolvedValue = aResult[0];
        }
      } catch {}
    }

    if (verified) {
      await db.update(workspaces)
        .set({ domainVerified: true, sslStatus: 'provisioning' })
        .where(eq(workspaces.id, wsId));
    }

    return NextResponse.json({
      success: true,
      domain,
      verified,
      method: verified ? method : null,
      resolvedValue: verified ? resolvedValue : null,
      message: verified
        ? `✓ Domain ${domain} verified via ${method}. SSL certificate is being provisioned.`
        : `DNS record not yet found for ${domain}. Allow up to 48 hours for propagation.`,
    });
  } catch (err: any) {
    console.error('Domain verification error:', err);
    return NextResponse.json({ error: err?.message || 'Verification failed.' }, { status: 500 });
  }
}
