
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { restaurantKey, endpoint = 'menu' } = await req.json()
    
    if (!restaurantKey) {
      return new Response(
        JSON.stringify({ error: 'Restaurant key is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    console.log('Making request to Gloria API with key:', restaurantKey)
    
    const response = await fetch(`https://pos.globalfoodsoft.com/pos/${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': restaurantKey,
        'Accept': 'application/xml',
        'Glf-Api-Version': '2'
      }
    })

    const data = await response.text()
    console.log('Gloria API response status:', response.status)
    console.log('Gloria API response preview:', data.substring(0, 200))

    if (response.ok) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: data,
          status: response.status 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } else {
      return new Response(
        JSON.stringify({ 
          error: `Gloria API error: ${response.status} ${response.statusText}`,
          data: data
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: response.status
        }
      )
    }
  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
