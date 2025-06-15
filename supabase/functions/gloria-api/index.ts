
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Gloria API function called, method:', req.method)
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    console.log('Request body:', body)
    
    const { restaurantKey, endpoint = 'menu' } = body
    
    if (!restaurantKey) {
      console.log('No restaurant key provided')
      return new Response(
        JSON.stringify({ error: 'Restaurant key is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    console.log('Making request to Gloria API with key:', restaurantKey, 'endpoint:', endpoint)
    
    const gloriaUrl = `https://pos.globalfoodsoft.com/pos/${endpoint}`
    console.log('Requesting URL:', gloriaUrl)
    
    const response = await fetch(gloriaUrl, {
      method: 'GET',
      headers: {
        'Authorization': restaurantKey,
        'Accept': 'application/xml',
        'Glf-Api-Version': '2'
      }
    })

    console.log('Gloria API response status:', response.status)
    console.log('Gloria API response headers:', Object.fromEntries(response.headers.entries()))

    const data = await response.text()
    console.log('Gloria API response length:', data.length)
    console.log('Gloria API response preview:', data.substring(0, 500))

    if (response.ok) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: data,
          status: response.status,
          headers: Object.fromEntries(response.headers.entries())
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } else {
      console.log('Gloria API returned error status:', response.status)
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `Gloria API error: ${response.status} ${response.statusText}`,
          data: data,
          status: response.status
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 // Return 200 so the client can handle the error properly
        }
      )
    }
  } catch (error) {
    console.error('Edge function error details:', error)
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: `Edge function error: ${error.message}`,
        errorType: error.name,
        details: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Return 200 so the client can handle the error properly
      }
    )
  }
})
