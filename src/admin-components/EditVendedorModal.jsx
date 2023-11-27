import React, { useState, useEffect } from "react";

const EditVendedorModal = ({ vendedor, onClose, onSave }) => {
  const [nombre, setNombre] = useState(vendedor.Nombre);
  const [apellido, setApellido] = useState(vendedor.Apellido);
  const [Correo_Electronico, setCorreoElectronico] = useState(
    vendedor.Correo_Electronico
  );
  const [Telefono, setTelefono] = useState(vendedor.Telefono);
  // Añade más campos según sea necesario...
  const [sucursales, setSucursales] = useState([]);
  const [idSucursal, setIdSucursal] = useState(vendedor.ID_Sucursal || "");
  const [Area_Especializacion, setAreaEspecializacion] = useState(
    vendedor.Area_Especializacion
  );
  const [pass, setPass] = useState(vendedor.pass);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Crear un objeto con los datos actualizados del vendedor
    const updatedVendedor = {
      ...vendedor,
      Nombre: nombre,
      Apellido: apellido,
      Correo_Electronico: Correo_Electronico,
      Telefono: Telefono,
      ID_Sucursal: idSucursal,
      Area_Especializacion: Area_Especializacion,
      pass: pass,
    };
  
    // Imprimir los datos actualizados para depuración
    console.log("Datos a enviar:", updatedVendedor);
  
    // Llamar a la función onSave pasándole los datos actualizados
    onSave(updatedVendedor);
  };
  


  

  useEffect(() => {
    const cargarSucursales = async () => {
      try {
        const respuesta = await fetch('http://localhost:5000/api/sucursales');
        if (respuesta.ok) {
          const datosSucursales = await respuesta.json();
          setSucursales(datosSucursales);
        } else {
          console.error('Error al cargar sucursales:', respuesta);
        }
      } catch (error) {
        console.error('Error al conectar con el servidor:', error);
      }
    };

    cargarSucursales();
  }, []);

  return (
    <div className="modal show" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Vendedor</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Apellido</label>
                <input
                  type="text"
                  className="form-control"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Mail</label>
                <input
                  type="text"
                  className="form-control"
                  value={Correo_Electronico}
                  onChange={(e) => setCorreoElectronico(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Telefono</label>
                <input
                  type="text"
                  className="form-control"
                  value={Telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
              <div className="form-group">
  <label>Sucursal</label>
  {sucursales.length > 0 ? (
    <select 
      className="form-control" 
      value={idSucursal} 
      onChange={(e) => setIdSucursal(e.target.value)}
    >
      {sucursales.map((sucursal) => (
        <option key={sucursal.ID_Sucursal} value={sucursal.ID_Sucursal}>
          {sucursal.Ubicacion}
        </option>
      ))}
    </select>
  ) : (
    <p>Cargando sucursales...</p>
  )}
</div>

              
              <div className="form-group">
                <label>Direccion</label>
                <input
                  type="text"
                  className="form-control"
                  value={Area_Especializacion}
                  onChange={(e) => setAreaEspecializacion(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="text"
                  className="form-control"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
              </div>
              {/* Agrega más campos aquí... */}
              <button type="submit" className="btn btn-success">
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditVendedorModal;
