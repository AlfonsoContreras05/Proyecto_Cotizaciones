const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// Configurar conexión a la base de datos PostgreSQL
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "admin",
  database: "sistemacotizaciones",
  port: 5432 // Puerto por defecto de PostgreSQL
});

// Iniciar el servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Endpoint para el inicio de sesión
app.post("/login", (req, res) => {
  const { usuario, password } = req.body;

  // Consulta la base de datos para validar las credenciales del vendedor
  pool.query(
    "SELECT ID_Vendedor, Nombre FROM vendedor WHERE Nombre = $1 AND pass = $2",
    [usuario, password],
    (err, results) => {
      if (err) {
        console.error("Error en el servidor:", err);
        return res.status(500).send("Error en el servidor");
      }

      const vendedorResults = results.rows;

      if (vendedorResults.length > 0) {
        // Las credenciales son del vendedor
        const vendedorData = {
          ID_Vendedor: vendedorResults[0].id_vendedor,
          Nombre: vendedorResults[0].nombre,
        };
        return res.status(200).json({ vendedor: vendedorData });
      } else {
        // Si las credenciales no son del vendedor, intenta con el administrador
        pool.query(
          "SELECT ID_Administrador, Nombre FROM administrador WHERE Nombre = $1 AND pass = $2",
          [usuario, password],
          (err, adminResults) => {
            if (err) {
              console.error("Error en el servidor:", err);
              return res.status(500).send("Error en el servidor");
            }

            const adminResultsRows = adminResults.rows;

            if (adminResultsRows.length > 0) {
              // Las credenciales son del administrador
              const adminData = {
                ID_Administrador: adminResultsRows[0].id_administrador,
                Nombre: adminResultsRows[0].nombre,
              };
              return res.status(200).json({ administrador: adminData });
            } else {
              // Credenciales incorrectas para vendedor y administrador
              return res.status(401).send("Credenciales incorrectas");
            }
          }
        );
      }
    }
  );
});

app.post("/login-adm", (req, res) => {
  const { usuario, password } = req.body;

  // Primero, verifica si el intento de inicio de sesión es para un administrador
  pool.query(
    "SELECT ID_Administrador, Nombre FROM administrador WHERE Nombre = $1 AND pass = $2",
    [usuario, password],
    (err, adminResults) => {
      if (err) {
        console.error("Error en el servidor:", err);
        return res.status(500).send("Error en el servidor");
      }

      const adminResultsRows = adminResults.rows;

      if (adminResultsRows.length > 0) {
        // Las credenciales son del administrador
        const adminData = {
          ID_Administrador: adminResultsRows[0].id_administrador,
          Nombre: adminResultsRows[0].nombre,
          // Otros campos necesarios para el administrador
        };
        return res.status(200).json({ administrador: adminData });
      } else {
        // Si las credenciales no son de administrador, envía un error
        return res
          .status(401)
          .send("Credenciales incorrectas para administrador");
      }
    }
  );
});


app.get("/api/productos", (req, res) => {
  const query = `
    SELECT 
      p.id_producto, 
      p.nombre, 
      p.descripcion, 
      p.precio, 
      p.id_categoria, 
      p.stock, 
      c.nombre AS "nombreCategoria", 
      i.url AS "imagenURL"
    FROM producto p
    JOIN categoria_producto c ON p.id_categoria = c.id_categoria
    LEFT JOIN imagenes i ON p.id_producto = i.id_producto;
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener productos:", err);
      return res.status(500).send("Error en el servidor");
    }
    res.json(results.rows);
  });
});




// Endpoint para guardar cotización
app.post("/api/guardar-cotizacion", async (req, res) => {
  const { cliente, productos, ID_Vendedor } = req.body;

  try {
    await pool.query('BEGIN');

    const vendedorExistente = await pool.query(
      "SELECT * FROM vendedor WHERE id_vendedor = $1", [ID_Vendedor]
    );
    if (vendedorExistente.rows.length === 0) {
      throw new Error("Vendedor no encontrado");
    }

    const clienteData = [
      cliente.nombre,
      cliente.apellido,
      cliente.rut,
      cliente.direccion,
      cliente.correo,
      cliente.celular,
    ];

    const clienteResult = await pool.query(
      "INSERT INTO cliente (nombre, apellido, rut, direccion, correo_electronico, telefono) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_cliente",
      clienteData
    );
    const clienteId = clienteResult.rows[0].id_cliente;

    let cotizacionData = [
      clienteId,
      new Date(),
      "Pendiente",
      isNaN(parseInt(ID_Vendedor)) ? null : parseInt(ID_Vendedor),
    ];

    const cotizacionResult = await pool.query(
      "INSERT INTO cotizacion (id_cliente, fecha_cotizacion, estado, id_vendedor) VALUES ($1, $2, $3, $4) RETURNING id_cotizacion",
      cotizacionData
    );
    const cotizacionId = cotizacionResult.rows[0].id_cotizacion;

    for (const producto of productos) {
      const detalle = [
        cotizacionId,
        producto.ID_Producto,
        producto.Cantidad,
        producto.Precio,
        cotizacionData[3], // ID_Vendedor
      ];
      await pool.query(
        "INSERT INTO detalle_venta (id_cotizacion, id_producto, cantidad, precio_unitario, id_vendedor) VALUES ($1, $2, $3, $4, $5)",
        detalle
      );
    }

    await pool.query('COMMIT');
    res
      .status(200)
      .send(`Cotización guardada con éxito. ID de Cotización: ${cotizacionId}`);
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error("Error al guardar la cotización:", error);
    res.status(500).send("Error al guardar la cotización");
  }
});

// Nuevo endpoint para obtener detalles de una cotización
app.get("/api/cotizaciones-vendedor/:idVendedor", async (req, res) => {
  const idVendedor = req.params.idVendedor;

  try {
    const query = `
      SELECT 
        c.id_cotizacion, 
        c.fecha_cotizacion, 
        c.estado,
        STRING_AGG(CAST(d.id_producto AS TEXT), ',') AS productos,
        SUM(d.precio_unitario * d.cantidad) AS total,
        EXTRACT(EPOCH FROM (NOW() - c.fecha_cotizacion)) / 3600 AS horas_transcurridas
      FROM 
        cotizacion c
      JOIN 
        detalle_venta d ON c.id_cotizacion = d.id_cotizacion
      WHERE 
        c.id_vendedor = $1 AND c.estado != 'Pagado'
      GROUP BY 
        c.id_cotizacion;
    `;

    const result = await pool.query(query, [idVendedor]);
    const cotizaciones = result.rows;

    const cotizacionesActualizadas = cotizaciones.map((cot) => {
      let estadoActualizado = cot.estado;
      if (cot.horas_transcurridas > 48) {
        estadoActualizado = "Expirado";
      } else if (cot.horas_transcurridas < 48 && cot.horas_transcurridas > 24) {
        estadoActualizado = "Caducará Pronto";
      } else if (cot.horas_transcurridas < 24) {
        estadoActualizado = "Nueva";
      }

      return {
        ...cot,
        productos: cot.productos.split(",").map(Number),
        total: parseFloat(cot.total),
        estado: estadoActualizado, // Actualiza el estado
      };
    });

    res.json(cotizacionesActualizadas);
  } catch (error) {
    console.error("Error al obtener cotizaciones del vendedor:", error);
    res.status(500).send("Error en el servidor");
  }
});


app.get("/api/ventas-vendedor/:idVendedor", async (req, res) => {
  const idVendedor = req.params.idVendedor;

  try {
    const query = `
      SELECT 
        TO_CHAR(c.fecha_cotizacion, 'YYYY-MM-DD') AS fecha,
        SUM(d.precio_unitario * d.cantidad) AS total_venta
      FROM 
        cotizacion c
      JOIN 
        detalle_venta d ON c.id_cotizacion = d.id_cotizacion
      WHERE 
        c.id_vendedor = $1
      GROUP BY 
        DATE(c.fecha_cotizacion);
    `;
    const result = await pool.query(query, [idVendedor]);
    const ventas = result.rows;

    res.json(ventas);
  } catch (error) {
    console.error("Error al obtener ventas del vendedor:", error);
    res.status(500).send("Error en el servidor");
  }
});


// Endpoint para obtener detalles de una cotización específica
app.get("/api/detalles-cotizacion/:idCotizacion", async (req, res) => {
  const idCotizacion = req.params.idCotizacion;

  try {
    const query = `
      SELECT 
        c.id_cotizacion, c.fecha_cotizacion, c.estado, 
        v.nombre AS nombre_vendedor, v.apellido AS apellido_vendedor,
        p.id_producto, p.nombre AS nombre_producto, p.descripcion, 
        d.cantidad, d.precio_unitario
      FROM 
        cotizacion c
      JOIN 
        detalle_venta d ON c.id_cotizacion = d.id_cotizacion
      JOIN 
        producto p ON d.id_producto = p.id_producto
      JOIN
        vendedor v ON c.id_vendedor = v.id_vendedor
      WHERE 
        c.id_cotizacion = $1;
    `;

    const result = await pool.query(query, [idCotizacion]);
    const detalles = result.rows;

    if (detalles.length > 0) {
      // Formatear los detalles para la respuesta
      const formattedDetails = detalles.map((item) => ({
        idProducto: item.id_producto,
        nombreProducto: item.nombre_producto,
        descripcion: item.descripcion,
        cantidad: item.cantidad,
        precioUnitario: item.precio_unitario,
        total: item.cantidad * item.precio_unitario,
      }));

      // Datos adicionales de la cotización
      const cotizacionInfo = {
        idCotizacion: detalles[0].id_cotizacion,
        fechaCotizacion: detalles[0].fecha_cotizacion,
        estado: detalles[0].estado,
        nombreVendedor: `${detalles[0].nombre_vendedor} ${detalles[0].apellido_vendedor}`,
      };

      res.json({ cotizacion: cotizacionInfo, productos: formattedDetails });
    } else {
      res.status(404).send("Cotización no encontrada");
    }
  } catch (error) {
    console.error("Error al obtener detalles de la cotización:", error);
    res.status(500).send("Error en el servidor");
  }
});


app.get("/api/productos-mas-cotizados/:idVendedor", async (req, res) => {
  const idVendedor = req.params.idVendedor;

  try {
    const query = `
      SELECT 
        p.nombre, 
        SUM(d.cantidad) as total_cotizado
      FROM 
        detalle_venta d
      JOIN 
        producto p ON d.id_producto = p.id_producto
      JOIN 
        cotizacion c ON d.id_cotizacion = c.id_cotizacion
      WHERE 
        c.id_vendedor = $1
      GROUP BY 
        p.id_producto
      ORDER BY 
        total_cotizado DESC
      LIMIT 5;
    `;

    const result = await pool.query(query, [idVendedor]);
    const productosMasCotizados = result.rows;
    res.json(productosMasCotizados);
  } catch (error) {
    console.error("Error al obtener los productos más cotizados:", error);
    res.status(500).send("Error en el servidor");
  }
});


app.get("/api/ventas-diarias", async (req, res) => {
  try {
    const query = `
      SELECT 
        COALESCE(SUM(d.precio_unitario * d.cantidad), 0) AS total_venta
      FROM 
        cotizacion c
      JOIN 
        detalle_venta d ON c.id_cotizacion = d.id_cotizacion
      WHERE 
        DATE(c.fecha_cotizacion) = CURRENT_DATE;
    `;

    const result = await pool.query(query);
    const ventasDiarias = result.rows[0].total_venta;
    res.json({ ventasDiarias });
  } catch (error) {
    console.error("Error al obtener ventas diarias:", error);
    res.status(500).send("Error en el servidor");
  }
});


// API para obtener las ventas mensuales
app.get("/api/ventas-mensuales", async (req, res) => {
  try {
    const query = `
      SELECT 
        COALESCE(SUM(d.precio_unitario * d.cantidad), 0) AS total_venta
      FROM 
        cotizacion c
      JOIN 
        detalle_venta d ON c.id_cotizacion = d.id_cotizacion
      WHERE 
        EXTRACT(MONTH FROM c.fecha_cotizacion) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM c.fecha_cotizacion) = EXTRACT(YEAR FROM CURRENT_DATE);
    `;

    const result = await pool.query(query);
    const ventasMensuales = result.rows[0].total_venta;
    res.json({ ventasMensuales });
  } catch (error) {
    console.error("Error al obtener ventas mensuales:", error);
    res.status(500).send("Error en el servidor");
  }
});

// API para obtener las ventas anuales
app.get("/api/ventas-anuales", async (req, res) => {
  try {
    const query = `
      SELECT 
        COALESCE(SUM(d.precio_unitario * d.cantidad), 0) AS total_venta
      FROM 
        cotizacion c
      JOIN 
        detalle_venta d ON c.id_cotizacion = d.id_cotizacion
      WHERE 
        EXTRACT(YEAR FROM c.fecha_cotizacion) = EXTRACT(YEAR FROM CURRENT_DATE);
    `;

    const result = await pool.query(query);
    const ventasAnuales = result.rows[0].total_venta;
    res.json({ ventasAnuales });
  } catch (error) {
    console.error("Error al obtener ventas anuales:", error);
    res.status(500).send("Error en el servidor");
  }
});


//crear usuario vendedor
app.post("/api/registerVendedor", async (req, res) => {
  const {
    nombre,
    apellido,
    correoElectronico,
    telefono,
    idSucursal,
    areaEspecializacion,
    pass,
  } = req.body;

  try {
    const query = `
      INSERT INTO vendedor (nombre, apellido, correo_electronico, telefono, id_sucursal, area_especializacion, pass) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id_vendedor;
    `;

    const result = await pool.query(query, [
      nombre,
      apellido,
      correoElectronico,
      telefono,
      idSucursal,
      areaEspecializacion,
      pass,
    ]);

    const nuevoVendedorId = result.rows[0].id_vendedor;
    res.status(201).json({ mensaje: "Vendedor registrado con éxito", id: nuevoVendedorId });
  } catch (err) {
    console.error("Error al insertar en la base de datos:", err);
    res.status(500).send("Error al registrar el vendedor");
  }
});


app.get("/api/sucursales", async (req, res) => {
  try {
    const query = "SELECT * FROM sucursal";
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Error al consultar la base de datos:", err);
    res.status(500).send("Error al obtener las sucursales");
  }
});

app.get("/api/vendedores-admin", async (req, res) => {
  try {
    const query = `
      SELECT 
        v.id_vendedor, 
        v.nombre, 
        v.apellido,
        v.correo_electronico,
        v.telefono,
        v.id_sucursal,
        v.area_especializacion,
        v.pass,
        COALESCE(SUM(dv.cantidad * dv.precio_unitario), 0) AS total_ventas
      FROM 
        vendedor v
      LEFT JOIN 
        cotizacion c ON v.id_vendedor = c.id_vendedor
      LEFT JOIN 
        detalle_venta dv ON c.id_cotizacion = dv.id_cotizacion
      GROUP BY 
        v.id_vendedor;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Error al consultar la base de datos:", err);
    res.status(500).send("Error al obtener los vendedores");
  }
});


// Endpoint para actualizar un vendedor
app.put("/api/vendedores/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    apellido,
    correoElectronico,
    telefono,
    idSucursal,
    areaEspecializacion,
    pass,
  } = req.body;

  try {
    const query = `
      UPDATE 
        vendedor 
      SET 
        nombre = $1, 
        apellido = $2, 
        correo_electronico = $3, 
        telefono = $4, 
        id_sucursal = $5, 
        area_especializacion = $6, 
        pass = $7
      WHERE 
        id_vendedor = $8;
    `;

    await pool.query(query, [
      nombre,
      apellido,
      correoElectronico,
      telefono,
      idSucursal,
      areaEspecializacion,
      pass,
      id,
    ]);

    res.status(200).send("Vendedor actualizado con éxito");
  } catch (err) {
    console.error("Error al actualizar el vendedor:", err);
    res.status(500).send("Error al actualizar el vendedor");
  }
});


app.delete("/api/vendedoresD/:id", async (req, res) => {
  const { id } = req.params;
  const { adminPassword } = req.body; 

  try {
    // Verificar la contraseña del administrador
    const adminQuery = "SELECT pass FROM administrador WHERE id_administrador = 1";
    const adminResult = await pool.query(adminQuery);

    if (adminResult.rows[0].pass !== adminPassword) {
      return res.status(401).send("Contraseña de administrador incorrecta");
    }

    const deleteQuery = "DELETE FROM vendedor WHERE id_vendedor = $1";
    const result = await pool.query(deleteQuery, [id]);

    if (result.rowCount === 0) {
      return res.status(404).send("Vendedor no encontrado");
    }

    res.status(200).send("Vendedor eliminado con éxito");
  } catch (err) {
    console.error("Error al eliminar el vendedor:", err);
    res.status(500).send("Error al eliminar el vendedor");
  }
});


// Endpoint para obtener todas las categorías
app.get("/api/categorias", async (req, res) => {
  const query = "SELECT * FROM categoria_producto";
  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).send("Error al obtener categorías");
  }
});


// Endpoint para crear una nueva categoría
app.post("/api/categorias", async (req, res) => {
  const { nombre, descripcion } = req.body;
  const query = "INSERT INTO categoria_producto (nombre, descripcion) VALUES ($1, $2)";
  try {
    await pool.query(query, [nombre, descripcion]);
    res.status(201).send("Categoría creada con éxito");
  } catch (error) {
    res.status(500).send("Error al crear categoría");
  }
});


// Endpoint para actualizar una categoría existente
app.put("/api/categorias/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  const query = "UPDATE categoria_producto SET nombre = $1, descripcion = $2 WHERE id_categoria = $3";
  try {
    await pool.query(query, [nombre, descripcion, id]);
    res.status(200).send("Categoría actualizada con éxito");
  } catch (error) {
    res.status(500).send("Error al actualizar categoría");
  }
});


// Endpoint para eliminar una categoría
app.delete("/api/categorias/:id", async (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM categoria_producto WHERE id_categoria = $1";
  try {
    const result = await pool.query(query, [id]);
    if (result.rowCount === 0) {
      return res.status(404).send("Categoría no encontrada");
    }
    res.status(200).send("Categoría eliminada con éxito");
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    res.status(500).send("Error al eliminar categoría");
  }
});


app.get("/api/ventas-por-vendedor/:anio", async (req, res) => {
  const anio = req.params.anio;
  try {
    const query = `
      SELECT 
        v.id_vendedor, 
        v.nombre, 
        EXTRACT(MONTH FROM c.fecha_cotizacion) as mes, 
        SUM(dv.cantidad * dv.precio_unitario) as total_ventas
      FROM 
        detalle_venta dv
      JOIN 
        cotizacion c ON dv.id_cotizacion = c.id_cotizacion
      JOIN 
        vendedor v ON c.id_vendedor = v.id_vendedor
      WHERE 
        EXTRACT(YEAR FROM c.fecha_cotizacion) = $1
      GROUP BY 
        v.id_vendedor, EXTRACT(MONTH FROM c.fecha_cotizacion)
      ORDER BY 
        v.id_vendedor, mes;
    `;

    const result = await pool.query(query, [anio]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener ventas por vendedor:", error);
    res.status(500).send("Error al obtener ventas por vendedor");
  }
});


app.get("/api/LCotizaciones", async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id_cotizacion, 
        c.fecha_cotizacion, 
        c.estado, 
        v.id_vendedor, 
        v.nombre AS nombre_vendedor, 
        v.apellido AS apellido_vendedor
      FROM 
        cotizacion c
      LEFT JOIN 
        vendedor v ON c.id_vendedor = v.id_vendedor;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener las cotizaciones:", error);
    res.status(500).send("Error en el servidor");
  }
});


// Obtener todos los productos
app.get("/api/products", async (req, res) => {
  try {
    const query = "SELECT * FROM producto";
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).send("Error al obtener productos");
  }
});


// Eliminar un producto
app.delete("/api/products/:id", async (req, res) => {
  try {
    const query = "DELETE FROM producto WHERE id_producto = $1";
    const result = await pool.query(query, [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).send("Producto no encontrado");
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Error al eliminar producto");
  }
});


app.post("/api/pagarCotizacion", async (req, res) => {
  const { idCotizacion, totalCotizacion, metodoPago } = req.body;
  
  try {
    // Iniciar transacción
    await pool.query('BEGIN');

    const cotizacionQuery = "SELECT * FROM cotizacion WHERE id_cotizacion = $1";
    const cotizacionRes = await pool.query(cotizacionQuery, [idCotizacion]);

    if (cotizacionRes.rows.length === 0) {
      throw new Error("Cotización no encontrada");
    }

    const cotizacion = cotizacionRes.rows[0];
    const sucursalQuery = "SELECT id_sucursal FROM vendedor WHERE id_vendedor = $1";
    const sucursalRes = await pool.query(sucursalQuery, [cotizacion.id_vendedor]);
    
    if (sucursalRes.rows.length === 0) {
      throw new Error("Sucursal no encontrada");
    }

    const idSucursal = sucursalRes.rows[0].id_sucursal;
    const fechaActual = new Date().toISOString().slice(0, 10);
    const insertTransaccion = "INSERT INTO transaccion (id_cliente, fecha, total, id_sucursal, metodo_pago, id_cotizacion) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_transaccion";

    const transaccionRes = await pool.query(insertTransaccion, [cotizacion.id_cliente, fechaActual, totalCotizacion, idSucursal, metodoPago, idCotizacion]);
    const idTransaccion = transaccionRes.rows[0].id_transaccion;

    const updateCotizacion = 'UPDATE cotizacion SET estado = $1 WHERE id_cotizacion = $2';
    await pool.query(updateCotizacion, ['Pagado', idCotizacion]);

    // Actualizar detalles y stock
    await actualizarDetallesYStock(idCotizacion, idTransaccion);

    // Finalizar transacción
    await pool.query('COMMIT');
    res.status(200).send(`Pago y actualización de detalles completados con éxito. ID de Transacción: ${idTransaccion}`);
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error("Error en la transacción:", error);
    res.status(500).send("Error en la transacción");
  }
});

async function actualizarDetallesYStock(idCotizacion, idTransaccion) {
  const detallesCotizacionQuery = "SELECT * FROM detalle_venta WHERE id_cotizacion = $1";
  const detalles = await pool.query(detallesCotizacionQuery, [idCotizacion]);

  for (const detalle of detalles.rows) {
    const updateDetalleVenta = "UPDATE detalle_venta SET id_transaccion = $1 WHERE id_detalle_venta = $2";
    await pool.query(updateDetalleVenta, [idTransaccion, detalle.id_detalle_venta]);

    const reduceStockQuery = "UPDATE producto SET stock = stock - $1 WHERE id_producto = $2";
    await pool.query(reduceStockQuery, [detalle.cantidad, detalle.id_producto]);
  }
}
  


app.get("/api/ventas-globales", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT EXTRACT(YEAR FROM fecha) AS year, SUM(precio_unitario * cantidad) AS totalsales
      FROM detalle_venta
      JOIN transaccion ON detalle_venta.id_transaccion = transaccion.id_transaccion
      WHERE fecha >= NOW() - INTERVAL '5 years'
      GROUP BY EXTRACT(YEAR FROM fecha)
      ORDER BY EXTRACT(YEAR FROM fecha);
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener ventas globales:", error);
    res.status(500).send("Error al obtener ventas globales");
  }
});


    
app.get("/api/ventas-anuales2", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT EXTRACT(YEAR FROM fecha) AS year, SUM(precio_unitario * cantidad) AS totalsales
      FROM detalle_venta
      JOIN transaccion ON detalle_venta.id_transaccion = transaccion.id_transaccion
      WHERE fecha >= NOW() - INTERVAL '5 years'
      GROUP BY EXTRACT(YEAR FROM fecha)
      ORDER BY EXTRACT(YEAR FROM fecha);
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener ventas anuales:", error);
    res.status(500).send("Error al obtener ventas anuales");
  }
});


app.get("/api/ventas-mensuales2", async (req, res) => {
  const year = new Date().getFullYear();
  try {
    const result = await pool.query(`
      SELECT EXTRACT(MONTH FROM fecha) AS month, SUM(precio_unitario * cantidad) AS totalsales
      FROM detalle_venta
      JOIN transaccion ON detalle_venta.id_transaccion = transaccion.id_transaccion
      WHERE EXTRACT(YEAR FROM fecha) = $1
      GROUP BY EXTRACT(MONTH FROM fecha);
    `, [year]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener ventas mensuales:", error);
    res.status(500).send("Error al obtener ventas mensuales");
  }
});



app.get("/api/top-productos", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT producto.nombre, SUM(cantidad) AS totalvendido
      FROM detalle_venta
      JOIN producto ON detalle_venta.id_producto = producto.id_producto
      JOIN transaccion ON detalle_venta.id_transaccion = transaccion.id_transaccion
      GROUP BY detalle_venta.id_producto
      ORDER BY totalvendido DESC
      LIMIT 10;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener top de productos:", error);
    res.status(500).send("Error al obtener top de productos");
  }
});



app.get("/api/ventas-por-sucursal", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT sucursal.ubicacion AS sucursal, SUM(transaccion.total) AS totalventas
      FROM transaccion
      JOIN sucursal ON transaccion.id_sucursal = sucursal.id_sucursal
      GROUP BY sucursal.ubicacion;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener ventas por sucursal:", error);
    res.status(500).send("Error al obtener ventas por sucursal");
  }
});
