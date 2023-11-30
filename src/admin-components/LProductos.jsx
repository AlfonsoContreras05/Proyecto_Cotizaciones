import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import NavBArAdm from "./navBarAmin";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "DELETE",
      });
      fetchProducts(); // Recargar la lista de productos
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.Nombre,
      sortable: true,
    },
    {
      name: "Descripcion",
      selector: (row) => row.Descripcion,
      sortable: true,
    },
    {
      name: "Precio",
      selector: (row) => row.Precio,
      sortable: true,
    },
    {
      name: "Stock",
      selector: (row) => row.Stock,
      sortable: true,
    },
    {
      name: "Acciones",
      button: true,
      cell: (row) => (
        <>
          <button
            onClick={() => {
              /* Código para abrir el formulario de edición */
            }}
          >
            Editar
          </button>
        </>
      ),
    },
    {
      name: "Acciones",
      button: true,
      cell: (row) => (
        <>
          <button onClick={() => deleteProduct(row.ID_Producto)}>
            Eliminar
          </button>
        </>
      ),
    },
  ];

  return (
    <div>
      <NavBArAdm />
      <DataTable
        title="Lista de Productos"
        columns={columns}
        data={products}
        pagination
        theme="dark"
            customStyles={{
              headRow: {
                style: {
                  backgroundColor: "#16191c",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#2c3038" },
                },
              },
              rows: {
                style: {
                  backgroundColor: "#282c34",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#2c3038" },
                },
              },
            }}
      />
    </div>
  );
};

export default ProductList;
