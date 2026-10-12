import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, PlusCircle, Printer, Edit, Trash2, FileText, Calendar, User } from 'lucide-react';

export default function PatientList({ onSelectFicha, onNewFicha, onEditFicha }) {
  const [fichas, setFichas] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const fetchFichas = (query = '') => {
    setLoading(true);
    const token = localStorage.getItem('dental_token');
    fetch(`/api/fichas?search=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar expedientes');
        return res.json();
      })
      .then(data => setFichas(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFichas(search);
  }, [search]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Está seguro de eliminar la ficha clínica de "${name}"?`)) return;

    try {
      const token = localStorage.getItem('dental_token');
      const res = await fetch(`/api/fichas/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al eliminar');
      }

      setFichas(fichas.filter(f => f.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Search Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Expedientes Clínicos Odontológicos</h2>
          <p className="text-xs text-slate-500">Búsqueda remota y gestión de historias de evaluación</p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por DNI o Nombres..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {(user?.role === 'admin' || user?.role === 'doctor') && (
            <button
              onClick={onNewFicha}
              className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors flex-shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nueva Ficha</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Patients Table / Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 text-sm">Cargando expedientes desde el servidor remoto...</div>
      ) : fichas.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-semibold text-slate-800 text-base">No se encontraron fichas clínicas</h3>
          <p className="text-xs text-slate-500">Intente buscar con otro DNI o cree una nueva evaluación clínica.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Paciente</th>
                  <th className="py-3.5 px-6">DNI</th>
                  <th className="py-3.5 px-6">Fecha</th>
                  <th className="py-3.5 px-6">Biotipo / Oclusión</th>
                  <th className="py-3.5 px-6">Registrado por</th>
                  <th className="py-3.5 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fichas.map(f => (
                  <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {f.nombres}
                      {f.edad && <span className="block text-xs font-normal text-slate-400">{f.edad} años • {f.sexo}</span>}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-800 font-medium">{f.dni}</td>
                    <td className="py-4 px-6 text-slate-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{f.fecha}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-0.5 text-xs">
                        <span className="inline-block bg-teal-50 text-teal-700 px-2 py-0.5 rounded font-medium mr-1">
                          {f.examenExtraoral?.biotipo || 'Biotipo'}
                        </span>
                        <span className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                          {f.examenIntraoral?.relacionMolar || 'Molar'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{f.creadoPor || 'Odontólogo'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onSelectFicha(f)}
                          title="Ver / Imprimir Ficha"
                          className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {(user?.role === 'admin' || user?.role === 'doctor') && (
                          <button
                            onClick={() => onEditFicha(f)}
                            title="Editar Ficha"
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}

                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDelete(f.id, f.nombres)}
                            title="Eliminar Ficha"
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
