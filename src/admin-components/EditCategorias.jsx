import React, { useState, useEffect } from 'react';
import NavBarAdmin from "./navBarAmin";

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

  const handleEdit = (categoria) => {
    setCategoriaEditando(categoria);
  };

  const handleSave = async (categoria) => {
    // Lógica para actualizar o crear una categoría
    const url = categoria.ID_Categoria
      ? `http://localhost:5000/api/categorias/${categoria.ID_Categoria}`
      : 'http://localhost:5000/api/categorias';
    const method = categoria.ID_Categoria ? 'PUT' : 'POST';

    await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoria),
    });

    // Recargar categorías
    const response = await fetch('http://localhost:5000/api/categorias');
    const data = await response.json();
    setCategorias(data);
    setCategoriaEditando(null);
    setNuevaCategoria({ Nombre: '', Descripcion: '' });
  };

  const handleChange = (e, categoria) => {
    const { name, value } = e.target;
    setCategoriaEditando({ ...categoria, [name]: value });
  };

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria({ ...nuevaCategoria, [name]: value });
  };

  return (
    <div>
      <h2>Administrar Categorías</h2>
      {categorias.map((categoria) => (
        <div key={categoria.ID_Categoria}>
          {categoriaEditando?.ID_Categoria === categoria.ID_Categoria ? (
            <div>
              <input
                name="Nombre"
                value={categoriaEditando.Nombre}
                onChange={(e) => handleChange(e, categoriaEditando)}
              />
              <input
                name="Descripcion"
                value={categoriaEditando.Descripcion}
                onChange={(e) => handleChange(e, categoriaEditando)}
              />
              <button onClick={() => handleSave(categoriaEditando)}>Guardar</button>
            </div>
          ) : (
            <div>
              <span>{categoria.Nombre}</span>
              <button onClick={() => handleEdit(categoria)}>Editar</button>
            </div>
          )}
        </div>
      ))}
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
