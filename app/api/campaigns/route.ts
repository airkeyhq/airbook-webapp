import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { campaigns, workspaces, clients } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';

// GET /api/campaigns - List campaigns and marketing status for workspace
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceIdParam = searchParams.get('workspaceId');
    const workspaceId = await getActiveWorkspaceId(workspaceIdParam);

    const [ws] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .limit(1);

    let campaignList = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.workspaceId, workspaceId))
      .orderBy(desc(campaigns.createdAt));

    // Seed default sample campaigns in dev mode if empty
    if (campaignList.length === 0 && process.env.NODE_ENV !== 'production') {
      const defaultCampaigns = [
        {
          name: 'Summer Styling Special (20% Off)',
          channel: 'sms',
          audienceFilter: 'all',
          recipientCount: 42,
          creditsUsed: 42,
          messageTemplate: 'Hey {clientName}! Beat the summer heat with 20% off all styling sessions this week at {businessName}. Book now: {bookingUrl}',
          status: 'sent',
        },
        {
          name: 'VIP Client Weekend Priority Booking',
          channel: 'both',
          audienceFilter: 'vip',
          recipientCount: 18,
          creditsUsed: 18,
          messageTemplate: 'Exclusive for our VIP Members: weekend slots are now open for priority reservations. Tap here: {bookingUrl}',
          status: 'sent',
        },
        {
          name: 'We Miss You! Re-engagement Bonus',
          channel: 'email',
          audienceFilter: 'lapsed',
          recipientCount: 29,
          creditsUsed: 0,
          messageTemplate: 'Hi {clientName}, it has been over a month since your last visit. Enjoy a complimentary scalp treatment on your next booking: {bookingUrl}',
          status: 'sent',
        },
      ];

      for (const camp of defaultCampaigns) {
        await db.insert(campaigns).values({
          workspaceId,
          ...camp,
        });
      }

      campaignList = await db
        .select()
        .from(campaigns)
        .where(eq(campaigns.workspaceId, workspaceId))
        .orderBy(desc(campaigns.createdAt));
    }

    return NextResponse.json({
      success: true,
      campaigns: campaignList,
      smsCreditsRemaining: ws?.smsCreditsRemaining ?? 50,
      googleReviewUrl: ws?.googleReviewUrl || 'https://g.page/r/your-business/review',
      autoReviewEnabled: ws?.autoReviewEnabled ?? true,
      reengagementDays: ws?.reengagementDays ?? 21,
      autoReengagementEnabled: ws?.autoReengagementEnabled ?? true,
    });
  } catch (error: any) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

// POST /api/campaigns - Send/Dispatch broadcast campaign with SMS credit validation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const workspaceId = await getActiveWorkspaceId(body.workspaceId);

    const [ws] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .limit(1);

    if (!ws) {
      return NextResponse.json({ error: 'Workspace not found.' }, { status: 404 });
    }

    const { name, channel, audienceFilter, messageTemplate, recipientCount } = body;
    const count = Number(recipientCount) || 15;
    const isSmsChannel = channel === 'sms' || channel === 'both';
    const creditsRequired = isSmsChannel ? count : 0;

    // Hard check for zero client debt: SMS credit ledger validation
    if (isSmsChannel && ws.smsCreditsRemaining < creditsRequired) {
      return NextResponse.json(
        {
          error: `Insufficient SMS credits. This broadcast requires ${creditsRequired} credits, but your current balance is ${ws.smsCreditsRemaining}. Please top up your SMS credit balance or switch to Free Email.`,
          requiredCredits: creditsRequired,
          smsCreditsRemaining: ws.smsCreditsRemaining,
        },
        { status: 402 } // Payment Required
      );
    }

    // Deduct prepaid credits if SMS
    let remainingCredits = ws.smsCreditsRemaining;
    if (creditsRequired > 0) {
      remainingCredits = Math.max(0, ws.smsCreditsRemaining - creditsRequired);
      await db
        .update(workspaces)
        .set({ smsCreditsRemaining: remainingCredits })
        .where(eq(workspaces.id, workspaceId));
    }

    // Record campaign in database
    const [newCampaign] = await db
      .insert(campaigns)
      .values({
        workspaceId,
        name: name?.trim() || 'Broadcast Campaign',
        channel: channel || 'sms',
        audienceFilter: audienceFilter || 'all',
        recipientCount: count,
        creditsUsed: creditsRequired,
        messageTemplate: messageTemplate || '',
        status: 'sent',
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        campaign: newCampaign,
        smsCreditsRemaining: remainingCredits,
        message: `Campaign sent successfully to ${count} recipients.`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating campaign:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

// PATCH /api/campaigns - Update automation settings (Google Reviews, Re-engagement)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const workspaceId = await getActiveWorkspaceId(body.workspaceId);

    const updatePayload: Record<string, any> = {};
    if (body.googleReviewUrl !== undefined) updatePayload.googleReviewUrl = body.googleReviewUrl.trim();
    if (body.autoReviewEnabled !== undefined) updatePayload.autoReviewEnabled = Boolean(body.autoReviewEnabled);
    if (body.reengagementDays !== undefined) updatePayload.reengagementDays = Number(body.reengagementDays);
    if (body.autoReengagementEnabled !== undefined) updatePayload.autoReengagementEnabled = Boolean(body.autoReengagementEnabled);

    const [updatedWs] = await db
      .update(workspaces)
      .set(updatePayload)
      .where(eq(workspaces.id, workspaceId))
      .returning();

    return NextResponse.json({
      success: true,
      googleReviewUrl: updatedWs.googleReviewUrl,
      autoReviewEnabled: updatedWs.autoReviewEnabled,
      reengagementDays: updatedWs.reengagementDays,
      autoReengagementEnabled: updatedWs.autoReengagementEnabled,
    });
  } catch (error: any) {
    console.error('Error updating marketing automation settings:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
