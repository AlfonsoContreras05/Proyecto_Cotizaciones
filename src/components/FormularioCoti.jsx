import React, { useState, useCallback } from "react";
import NavbarComponent from "./NavbarComponent";
import ProductSelector from "./ProductSelector";
import ClientDetailsForm from "./ClientDetailsForm";
import "../css/StyleMenu.css";

const FormularioCotizacion = () => {
  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "",
    rut: "",
    direccion: "",
    correo: "",
    celular: "",
  });
  const [componentesSeleccionados, setComponentesSeleccionados] = useState([]);

  const handleClientChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleComponenteSeleccionado = useCallback((nuevoComponente) => {
    // Evitar duplicados
    if (!componentesSeleccionados.find(c => c.ID_Producto === nuevoComponente.ID_Producto)) {
      setComponentesSeleccionados((prev) => [...prev, nuevoComponente]);
    }
  }, [componentesSeleccionados]);

  const totalPrecio = componentesSeleccionados.reduce(
    (total, componente) => total + parseFloat(componente.Precio),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const idVendedor = localStorage.getItem('idVendedor');


      if (!idVendedor) {
        console.error("ID del vendedor no está disponible");
        return; // Detener si no hay ID del vendedor
      }

      const response = await fetch(
        "http://localhost:5000/api/guardar-cotizacion",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cliente: cliente,
            productos: componentesSeleccionados.map((producto) => ({
              ID_Producto: producto.ID_Producto,
              Cantidad: 1,
              Precio: producto.Precio,
            })),
            ID_Vendedor: Number(idVendedor)

          }),
        }
      );
      if (!response.ok) throw new Error("Error al guardar la cotización");
      // Manejar éxito aquí
    } catch (error) {
      console.error("Error al guardar la cotización:", error);
      // Manejar error aquí
    }
  };

  return (
<div className="bg-black">
    <NavbarComponent />
    <div className="container">
      <form className="row g-3 mt-4" onSubmit={handleSubmit}>
          <h1 className="mt-5">Datos del Cliente</h1>
          <ClientDetailsForm cliente={cliente} onChange={handleClientChange} />


          <h1 className="mt-5">Selecciona Tus Componentes</h1>
        <ProductSelector onComponenteSeleccionado={handleComponenteSeleccionado} />

          <h2>Componentes Seleccionados</h2>
          <table className="table table-dark table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {componentesSeleccionados.map((componente, index) => (
                <tr key={`componente-${componente.ID_Producto}-${index}`}>
                  <td>{componente.Nombre}</td>
                  <td>$ {componente.Precio.toFixed(2)}</td>
                  <td>{componente.Descripcion}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Total: ${totalPrecio.toFixed(2)}</h2>
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-outline-light mx-2 mb-5">
              Crear Cotización
            </button>
            <button
              type="button"
              className="btn btn-outline-light mx-2 mb-5"
              onClick={() => {
                setComponentesSeleccionados([]); // Limpiar la selección
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioCotizacion;
