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

const ModalVenta = ({ cotizacion, onClose }) => {
  const [metodoPago, setMetodoPago] = useState('');

  const handlePaymentSuccess = (details) => {
    console.log("Pago completado. Detalles: ", details);
    onClose(); // Cierra el modal después del pago exitoso
    // Aquí puedes agregar lógica adicional para manejar el pago exitoso
  };

  return (
    <div className="modal-venta">
      {/* Contenido del modal */}
      <h2>Confirmar Compra</h2>
      {/* Opciones de método de pago */}
      <div>
        <label>Método de pago:</label>
        <select value={metodoPago} onChange={e => setMetodoPago(e.target.value)}>
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="paypal">PayPal</option>
        </select>
      </div>

      {/* Botón de PayPal */}
      {metodoPago === "paypal" && (
        <PaypalButtonComponent
          total={cotizacion.total}
          onPaymentCompleted={handlePaymentSuccess}
        />
      )}

      {/* Botón para cerrar el modal */}
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
};

export default ModalVenta;
