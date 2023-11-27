import React, { useState, useEffect } from 'react';
import NavBArAdm from './navBarAmin';
import DataTable from 'react-data-table-component';
import '../css/ListarVenedores.css'; // Asegúrate de tener este archivo CSS

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

  const columnas = [
    {
      name: 'ID',
      selector: row => row.ID_Vendedor,
    },
    {
      name: 'Nombre',
      selector: row => row.Nombre,
    },
    {
      name: 'Apellido',
      selector: row => row.Apellido,
    },
    {
      name: 'Correo Electrónico',
      selector: row => row.Correo_Electronico,
    },
    {
      name: 'Teléfono',
      selector: row => row.Telefono,
    },
    {
      name: 'Sucursal',
      // Asegúrate de que los datos de la sucursal se pueden mapear correctamente
      selector: row => `Sucursal ${row.ID_Sucursal}`, 
    },
    {
      name: 'Direccion',
      selector: row => row.Area_Especializacion,
    },
    {
      name: 'Contraseña',
      selector: row => '***',
    },
    {
      name: 'Acciones',
      button: true,
      cell: row => (
        <div>
          <button className="btn btn-primary btn-custom">Editar</button>
          <button className="btn btn-danger btn-custom">Eliminar</button>
          <button className="btn btn-success btn-custom">Aprobar</button>
        </div>
      )
    }
  ];
  

  return (
    <div>
      <NavBArAdm/>
      <div className="container mt-3">
        <h2>Listado de Vendedores</h2>
        <DataTable
          columns={columnas}
          data={vendedores}
          // Agrega aquí más propiedades según necesites
        />
      </div>
    </div>
  );
}

export default ListarVendedores;
