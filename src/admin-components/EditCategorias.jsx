import React, { useState, useEffect } from 'react';
import NavBarAdmin from "./navBarAmin";
import DataTable from 'react-data-table-component';
import "../css/StyleHistorial.css";

function CategoriaManager() {
  const [categorias, setCategorias] = useState([]);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [nuevaCategoria, setNuevaCategoria] = useState({ Nombre: '', Descripcion: '' });

  useEffect(() => {
    const fetchCategorias = async () => {
      const response = await fetch('http://localhost:5000/api/categorias');
      const data = await response.json();
      setCategorias(data);
    };

    fetchCategorias();
  }, []);

  const handleChange = (e, categoria) => {
    const { name, value } = e.target;
    setCategoriaEditando({ ...categoria, [name]: value });
  };

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria({ ...nuevaCategoria, [name]: value });
  };

  const handleSave = async (categoria) => {
    const url = categoria.ID_Categoria
      ? `http://localhost:5000/api/categorias/${categoria.ID_Categoria}`
      : 'http://localhost:5000/api/categorias';
    const method = categoria.ID_Categoria ? 'PUT' : 'POST';

    await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoria),
    });

    recargarCategorias();
  };

  const handleDelete = async (idCategoria) => {
    if (window.confirm('¿Estás seguro de querer eliminar esta categoría?')) {
      await fetch(`http://localhost:5000/api/categorias/${idCategoria}`, {
        method: 'DELETE',
      });

      recargarCategorias();
    }
  };

  const recargarCategorias = async () => {
    const response = await fetch('http://localhost:5000/api/categorias');
    const data = await response.json();
    setCategorias(data);
    setCategoriaEditando(null);
    setNuevaCategoria({ Nombre: '', Descripcion: '' });
  };

  const columnas = [
    {
      name: 'Nombre',
      selector: row => row.Nombre,
      sortable: true,
    },
    {
      name: 'Descripción',
      selector: row => row.Descripcion,
      sortable: true,
    },
    {
      name: 'Acciones',
      cell: (row) => (
        <>
          {categoriaEditando?.ID_Categoria === row.ID_Categoria ? (
            <>
              <button onClick={() => handleSave(categoriaEditando)}>Guardar</button>
              <button onClick={() => setCategoriaEditando(null)}>Cancelar</button>
            </>
          ) : (
            <>
              <button onClick={() => setCategoriaEditando(row)}>Editar</button>
              <button onClick={() => handleDelete(row.ID_Categoria)}>Eliminar</button>
            </>
          )}
        </>
      )
    }
  ];

  const dataConInputs = categorias.map(categoria => {
    if (categoriaEditando?.ID_Categoria === categoria.ID_Categoria) {
      return {
        ...categoria,
        Nombre: (
          <input
            name="Nombre"
            value={categoriaEditando.Nombre}
            onChange={(e) => handleChange(e, categoriaEditando)}
          />
        ),
        Descripcion: (
          <input
            name="Descripcion"
            value={categoriaEditando.Descripcion}
            onChange={(e) => handleChange(e, categoriaEditando)}
          />
        )
      };
    }
    return categoria;
  });

  return (
    <div className='container mt-5 bg-dark-x'>
      <NavBarAdmin/>

      <div className='container mt-4 bg-dark-x'>
      <h2>Administrar Categorías</h2>
      </div>
      <DataTable
        columns={columnas}
        data={dataConInputs}
        pagination
        theme="dark"

        // Agrega aquí más propiedades de DataTable si lo necesitas
      />
      <div>
        <h3>Añadir nueva categoría</h3>
        <input
          name="Nombre"
          value={nuevaCategoria.Nombre}
          onChange={handleNewChange}
        />
        <input
          name="Descripcion"
          value={nuevaCategoria.Descripcion}
          onChange={handleNewChange}
        />
        <button onClick={() => handleSave(nuevaCategoria)}>Crear</button>
      </div>
    </div>
  );
}

export default CategoriaManager;
