import React, { useEffect, useState, useMemo } from "react";
import NavbarComponent from "./NavbarComponent";
import DataTable from "react-data-table-component";
import "../css/StyleHistorial.css";
//import "../css/StyleMenu.css";


const HistorialCotizaciones = () => {
    const [cotizaciones, setCotizaciones] = useState([]);
    const [filterText, setFilterText] = useState('');
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
                    setCotizaciones(data.map(cot => ({
                        ...cot,
                        total: parseFloat(cot.Total)
                    })));
                }
            } catch (error) {
                console.error("Error al cargar las cotizaciones:", error);
            }
        };
        cargarCotizaciones();
    }, [idVendedor]);

    const columnas = [
      { name: "ID Cotización", selector: row => row.ID_Cotizacion, sortable: true },
      { 
          name: "Cantidad de Productos", 
          selector: row => row.Productos.split(',').length, 
          sortable: true 
      },
      { 
          name: "Total", 
          selector: row => `$${row.total.toFixed(2)}`, 
          sortable: true 
      },
      {
          name: "Acciones",
          cell: row => (
              <>
                  <button onClick={() => handleVerCotizacion(row.ID_Cotizacion)}>Ver</button>
                  <button onClick={() => handleComprarCotizacion(row.ID_Cotizacion)}>Comprar</button>
              </>
          ),
          ignoreRowClick: true,
          allowOverflow: true,
          button: true,
      },
      { 
          name: "Estado", 
          selector: row => row.Estado, 
          sortable: true 
      },
  ];
  

    const filteredItems = cotizaciones.filter(
        item => item.ID_Cotizacion && item.ID_Cotizacion.toString().includes(filterText)
    );

    const subHeaderComponent = useMemo(() => {
      return (
          <input
              type="text"
              placeholder="Buscar Cotización"
              className="dataTable-input"
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
          />
      );
  }, [filterText]);

    const handleVerCotizacion = (idCotizacion) => {
        console.log("Ver cotización:", idCotizacion);
    };

    const handleComprarCotizacion = (idCotizacion) => {
        console.log("Comprar cotización:", idCotizacion);
    };

    return (
      <div className="bg-dark">
              <div className="historial-container">
          <NavbarComponent />
          <div className="container historial-content">
              <h2>Historial de Cotizaciones</h2>
              <DataTable
                  columns={columnas}
                  data={filteredItems}
                  subHeader
                  subHeaderComponent={subHeaderComponent}
                  persistTableHead
                  customStyles={{
                      headRow: {
                          style: {
                              backgroundColor: "#16191c", // Color de fondo de la cabecera
                          },
                      },
                      rows: {
                          style: {
                              backgroundColor: "#282c34", // Color de fondo de las filas
                              color: "#fff", // Color de texto
                              '&:hover': {
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
  
export default HistorialCotizaciones;
