import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'data', 'database.json');

const newPassword = process.argv[2] || 'admin123';

if (!fs.existsSync(DB_PATH)) {
  console.error('No se encontró el archivo de base de datos:', DB_PATH);
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const adminUser = db.users.find(u => u.username === 'admin');

if (!adminUser) {
  console.error('Usuario admin no encontrado en la base de datos.');
  process.exit(1);
}

adminUser.passwordHash = bcrypt.hashSync(newPassword, 10);
fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');

console.log('---------------------------------------------------------');
console.log('✅ CONTRASEÑA DE ADMINISTRADOR RESTABLECIDA EXITOSAMENTE');
console.log('Usuario: admin');
console.log(`Nueva Contraseña: ${newPassword}`);
console.log('---------------------------------------------------------');
