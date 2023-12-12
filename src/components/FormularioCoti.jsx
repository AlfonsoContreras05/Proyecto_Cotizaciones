import React, { useState, useCallback, useEffect } from "react";
import NavbarComponent from "./NavbarComponent";
import ProductSelector from "./ProductSelector";
import ClientDetailsForm from "./ClientDetailsForm";
import { Tooltip } from "react-tooltip"; // Importar Tooltip/ Importar ReactTooltip
import "../css/StyleForm.css";

import "../css/StyleForm.css";

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
  //const [tooltipContent, setTooltipContent] = useState("");
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" }); // Estado para manejar el mensaje

  useEffect(() => {
    if (mensaje.texto) {
      const timer = setTimeout(() => {
        setMensaje({ texto: "", tipo: "" });
      }, 2000); // 2000 milisegundos = 2 segundos

      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const handleClientChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleComponenteSeleccionado = useCallback(
    (nuevoComponente) => {
      // Evitar duplicados
      if (
        !componentesSeleccionados.find(
          (c) => c.ID_Producto === nuevoComponente.ID_Producto
        )
      ) {
        setComponentesSeleccionados((prev) => [...prev, nuevoComponente]);
      }
    },
    [componentesSeleccionados]
  );

  const totalPrecio = componentesSeleccionados.reduce((total, componente) => {
    return total + componente.Precio * (componente.Cantidad || 1);
  }, 0);

  const handleEliminarComponente = (idProducto) => {
    setComponentesSeleccionados(
      componentesSeleccionados.filter(
        (componente) => componente.ID_Producto !== idProducto
      )
    );
  };

  const handleCambiarCantidad = (idProducto, nuevaCantidad) => {
    setComponentesSeleccionados(
      componentesSeleccionados.map((componente) => {
        if (componente.ID_Producto === idProducto) {
          return {
            ...componente,
            Cantidad: Math.max(0, Math.min(nuevaCantidad, componente.Stock)),
          };
        }
        return componente;
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const idVendedor = localStorage.getItem("idVendedor");

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
            ID_Vendedor: Number(idVendedor),
          }),
        }
      );
      if (!response.ok) throw new Error("Error al guardar la cotización");

      setMensaje({ texto: "Cotización creada exitosamente", tipo: "success" });
      // Resetear el formulario
      setCliente({
        nombre: "",
        apellido: "",
        rut: "",
        direccion: "",
        correo: "",
        celular: "",
      });
      setComponentesSeleccionados([]);
    } catch (error) {
      console.error("Error al guardar la cotización:", error);
      setMensaje({ texto: "Error al crear la cotización", tipo: "danger" });
    }
  };

  return (
    <div className="BD">
      <div className="bg-black">
        <NavbarComponent />
        <div className="container m-auto d-flex align-items-center justify-content-center">
          {/* Mostrar mensaje de éxito o error */}

          <form className="row g-3 mt-4" onSubmit={handleSubmit}>
            <h1 className="mt-5 text-center">Datos del Cliente</h1>
            <ClientDetailsForm
              cliente={cliente}
              onChange={handleClientChange}
            />

            <h1 className="mt-5 text-center">Selecciona Tus Componentes</h1>
            <ProductSelector
              onComponenteSeleccionado={handleComponenteSeleccionado}
            />
            {mensaje.texto && (
              <div
                className={`alert alert-${mensaje.tipo} mt-3 fade show text-center`}
                role="alert"
              >
                {mensaje.texto}
              </div>
            )}
            <h2>Componentes Seleccionados</h2>
            <table className="table table-dark table-striped">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Descripción</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {componentesSeleccionados.map((componente, index) => (
                  <tr key={`componente-${componente.ID_Producto}-${index}`}>
                    <td data-tip data-for={`tooltip-${componente.ID_Producto}`}>
                      {componente.Nombre}
                      <Tooltip
                        id={`tooltip-${componente.ID_Producto}`}
                        effect="solid"
                      >
                        {/* Asegurarse de que la ruta de la imagen sea la correcta */}
                        <img
                          src={`/img-productos/tarjetagrafica/${componente.ImagenURL}`}
                          alt={componente.Nombre}
                          style={{ maxWidth: "150px" }}
                        />
                      </Tooltip>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={componente.Cantidad || 1}
                        onChange={(e) =>
                          handleCambiarCantidad(
                            componente.ID_Producto,
                            parseInt(e.target.value)
                          )
                        }
                        min="1"
                        max={componente.Stock}
                      />
                    </td>
                    <td>$ {componente.Precio.toFixed(0)}</td>
                    <td>{componente.Descripcion}</td>
                    <td>
                      <button
                        onClick={() =>
                          handleEliminarComponente(componente.ID_Producto)
                        }
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "30px",
                          height: "30px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "20px",
                          cursor: "pointer",
                        }}
                      >
                        &times;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Tooltip />
            <h2>
              Total:{" "}
              {totalPrecio.toLocaleString("es-CL", {
                style: "currency",
                currency: "CLP",
              })}
            </h2>

            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-outline-light mx-2 mb-5">
                Crear Cotización
              </button>
              <button
                type="button"
                className="btn btn-outline-light mx-2 mb-5"
                onClick={() => {
                  setComponentesSeleccionados([]); // Limpiar la selección
                  setCliente({
                    nombre: "",
                    apellido: "",
                    rut: "",
                    direccion: "",
                    correo: "",
                    celular: "",
                  }); // Resetear datos del cliente
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormularioCotizacion;
