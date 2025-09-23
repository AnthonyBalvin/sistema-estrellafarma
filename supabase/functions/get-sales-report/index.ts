// supabase/functions/get-sales-report/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 1. Calcular Ventas del Día (en dinero)
    const { data: dailySales, error: dailySalesError } = await supabaseAdmin
      .from('sales')
      .select('id, total_amount') // También seleccionamos el ID de la venta
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString());

    if (dailySalesError) throw dailySalesError;
    const totalDailySales = dailySales.reduce((sum, sale) => sum + sale.total_amount, 0);

    // --- NUEVA LÓGICA ---
    // 2. Calcular el total de productos vendidos hoy
    const saleIdsToday = dailySales.map(sale => sale.id);
    let totalProductsSoldToday = 0;

    if (saleIdsToday.length > 0) {
        const { data: itemsSold, error: itemsError } = await supabaseAdmin
            .from('sale_items')
            .select('quantity')
            .in('sale_id', saleIdsToday);

        if (itemsError) throw itemsError;
        totalProductsSoldToday = itemsSold.reduce((sum, item) => sum + item.quantity, 0);
    }
    // --- FIN DE LA NUEVA LÓGICA ---

    // 3. Obtener Top 5 Productos Vendidos (sin cambios)
    const { data: topProducts, error: topProductsError } = await supabaseAdmin
      .from('sale_items')
      .select('quantity, products(name)')
      .limit(100);

    if (topProductsError) throw topProductsError;
    const productSales = topProducts.reduce((acc, item) => {
      if(item.products) {
        const productName = item.products.name;
        acc[productName] = (acc[productName] || 0) + item.quantity;
      }
      return acc;
    }, {});
    const sortedTopProducts = Object.entries(productSales).sort(([, a], [, b]) => b - a).slice(0, 5).map(([name, quantity]) => ({ name, quantity }));

    const reportData = {
      totalDailySales,
      totalProductsSoldToday, // Devolvemos el nuevo dato
      topProducts: sortedTopProducts,
    };

    return new Response(JSON.stringify(reportData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400,
    })
  }
})
