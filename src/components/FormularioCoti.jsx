import React, { useState, useEffect } from "react";

import "../css/StyleMenu.css";
import NavbarComponent from "./NavbarComponent";

const FormularioCotizacion = () => {
  const [placasMadre, setPlacasMadre] = useState([]);
  const [selectedPlacaMadre, setSelectedPlacaMadre] = useState("");
  const [marca, setMarca] = useState("");
  const [procesadores, setProcesadores] = useState([]);
  const [selectedprocesadores, setSelectedProcesadores] = useState([]);
  const [Grafica, setGrafica] = useState([]);
  const [selectedGrafica, setSelectedGrafica] = useState([]);
  const [Fuente, setFuente] = useState([]);
  const [selectedFuente, setSelectedFuente] = useState([]);
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [rut, setRut] = useState("");
  const [direccion, setDireccion] = useState("");
  const [correo, setCorreo] = useState("");
  const [celular, setCelular] = useState("");

  const [componentesSeleccionados, setComponentesSeleccionados] = useState([]);

  const totalPrecio = componentesSeleccionados.reduce((total, componente) => {
    return total + parseFloat(componente.Precio);
}, 0);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Manejo del envío del formulario
    await guardarCotizacion();
  };

  useEffect(() => {
    const cargarPlacasMadre = async () => {
      try {
        const respuesta = await fetch("http://localhost:5000/api/placas-madre");
        if (!respuesta.ok) {
          throw new Error("Respuesta del servidor no fue OK");
        }
        const placas = await respuesta.json();
        setPlacasMadre(placas);
      } catch (error) {
        console.error("Error al cargar las placas madre:", error);
      }
    };

    const cargarProcesadores = async () => {
      try {
          const respuesta = await fetch('http://localhost:5000/api/procesador');
          if (!respuesta.ok) {
              throw new Error('Respuesta del servidor no fue OK');
          }
          const procs = await respuesta.json();
          setProcesadores(procs);
      } catch (error) {
          console.error('Error al cargar los procesadores:', error);
      }
    };

    const cargarGrafica = async () => {
      try {
          const respuesta = await fetch('http://localhost:5000/api/tarjeta-grafica');
          if (!respuesta.ok) {
              throw new Error('Respuesta del servidor no fue OK');
          }
          const procs = await respuesta.json();
          setGrafica(procs);
      } catch (error) {
          console.error('Error al cargar los procesadores:', error);
      }
    };
  
    
    const cargarFuente = async () => {
      try {
          const respuesta = await fetch('http://localhost:5000/api/Fuente');
          if (!respuesta.ok) {
              throw new Error('Respuesta del servidor no fue OK');
          }
          const procs = await respuesta.json();
          setFuente(procs);
      } catch (error) {
          console.error('Error al cargar los procesadores:', error);
      }
    };
    cargarPlacasMadre();
    cargarProcesadores();
    cargarGrafica();
    cargarFuente();
  }, []);

  const handlePlacaMadreChange = (event) => {
    const selectedValue = parseInt(event.target.value);
    setSelectedPlacaMadre(selectedValue);
    const placaSeleccionada = placasMadre.find(placa => placa.ID_Producto === selectedValue);
    if (placaSeleccionada) {
        setComponentesSeleccionados(prev => [...prev, placaSeleccionada]);
    }
};


  const handleProcesadoresChange = (event) => {
    const selectedValue = parseInt(event.target.value);
    setSelectedProcesadores(selectedValue);
    const proceSeleccionada = procesadores.find(proce => proce.ID_Producto === selectedValue);
    if (proceSeleccionada) {
        setComponentesSeleccionados(prev => [...prev, proceSeleccionada]);
    }
};

  const handleGraficaChange = (event) => {
    const selectedValue = parseInt(event.target.value);
    setSelectedGrafica(selectedValue);
    const GraficaSeleccionada = Grafica.find(graf => graf.ID_Producto === selectedValue);
    if (GraficaSeleccionada) {
        setComponentesSeleccionados(prev => [...prev, GraficaSeleccionada]);
    }
};
  const handleFuenteChange = (event) => {
    const selectedValue = parseInt(event.target.value);
    setSelectedFuente(selectedValue);
    const FuenteSeleccionada = Fuente.find(fuent => fuent.ID_Producto === selectedValue);
    if (FuenteSeleccionada) {
        setComponentesSeleccionados(prev => [...prev, FuenteSeleccionada]);
    }
};
const guardarCotizacion = async () => {
  const clienteData = { nombre, apellido, rut, direccion, correo, celular }; // Ajustar según los campos de tu formulario
  const productosSeleccionadosData = componentesSeleccionados.map(producto => ({ ID_Producto: producto.ID_Producto, Cantidad: 1, Precio: producto.Precio })); // Ajustar según sea necesario

  try {
      const response = await fetch('http://localhost:5000/api/guardar-cotizacion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cliente: clienteData, productos: productosSeleccionadosData })
      });
      if (response.ok) {
          // Manejar éxito, mostrar mensaje o redirigir
      } else {
          // Manejar error, mostrar mensaje
      }
  } catch (error) {
      console.error('Error al guardar la cotización:', error);
  }
};

  return (
    <div className="bg-black">
      <NavbarComponent />

      <div className="container">
        <form className="row g-3 mt-4" onSubmit={handleSubmit}>
          <h1 className="mt-5">Datos del Cliente</h1>
          {/* Campos del formulario */}
          <div className="col-md-6">
            <label htmlFor="inputNombre" className="form-label">
              Nombre
            </label>
            <input
              type="text"
              className="form-control bg-dark-x border-0 text-bg-dark"
              id="inputNombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="inputNombre" className="form-label">
              Apellido
            </label>
            <input
              type="text"
              className="form-control bg-dark-x border-0 text-bg-dark"
              id="inputNombre"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="inputNombre" className="form-label">
              Rut
            </label>
            <input
              type="text"
              className="form-control bg-dark-x border-0 text-bg-dark"
              id="inputNombre"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="inputNombre" className="form-label">
              Direccion
            </label>
            <input
              type="text"
              className="form-control bg-dark-x border-0 text-bg-dark"
              id="inputNombre"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="inputNombre" className="form-label">
              Correo
            </label>
            <input
              type="text"
              className="form-control bg-dark-x border-0 text-bg-dark"
              id="inputNombre"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="inputNombre" className="form-label">
              Celular
            </label>
            <input
              type="text"
              className="form-control bg-dark-x border-0 text-bg-dark"
              id="inputNombre"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
            />
          </div>
          <h1 className="mt-5">Selecciona Tus Componentes</h1>
          {/* Campos del formulario */}
          <div className="col-md-6">
            <label htmlFor="inputMarca" className="form-label">
              Arquitectura
            </label>
            <select
              className="form-control bg-dark-x border-0 text-bg-dark"
              id="inputMarca"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
            >
              <option value="">Seleccione...</option>
              <option value="Intel">Intel</option>
              <option value="AMD">AMD</option>
              {/* Agrega aquí más opciones si lo necesitas */}
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="inputPlacaMadre" className="form-label">
              Placa Madre
            </label>
            <select
              className="form-control bg-dark-x border-0 text-bg-dark"
              id="inputPlacaMadre"
              value={selectedPlacaMadre}
              onChange={handlePlacaMadreChange}
            >
              <option value="">Seleccione...</option>
              {placasMadre.map((placa) => (
                <option key={placa.ID_Producto} value={placa.ID_Producto}>
                  {placa.Nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="inputProcesadores" className="form-label">
              Procesadores
            </label>
            <select
              className="form-control bg-dark-x border-0 text-bg-dark"
              id="inputProcesadores"
              value={selectedprocesadores}
              onChange={handleProcesadoresChange}
            >
              <option value="">Seleccione...</option>
              {procesadores.map((placa) => (
                <option key={placa.ID_Producto} value={placa.ID_Producto}>
                  {placa.Nombre}
                </option>
              ))}
            </select>
          </div>


          <div className="col-md-6">
            <label htmlFor="inputGrafica" className="form-label">
              Tarjeta Grafica
            </label>
            <select
              className="form-control bg-dark-x border-0 text-bg-dark"
              id="inputGrafica"
              value={selectedGrafica}
              onChange={handleGraficaChange}
            >
              <option value="">Seleccione...</option>
              {Grafica.map((placa) => (
                <option key={placa.ID_Producto} value={placa.ID_Producto}>
                  {placa.Nombre}
                </option>
              ))}
            </select>
          </div>


          <div className="col-md-6">
            <label htmlFor="inputFuente" className="form-label">
              Fuente De Poder
            </label>
            <select
              className="form-control bg-dark-x border-0 text-bg-dark"
              id="inputFuente"
              value={selectedFuente}
              onChange={handleFuenteChange}
            >
              <option value="">Seleccione...</option>
              {Fuente.map((placa) => (
                <option key={placa.ID_Producto} value={placa.ID_Producto}>
                  {placa.Nombre}
                </option>
              ))}
            </select>
          </div>

          <h2>Componentes Seleccionados</h2>
      <table className="table table-dark table-striped">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Stock</th>
                    <th>Unidades</th>
                    <th>Precio</th>

                </tr>
            </thead>
            <tbody>
                {componentesSeleccionados.map((componente, index) => (
                    <tr key={index}>
                        <td>{componente.Nombre}</td>
                        <td>{componente.Descripcion}</td>
                        <td>1</td>
                        <td>${componente.Precio}</td>

                    </tr>
                ))}
                {/* Fila para mostrar el total */}
                <tr>
                    <td colSpan="3"><strong>Total</strong></td>
                    <td>${totalPrecio.toFixed(0)}</td>
                </tr>
            </tbody>
        </table>

        
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-outline-light mx-2 mb-5">
              Agregar
            </button>
            <button type="submit" className="btn btn-outline-light mr-2 mb-5">
              Crear Cotizacion
            </button>

            <button type="submit" className="btn btn-outline-light mx-2 mb-5">
              Cancelar
            </button>
          </div>
       

          {/* Continúa agregando más campos de formulario aquí */}
         
        </form>
      </div>



      {/* Repetir para los demás campos, asegurándote de que los ID sean únicos */}
      {/* Más campos del formulario */}

    </div>
    
  );
};

export default FormularioCotizacion;
