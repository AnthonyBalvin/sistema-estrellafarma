import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Manejo de la solicitud pre-vuelo (CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Hacemos la consulta real a la base de datos
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select(`
        id,
        full_name,
        role,
        created_at,
        users ( email )
      `)
      .order('full_name', { ascending: true });

    if (error) {
      // Si hay un error en la consulta, lo lanzamos para que se vea en los logs
      console.error("Error en la consulta a la base de datos:", error);
      throw error;
    }

    // Aplanamos los datos para que sean más fáciles de usar en React
    const formattedProfiles = data.map(p => ({
        ...p,
        email: p.users ? p.users.email : 'Correo no disponible'
    }));

    return new Response(JSON.stringify(formattedProfiles), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})