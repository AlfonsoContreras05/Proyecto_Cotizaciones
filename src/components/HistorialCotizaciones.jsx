import React, { useEffect, useState } from "react";
import NavbarComponent from "./NavbarComponent";
import "../css/StyleHistorial.css";

const HistorialCotizaciones = () => {
  const [cotizaciones, setCotizaciones] = useState([]);
  const idVendedor = localStorage.getItem("idVendedor");

  useEffect(() => {
    if (!idVendedor) {
      console.error("ID del vendedor no encontrado");
      return;
    }

    const cargarCotizaciones = async () => {
      try {
        const url = `http://localhost:5000/api/cotizaciones-vendedor/${idVendedor}`;
        const respuesta = await fetch(url);
        if (respuesta.ok) {
          const data = await respuesta.json();
          console.log(data); 
          setCotizaciones(data.map(cot => ({
            ...cot,
            
            total: parseFloat(cot.Total)
            
          }
          )));
        }
      } catch (error) {
        console.error("Error al cargar las cotizaciones:", error);
      }
    };
    cargarCotizaciones();
  }, [idVendedor]);

  const handleVerCotizacion = (idCotizacion) => {
    console.log("Ver cotización:", idCotizacion);
  };

  const handleComprarCotizacion = (idCotizacion) => {
    console.log("Comprar cotización:", idCotizacion);
  };

  return (
    <div className="historial-container">
    <NavbarComponent />
    <div className="container historial-content">
      <h2>Historial de Cotizaciones</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID Cotización</th>
            <th>Cantidad de Productos</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cotizaciones.map((cotizacion) => (
            <tr key={cotizacion.ID_Cotizacion}>
              <td>{cotizacion.ID_Cotizacion}</td>
              <td>{cotizacion.Productos.split(',').length}</td>
              <td>${parseFloat(cotizacion.total).toFixed(2)}</td>
              <td>
                <button onClick={() => handleVerCotizacion(cotizacion.ID_Cotizacion)}>Ver</button>
                <button onClick={() => handleComprarCotizacion(cotizacion.ID_Cotizacion)}>Comprar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default HistorialCotizaciones;
