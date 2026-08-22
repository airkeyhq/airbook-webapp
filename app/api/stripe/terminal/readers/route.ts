import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { workspaces } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';

function getStripe() {
  const Stripe = require('stripe').default;
  return new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2026-07-29.dahlia',
  });
}

// GET: list all registered Terminal readers
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const wsId = await getActiveWorkspaceId(searchParams.get('workspaceId'));
    const [ws] = await db.select().from(workspaces).where(eq(workspaces.id, wsId)).limit(1);

    if (!ws?.stripeAccountId) {
      return NextResponse.json({
        success: true,
        readers: [
          { id: 'tmr_demo_wisepad3', label: 'WisePad 3 — Register 1', device_type: 'bbpos_wisepad3', status: 'offline', location: null },
          { id: 'tmr_demo_s700', label: 'Stripe S700 — Counter', device_type: 'stripe_s700', status: 'offline', location: null },
        ],
        isDemo: true,
      });
    }

    const stripe = getStripe();
    const list = await stripe.terminal.readers.list(
      { limit: 20 },
      { stripeAccount: ws.stripeAccountId }
    );

    return NextResponse.json({
      success: true,
      readers: list.data.map((r: any) => ({
        id: r.id,
        label: r.label || r.device_type,
        device_type: r.device_type,
        status: r.status,
        location: r.location,
        battery_level: r.battery_level ?? null,
      })),
      isDemo: false,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch readers.' }, { status: 500 });
  }
}

// POST: register a new reader by registration code
export async function POST(req: NextRequest) {
  try {
    const { registrationCode, label, workspaceId } = await req.json();
    if (!registrationCode?.trim()) {
      return NextResponse.json({ error: 'registrationCode is required.' }, { status: 400 });
    }
    const wsId = await getActiveWorkspaceId(workspaceId);
    const [ws] = await db.select().from(workspaces).where(eq(workspaces.id, wsId)).limit(1);

    if (!ws?.stripeAccountId) {
      return NextResponse.json({ error: 'Complete Stripe Connect onboarding before pairing a reader.' }, { status: 400 });
    }

    const stripe = getStripe();
    const reader = await stripe.terminal.readers.create(
      { registration_code: registrationCode.trim(), label: label || 'POS Register', location: ws.stripeTerminalLocationId || undefined },
      { stripeAccount: ws.stripeAccountId }
    );

    return NextResponse.json({ success: true, reader }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to register reader.' }, { status: 500 });
  }
}
