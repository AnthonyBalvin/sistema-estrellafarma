// src/pages/dashboard/MainDashboardPage.jsx
import React from 'react';

export default function MainDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Principal</h1>
      <p className="text-gray-600 mt-2">
        Aquí se mostrarán las métricas clave del negocio: alertas de inventario, resumen de ventas, clientes con deudas y ranking de vendedores.
      </p>
      {/* Los widgets con la información irán aquí en el futuro */}
    </div>
  );
}
