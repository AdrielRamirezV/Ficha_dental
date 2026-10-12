import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Shield, UserCheck, Stethoscope, Building } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // New user form state
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('doctor');
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    const token = localStorage.getItem('dental_token');
    fetch('/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar lista de usuarios');
        return res.json();
      })
      .then(data => setUsers(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setCreating(true);

    try {
      const token = localStorage.getItem('dental_token');
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username, name, role, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear usuario');

      setUsers([...users, data]);
      setUsername('');
      setName('');
      setPassword('');
      setRole('doctor');
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteUser = async (id, usernameToDelete) => {
    if (!window.confirm(`¿Confirma eliminar al usuario "${usernameToDelete}"?`)) return;

    try {
      const token = localStorage.getItem('dental_token');
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al eliminar usuario');
      }

      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const getRoleIcon = (roleName) => {
    switch (roleName) {
      case 'admin':
        return <Shield className="w-4 h-4 text-purple-600" />;
      case 'doctor':
        return <Stethoscope className="w-4 h-4 text-teal-600" />;
      case 'reception':
        return <Building className="w-4 h-4 text-blue-600" />;
      default:
        return <UserCheck className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Gestión de Usuarios y Roles</h2>
        <p className="text-xs text-slate-500">Administre el acceso remoto del personal de la clínica dental</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create User Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
          <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-teal-600" />
            <span>Crear Nuevo Usuario</span>
          </h3>

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Nombre de Usuario</label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="ej. dr_mendoza"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Nombre Completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="ej. Dr. Roberto Mendoza"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Rol en el Sistema</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm bg-white"
              >
                <option value="doctor">Odontólogo / Especialista</option>
                <option value="reception">Recepción / Asistente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors disabled:opacity-50 mt-2"
            >
              {creating ? 'Guardando...' : 'Crear Usuario'}
            </button>
          </form>
        </div>

        {/* Existing Users List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 text-base mb-4">Usuarios Registrados</h3>
          
          {loading ? (
            <p className="text-slate-500 text-sm py-4">Cargando usuarios...</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {users.map(u => (
                <div key={u.id} className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-100 rounded-xl">
                      {getRoleIcon(u.role)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{u.name}</p>
                      <p className="text-xs text-slate-400">@{u.username} • <span className="uppercase font-semibold text-slate-600">{u.role}</span></p>
                    </div>
                  </div>

                  {u.username !== 'admin' && (
                    <button
                      onClick={() => handleDeleteUser(u.id, u.username)}
                      title="Eliminar usuario"
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
