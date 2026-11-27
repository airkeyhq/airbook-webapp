import { NextResponse } from 'next/server';
import { db } from '@/db';
import { expenses } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');

    const rows = await db
      .select()
      .from(expenses)
      .where(workspaceId ? eq(expenses.workspaceId, workspaceId) : undefined)
      .orderBy(desc(expenses.dateStr), desc(expenses.createdAt))
      .limit(50);

    return NextResponse.json({ success: true, expenses: rows });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch expenses.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { workspaceId, category, amountCents, description, dateStr } = body;

    if (!workspaceId || !category || typeof amountCents !== 'number' || amountCents <= 0) {
      return NextResponse.json(
        { error: 'workspaceId, category, and positive amountCents are required.' },
        { status: 400 }
      );
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const [created] = await db
      .insert(expenses)
      .values({
        workspaceId,
        category: String(category).slice(0, 50),
        amountCents: Math.round(amountCents),
        description: description ? String(description).trim() : null,
        dateStr: dateStr || todayStr,
      })
      .returning();

    return NextResponse.json({ success: true, expense: created });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create expense.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Expense ID is required.' }, { status: 400 });
    }

    await db.delete(expenses).where(eq(expenses.id, id));
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to delete expense.' }, { status: 500 });
  }
}
