import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/db';
import { appointments, workspaces } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret && signature && !webhookSecret.includes('mock')) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // Mock event parsing for dev testing
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle Event Types
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const appointmentId = session.metadata?.appointmentId;
        if (appointmentId) {
          await db.update(appointments)
            .set({ status: 'confirmed' })
            .where(eq(appointments.id, appointmentId));
        }

        const workspaceId = session.metadata?.workspaceId;
        if (session.mode === 'subscription' && workspaceId && session.metadata?.plan) {
          await db.update(workspaces)
            .set({
              plan: session.metadata.plan,
              subscriptionStatus: 'active',
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
            })
            .where(eq(workspaces.id, workspaceId));
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const appointmentId = paymentIntent.metadata?.appointmentId;
        if (appointmentId) {
          await db.update(appointments)
            .set({ status: 'completed' })
            .where(eq(appointments.id, appointmentId));
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const isActive = subscription.status === 'active' || subscription.status === 'trialing';
        await db.update(workspaces)
          .set({
            subscriptionStatus: subscription.status,
            plan: isActive ? undefined : 'free',
          })
          .where(eq(workspaces.stripeSubscriptionId, subscription.id));
        break;
      }

      case 'account.updated': {
        const account = event.data.object;
        console.log(`Stripe Connect Account Updated: ${account.id}, Payouts Enabled: ${account.payouts_enabled}`);
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Error processing webhook event:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
