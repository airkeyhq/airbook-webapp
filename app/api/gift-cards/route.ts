import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { gift_cards } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';

// GET /api/gift-cards - List gift cards for workspace
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceIdParam = searchParams.get('workspaceId');
    const codeParam = searchParams.get('code');
    const workspaceId = await getActiveWorkspaceId(workspaceIdParam);

    // If searching by single code (e.g. for POS checkout verification)
    if (codeParam) {
      const [card] = await db
        .select()
        .from(gift_cards)
        .where(eq(gift_cards.code, codeParam.trim().toUpperCase()))
        .limit(1);

      if (!card) {
        return NextResponse.json({ success: false, error: 'Gift card not found.' }, { status: 404 });
      }

      return NextResponse.json({ success: true, giftCard: card });
    }

    let list = await db
      .select()
      .from(gift_cards)
      .where(eq(gift_cards.workspaceId, workspaceId))
      .orderBy(desc(gift_cards.createdAt));

    // Seed default cards in dev mode if empty
    if (list.length === 0 && process.env.NODE_ENV !== 'production') {
      const defaultCards = [
        {
          code: 'GC-VIP-150',
          initialBalanceCents: 15000,
          currentBalanceCents: 15000,
          recipientName: 'Sophia Loren',
          recipientEmail: 'sophia@example.com',
          senderName: 'Michael Scott',
          notes: 'Happy Birthday! Enjoy your VIP session.',
          status: 'active',
        },
        {
          code: 'GC-SUMMER-75',
          initialBalanceCents: 7500,
          currentBalanceCents: 4500,
          recipientName: 'David Beckham',
          recipientEmail: 'david@example.com',
          senderName: 'Victoria Beckham',
          notes: 'Special treat for summer styling.',
          status: 'active',
        },
        {
          code: 'GC-WELCOME-50',
          initialBalanceCents: 5000,
          currentBalanceCents: 0,
          recipientName: 'Elena Rostova',
          recipientEmail: 'elena@example.com',
          senderName: 'AirBook Team',
          notes: 'Welcome reward card.',
          status: 'redeemed',
        },
      ];

      for (const card of defaultCards) {
        await db.insert(gift_cards).values({
          workspaceId,
          ...card,
        });
      }

      list = await db
        .select()
        .from(gift_cards)
        .where(eq(gift_cards.workspaceId, workspaceId))
        .orderBy(desc(gift_cards.createdAt));
    }

    return NextResponse.json({ success: true, giftCards: list });
  } catch (error: any) {
    console.error('Error fetching gift cards:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

// POST /api/gift-cards - Issue a new digital gift card
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const workspaceId = await getActiveWorkspaceId(body.workspaceId);

    const initialBalanceCents = Math.round((Number(body.amount) || Number(body.initialBalance) || 100) * 100);
    const code = (body.code || `GC-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`).toUpperCase();

    const [card] = await db
      .insert(gift_cards)
      .values({
        workspaceId,
        code,
        initialBalanceCents,
        currentBalanceCents: initialBalanceCents,
        recipientName: body.recipientName?.trim() || null,
        recipientEmail: body.recipientEmail?.trim() || null,
        senderName: body.senderName?.trim() || null,
        notes: body.notes?.trim() || null,
        status: 'active',
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      })
      .returning();

    return NextResponse.json({ success: true, giftCard: card }, { status: 201 });
  } catch (error: any) {
    console.error('Error issuing gift card:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

// PATCH /api/gift-cards - Redeem amount or update card status
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, code, redeemAmountCents, status } = body;

    let targetCard;
    if (id) {
      [targetCard] = await db.select().from(gift_cards).where(eq(gift_cards.id, id)).limit(1);
    } else if (code) {
      [targetCard] = await db.select().from(gift_cards).where(eq(gift_cards.code, code.trim().toUpperCase())).limit(1);
    }

    if (!targetCard) {
      return NextResponse.json({ error: 'Gift card not found.' }, { status: 404 });
    }

    if (redeemAmountCents !== undefined) {
      const deduct = Math.max(0, Number(redeemAmountCents));
      if (deduct > targetCard.currentBalanceCents) {
        return NextResponse.json({ 
          error: `Insufficient gift card balance. Current balance is $${(targetCard.currentBalanceCents / 100).toFixed(2)}.`,
          currentBalanceCents: targetCard.currentBalanceCents,
        }, { status: 400 });
      }

      const newBalance = Math.max(0, targetCard.currentBalanceCents - deduct);
      const newStatus = newBalance === 0 ? 'redeemed' : 'active';

      const [updated] = await db
        .update(gift_cards)
        .set({
          currentBalanceCents: newBalance,
          status: newStatus,
        })
        .where(eq(gift_cards.id, targetCard.id))
        .returning();

      return NextResponse.json({
        success: true,
        giftCard: updated,
        amountDeductedCents: deduct,
        remainingBalanceCents: newBalance,
      });
    }

    if (status) {
      const [updated] = await db
        .update(gift_cards)
        .set({ status })
        .where(eq(gift_cards.id, targetCard.id))
        .returning();

      return NextResponse.json({ success: true, giftCard: updated });
    }

    return NextResponse.json({ error: 'No valid update operation provided.' }, { status: 400 });
  } catch (error: any) {
    console.error('Error updating/redeeming gift card:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

// DELETE /api/gift-cards - Delete gift card
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing gift card ID.' }, { status: 400 });
    }

    await db.delete(gift_cards).where(eq(gift_cards.id, id));
    return NextResponse.json({ success: true, message: 'Gift card removed.' });
  } catch (error: any) {
    console.error('Error deleting gift card:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
