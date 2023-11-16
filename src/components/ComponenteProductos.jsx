// Dentro de ComponenteProductos.jsx
import React, { useEffect, useState } from 'react';

const ComponenteProductos = () => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/productos');
                if (response.ok) {
                    const data = await response.json();
                    setProductos(data);
                }
            } catch (error) {
                console.error('Error al cargar los productos:', error);
            }
        };
        cargarProductos();
    }, []);

    return (
        <div>
            <h2>Productos</h2>
            <div>
                {productos.map((producto) => (
                    <div key={producto.ID_Producto}>
                        <h3>{producto.Nombre}</h3>
                        <p>{producto.Descripcion}</p>
                        <p>Precio: ${producto.Precio}</p>
                        <p>Stock: {producto.Stock}</p>
                        {/* Más información del producto que quieras mostrar */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ComponenteProductos;
