import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { workspaces } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';

// GET /api/brand - Get brand kit identity settings
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceIdParam = searchParams.get('workspaceId');
    const workspaceId = await getActiveWorkspaceId(workspaceIdParam);

    const [ws] = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        slug: workspaces.slug,
        brandColor: workspaces.brandColor,
        accentColor: workspaces.accentColor,
        logoUrl: workspaces.logoUrl,
        coverImageUrl: workspaces.coverImageUrl,
        bio: workspaces.bio,
        instagramUrl: workspaces.instagramUrl,
        tiktokUrl: workspaces.tiktokUrl,
        websiteUrl: workspaces.websiteUrl,
        googleReviewUrl: workspaces.googleReviewUrl,
        widgetTheme: workspaces.widgetTheme,
      })
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .limit(1);

    if (!ws) {
      return NextResponse.json({ error: 'Workspace not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      brand: ws,
    });
  } catch (err: any) {
    console.error('Error fetching brand settings:', err);
    return NextResponse.json({ error: err?.message || 'Failed to fetch brand kit.' }, { status: 500 });
  }
}

// PATCH /api/brand - Update brand kit identity settings
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const workspaceId = await getActiveWorkspaceId(body.workspaceId);

    const {
      name,
      brandColor,
      accentColor,
      logoUrl,
      coverImageUrl,
      bio,
      instagramUrl,
      tiktokUrl,
      websiteUrl,
      googleReviewUrl,
      widgetTheme,
    } = body;

    const [updated] = await db
      .update(workspaces)
      .set({
        ...(name && { name: name.trim() }),
        ...(brandColor && { brandColor }),
        ...(accentColor && { accentColor }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(coverImageUrl !== undefined && { coverImageUrl }),
        ...(bio !== undefined && { bio }),
        ...(instagramUrl !== undefined && { instagramUrl }),
        ...(tiktokUrl !== undefined && { tiktokUrl }),
        ...(websiteUrl !== undefined && { websiteUrl }),
        ...(googleReviewUrl !== undefined && { googleReviewUrl }),
        ...(widgetTheme && { widgetTheme }),
      })
      .where(eq(workspaces.id, workspaceId))
      .returning();

    return NextResponse.json({
      success: true,
      brand: updated,
      message: 'Brand kit updated successfully.',
    });
  } catch (err: any) {
    console.error('Error updating brand settings:', err);
    return NextResponse.json({ error: err?.message || 'Failed to update brand kit.' }, { status: 500 });
  }
}
