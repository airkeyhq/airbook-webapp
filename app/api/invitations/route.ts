import { NextResponse } from 'next/server';
import { db } from '@/db';
import { invitations, organizations, users, staff } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getActiveWorkspaceId } from '@/lib/workspace';
import { sendTeamInvitationEmail } from '@/lib/notifications';

async function getOrCreateDefaultOrgAndUser() {
  let [user] = await db.select().from(users).limit(1);
  if (!user) {
    [user] = await db
      .insert(users)
      .values({
        id: `usr_${Date.now()}`,
        name: 'Eduardo Moreno',
        email: 'owner@getairbook.com',
        emailVerified: true,
      })
      .returning();
  }

  let [org] = await db.select().from(organizations).limit(1);
  if (!org) {
    [org] = await db
      .insert(organizations)
      .values({
        id: `org_${Date.now()}`,
        name: 'AirBook Business',
        slug: 'airbook-business',
      })
      .returning();
  }

  return { user, org };
}

export async function GET() {
  try {
    const activeWorkspaceId = await getActiveWorkspaceId();
    
    // Fetch pending invitations
    const pendingInvitesList = await db
      .select()
      .from(invitations)
      .where(eq(invitations.status, 'pending'));

    // Fetch existing staff/team members
    const teamMembersList = await db
      .select()
      .from(staff)
      .where(eq(staff.workspaceId, activeWorkspaceId))
      .orderBy(desc(staff.createdAt));

    return NextResponse.json({
      success: true,
      invitations: pendingInvitesList,
      teamMembers: teamMembersList,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch team invitations.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, role } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required.' }, { status: 400 });
    }

    const { user, org } = await getOrCreateDefaultOrgAndUser();

    // Check if invitation already exists
    const existing = await db
      .select()
      .from(invitations)
      .where(eq(invitations.email, email.toLowerCase().trim()));

    if (existing.length > 0 && existing[0].status === 'pending') {
      return NextResponse.json({ error: 'An invitation is already pending for this email address.' }, { status: 400 });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

    const [newInvite] = await db
      .insert(invitations)
      .values({
        id: `inv_${Date.now()}`,
        organizationId: org.id,
        email: email.toLowerCase().trim(),
        role: role || 'staff',
        status: 'pending',
        expiresAt,
        inviterId: user.id,
      })
      .returning();

    const origin = new URL(req.url).origin;
    const emailResult = await sendTeamInvitationEmail({
      email: newInvite.email,
      inviterName: user.name || 'Your team',
      organizationName: org.name,
      role: newInvite.role,
      signInUrl: `${origin}/login`,
    });

    return NextResponse.json({ success: true, invitation: newInvite, emailSent: emailResult.success });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to send invitation.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Invitation ID is required.' }, { status: 400 });
    }

    await db.delete(invitations).where(eq(invitations.id, id));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to revoke invitation.' }, { status: 500 });
  }
}
