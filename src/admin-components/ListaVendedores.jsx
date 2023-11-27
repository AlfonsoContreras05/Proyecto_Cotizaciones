import React, { useState, useEffect } from 'react';

export function ListarVendedores() {
  const [vendedores, setVendedores] = useState([]);

  useEffect(() => {
    const obtenerVendedores = async () => {
      try {
        const respuesta = await fetch('http://localhost:5000/api/vendedores-admin');
        if (respuesta.ok) {
          const datos = await respuesta.json();
          setVendedores(datos);
        } else {
          console.error('Error al cargar vendedores:', respuesta);
        }
      } catch (error) {
        console.error('Error al conectar con el servidor:', error);
      }
    };
    obtenerVendedores();
  }, []);

  return (
    <div className="container mt-3">
    <h2>Listado de Vendedores</h2>
    <table className="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Sucursal</th>
          {/* Otras columnas aquí */}
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {vendedores.map((vendedor) => (
          <tr key={vendedor.ID_Vendedor}>
            <td>{vendedor.ID_Vendedor}</td>
            <td>{vendedor.Nombre}</td>
            <td>{vendedor.Sucursal}</td>
            {/* Mostrar otras informaciones aquí */}
            <td>
              {/* Botones de acción */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
}

export default ListarVendedores;
