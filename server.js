import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dental_super_secret_key_2026';

app.use(cors());
app.use(express.json());

// Serving static uploaded/extracted public images
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Database file setup
const DB_PATH = path.join(__dirname, 'data', 'database.json');

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function initDatabase() {
  ensureDirectoryExistence(DB_PATH);
  if (!fs.existsSync(DB_PATH)) {
    const defaultData = {
      users: [
        {
          id: 'u1',
          username: 'admin',
          name: 'Administrador del Sistema',
          role: 'admin',
          passwordHash: bcrypt.hashSync('admin123', 10),
          createdAt: new Date().toISOString()
        },
        {
          id: 'u2',
          username: 'doctor1',
          name: 'Dr. Carlos Mendoza (Ortodoncista)',
          role: 'doctor',
          passwordHash: bcrypt.hashSync('doctor123', 10),
          createdAt: new Date().toISOString()
        },
        {
          id: 'u3',
          username: 'recepcion1',
          name: 'María López (Recepción)',
          role: 'reception',
          passwordHash: bcrypt.hashSync('recepcion123', 10),
          createdAt: new Date().toISOString()
        }
      ],
      fichas: [
        {
          id: 'f1',
          dni: '72849102',
          nombres: 'Juan Pérez Rodríguez',
          edad: 28,
          sexo: 'Masculino',
          fecha: '2026-09-15',
          examenExtraoral: {
            biotipo: 'Meso Facial',
            perfil: 'Convexo',
            simetria: 'Simétrico',
            observacionesSimetria: ''
          },
          examenIntraoral: {
            queilogramaComisura: 'Normal',
            codificacionSuzuki: 'Tipo I-L',
            palatograma: 'Líneas A, B paralelas, zonas 1 y 2 normales',
            relacionMaxilarMandibular: 'Protrusión Maxilar',
            relacionMolar: 'Clase I',
            relacionCanina: 'Clase I',
            maloclusiones: ['Mordida cruzada anterior'],
            overjet: 3.5,
            overbite: 2.0,
            arcosDentales: {
              superior: 'Parabólico/U',
              inferior: 'Ovoide'
            },
            kennedy: {
              clase: 'Clase III',
              modificacion: 'Mod 1'
            },
            curvaSpee: {
              medida: 1.5,
              estado: 'Normal'
            }
          },
          diagnostico: 'Maloclusión Clase I con ligero overjet aumentado.',
          creadoPor: 'Dr. Carlos Mendoza',
          createdAt: '2026-09-15T10:30:00.000Z'
        }
      ]
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

function readDB() {
  initDatabase();
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Acceso no autorizado: Token no proporcionado' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido o expirado' });
    req.user = user;
    next();
  });
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'No tienes permisos suficientes para realizar esta acción' });
    }
    next();
  };
};

// --- AUTH ROUTES ---
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  }

  const db = readDB();
  const user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role
    }
  });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// --- USER MANAGEMENT ROUTES (ADMIN ONLY) ---
app.get('/api/users', authenticateToken, authorizeRoles('admin'), (req, res) => {
  const db = readDB();
  const safeUsers = db.users.map(({ passwordHash, ...u }) => u);
  res.json(safeUsers);
});

app.post('/api/users', authenticateToken, authorizeRoles('admin'), (req, res) => {
  const { username, name, role, password } = req.body;
  if (!username || !name || !role || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const db = readDB();
  if (db.users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    return res.status(400).json({ error: 'El nombre de usuario ya existe' });
  }

  const newUser = {
    id: 'u_' + Date.now(),
    username,
    name,
    role,
    passwordHash: bcrypt.hashSync(password, 10),
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);

  const { passwordHash, ...safeUser } = newUser;
  res.status(201).json(safeUser);
});

app.delete('/api/users/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const userIndex = db.users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  if (db.users[userIndex].username === 'admin') {
    return res.status(400).json({ error: 'No se puede eliminar el usuario administrador principal' });
  }

  db.users.splice(userIndex, 1);
  writeDB(db);
  res.json({ message: 'Usuario eliminado exitosamente' });
});

// --- CLINICAL FICHAS ROUTES ---
app.get('/api/fichas', authenticateToken, (req, res) => {
  const { search } = req.query;
  const db = readDB();
  let results = db.fichas;

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(f => 
      (f.dni && f.dni.includes(q)) || 
      (f.nombres && f.nombres.toLowerCase().includes(q))
    );
  }

  res.json(results);
});

app.get('/api/fichas/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const ficha = db.fichas.find(f => f.id === id);
  
  if (!ficha) {
    return res.status(404).json({ error: 'Ficha clínica no encontrada' });
  }

  res.json(ficha);
});

app.post('/api/fichas', authenticateToken, authorizeRoles('admin', 'doctor'), (req, res) => {
  const fichaData = req.body;
  if (!fichaData.dni || !fichaData.nombres) {
    return res.status(400).json({ error: 'El DNI y Nombres son requeridos' });
  }

  const db = readDB();
  
  if (fichaData.id) {
    // Update existing
    const index = db.fichas.findIndex(f => f.id === fichaData.id);
    if (index !== -1) {
      db.fichas[index] = {
        ...db.fichas[index],
        ...fichaData,
        updatedAt: new Date().toISOString(),
        actualizadoPor: req.user.name
      };
      writeDB(db);
      return res.json(db.fichas[index]);
    }
  }

  // Create new
  const newFicha = {
    ...fichaData,
    id: 'f_' + Date.now(),
    creadoPor: req.user.name,
    createdAt: new Date().toISOString()
  };

  db.fichas.unshift(newFicha);
  writeDB(db);
  res.status(201).json(newFicha);
});

app.delete('/api/fichas/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const index = db.fichas.findIndex(f => f.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Ficha no encontrada' });
  }

  db.fichas.splice(index, 1);
  writeDB(db);
  res.json({ message: 'Ficha eliminada exitosamente' });
});

// Serve frontend in production mode if dist folder exists
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

initDatabase();

app.listen(PORT, () => {
  console.log(`Servidor de Historia Clínica Dental corriendo en el puerto ${PORT}`);
});
