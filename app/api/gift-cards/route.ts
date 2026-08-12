import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { gift_cards, workspaces } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET /api/gift-cards - List gift cards for workspace
export async function GET(req: NextRequest) {
  try {
    const [ws] = await db.select().from(workspaces).limit(1);
    if (!ws) return NextResponse.json({ success: true, giftCards: [] });

    const list = await db
      .select()
      .from(gift_cards)
      .where(eq(gift_cards.workspaceId, ws.id));

    return NextResponse.json({ success: true, giftCards: list });
  } catch (error: any) {
    console.error('Error fetching gift cards:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

// POST /api/gift-cards - Issue a new digital gift card
export async function POST(req: NextRequest) {
  try {
    const [ws] = await db.select().from(workspaces).limit(1);
    const body = await req.json();

    const initialBalanceCents = Math.round((Number(body.amount) || 100) * 100);

    const [card] = await db
      .insert(gift_cards)
      .values({
        workspaceId: ws?.id || '00000000-0000-0000-0000-000000000001',
        code: (body.code || `GC-${Math.random().toString(36).substring(2, 8)}`).toUpperCase(),
        initialBalanceCents,
        currentBalanceCents: initialBalanceCents,
        recipientEmail: body.recipientEmail || null,
      })
      .returning();

    return NextResponse.json({ success: true, giftCard: card }, { status: 201 });
  } catch (error: any) {
    console.error('Error issuing gift card:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
