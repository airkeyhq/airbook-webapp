import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { workspaces } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';

// POST /api/campaigns/credits - Top-up prepaid SMS credits
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const workspaceId = await getActiveWorkspaceId(body.workspaceId);

    const creditsToAdd = Number(body.credits) || 250;
    const packPrice = Number(body.priceDollars) || 5;

    const [updatedWs] = await db
      .update(workspaces)
      .set({
        smsCreditsRemaining: sql`${workspaces.smsCreditsRemaining} + ${creditsToAdd}`,
      })
      .where(eq(workspaces.id, workspaceId))
      .returning();

    return NextResponse.json({
      success: true,
      creditsAdded: creditsToAdd,
      packPrice,
      smsCreditsRemaining: updatedWs.smsCreditsRemaining,
      message: `Successfully added ${creditsToAdd} SMS credits to your workspace.`,
    });
  } catch (error: any) {
    console.error('Error topping up SMS credits:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
