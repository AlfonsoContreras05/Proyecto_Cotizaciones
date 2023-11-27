import React, { useState, useEffect , useMemo } from "react";
import NavBArAdm from "./navBarAmin";
import DataTable from "react-data-table-component";
import "../css/StyleHistorial.css"; // Asegúrate de tener este archivo CSS
//import "bootstrap/dist/css/bootstrap.min.css";
//import DataTable from "react-data-table-component";




// Usar <GlobalStyle /> en la parte superior de tu componente o aplicación

export function ListarVendedores() {
  const [vendedores, setVendedores] = useState([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const obtenerVendedores = async () => {
      try {
        const respuesta = await fetch(
          "http://localhost:5000/api/vendedores-admin"
        );
        if (respuesta.ok) {
          const datos = await respuesta.json();
          setVendedores(datos);
        } else {
          console.error("Error al cargar vendedores:", respuesta);
        }
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
      }
    };
    obtenerVendedores();
  }, []);

  const filteredItems = vendedores.filter(
    (item) =>
      item.ID_Vendedor  && item.ID_Vendedor.toString().includes(filterText)
  );

  const subHeaderComponent = useMemo(() => {
    return (
      <input
        type="text"
        placeholder="Buscar Cotización"
        className="dataTable-input"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
    );
  }, [filterText]);
  const headerElement = document.querySelector("header.sc-dIUfKc.goZmTm");

  // Verifica si el elemento se encontró antes de intentar quitar la clase
  if (headerElement) {
    // Quita la clase "goZmTm"
    headerElement.classList.remove("goZmTm");
  }





   
  const columnas = [
    {
      name: "ID",
      sortable: true,
      selector: (row) => row.ID_Vendedor,
    },
    {
      name: "Nombre",
      sortable: true,
      selector: (row) => row.Nombre,
    },
    {
      name: "Apellido",
      sortable: true,
      selector: (row) => row.Apellido,
    },
    {
      name: "Correo Electrónico",
      sortable: true,
      selector: (row) => row.Correo_Electronico,
    },
    {
      name: "Teléfono",
      sortable: true,
      selector: (row) => row.Telefono,
    },
    {
      name: "Sucursal",
      sortable: true,
      // Asegúrate de que los datos de la sucursal se pueden mapear correctamente
      selector: (row) => `Sucursal ${row.ID_Sucursal}`,
    },
    {
      name: "Direccion",
      sortable: true,
      selector: (row) => row.Area_Especializacion,
    },
    {
      name: "Contraseña",
      sortable: true,
      selector: (row) => row.pass,
    },
    {
      name: "Total de Ventas",
      selector: (row) => row.TotalVentas,
      sortable: true,
      format: (row) => {
        const totalVentas = parseFloat(row.TotalVentas); // Convierte a número flotante
        return totalVentas ? `$${totalVentas.toFixed(0)}` : "$0.00"; // Formatea a moneda
      },
    },

    {
      name: "Acciones",
      button: true,
      cell: (row) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
          <button className="btn btn-primary btn-custom">Editar</button>
        </div>
      ),
    },
    {
      name: "Acciones",
      button: true,
      cell: (row) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
          <button className="btn btn-danger btn-custom">Eliminar</button>
        </div>
      ),
    },
  ];
  const paginacionopcion = {
    rowsPerPageText: 'Filas por pagina',
    rangeSeparatorText:'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos'
 }



  return (
    <div className="container mt-5">
      <div className="container mt-5">
        <NavBArAdm />
      </div>

      <div className="table table-dark table-striped">
        <h2>Listado de Vendedores</h2>
 
        <DataTable 
          columns={columnas}
          data={filteredItems}
          
          subHeader
          subHeaderComponent={subHeaderComponent}
          pagination
          paginationComponentOptions={paginacionopcion }
          fixedHeader
          fixedHeaderScrollHeight="600px"
          theme="dark"
          customStyles={{
            headRow: {
              style: {
                backgroundColor: "#16191c", // Color de fondo de la cabecera
                color: "#fff", // Color de texto
                "&:hover": {
                  backgroundColor: "#2c3038", // Color de fondo al pasar el mouse
                  margin: "auto",
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
  );
}

export default ListarVendedores;
