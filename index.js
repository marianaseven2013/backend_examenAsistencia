// 📌 Importar dependencias necesarias
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');

// 📌 Configuración del servidor
const app = express();
const port = 3005;

// 📌 Middleware
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 📌 Configuración de la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 's1234!Strong',
  database: 'examen_lab2',
});

// 📌 Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión a la base de datos: ', err);
    return;
  }
  console.log('✅ Conexión a la base de datos establecida');
});

// 📌 Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Bienvenido al backend!');
});

app.post("/login", (req, res) => {
  console.log("Datos recibidos:", req.body);
  
  const { nombre, contraseña } = req.body;
  const contraseñaInput = contraseña?.trim();

  if (!nombre || !contraseñaInput) {
    return res.status(400).json({ mensaje: "Usuario y contraseña requeridos" });
  }

  const query = "SELECT * FROM usuario WHERE LOWER(TRIM(nombre)) = LOWER(?)";
  db.query(query, [nombre.trim()], async (err, results) => {
    if (err) {
      console.error("Error en BD:", err);
      return res.status(500).json({ mensaje: "Error en el servidor" });
    }

    if (results.length === 0) {
      return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }

    const usuario = results[0];
    console.log("Comparando:", {
      input: contraseñaInput,
      almacenada: usuario.contraseña
    });

    try {
      // Comparación con bcrypt
      const match = await bcrypt.compare(contraseñaInput, usuario.contraseña);
      
      if (match) {
        return res.status(200).json({ 
          mensaje: "Login exitoso",
          usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            grado_id: usuario.grado_id
          }
        });
      } else {
        console.log("No coinciden (bcrypt)");
        return res.status(401).json({ mensaje: "Credenciales incorrectas" });
      }
    } catch (error) {
      console.error("Error en bcrypt.compare:", error);
      return res.status(500).json({ mensaje: "Error en el servidor" });
    }
  });
});

// 📌 Ruta para registrar un usuario
app.post('/registrar', (req, res) => {
  const { nombre, contraseña, grado_id } = req.body;

  if (!nombre || !contraseña || !grado_id) {
    return res.status(400).json({ mensaje: 'Todos los campos son requeridos' });
  }

  bcrypt.hash(contraseña, 10, (err, hashedPassword) => {
    if (err) {
      console.error('❌ Error al encriptar la contraseña:', err);
      return res.status(500).json({ mensaje: 'Error en el servidor' });
    }

    const query = 'INSERT INTO usuario (nombre, contraseña, grado_id) VALUES (?, ?, ?)';
    db.query(query, [nombre, hashedPassword, grado_id], (err) => {
      if (err) {
        console.error('❌ Error al guardar el usuario:', err);
        return res.status(500).json({ mensaje: 'Error al guardar el usuario' });
      }

      res.status(201).json({ mensaje: '✅ Usuario registrado exitosamente' });
    });
  });
});

// 📌 Ruta para obtener la clase asignada al profesor
app.get('/clase/:grado_id', (req, res) => {
  const grado_id = req.params.grado_id;

  const query = 'SELECT nombre FROM grado WHERE id = ?';
  db.query(query, [grado_id], (err, results) => {
    if (err) {
      console.error('❌ Error al realizar la consulta: ', err);
      return res.status(500).json({ mensaje: 'Error en el servidor' });
    }

    if (results.length === 0) {
      return res.status(404).json({ mensaje: 'Clase no encontrada' });
    }

    res.status(200).json({ mensaje: '✅ Clase encontrada', clase: results[0] });
  });
});

// Obtener alumnos por grado_id
app.get('/alumnos/:grado_id', (req, res) => {
  const grado_id = req.params.grado_id;
  
  const query = 'SELECT * FROM alumnos WHERE grado_id = ?';
  db.query(query, [grado_id], (err, results) => {
      if (err) {
          console.error('Error al obtener alumnos:', err);
          return res.status(500).json({ mensaje: 'Error en el servidor' });
      }
      
      res.status(200).json(results);
  });
});

// Registrar asistencia
app.post('/asistencia', (req, res) => {
  const { usuario_id, grado_id, alumnos_id, estado } = req.body;
  
  if (!usuario_id || !grado_id || !alumnos_id || !estado) {
      return res.status(400).json({ mensaje: 'Todos los campos son requeridos' });
  }
  
  const query = 'INSERT INTO asistencia (usuario_id, grado_id, alumnos_id, estado) VALUES (?, ?, ?, ?)';
  db.query(query, [usuario_id, grado_id, alumnos_id, estado], (err, results) => {
      if (err) {
          console.error('Error al registrar asistencia:', err);
          return res.status(500).json({ mensaje: 'Error al registrar asistencia' });
      }
      
      res.status(201).json({ 
          mensaje: 'Asistencia registrada exitosamente',
          id: results.insertId
      });
  });
});

// Ruta para guardar múltiples asistencias
app.post('/asistencia/multiple', (req, res) => {
  const asistencias = req.body;
  
  if (!Array.isArray(asistencias) || asistencias.length === 0) {
      return res.status(400).json({ mensaje: 'Datos de asistencia no válidos' });
  }
  
  const query = 'INSERT INTO asistencia (usuario_id, grado_id, alumnos_id, estado) VALUES ?';
  const values = asistencias.map(a => [a.usuario_id, a.grado_id, a.alumnos_id, a.estado]);
  
  db.query(query, [values], (err, results) => {
      if (err) {
          console.error('Error al guardar múltiples asistencias:', err);
          return res.status(500).json({ mensaje: 'Error al guardar asistencias' });
      }
      
      res.status(201).json({ 
          mensaje: 'Asistencias guardadas exitosamente',
          registrosAfectados: results.affectedRows
      });
  });
});

// 📌 Iniciar el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});