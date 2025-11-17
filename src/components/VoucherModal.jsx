import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';

// Iconos
const PrinterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 6 2 18 2 18 9"></polyline>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
    <rect x="6" y="14" width="12" height="8"></rect>
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function VoucherModal({ isOpen, onClose, voucherData }) {
  const voucherRef = useRef();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  if (!isOpen || !voucherData) return null;

  const {
    voucherNumber,
    issueDate,
    clientName,
    clientDni,
    items,
    totalAmount,
    pharmacistName,
    branchName,
    branchAddress,
    branchPhone,
    paymentStatus,
  } = voucherData;

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-PE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const element = voucherRef.current;
      
      // Capturar el contenido como canvas con alta calidad
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Crear PDF en formato A4
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Agregar primera página
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Si el contenido es más grande que una página, agregar más páginas
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Descargar el PDF
      pdf.save(`Comprobante-${voucherNumber}.pdf`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Por favor intenta de nuevo.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // URL para el QR - Personaliza con tu dominio real
  const qrData = `https://estrellafarma.com/verificar/${voucherNumber}`;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header del Modal */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white relative print:hidden">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <CloseIcon />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <CheckCircleIcon />
            </div>
            <div>
              <h2 className="text-3xl font-bold">¡Venta Exitosa!</h2>
              <p className="text-green-100 mt-1">Comprobante generado correctamente</p>
            </div>
          </div>
        </div>

        {/* Contenido del Comprobante */}
        <div className="flex-1 overflow-y-auto p-6">
          <div ref={voucherRef} className="bg-white p-8">
            
            {/* Encabezado de la Boleta */}
            <div className="flex justify-between items-start mb-6 border-b-2 border-gray-300 pb-6">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  FARMACIA {branchName?.toUpperCase() || 'ESTRELLA FARMA'}
                </h1>
                <p className="text-sm text-gray-600">{branchAddress || 'Av. Principal 123, Lima'}</p>
                <p className="text-sm text-gray-600">Tel: {branchPhone || '(01) 234-5678'}</p>
                <p className="text-sm text-gray-600">RUC: 20123456789</p>
              </div>
              
              {/* Código QR */}
              <div className="text-center">
                <div className="border-2 border-orange-500 px-4 py-2 rounded-lg mb-3">
                  <p className="text-xs text-gray-600 font-semibold">BOLETA DE VENTA</p>
                  <p className="text-base font-bold text-orange-600">{voucherNumber}</p>
                </div>
                <QRCodeSVG 
                  value={qrData}
                  size={80}
                  level="H"
                  includeMargin={true}
                />
                <p className="text-xs text-gray-500 mt-1">Escanea para verificar</p>
              </div>
            </div>

            {/* Información de la Venta */}
            <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
              <div>
                <p className="text-gray-600 font-semibold mb-2">Datos del Cliente:</p>
                <p className="text-gray-800"><span className="font-medium">Nombre:</span> {clientName || 'Cliente Anónimo'}</p>
                {clientDni && <p className="text-gray-800"><span className="font-medium">DNI:</span> {clientDni}</p>}
              </div>
              <div className="text-right">
                <p className="text-gray-600 font-semibold mb-2">Datos de Emisión:</p>
                <p className="text-gray-800"><span className="font-medium">Fecha:</span> {formatDate(issueDate)}</p>
                <p className="text-gray-800"><span className="font-medium">Cajero:</span> {pharmacistName || 'Sistema'}</p>
                <p className={`text-xs font-bold mt-2 inline-block px-3 py-1 rounded-full ${
                  paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {paymentStatus === 'paid' ? 'PAGADO' : 'CRÉDITO'}
                </p>
              </div>
            </div>

            {/* Tabla de Productos */}
            <div className="mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-y-2 border-gray-300">
                    <th className="py-3 px-3 text-left font-semibold text-gray-700">Producto</th>
                    <th className="py-3 px-3 text-center font-semibold text-gray-700">Cant.</th>
                    <th className="py-3 px-3 text-right font-semibold text-gray-700">P. Unit.</th>
                    <th className="py-3 px-3 text-right font-semibold text-gray-700">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-3 px-3 text-gray-800">{item.name}</td>
                      <td className="py-3 px-3 text-center text-gray-800">{item.quantity}</td>
                      <td className="py-3 px-3 text-right text-gray-800">S/ {Number(item.price).toFixed(2)}</td>
                      <td className="py-3 px-3 text-right font-semibold text-gray-800">
                        S/ {(item.quantity * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="border-t-2 border-gray-300 pt-4">
              <div className="flex justify-end items-center gap-8 mb-6">
                <span className="text-xl font-bold text-gray-700">TOTAL A PAGAR:</span>
                <span className="text-3xl font-bold text-orange-600">S/ {Number(totalAmount).toFixed(2)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 mt-8 pt-6 border-t border-gray-200">
              <p className="font-semibold mb-1">¡Gracias por su compra!</p>
              <p>Este documento es un comprobante electrónico de pago</p>
              <p className="mt-2">Conserve este comprobante para cualquier reclamo</p>
              <p className="mt-3 text-gray-400">
                Comprobante generado electrónicamente • www.estrellafarma.com
              </p>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="bg-gray-50 p-6 border-t border-gray-200 flex flex-wrap gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 min-w-[150px] bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <PrinterIcon />
            Imprimir
          </button>
          
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="flex-1 min-w-[150px] bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {isGeneratingPDF ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generando PDF...
              </>
            ) : (
              <>
                <DownloadIcon />
                Descargar PDF
              </>
            )}
          </button>
          
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>

      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\:hidden {
            display: none !important;
          }
          ${voucherRef.current ? `#${voucherRef.current.id}` : ''}, 
          ${voucherRef.current ? `#${voucherRef.current.id} *` : ''} {
            visibility: visible;
          }
        }
      `}</style>
    </div>
  );
}