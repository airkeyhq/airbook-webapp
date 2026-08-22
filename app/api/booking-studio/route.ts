import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { workspaces, services, staff } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';

// GET /api/booking-studio - Fetch workspace public branding, services, and staff
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

    if (!ws) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    const [servicesList, staffList] = await Promise.all([
      db.select().from(services).where(eq(services.workspaceId, workspaceId)),
      db.select().from(staff).where(eq(staff.workspaceId, workspaceId)),
    ]);

    return NextResponse.json({
      success: true,
      workspace: {
        id: ws.id,
        name: ws.name,
        slug: ws.slug,
        phone: ws.phone,
        email: ws.email,
        address: ws.address,
        currency: ws.currency,
        brandColor: ws.brandColor || '#007AFF',
        logoUrl: ws.logoUrl,
        coverImageUrl: ws.coverImageUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80',
        bio: ws.bio || 'Premium booking experience powered by AirBook. Reserve appointments with top-rated professionals.',
        instagramUrl: ws.instagramUrl || '',
        websiteUrl: ws.websiteUrl || '',
        bookingNotice: ws.bookingNotice || 'Please arrive 5 minutes prior to your appointment. 24-hour advance notice is required for cancellations.',
        widgetTheme: ws.widgetTheme || 'system',
        cancellationNoticeHours: ws.cancellationNoticeHours,
        depositRequiredPercent: ws.depositRequiredPercent,
      },
      services: servicesList,
      staff: staffList,
    });
  } catch (error: any) {
    console.error('Error fetching booking studio data:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

// PATCH /api/booking-studio - Update public branding and customizer settings
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const workspaceId = await getActiveWorkspaceId(body.workspaceId);

    const updatePayload: Record<string, any> = {};
    if (body.brandColor !== undefined) updatePayload.brandColor = body.brandColor;
    if (body.coverImageUrl !== undefined) updatePayload.coverImageUrl = body.coverImageUrl;
    if (body.bio !== undefined) updatePayload.bio = body.bio;
    if (body.instagramUrl !== undefined) updatePayload.instagramUrl = body.instagramUrl;
    if (body.websiteUrl !== undefined) updatePayload.websiteUrl = body.websiteUrl;
    if (body.bookingNotice !== undefined) updatePayload.bookingNotice = body.bookingNotice;
    if (body.widgetTheme !== undefined) updatePayload.widgetTheme = body.widgetTheme;
    if (body.cancellationNoticeHours !== undefined) updatePayload.cancellationNoticeHours = Number(body.cancellationNoticeHours);
    if (body.depositRequiredPercent !== undefined) updatePayload.depositRequiredPercent = Number(body.depositRequiredPercent);

    const [updatedWs] = await db
      .update(workspaces)
      .set(updatePayload)
      .where(eq(workspaces.id, workspaceId))
      .returning();

    return NextResponse.json({
      success: true,
      workspace: updatedWs,
      message: 'Booking studio branding updated successfully.',
    });
  } catch (error: any) {
    console.error('Error updating booking studio:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
