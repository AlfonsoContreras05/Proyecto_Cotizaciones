import React, { useState, useEffect } from 'react';

const ProductSelector = ({ onComponenteSeleccionado }) => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const respuesta = await fetch('http://localhost:5000/api/productos');
        if (!respuesta.ok) throw new Error('Error al cargar productos');
        const data = await respuesta.json();
        setProductos(data);
        const categoriasUnicas = [...new Set(data.map(p => p.Categoria))];
        setCategorias(categoriasUnicas);
      } catch (error) {
        console.error('Error al cargar los productos:', error);
      }
    };

    cargarProductos();
  }, []);

  const handleProductoSeleccionado = (productoId, categoria) => {
    const productoSeleccionado = productos.find(p => p.ID_Producto === parseInt(productoId) && p.Categoria === categoria);
    if (productoSeleccionado) {
      onComponenteSeleccionado(productoSeleccionado);
    }
  };

  return (
    <>
      {categorias.map(categoria => (
        <div key={categoria} className="col-md-6">
          <label htmlFor={`select${categoria}`} className="form-label">{categoria}</label>
          <select
            className="form-control bg-dark-x border-0 text-bg-dark"
            id={`select${categoria}`}
            onChange={(e) => handleProductoSeleccionado(e.target.value, categoria)}
          >
            <option value="">Seleccione...</option>
            {productos.filter(p => p.Categoria === categoria).map(producto => (
              <option key={producto.ID_Producto} value={producto.ID_Producto}>
                {producto.Nombre}
              </option>
            ))}
          </select>
        </div>
      ))}
    </>
  );
};

export default ProductSelector;
