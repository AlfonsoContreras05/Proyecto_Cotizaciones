import React, { useEffect, useState, useMemo } from "react";
import NavbarComponent from "./NavbarComponent";
import DataTable from "react-data-table-component";
import "../css/StyleHistorial.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ModalVenta from "./ModalVenta"; // Asegúrate de que la ruta sea correcta

const HistorialCotizaciones = () => {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [filterText, setFilterText] = useState("");
  const idVendedor = localStorage.getItem("idVendedor");

  const [showModal, setShowModal] = useState(false);
  const [selectedCotizacion, setSelectedCotizacion] = useState(null);

  // Función para calcular el tiempo restante
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
          const cotizacionesActualizadas = data.map((cot) => {
            // Utiliza el estado y las horas transcurridas de la API
            return {
              ...cot,
              TiempoRestante: cot.HorasTranscurridas <= 48 ? `${48 - cot.HorasTranscurridas}h restantes` : "Expirado"
            };
          });

          setCotizaciones(cotizacionesActualizadas);
        }
      } catch (error) {
        console.error("Error al cargar las cotizaciones:", error);
      }
    };

    cargarCotizaciones();

    const headerElement = document.querySelector("header.sc-dIUfKc.goZmTm");

    // Verifica si el elemento se encontró antes de intentar quitar la clase
    if (headerElement) {
      // Quita la clase "goZmTm"
      headerElement.classList.remove("goZmTm");
    }
  }, [idVendedor]);

  const columnas = [
    {
      name: "ID Cotización",
      selector: (row) => row.ID_Cotizacion,
      sortable: true,
    },
    {
      name: "Cantidad de Productos",
      selector: (row) => row.Productos.split(",").length,
      sortable: true,
    },
    {
      name: "Total",
      selector: (row) => `$${row.total.toFixed(0)}`,
      sortable: true,
    },
    {},
    {
      name: "Acciones",
      cell: (row) => (
        <>
          <button onClick={() => handleVerCotizacion(row.ID_Cotizacion)}>
            Ver
          </button>
          <button onClick={() => handleDescargarCotizacion(row.ID_Cotizacion)}>
            Descargar
          </button>
          <button 
            onClick={() => handleComprarCotizacion(row)}
            disabled={row.Estado === 'Expirado'} // Deshabilita si el estado es 'Expirado'
          >
            Comprar
          </button>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {},
    {
      name: "Estado",
      selector: (row) => row.Estado,
      sortable: true,
    },
    {
      name: "Tiempo Restante",
      selector: (row) => `(${row.TiempoRestante})`,
      sortable: true,
    },
  ];

  const filteredItems = cotizaciones.filter(
    (item) =>
      item.ID_Cotizacion && item.ID_Cotizacion.toString().includes(filterText)
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

  const handleComprarCotizacion = (cotizacion) => {
    setSelectedCotizacion(cotizacion);
    setShowModal(true);
  };

  const handleVerCotizacion = async (idCotizacion) => {
    try {
      // Obtener los detalles de la cotización del servidor
      const response = await fetch(
        `http://localhost:5000/api/detalles-cotizacion/${idCotizacion}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener los detalles de la cotización");
      }
      const detallesCotizacion = await response.json();

      // Crear un nuevo documento PDF
      const doc = new jsPDF();

      // Agregar contenido al PDF (por ejemplo, detalles de la cotización)
      doc.text(`Cotización ID: ${idCotizacion}`, 10, 10);
      // Más contenido...

      // Usar jsPDF-AutoTable para agregar una tabla con los productos
      doc.autoTable({
        head: [["Producto", "Cantidad", "Precio Unitario"]],
        body: detallesCotizacion.productos.map((producto) => [
          producto.nombreProducto, // Cambio realizado aquí
          producto.cantidad,
          `$${producto.precioUnitario}`,
        ]),
      });

      // Abrir el PDF en una nueva ventana o descargarlo
      doc.output("dataurlnewwindow"); // Para abrir en una nueva ventana
      //doc.save(`cotizacion-${idCotizacion}.pdf`); // Para descargar
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };

  const handleDescargarCotizacion = async (idCotizacion) => {
    try {
      // Obtener los detalles de la cotización del servidor
      const response = await fetch(
        `http://localhost:5000/api/detalles-cotizacion/${idCotizacion}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener los detalles de la cotización");
      }
      const detallesCotizacion = await response.json();

      // Crear un nuevo documento PDF
      const doc = new jsPDF();

      // Agregar contenido al PDF (por ejemplo, detalles de la cotización)
      doc.text(`Cotización ID: ${idCotizacion}`, 10, 10);
      // Más contenido...

      // Usar jsPDF-AutoTable para agregar una tabla con los productos
      doc.autoTable({
        head: [["Producto", "Cantidad", "Precio Unitario"]],
        body: detallesCotizacion.productos.map((producto) => [
          producto.nombreProducto, // Cambio realizado aquí
          producto.cantidad,
          `$${producto.precioUnitario}`,
        ]),
      });

      // Abrir el PDF en una nueva ventana o descargarlo
      //doc.output('dataurlnewwindow'); // Para abrir en una nueva ventana
      doc.save(`cotizacion-${idCotizacion}.pdf`); // Para descargar
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };

  /*  const handleComprarCotizacion = (idCotizacion) => {
    console.log("Comprar cotización:", idCotizacion);
    // Aquí puedes añadir la lógica para manejar la compra de la cotización
  };*/

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
          {showModal && (
            <ModalVenta
              cotizacion={selectedCotizacion}
              onClose={() => setShowModal(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialCotizaciones;
