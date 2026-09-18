import { NextResponse } from 'next/server';
import { stripe, isStripeConfigured } from '@/lib/stripe';
import { getActiveWorkspaceId } from '@/lib/workspace';
import { db } from '@/db';
import { workspaces } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { workspaceId: providedWorkspaceId } = body;

    const activeWorkspaceId = await getActiveWorkspaceId(providedWorkspaceId);
    const [workspace] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, activeWorkspaceId))
      .limit(1);

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found.' }, { status: 404 });
    }

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const origin = `${protocol}://${host}`;
    const returnUrl = `${origin}/dashboard?tab=settings&subTab=billing`;

    if (!isStripeConfigured) {
      // Mock portal URL for offline dev testing
      return NextResponse.json({
        success: true,
        url: `${origin}/dashboard?tab=settings&subTab=billing&mockPortal=true`,
        message: 'Stripe test mode: billing portal link simulated.',
      });
    }

    if (!workspace.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No active Stripe billing profile found for this workspace. Please subscribe to a plan first.' },
        { status: 400 }
      );
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: workspace.stripeCustomerId,
      return_url: returnUrl,
    });

    return NextResponse.json({ success: true, url: portalSession.url });
  } catch (err: any) {
    console.error('Stripe Customer Portal Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to generate billing portal session.' },
      { status: 500 }
    );
  }
}
