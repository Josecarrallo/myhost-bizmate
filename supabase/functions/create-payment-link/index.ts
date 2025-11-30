 import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
  import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
  import Stripe from 'https://esm.sh/stripe@14.3.0?target=deno'

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  serve(async (req) => {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    try {
      const { booking_id } = await req.json()

      // Initialize Supabase client
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      // Get booking with property details
      const { data: booking, error: bookingError } = await supabaseClient
        .from('bookings')
        .select('*, property:properties(*)')
        .eq('id', booking_id)
        .single()

      if (bookingError) throw bookingError

      // Initialize Stripe
      const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
        apiVersion: '2023-10-16',
      })

      // Create Payment Link
      const paymentLink = await stripe.paymentLinks.create({
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Reserva ${booking.property.name}`,
              description: `${booking.check_in} - ${booking.check_out}`,
            },
            unit_amount: Math.round(booking.total_price * 100),
          },
          quantity: 1,
        }],
        metadata: {
          booking_id: booking.id,
          property_id: booking.property_id,
          guest_email: booking.guest_email,
        },
        after_completion: {
          type: 'redirect',
          redirect: {
            url: `${Deno.env.get('FRONTEND_URL')}/booking/${booking.id}/success`,
          },
        },
      })

      // Save payment link in booking
      await supabaseClient
        .from('bookings')
        .update({
          payment_link: paymentLink.url,
        })
        .eq('id', booking_id)

      return new Response(
        JSON.stringify({
          payment_link: paymentLink.url,
          amount: booking.total_price
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )

    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }
  })