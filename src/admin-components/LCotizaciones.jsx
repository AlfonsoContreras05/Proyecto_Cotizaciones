import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import NavBarAdmin from "./navBarAmin";

const ListarCotizaciones = () => {
  const [cotizaciones, setCotizaciones] = useState([]);

  useEffect(() => {
    const fetchCotizaciones = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/LCotizaciones");
        const data = await response.json();
        setCotizaciones(data);
      } catch (error) {
        console.error("Error al obtener las cotizaciones:", error);
      }
    };

    fetchCotizaciones();
  }, []);

  const columnas = [
    {
      name: "ID Cotización",
      selector: (row) => row.ID_Cotizacion,
      sortable: true,
    },
    { name: "Fecha", selector: (row) => row.Fecha_Cotizacion, sortable: true },
    { name: "Estado", selector: (row) => row.Estado, sortable: true },
    { name: "ID Vendedor", selector: (row) => row.ID_Vendedor, sortable: true },
    {
      name: "Nombre Vendedor",
      selector: (row) => `${row.NombreVendedor} ${row.ApellidoVendedor}`,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <>
          <button onClick={() => (row.ID_Cotizacion)}>
            Editar
          </button>
          <button onClick={() => (row.ID_Cotizacion)}>
            Eliminar
          </button>
        </>
      )
    },
    // Agrega aquí más columnas si lo necesitas
  ];

  return (
    <div>
      <div className="container mt-5">
        <NavBarAdmin />
      </div>
      <div className=" ">
        <div className="container mt-3">
          <h2>Listado de Cotizaciones</h2>
          <DataTable
            columns={columnas}
            data={cotizaciones}
            persistTableHead
            pagination
            theme="dark"
            customStyles={{
              headRow: {
                style: {
                  backgroundColor: "#16191c", // Color de fondo de la cabecera
                  color: "#fff", // Color de texto
                  "&:hover": {
                    backgroundColor: "#2c3038", // Color de fondo al pasar el mouse
                  },
                },
              },
              rows: {
                style: {
                  backgroundColor: "#282c34", // Color de fondo de las filas
                  color: "#fff", // Color de texto
                  "&:hover": {
                    backgroundColor: "#2c3038", // Color de fondo al pasar el mouse
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ListarCotizaciones;
