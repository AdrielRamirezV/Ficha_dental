import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, User, LogOut, Users, FileText, PlusCircle, Key } from 'lucide-react';
import ChangePasswordModal from './ChangePasswordModal';

export default function Navbar({ currentTab, setCurrentTab }) {
  const { user, logout } = useAuth();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="bg-purple-100 text-purple-700 text-xs px-2.5 py-1 rounded-full font-semibold">Administrador</span>;
      case 'doctor':
        return <span className="bg-teal-100 text-teal-700 text-xs px-2.5 py-1 rounded-full font-semibold">Odontólogo</span>;
      case 'reception':
        return <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-semibold">Recepción</span>;
      default:
        return null;
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('list')}>
            <div className="bg-teal-600 text-white p-2 rounded-xl shadow-md">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-lg leading-tight">Ficha Estomatológica</h1>
              <p className="text-xs text-slate-500 font-medium">Sistema Digital de Ortodoncia</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex space-x-2">
            <button
              onClick={() => setCurrentTab('list')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'list'
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Expedientes</span>
            </button>

            {(user?.role === 'admin' || user?.role === 'doctor') && (
              <button
                onClick={() => setCurrentTab('new')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentTab === 'new'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Nueva Ficha</span>
              </button>
            )}

            {user?.role === 'admin' && (
              <button
                onClick={() => setCurrentTab('users')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentTab === 'users'
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Usuarios</span>
              </button>
            )}
          </nav>

          {/* User Profile & Logout */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="hidden sm:flex items-center space-x-3 text-right">
              <div>
                <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                <div className="flex justify-end mt-0.5">{getRoleBadge(user?.role)}</div>
              </div>
            </div>

            <button
              onClick={() => setIsPasswordModalOpen(true)}
              title="Cambiar mi contraseña"
              className="p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors flex items-center space-x-1"
            >
              <Key className="w-5 h-5" />
            </button>

            <button
              onClick={logout}
              title="Cerrar sesión"
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>

      {/* Modal para que cualquier usuario cambie su contraseña */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </header>
  );
}
