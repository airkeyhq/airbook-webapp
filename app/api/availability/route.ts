import { NextResponse } from 'next/server';
import { db } from '@/db';
import { appointments, schedules } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

const DEFAULT_OPEN = '09:00';
const DEFAULT_CLOSE = '18:00';
const SLOT_STEP_MINUTES = 30;

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function toHHMM(mins: number): string {
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get('staffId');
    const dateStr = searchParams.get('dateStr');
    const durationMinutes = Number(searchParams.get('durationMinutes') || 45);

    if (!staffId || !dateStr) {
      return NextResponse.json({ error: 'staffId and dateStr are required.' }, { status: 400 });
    }

    const dayOfWeek = new Date(`${dateStr}T00:00:00`).getDay();

    const [schedule] = await db
      .select()
      .from(schedules)
      .where(and(eq(schedules.staffId, staffId), eq(schedules.dayOfWeek, dayOfWeek)));

    if (schedule && !schedule.isWorkingDay) {
      return NextResponse.json({ success: true, slots: [] });
    }

    const openMinutes = toMinutes(schedule?.startTime || DEFAULT_OPEN);
    const closeMinutes = toMinutes(schedule?.endTime || DEFAULT_CLOSE);

    const existing = await db
      .select({ startTime: appointments.startTime, endTime: appointments.endTime })
      .from(appointments)
      .where(
        and(
          eq(appointments.staffId, staffId),
          eq(appointments.dateStr, dateStr),
          eq(appointments.status, 'confirmed')
        )
      );

    const busyRanges = existing.map((a) => ({
      start: toMinutes(a.startTime),
      end: toMinutes(a.endTime || a.startTime),
    }));

    const now = new Date();
    const isToday = dateStr === now.toISOString().slice(0, 10);
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const slots: string[] = [];
    for (let start = openMinutes; start + durationMinutes <= closeMinutes; start += SLOT_STEP_MINUTES) {
      const end = start + durationMinutes;
      if (isToday && start <= nowMinutes) continue;
      const overlaps = busyRanges.some((b) => start < b.end && end > b.start);
      if (!overlaps) slots.push(toHHMM(start));
    }

    return NextResponse.json({ success: true, slots });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to compute availability.' }, { status: 500 });
  }
}
