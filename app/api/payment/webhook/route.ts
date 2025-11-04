import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('creem-signature')

    // Verify webhook signature
    const webhookSecret = process.env.CREEM_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('CREEM_WEBHOOK_SECRET is not configured')
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      )
    }

    // TODO: Implement signature verification
    // For now, we'll proceed without verification (NOT RECOMMENDED FOR PRODUCTION)

    const event = JSON.parse(body)

    console.log('Received Creem webhook event:', event.type)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        // Payment succeeded
        const session = event.data
        const userId = session.metadata?.user_id
        const billingCycle = session.metadata?.billing_cycle

        if (!userId) {
          console.error('No user_id in webhook metadata')
          break
        }

        // Update user's subscription in Supabase
        const supabase = await createClient()

        // Store subscription information
        const { error } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            creem_customer_id: session.customer_id,
            creem_subscription_id: session.subscription_id,
            price_id: session.price_id,
            status: 'active',
            billing_cycle: billingCycle,
            current_period_start: new Date(session.current_period_start * 1000),
            current_period_end: new Date(session.current_period_end * 1000),
            updated_at: new Date(),
          })

        if (error) {
          console.error('Failed to update subscription:', error)
        }

        console.log(`Subscription activated for user ${userId}`)
        break
      }

      case 'subscription.updated': {
        // Subscription updated
        const subscription = event.data
        const userId = subscription.metadata?.user_id

        if (!userId) break

        const supabase = await createClient()
        await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000),
            current_period_end: new Date(subscription.current_period_end * 1000),
            updated_at: new Date(),
          })
          .eq('creem_subscription_id', subscription.id)

        console.log(`Subscription updated for user ${userId}`)
        break
      }

      case 'subscription.cancelled': {
        // Subscription cancelled
        const subscription = event.data
        const userId = subscription.metadata?.user_id

        if (!userId) break

        const supabase = await createClient()
        await supabase
          .from('subscriptions')
          .update({
            status: 'cancelled',
            cancelled_at: new Date(),
            updated_at: new Date(),
          })
          .eq('creem_subscription_id', subscription.id)

        console.log(`Subscription cancelled for user ${userId}`)
        break
      }

      case 'payment.succeeded': {
        // One-time payment succeeded
        const payment = event.data
        const userId = payment.metadata?.user_id

        if (!userId) break

        // Add credits to user account
        const supabase = await createClient()

        // You can store credit purchases in a separate table
        await supabase
          .from('credit_purchases')
          .insert({
            user_id: userId,
            creem_payment_id: payment.id,
            amount: payment.amount,
            credits: payment.metadata?.credits || 0,
            created_at: new Date(),
          })

        console.log(`Credits added for user ${userId}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
