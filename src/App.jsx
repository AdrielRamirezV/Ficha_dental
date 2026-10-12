import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import PatientList from './components/PatientList';
import DentalForm from './components/DentalForm';
import PrintableFicha from './components/PrintableFicha';
import UserManagement from './components/UserManagement';

function MainContent() {
  const { user, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState('list'); // 'list', 'new', 'edit', 'view', 'users'
  const [selectedFicha, setSelectedFicha] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-medium">
        Cargando sistema de historias clínicas...
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const handleSelectFicha = (ficha) => {
    setSelectedFicha(ficha);
    setCurrentTab('view');
  };

  const handleEditFicha = (ficha) => {
    setSelectedFicha(ficha);
    setCurrentTab('edit');
  };

  const handleSaved = (savedFicha) => {
    setSelectedFicha(savedFicha);
    setCurrentTab('view');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'list' && (
          <PatientList
            onSelectFicha={handleSelectFicha}
            onNewFicha={() => {
              setSelectedFicha(null);
              setCurrentTab('new');
            }}
            onEditFicha={handleEditFicha}
          />
        )}

        {(currentTab === 'new' || currentTab === 'edit') && (
          <DentalForm
            initialFicha={currentTab === 'edit' ? selectedFicha : null}
            onSaved={handleSaved}
            onCancel={() => setCurrentTab('list')}
          />
        )}

        {currentTab === 'view' && (
          <PrintableFicha
            ficha={selectedFicha}
            onBack={() => setCurrentTab('list')}
          />
        )}

        {currentTab === 'users' && user.role === 'admin' && (
          <UserManagement />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
