const express = require('express');
const mysql = require('mysql2');
const app = express();

// Permitir a Express entender JSON
app.use(express.json());

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

app.get('/', (req, res) => {
    res.send('Hola Mundo');
});

const cors = require('cors');
app.use(cors());


app.post('/login', (req, res) => {
    const { usuario, password } = req.body;

    // Aquí deberías verificar las credenciales con tu base de datos
    // Por ejemplo, una consulta SQL para buscar el usuario y verificar la contraseña

    db.query('SELECT * FROM vendedor WHERE Nombre = ? AND pass = ?', [usuario, password], (err, results) => {
        if (err) {
            // Manejar el error
            return res.status(500).send('Error en el servidor');
        }

        if (results.length > 0) {
            // Usuario encontrado y contraseña correcta
            return res.status(200).send('Inicio de sesión exitoso');
        } else {
            // Usuario no encontrado o contraseña incorrecta
            return res.status(401).send('Credenciales incorrectas');
        }
    });
});
