import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') { return new Response('ok', { headers: corsHeaders }) }
  try {
    const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const { userId, fullName, role, email, password } = await req.json();
    if (!userId) throw new Error("ID de usuario requerido.");

    const authUpdateData = { email };
    if (password) { // Solo añadimos la contraseña si no está vacía
      authUpdateData.password = password;
    }

    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, authUpdateData);
    if (authError) throw authError;

    const { error: profileError } = await supabaseAdmin.from('profiles').update({ full_name: fullName, role: role }).eq('id', userId);
    if (profileError) throw profileError;

    return new Response(JSON.stringify({ message: 'Usuario actualizado' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400,
    });
  }
});