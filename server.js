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
app.post("/login", (req, res) => {
  const { usuario, password } = req.body;
  db.query(
    "SELECT ID_Vendedor, Nombre FROM vendedor WHERE Nombre = ? AND pass = ?",
    [usuario, password],
    (err, results) => {
      if (err) {
        console.error("Error en el servidor:", err);
        return res.status(500).send("Error en el servidor");
      }
      if (results.length > 0) {
        // Devuelve solo la información necesaria del vendedor
        const vendedorData = {
          ID_Vendedor: results[0].ID_Vendedor,
          Nombre: results[0].Nombre,
          // Puedes añadir aquí otros campos que consideres necesarios
        };
        return res.status(200).json({ vendedor: vendedorData });
      } else {
        return res.status(401).send("Credenciales incorrectas");
      }
    }
  );
});

// Nuevo endpoint para obtener todos los productos
app.get("/api/productos", (req, res) => {
    const query = "SELECT ID_Producto, Nombre, Descripcion, Precio, ID_Categoria, Stock FROM producto";
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
  