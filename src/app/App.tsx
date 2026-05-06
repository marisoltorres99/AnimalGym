import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Settings, Edit2, Trash2, LogOut } from 'lucide-react';
import { LoginScreen } from './components/LoginScreen';
import { AddDocumentModal } from './components/AddDocumentModal';
import { EditDocumentModal } from './components/EditDocumentModal';
import { ConfigMenu } from './components/ConfigMenu';
import { MembersModal } from './components/MembersModal';
import { PlanConfigModal, Plan } from './components/PlanConfigModal';
import { RegistryModal, LogEntry } from './components/RegistryModal';
import { MemberDetailsModal } from './components/MemberDetailsModal';
import { ConfirmModal } from './components/ConfirmModal';

interface Document {
  id: number;
  documento: string;
  nombre: string;
  fechaNacimiento: string;
  celular: string;
  gmail: string;
  genero: 'Masculino' | 'Femenino' | 'No binario';
  fechaAlta: string;
  vencimiento: string;
  planNombre: string;
  monto: string;
  baja: boolean;
  fechaBaja?: string;
}

type UserRole = 'Admin' | 'Profe' | null;

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserRole>(null);
  const [loginError, setLoginError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfigMenu, setShowConfigMenu] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showRegistryModal, setShowRegistryModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [selectedMember, setSelectedMember] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ show: false, title: '', message: '', onConfirm: () => {} });

  // Sistema de planes
  const [plans, setPlans] = useState<Plan[]>([
    { id: 1, tipo: 'semanal', nombre: '2 Días', dias: 30, monto: 35, descuento: 0, montoFinal: 35 },
    { id: 2, tipo: 'semanal', nombre: '3 Días', dias: 30, monto: 45, descuento: 0, montoFinal: 45 },
    { id: 3, tipo: 'semanal', nombre: '4 Días', dias: 30, monto: 55, descuento: 0, montoFinal: 55 },
    { id: 4, tipo: 'semanal', nombre: 'Pase Libre', dias: 30, monto: 65, descuento: 0, montoFinal: 65 },
    { id: 5, tipo: 'mensual', nombre: 'Bimestral', meses: 2, monto: 120, descuento: 10, montoFinal: 108 },
    { id: 6, tipo: 'mensual', nombre: 'Trimestral', meses: 3, monto: 170, descuento: 15, montoFinal: 144.5 },
    { id: 7, tipo: 'mensual', nombre: 'Semestral', meses: 6, monto: 300, descuento: 20, montoFinal: 240 },
  ]);

  const [dayPrices, setDayPrices] = useState<{ [key: number]: number }>({
    1: 10,
    2: 18,
    3: 25,
    4: 32,
    5: 38,
    6: 44,
    7: 50,
  });

  const [documents, setDocuments] = useState<Document[]>([
    { 
      id: 1, 
      documento: '12345678',
      nombre: 'Juan Pérez',
      fechaNacimiento: '01/01/1980',
      celular: '1234567890',
      gmail: 'juanperez@example.com',
      genero: 'Masculino',
      fechaAlta: '01/01/2026', 
      vencimiento: '01/02/2026',
      planNombre: 'Plan Mensual',
      monto: '$50',
      baja: false
    },
    { 
      id: 2, 
      documento: '87654321',
      nombre: 'María García',
      fechaNacimiento: '15/12/1985',
      celular: '0987654321',
      gmail: 'mariagarcia@example.com',
      genero: 'Femenino',
      fechaAlta: '15/12/2025', 
      vencimiento: '15/01/2026',
      planNombre: 'Plan Mensual',
      monto: '$32',
      baja: false
    },
    { 
      id: 3, 
      documento: '11223344',
      nombre: 'Carlos López',
      fechaNacimiento: '10/12/1990',
      celular: '1122334455',
      gmail: 'carloslopez@example.com',
      genero: 'Masculino',
      fechaAlta: '10/12/2025', 
      vencimiento: '10/01/2026',
      planNombre: 'Plan Mensual',
      monto: '$25',
      baja: false
    },
    { 
      id: 4, 
      documento: '99887766',
      nombre: 'Ana Martínez',
      fechaNacimiento: '05/02/1995',
      celular: '6677889900',
      gmail: 'anamartinez@example.com',
      genero: 'Femenino',
      fechaAlta: '05/02/2026', 
      vencimiento: '05/03/2026',
      planNombre: 'Plan Mensual',
      monto: '$38',
      baja: false
    },
    { 
      id: 5, 
      documento: '55443322',
      nombre: 'Pedro Gómez',
      fechaNacimiento: '08/02/2000',
      celular: '2233445566',
      gmail: 'pedrogomez@example.com',
      genero: 'Masculino',
      fechaAlta: '08/02/2026', 
      vencimiento: '08/03/2026',
      planNombre: 'Plan Mensual',
      monto: '$18',
      baja: false
    },
    { 
      id: 6, 
      documento: '44556677',
      nombre: 'Lucía Fernández',
      fechaNacimiento: '10/01/2005',
      celular: '7788990011',
      gmail: 'luciafernandez@example.com',
      genero: 'Femenino',
      fechaAlta: '10/01/2026', 
      vencimiento: '13/02/2026',
      planNombre: 'Plan Mensual',
      monto: '$44',
      baja: false
    },
  ]);

  const addLog = (action: 'price_change' | 'status_change', details: string, user: string) => {
    const now = new Date();
    const timestamp = now.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const newLog: LogEntry = {
      id: logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1,
      timestamp,
      user,
      action,
      details
    };

    setLogs([...logs, newLog]);
  };

  const handleLogin = (username: string, password: string) => {
    if (username === 'Admin' && password === 'Grandioso') {
      setCurrentUser('Admin');
      setLoginError('');
    } else if (username === 'Profe' && password === 'AnimalGym') {
      setCurrentUser('Profe');
      setLoginError('');
    } else {
      setLoginError('Usuario o contraseña incorrectos');
    }
  };

  const handleLogout = () => {
    setConfirmAction({
      show: true,
      title: 'Cerrar sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      onConfirm: () => {
        setCurrentUser(null);
        setLoginError('');
        setConfirmAction({ show: false, title: '', message: '', onConfirm: () => {} });
      }
    });
  };

  const handleAddDocument = (newDoc: {
    documento: string;
    nombre: string;
    fechaNacimiento: string;
    celular: string;
    gmail: string;
    genero: 'Masculino' | 'Femenino' | 'No binario';
    fechaAlta: string;
    monto: string;
    vencimiento: string;
    planNombre: string;
  }) => {
    const document: Document = {
      id: documents.length > 0 ? Math.max(...documents.map(d => d.id)) + 1 : 1,
      documento: newDoc.documento,
      nombre: newDoc.nombre,
      fechaNacimiento: newDoc.fechaNacimiento,
      celular: newDoc.celular,
      gmail: newDoc.gmail,
      genero: newDoc.genero,
      fechaAlta: newDoc.fechaAlta,
      vencimiento: newDoc.vencimiento,
      planNombre: newDoc.planNombre,
      monto: newDoc.monto,
      baja: false
    };

    setDocuments([...documents, document]);
  };

  const handleDeleteDocument = (id: number) => {
    setConfirmAction({
      show: true,
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de eliminar este documento?',
      onConfirm: () => {
        setDocuments(documents.filter(doc => doc.id !== id));
        setConfirmAction({ show: false, title: '', message: '', onConfirm: () => {} });
      }
    });
  };

  const handleEditDocument = (updatedDoc: Document) => {
    setDocuments(documents.map(doc => doc.id === updatedDoc.id ? updatedDoc : doc));
  };

  const handleRefreshMember = (id: number) => {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;

    setConfirmAction({
      show: true,
      title: 'Confirmar actualización',
      message: `¿Cambiar el estado de ${doc.nombre || doc.documento} a "Al Día"?`,
      onConfirm: () => {
        const today = new Date();
        const fechaAlta = today.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });

        const vencimientoDate = new Date(today);
        vencimientoDate.setMonth(vencimientoDate.getMonth() + 1);
        const vencimiento = vencimientoDate.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });

        const updatedDoc = {
          ...doc,
          fechaAlta,
          vencimiento
        };

        setDocuments(documents.map(d => d.id === id ? updatedDoc : d));

        // Registrar solo si es Profe
        if (currentUser === 'Profe') {
          addLog(
            'status_change',
            `Cambió el estado del miembro ${doc.nombre || doc.documento} de VENCIDO a AL DÍA. Nueva fecha de pago: ${fechaAlta}, Vencimiento: ${vencimiento}`,
            currentUser
          );
        }

        setConfirmAction({ show: false, title: '', message: '', onConfirm: () => {} });
      }
    });
  };

  const handleBaja = (id: number) => {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;

    const today = new Date();
    const fechaBaja = today.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const updatedDoc = {
      ...doc,
      baja: !doc.baja,
      fechaBaja: !doc.baja ? fechaBaja : undefined
    };

    setDocuments(documents.map(d => d.id === id ? updatedDoc : d));
  };

  const handleSavePrices = (newPrices: { [key: number]: number }, username: string) => {
    const oldPrices = { ...dayPrices };
    setDayPrices(newPrices);

    // Registrar cambios solo si es Profe
    if (username === 'Profe') {
      const changes: string[] = [];
      for (let day = 1; day <= 7; day++) {
        if (oldPrices[day] !== newPrices[day]) {
          changes.push(`${day} día(s): $${oldPrices[day].toFixed(2)} → $${newPrices[day].toFixed(2)}`);
        }
      }

      if (changes.length > 0) {
        addLog(
          'price_change',
          `Modificó los precios: ${changes.join(', ')}`,
          username
        );
      }
    }
  };

  const handleSavePlans = (newPlans: Plan[], username: string) => {
    setPlans(newPlans);
    
    // Registrar cambios solo si es Profe
    if (username === 'Profe') {
      addLog(
        'price_change',
        `Modificó los planes del gimnasio`,
        username
      );
    }
  };

  const handleConfigOption = (option: 'members' | 'prices' | 'registry') => {
    if (option === 'members') {
      setShowMembersModal(true);
    } else if (option === 'prices') {
      setShowPlanModal(true);
    } else if (option === 'registry') {
      setShowRegistryModal(true);
    }
  };

  const getRowStatus = (vencimiento: string) => {
    const [day, month, year] = vencimiento.split('/');
    const vencimientoDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    vencimientoDate.setHours(0, 0, 0, 0);

    const diffTime = vencimientoDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: 'expired', color: 'bg-red-100 hover:bg-red-200' };
    } else if (diffDays <= 5) {
      return { status: 'warning', color: 'bg-yellow-100 hover:bg-yellow-200' };
    } else {
      return { status: 'active', color: 'bg-green-100 hover:bg-green-200' };
    }
  };

  const filteredDocuments = documents.filter(doc => {
    // Filtrar por búsqueda
    const matchesSearch = doc.documento.toLowerCase().includes(searchTerm.toLowerCase());
    
    // En la tabla principal: ocultar miembros de baja
    const notBaja = !doc.baja;
    
    return matchesSearch && notBaja;
  });

  // Ordenar miembros por prioridad: Vencidos → A vencer (Amarillo) → Al día (Verde)
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    const statusA = getRowStatus(a.vencimiento).status;
    const statusB = getRowStatus(b.vencimiento).status;
    
    // Definir orden de prioridad
    const priority = { expired: 0, warning: 1, active: 2 };
    
    return priority[statusA as keyof typeof priority] - priority[statusB as keyof typeof priority];
  });

  // Sistema de inactividad - Cierre automático después de 10 minutos
  useEffect(() => {
    if (!currentUser) return;

    const resetTimer = () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }

      inactivityTimer.current = setTimeout(() => {
        alert('Sesión cerrada por inactividad');
        handleLogout();
      }, 10 * 60 * 1000); // 10 minutos
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [currentUser]);

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} error={loginError} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 shadow-xl p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          {/* Logo Space - Espacio reservado para el logo */}
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
            {/* El logo se agregará aquí próximamente */}
            <div className="w-10 h-10 bg-white/30 rounded-full"></div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 flex items-center bg-white rounded-full shadow-lg overflow-hidden">
            <div className="pl-5 pr-3 py-3">
              <Search className="w-6 h-6 text-gray-400" strokeWidth={2.5} />
            </div>
            <input
              type="text"
              placeholder="Buscar por número de documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 py-3 pr-6 outline-none text-gray-700 font-medium"
            />
          </div>

          {/* Agregar Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <span className="font-bold text-gray-700 text-lg">Agregar</span>
            <Plus className="w-6 h-6 text-gray-700" strokeWidth={3} />
          </button>

          {/* Config Button */}
          <div className="relative">
            <button 
              onClick={() => setShowConfigMenu(!showConfigMenu)}
              className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
              title="Configuración"
            >
              <Settings className="w-6 h-6 text-cyan-500" strokeWidth={2.5} />
            </button>

            {showConfigMenu && (
              <ConfigMenu
                onClose={() => setShowConfigMenu(false)}
                onSelectOption={handleConfigOption}
                isAdmin={currentUser === 'Admin'}
              />
            )}
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
            title="Cerrar sesión"
          >
            <LogOut className="w-6 h-6 text-cyan-500" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <div className="bg-white rounded-xl shadow-md px-4 py-2 inline-flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-semibold text-gray-700">
            Usuario: <span className="text-cyan-600">{currentUser}</span>
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-gray-200 border-b-2 border-gray-300">
                  <th className="px-6 py-5 text-left font-bold text-gray-700 text-base tracking-wide">
                    Documento
                  </th>
                  <th className="px-6 py-5 text-left font-bold text-gray-700 text-base tracking-wide">
                    Nombre
                  </th>
                  <th className="px-6 py-5 text-left font-bold text-gray-700 text-base tracking-wide">
                    Fecha de alta
                  </th>
                  <th className="px-6 py-5 text-left font-bold text-gray-700 text-base tracking-wide">
                    Vencimiento
                  </th>
                  <th className="px-6 py-5 text-left font-bold text-gray-700 text-base tracking-wide">
                    Plan
                  </th>
                  <th className="px-6 py-5 text-left font-bold text-gray-700 text-base tracking-wide">
                    Monto
                  </th>
                  {currentUser === 'Admin' && (
                    <th className="px-6 py-5 text-center font-bold text-gray-700 text-base tracking-wide">
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {sortedDocuments.map((doc) => {
                  const { status, color } = getRowStatus(doc.vencimiento);
                  return (
                    <tr
                      key={doc.id}
                      onClick={() => setSelectedMember(doc)}
                      className={`border-b border-gray-200 transition-colors ${color} cursor-pointer`}
                    >
                      <td className="px-6 py-5 text-gray-700 font-medium">
                        {doc.documento}
                      </td>
                      <td className="px-6 py-5 text-gray-600">
                        {doc.nombre || '-'}
                      </td>
                      <td className="px-6 py-5 text-gray-600">
                        {doc.fechaAlta}
                      </td>
                      <td className="px-6 py-5 text-gray-600">
                        {doc.vencimiento}
                      </td>
                      <td className="px-6 py-5 text-gray-600">
                        {doc.planNombre}
                      </td>
                      <td className="px-6 py-5 text-gray-700 font-semibold">
                        {doc.monto}
                        {status === 'expired' && (
                          <span className="ml-2 text-red-600 text-sm font-bold">VENCIDO</span>
                        )}
                      </td>
                      {currentUser === 'Admin' && (
                        <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setEditingDocument(doc)}
                              className="p-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddDocumentModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddDocument}
          plans={plans}
        />
      )}

      {showMembersModal && (
        <MembersModal
          onClose={() => setShowMembersModal(false)}
          documents={documents}
          onEdit={handleEditDocument}
          onRefresh={handleRefreshMember}
          dayPrices={dayPrices}
          onBaja={handleBaja}
        />
      )}

      {showPlanModal && (
        <PlanConfigModal
          onClose={() => setShowPlanModal(false)}
          plans={plans}
          onSave={handleSavePlans}
          currentUser={currentUser}
        />
      )}

      {showRegistryModal && (
        <RegistryModal
          onClose={() => setShowRegistryModal(false)}
          logs={logs}
        />
      )}

      {editingDocument && (
        <EditDocumentModal
          onClose={() => setEditingDocument(null)}
          document={editingDocument}
          onSave={handleEditDocument}
          dayPrices={dayPrices}
        />
      )}

      {selectedMember && (
        <MemberDetailsModal
          onClose={() => setSelectedMember(null)}
          member={selectedMember}
          status={getRowStatus(selectedMember.vencimiento).status as 'expired' | 'warning' | 'active'}
          onGoToPayment={() => setShowMembersModal(true)}
        />
      )}

      {confirmAction.show && (
        <ConfirmModal
          onCancel={() => setConfirmAction({ show: false, title: '', message: '', onConfirm: () => {} })}
          title={confirmAction.title}
          message={confirmAction.message}
          onConfirm={confirmAction.onConfirm}
        />
      )}
    </div>
  );
}