import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PaypalButtonComponent = ({ total, onPaymentCompleted }) => {
  return (
    <PayPalScriptProvider options={{ "client-id": "AQzBwRyVHIpRqwepgz8o2UamYb-Ih3GZ87Rt48nMOsj4ja1LTDKFhRhKShLrROAKwrVLrt4bH650Hnje" }}>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: total,
              },
            }],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(details => {
            onPaymentCompleted(details);
          });
        }}
      />
    </PayPalScriptProvider>
  );
};

const ModalVenta = ({ cotizacion, onClose, onPagoExitoso }) => {
  const [metodoPago, setMetodoPago] = useState('');
  const [montoPagado, setMontoPagado] = useState('');
  const [vuelto, setVuelto] = useState(0);

  const handlePaymentSuccess = (details) => {
    console.log("Pago completado. Detalles: ", details);
    onClose(); // Cierra el modal después del pago exitoso
    onPagoExitoso(); // Actualiza las cotizaciones en el componente padre
  };

  const handleEfectivoChange = (e) => {
    const monto = parseFloat(e.target.value);
    setMontoPagado(monto);
    const vueltoCalculado = Math.max(0, monto - cotizacion.total).toFixed(2);
    setVuelto(vueltoCalculado);
  };

  const confirmarPagoEfectivo = async () => {
    try {
      const idCotizacionNumerico = parseInt(cotizacion.ID_Cotizacion);
      //const idSucursal = ...; // Obtener ID_Sucursal según tu lógica de negocio
      const metodoPagoEfectivo = "efectivo"; // O el método de pago que estés usando
      const response = await fetch('http://localhost:5000/api/pagarCotizacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idCotizacion: idCotizacionNumerico,
          montoPagado: montoPagado,
         // idSucursal: idSucursal,
          metodoPago: metodoPagoEfectivo
        }),
      });

      if (response.ok) {
        console.log("Pago en efectivo realizado con éxito");
        onClose(); // Cierra el modal
        onPagoExitoso(); // Actualiza las cotizaciones en el componente padre
      } else {
        console.error("Error al realizar el pago");
      }
    } catch (error) {
      console.error("Error al realizar el pago:", error);
    }
    
  };

  return (
    <div className="modal-venta">
      <h2>Confirmar Compra</h2>
      <div>
        <label>Método de pago:</label>
        <select value={metodoPago} onChange={e => setMetodoPago(e.target.value)}>
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="paypal">PayPal</option>
        </select>
      </div>

      {metodoPago === "paypal" && (
        <PaypalButtonComponent
          total={cotizacion.total}
          onPaymentCompleted={handlePaymentSuccess}
        />
      )}

      {metodoPago === "efectivo" && (
        <div>
          <label>Monto Pagado:</label>
          <input
            type="number"
            value={montoPagado}
            onChange={handleEfectivoChange}
          />
          <p>Vuelto a entregar: ${vuelto}</p>
          <button onClick={confirmarPagoEfectivo}>Confirmar Pago en Efectivo</button>
        </div>
      )}

      <button onClick={onClose}>Cerrar</button>
    </div>
  );
};

export default ModalVenta;
