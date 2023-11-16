const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Configuración de middleware
app.use(express.json());
app.use(cors());

// Configurar conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost', // O la IP de tu servidor MySQL
    user: 'root', // Tu usuario de la base de datos
    password: '', // Tu contraseña de la base de datos
    database: 'sistemacotizaciones' // Nombre de tu base de datos
});

// Conectar a la base de datos
db.connect(err => {
    if (err) throw err;
    console.log('Conexión a la base de datos establecida');
});

// Iniciar el servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Endpoint para el inicio de sesión
app.post('/login', (req, res) => {
    const { usuario, password } = req.body;
    db.query('SELECT * FROM vendedor WHERE Nombre = ? AND pass = ?', [usuario, password], (err, results) => {
        if (err) {
            return res.status(500).send('Error en el servidor');
        }
        if (results.length > 0) {
            return res.status(200).send('Inicio de sesión exitoso');
        } else {
            return res.status(401).send('Credenciales incorrectas');
        }
    });
});

// Nuevo endpoint para obtener los productos
app.get('/api/placas-madre', (req, res) => {
    const query = `
        SELECT pm.* 
        FROM producto pm
        JOIN producto p ON pm.ID_Producto = p.ID_Producto
        WHERE p.ID_Categoria = 1
    `;
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error en el servidor');
        } else {
            res.json(results);
        }
    });
});

app.get('/api/procesador', (req, res) => {
    const query = `
        SELECT pm.* 
        FROM producto pm
        JOIN producto p ON pm.ID_Producto = p.ID_Producto
        WHERE p.ID_Categoria = 2
    `;
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error en el servidor');
        } else {
            res.json(results);
        }
    });
});

app.get('/api/tarjeta-grafica', (req, res) => {
    const query = `
        SELECT pm.* 
        FROM producto pm
        JOIN producto p ON pm.ID_Producto = p.ID_Producto
        WHERE p.ID_Categoria = 3
    `;
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error en el servidor');
        } else {
            res.json(results);
        }
    });
});

app.get('/api/Fuente', (req, res) => {
    const query = `
        SELECT pm.* 
        FROM producto pm
        JOIN producto p ON pm.ID_Producto = p.ID_Producto
        WHERE p.ID_Categoria = 4
    `;
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error en el servidor');
        } else {
            res.json(results);
        }
    });
});


app.post('/api/guardar-cotizacion', async (req, res) => {
    const { cliente, productos } = req.body; // datos del cliente y productos seleccionados
    try {
        // Iniciar transacción
        await db.promise().beginTransaction();

        // Insertar cliente (ajusta según sea necesario)
        const [clienteResult] = await db.promise().query('INSERT INTO cliente SET ?', cliente);
        const clienteId = clienteResult.insertId;

        // Insertar cotización
        const cotizacion = { ID_Cliente: clienteId, Fecha_Cotizacion: new Date(), Estado: 'Pendiente' };
        const [cotizacionResult] = await db.promise().query('INSERT INTO cotizacion SET ?', cotizacion);
        const cotizacionId = cotizacionResult.insertId;

        // Insertar detalles de la cotización
        for (const producto of productos) {
            const detalle = { ID_Cotizacion: cotizacionId, ID_Producto: producto.ID_Producto, Cantidad: producto.Cantidad, Precio_Unitario: producto.Precio };
            await db.promise().query('INSERT INTO detalle_venta SET ?', detalle);
        }

        // Confirmar transacción
        await db.promise().commit();

        res.status(200).send('Cotización guardada con éxito');
    } catch (error) {
        // Revertir cambios en caso de error
        await db.promise().rollback();
        res.status(500).send('Error al guardar la cotización');
    }
});

