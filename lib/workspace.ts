import { db } from '@/db';
import { workspaces } from '@/db/schema';

export async function getActiveWorkspaceId(providedId?: string | null): Promise<string> {
  if (providedId && providedId !== '00000000-0000-0000-0000-000000000001') {
    return providedId;
  }

  const [existing] = await db.select({ id: workspaces.id }).from(workspaces).limit(1);
  if (existing) {
    return existing.id;
  }

  // Fallback: auto-create default workspace if table is empty
  const [created] = await db
    .insert(workspaces)
    .values({
      name: "Glow Esthetics Studio",
      slug: 'glow-esthetics-studio',
      currency: 'USD',
      brandColor: '#007AFF',
    })
    .returning({ id: workspaces.id });

  return created.id;
}
