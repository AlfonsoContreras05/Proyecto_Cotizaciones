import React, { useEffect, useState } from 'react';

const ComponenteProductos = () => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/productos');
                if (response.ok) {
                    const data = await response.json();
                    setProductos(data.map(producto => {
                        // Suponiendo que las tarjetas gráficas están en la categoría 3
                        if (producto.ID_Categoria === 3) {
                            // Aquí podrías asignar una URL de imagen específica basada en el nombre del producto
                            return { ...producto, ImagenURL: `../img/img-productos/tarjetagrafica/${producto.Nombre}.jpg` };
                        }
                        return producto;
                    }));
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
                        {producto.ImagenURL && <img src={producto.ImagenURL} alt={producto.Nombre} />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ComponenteProductos;
