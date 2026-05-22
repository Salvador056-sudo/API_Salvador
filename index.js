const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// RUTAS
app.get('/hola-mundo', (req, res) => {
  res.send('Hello World!');
});

// GET productos
app.get('/productos', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM productos');
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST producto
app.post('/productos', async (req, res) => {
  try {
    const { nombre, precio } = req.body;
    const nuevo = await pool.query(
      'INSERT INTO productos (nombre, precio) VALUES ($1, $2) RETURNING *',
      [nombre, precio]
    );
    res.status(201).json(nuevo.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete('/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM productos WHERE id = $1', [id]);
    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LISTEN
const PORT = 6001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
