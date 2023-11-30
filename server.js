const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Configuración de middleware
app.use(express.json());
app.use(cors());

// Configurar conexión a la base de datos
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sistemacotizaciones",
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) throw err;
  console.log("Conexión a la base de datos establecida");
});

// Iniciar el servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Endpoint para el inicio de sesión
app.post('/login', (req, res) => {
  const { usuario, password } = req.body;

  // Consulta la base de datos para validar las credenciales del vendedor
  db.query(
    'SELECT ID_Vendedor, Nombre FROM vendedor WHERE Nombre = ? AND pass = ?',
    [usuario, password],
    (err, vendedorResults) => {
      if (err) {
        console.error('Error en el servidor:', err);
        return res.status(500).send('Error en el servidor');
      }

      if (vendedorResults.length > 0) {
        // Las credenciales son del vendedor
        const vendedorData = {
          ID_Vendedor: vendedorResults[0].ID_Vendedor,
          Nombre: vendedorResults[0].Nombre,
          // Puedes añadir aquí otros campos que consideres necesarios para el vendedor
        };
        return res.status(200).json({ vendedor: vendedorData });
      } else {
        // Si las credenciales no son del vendedor, intenta con el administrador
        db.query(
          'SELECT ID_Administrador, Nombre FROM administrador WHERE Nombre = ? AND pass = ?',
          [usuario, password],
          (err, adminResults) => {
            if (err) {
              console.error('Error en el servidor:', err);
              return res.status(500).send('Error en el servidor');
            }

            if (adminResults.length > 0) {
              // Las credenciales son del administrador
              const adminData = {
                ID_Administrador: adminResults[0].ID_Administrador,
                Nombre: adminResults[0].Nombre,
                // Puedes añadir aquí otros campos que consideres necesarios para el administrador
              };
              return res.status(200).json({ administrador: adminData });
            } else {
              // Credenciales incorrectas para vendedor y administrador
              return res.status(401).send('Credenciales incorrectas');
            }
          }
        );
      }
    }
  );
});

app.post('/login-adm', (req, res) => {
  const { usuario, password } = req.body;

  // Primero, verifica si el intento de inicio de sesión es para un administrador
  db.query(
    'SELECT ID_Administrador, Nombre FROM administrador WHERE Nombre = ? AND pass = ?',
    [usuario, password],
    (err, adminResults) => {
      if (err) {
        console.error('Error en el servidor:', err);
        return res.status(500).send('Error en el servidor');
      }

      if (adminResults.length > 0) {
        // Las credenciales son del administrador
        const adminData = {
          ID_Administrador: adminResults[0].ID_Administrador,
          Nombre: adminResults[0].Nombre,
          // Otros campos necesarios para el administrador
        };
        return res.status(200).json({ administrador: adminData });
      } else {
        // Si las credenciales no son de administrador, envía un error
        return res.status(401).send('Credenciales incorrectas para administrador');
      }
    }
  );
});



// Nuevo endpoint para obtener todos los productos
app.get("/api/productos", (req, res) => {
    // Asegúrate de tener una tabla 'categoria' con una columna 'Nombre'
    const query = `
        SELECT p.ID_Producto, p.Nombre, p.Descripcion, p.Precio, p.ID_Categoria, p.Stock, c.Nombre AS NombreCategoria
        FROM producto p
        JOIN categoria_producto c ON p.ID_Categoria = c.ID_Categoria;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener productos:", err);
            return res.status(500).send("Error en el servidor");
        }
        res.json(results);
    });
});

  
// Endpoint para guardar cotización
app.post("/api/guardar-cotizacion", async (req, res) => {
    const { cliente, productos, ID_Vendedor } = req.body;
    console.log("ID Vendedor recibido:", ID_Vendedor);
  
    try {
        console.log("datos recibidos: ", req.body);
        console.log("ID Vendedor recibido:", ID_Vendedor);

      await db.promise().beginTransaction();
        
      const [vendedorExistente] = await db.promise().query('SELECT * FROM vendedor WHERE ID_Vendedor = ?', [ID_Vendedor]);
      if (vendedorExistente.length === 0) {
          throw new Error('Vendedor no encontrado');
      }
      

      const clienteData = {
        Nombre: cliente.nombre,
        Apellido: cliente.apellido,
        rut: cliente.rut,
        Direccion: cliente.direccion,
        Correo_Electronico: cliente.correo,
        Telefono: cliente.celular
      };
  
      const [clienteResult] = await db.promise().query("INSERT INTO cliente SET ?", clienteData);
      const clienteId = clienteResult.insertId;
  
      let cotizacionData = {
        ID_Cliente: clienteId,
        Fecha_Cotizacion: new Date(),
        Estado: "Pendiente"
      };
  
      if (!isNaN(parseInt(ID_Vendedor))) {
        cotizacionData.ID_Vendedor = parseInt(ID_Vendedor);
      } else {
        res.status(400).send("ID de vendedor no válido");
        await db.promise().rollback();
        return;
      }
  
      const [cotizacionResult] = await db.promise().query("INSERT INTO cotizacion SET ?", cotizacionData);
      const cotizacionId = cotizacionResult.insertId;
  
      for (const producto of productos) {
        const detalle = {
            ID_Cotizacion: cotizacionId,
            ID_Producto: producto.ID_Producto,
            Cantidad: producto.Cantidad,
            Precio_Unitario: producto.Precio
        };
        await db.promise().query("INSERT INTO detalle_venta SET ?", detalle);
    }
  
      await db.promise().commit();
      res.status(200).send(`Cotización guardada con éxito. ID de Cotización: ${cotizacionId}`);
    } catch (error) {
      await db.promise().rollback();
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
                c.ID_Cotizacion, 
                c.Fecha_Cotizacion, 
                c.Estado,
                GROUP_CONCAT(d.ID_Producto) AS Productos,
                SUM(d.Precio_Unitario * d.Cantidad) AS Total,
                TIMESTAMPDIFF(HOUR, c.Fecha_Cotizacion, NOW()) AS HorasTranscurridas
            FROM 
                cotizacion c
            JOIN 
                detalle_venta d ON c.ID_Cotizacion = d.ID_Cotizacion
            WHERE 
                c.ID_Vendedor = ?
            GROUP BY 
                c.ID_Cotizacion;
        `;

        const [cotizaciones] = await db.promise().query(query, [idVendedor]);

        const cotizacionesActualizadas = cotizaciones.map(cot => {
            let estadoActualizado = cot.Estado;
            if (cot.HorasTranscurridas > 48) {
                estadoActualizado = 'Expirado';
            } else if (cot.HorasTranscurridas < 48 && cot.HorasTranscurridas > 24) {
                estadoActualizado = 'Caducará Pronto';
            }else if (cot.HorasTranscurridas < 24){
              estadoActualizado = 'Nueva';
            }

            return {
                ...cot,
                productos: cot.Productos.split(',').map(Number),
                total: parseFloat(cot.Total),
                Estado: estadoActualizado // Actualiza el estado
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
              DATE_FORMAT(c.Fecha_Cotizacion, '%Y-%m-%d') AS Fecha,
              SUM(d.Precio_Unitario * d.Cantidad) AS TotalVenta
          FROM 
              cotizacion c
          JOIN 
              detalle_venta d ON c.ID_Cotizacion = d.ID_Cotizacion
          WHERE 
              c.ID_Vendedor = ?
          GROUP BY 
              DATE(c.Fecha_Cotizacion);
      `;
      const [ventas] = await db.promise().query(query, [idVendedor]);
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
        c.ID_Cotizacion, c.Fecha_Cotizacion, c.Estado, 
        v.Nombre as NombreVendedor, v.Apellido as ApellidoVendedor,
        p.ID_Producto, p.Nombre as NombreProducto, p.Descripcion, 
        d.Cantidad, d.Precio_Unitario
      FROM 
        cotizacion c
      JOIN 
        detalle_venta d ON c.ID_Cotizacion = d.ID_Cotizacion
      JOIN 
        producto p ON d.ID_Producto = p.ID_Producto
      JOIN
        vendedor v ON c.ID_Vendedor = v.ID_Vendedor
      WHERE 
        c.ID_Cotizacion = ?;
    `;

    const [detalles] = await db.promise().query(query, [idCotizacion]);

    if (detalles.length > 0) {
      // Formatear los detalles para la respuesta
      const formattedDetails = detalles.map(item => ({
        idProducto: item.ID_Producto,
        nombreProducto: item.NombreProducto,
        descripcion: item.Descripcion,
        cantidad: item.Cantidad,
        precioUnitario: item.Precio_Unitario,
        total: item.Cantidad * item.Precio_Unitario
      }));

      // Datos adicionales de la cotización
      const cotizacionInfo = {
        idCotizacion: detalles[0].ID_Cotizacion,
        fechaCotizacion: detalles[0].Fecha_Cotizacion,
        estado: detalles[0].Estado,
        nombreVendedor: `${detalles[0].NombreVendedor} ${detalles[0].ApellidoVendedor}`
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
              p.Nombre, 
              SUM(d.Cantidad) as TotalCotizado
          FROM 
              detalle_venta d
          JOIN 
              producto p ON d.ID_Producto = p.ID_Producto
          JOIN 
              cotizacion c ON d.ID_Cotizacion = c.ID_Cotizacion
          WHERE 
              c.ID_Vendedor = ?
          GROUP BY 
              p.ID_Producto
          ORDER BY 
              TotalCotizado DESC
          LIMIT 5;
      `;

      const [productosMasCotizados] = await db.promise().query(query, [idVendedor]);
      res.json(productosMasCotizados);
  } catch (error) {
      console.error("Error al obtener los productos más cotizados:", error);
      res.status(500).send("Error en el servidor");
  }
});



app.get("/api/ventas-diarias", async (req, res) => {
  try {
      const query = `
          SELECT SUM(d.Precio_Unitario * d.Cantidad) AS TotalVenta
          FROM cotizacion c
          JOIN detalle_venta d ON c.ID_Cotizacion = d.ID_Cotizacion
          WHERE DATE(c.Fecha_Cotizacion) = CURDATE();
      `;
      const [ventasDiarias] = await db.promise().query(query);
      res.json({ ventasDiarias: ventasDiarias[0].TotalVenta || 0 });
  } catch (error) {
      console.error("Error al obtener ventas diarias:", error);
      res.status(500).send("Error en el servidor");
  }
});

// API para obtener las ventas mensuales
app.get("/api/ventas-mensuales", async (req, res) => {
  try {
      const query = `
          SELECT SUM(d.Precio_Unitario * d.Cantidad) AS TotalVenta
          FROM cotizacion c
          JOIN detalle_venta d ON c.ID_Cotizacion = d.ID_Cotizacion
          WHERE MONTH(c.Fecha_Cotizacion) = MONTH(CURDATE())
          AND YEAR(c.Fecha_Cotizacion) = YEAR(CURDATE());
      `;
      const [ventasMensuales] = await db.promise().query(query);
      res.json({ ventasMensuales: ventasMensuales[0].TotalVenta || 0 });
  } catch (error) {
      console.error("Error al obtener ventas mensuales:", error);
      res.status(500).send("Error en el servidor");
  }
});


// API para obtener las ventas anuales
app.get("/api/ventas-anuales", async (req, res) => {
  try {
      const query = `
          SELECT SUM(d.Precio_Unitario * d.Cantidad) AS TotalVenta
          FROM cotizacion c
          JOIN detalle_venta d ON c.ID_Cotizacion = d.ID_Cotizacion
          WHERE YEAR(c.Fecha_Cotizacion) = YEAR(CURDATE());
      `;
      const [ventasAnuales] = await db.promise().query(query);
      res.json({ ventasAnuales: ventasAnuales[0].TotalVenta || 0 });
  } catch (error) {
      console.error("Error al obtener ventas anuales:", error);
      res.status(500).send("Error en el servidor");
  }
});


//crear usuario vendedor 
app.post('/api/registerVendedor', (req, res) => {
  const { nombre, apellido, correoElectronico, telefono, idSucursal, areaEspecializacion, pass } = req.body;

  const query = 'INSERT INTO vendedor (Nombre, Apellido, Correo_Electronico, Telefono, ID_Sucursal, Area_Especializacion, pass) VALUES (?, ?, ?, ?, ?, ?, ?)';

  db.query(query, [nombre, apellido, correoElectronico, telefono, idSucursal, areaEspecializacion, pass], (err, results) => {
    if (err) {
      console.error('Error al insertar en la base de datos:', err);
      return res.status(500).send('Error al registrar el vendedor');
    }

    res.status(201).send('Vendedor registrado con éxito');
  });
});


app.get('/api/sucursales', (req, res) => {
  const query = 'SELECT * FROM sucursal';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).send('Error al obtener las sucursales');
    }
    res.json(results);
  });
});


app.get('/api/vendedores-admin', (req, res) => {
  const query = `
    SELECT 
      v.ID_Vendedor, 
      v.Nombre, 
      v.Apellido,
      v.Correo_Electronico,
      v.Telefono,
      v.ID_Sucursal,
      v.Area_Especializacion,
      v.pass,
      SUM(dv.Cantidad * dv.Precio_Unitario) AS TotalVentas
    FROM vendedor v
    LEFT JOIN cotizacion c ON v.ID_Vendedor = c.ID_Vendedor
    LEFT JOIN detalle_venta dv ON c.ID_Cotizacion = dv.ID_Cotizacion
    GROUP BY v.ID_Vendedor;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).send('Error al obtener los vendedores');
    }
    res.json(results);
  });
});

// Endpoint para actualizar un vendedor
// Endpoint para actualizar un vendedor
app.put('/api/vendedores/:id', (req, res) => {
  console.log("Datos recibidos para actualizar:", req.body);
  const { id } = req.params;
  const { Nombre, Apellido, Correo_Electronico, Telefono, ID_Sucursal, Area_Especializacion, pass } = req.body;

  const query = `
    UPDATE vendedor 
    SET 
      Nombre = ?, 
      Apellido = ?, 
      Correo_Electronico = ?, 
      Telefono = ?, 
      ID_Sucursal = ?, 
      Area_Especializacion = ?, 
      pass = ?
    WHERE ID_Vendedor = ?;
  `;

  db.query(query, [Nombre, Apellido, Correo_Electronico, Telefono, ID_Sucursal, Area_Especializacion, pass, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar el vendedor:', err);
      return res.status(500).send('Error al actualizar el vendedor');
    }
    res.status(200).send('Vendedor actualizado con éxito');
  });
});


app.delete('/api/vendedoresD/:id', async (req, res) => {
  const { id } = req.params;
  const { adminPassword } = req.body; // Recibir la contraseña del administrador

  // Verificar la contraseña del administrador
  const adminQuery = 'SELECT pass FROM administrador WHERE ID_Administrador = 1'; // Ajustar según sea necesario
  const [admin] = await db.promise().query(adminQuery);

  if (admin[0].pass !== adminPassword) {
    return res.status(401).send('Contraseña de administrador incorrecta');
  }

  const deleteQuery = 'DELETE FROM vendedor WHERE ID_Vendedor = ?';

  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar el vendedor:', err);
      return res.status(500).send('Error al eliminar el vendedor');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Vendedor no encontrado');
    }
    res.status(200).send('Vendedor eliminado con éxito');
  });
});

// Endpoint para obtener todas las categorías
app.get('/api/categorias', async (req, res) => {
  const query = 'SELECT * FROM categoria_producto';
  try {
    const [categorias] = await db.promise().query(query);
    res.json(categorias);
  } catch (error) {
    res.status(500).send('Error al obtener categorías');
  }
});

// Endpoint para crear una nueva categoría
app.post('/api/categorias', async (req, res) => {
  const { Nombre, Descripcion } = req.body;
  const query = 'INSERT INTO categoria_producto (Nombre, Descripcion) VALUES (?, ?)';
  try {
    await db.promise().query(query, [Nombre, Descripcion]);
    res.status(201).send('Categoría creada con éxito');
  } catch (error) {
    res.status(500).send('Error al crear categoría');
  }
});

// Endpoint para actualizar una categoría existente
app.put('/api/categorias/:id', async (req, res) => {
  const { id } = req.params;
  const { Nombre, Descripcion } = req.body;
  const query = 'UPDATE categoria_producto SET Nombre = ?, Descripcion = ? WHERE ID_Categoria = ?';
  try {
    await db.promise().query(query, [Nombre, Descripcion, id]);
    res.status(200).send('Categoría actualizada con éxito');
  } catch (error) {
    res.status(500).send('Error al actualizar categoría');
  }
});

// Endpoint para eliminar una categoría
app.delete('/api/categorias/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM categoria_producto WHERE ID_Categoria = ?';

  try {
    const [result] = await db.promise().query(query, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).send('Categoría no encontrada');
    }
    res.status(200).send('Categoría eliminada con éxito');
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).send('Error al eliminar categoría');
  }
});

app.get('/api/LCotizaciones', async (req, res) => {
  try {
    const query = `
      SELECT 
        c.ID_Cotizacion, 
        c.Fecha_Cotizacion, 
        c.Estado, 
        v.ID_Vendedor, 
        v.Nombre as NombreVendedor, 
        v.Apellido as ApellidoVendedor
      FROM 
        cotizacion c
      LEFT JOIN 
        vendedor v ON c.ID_Vendedor = v.ID_Vendedor;
    `;
    const [cotizaciones] = await db.promise().query(query);
    res.json(cotizaciones);
  } catch (error) {
    console.error('Error al obtener las cotizaciones:', error);
    res.status(500).send('Error en el servidor');
  }
});
