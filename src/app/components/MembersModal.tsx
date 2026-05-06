import { useState } from 'react';
import { X, Search, Edit2, RefreshCw, User, Mail, Phone, Calendar, Users, UserX } from 'lucide-react';
import { EditDocumentModal } from './EditDocumentModal';

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

interface MembersModalProps {
  onClose: () => void;
  documents: Document[];
  onEdit: (document: Document) => void;
  onRefresh: (id: number) => void;
  onBaja: (id: number) => void;
  dayPrices: { [key: number]: number };
}

export function MembersModal({ onClose, documents, onEdit, onRefresh, onBaja, dayPrices }: MembersModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired' | 'baja'>('all');
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [selectedMember, setSelectedMember] = useState<Document | null>(null);
  const [confirmBaja, setConfirmBaja] = useState<{ show: boolean; memberId: number; memberName: string; isBaja: boolean }>({
    show: false,
    memberId: 0,
    memberName: '',
    isBaja: false
  });

  const getRowStatus = (doc: Document) => {
    // Si está de baja, siempre devolver estado de baja
    if (doc.baja) {
      return { status: 'baja', color: 'bg-gray-100' };
    }

    const [day, month, year] = doc.vencimiento.split('/');
    const vencimientoDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    vencimientoDate.setHours(0, 0, 0, 0);

    const diffTime = vencimientoDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: 'expired', color: 'bg-red-100' };
    } else if (diffDays <= 5) {
      return { status: 'warning', color: 'bg-yellow-100' };
    } else {
      return { status: 'active', color: 'bg-green-100' };
    }
  };

  const filteredDocuments = documents.filter(doc => 
    doc.documento.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(doc => {
    if (filterStatus === 'all') return true;
    
    const { status } = getRowStatus(doc);
    
    if (filterStatus === 'active') {
      // "Al día" incluye verde (active) y amarillo (warning)
      return status === 'active' || status === 'warning';
    }
    
    return status === filterStatus;
  });

  const handleEdit = (updatedDoc: Document) => {
    onEdit(updatedDoc);
    setEditingDocument(null);
  };

  const handleBajaClick = (doc: Document) => {
    setConfirmBaja({
      show: true,
      memberId: doc.id,
      memberName: doc.nombre || doc.documento,
      isBaja: doc.baja
    });
  };

  const confirmBajaAction = () => {
    onBaja(confirmBaja.memberId);
    setConfirmBaja({ show: false, memberId: 0, memberName: '', isBaja: false });
  };

  // Formatear fecha de nacimiento de YYYY-MM-DD a DD/MM/YYYY
  const formatFechaNacimiento = (fecha: string) => {
    if (!fecha) return '-';
    if (fecha.includes('/')) return fecha; // Ya está formateada
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-6 flex items-center justify-between flex-shrink-0">
            <h2 className="text-2xl font-bold text-white">Gestión de Miembros</h2>
            <button
              onClick={onClose}
              className="bg-white hover:bg-gray-100 p-2 rounded-full transition-all"
            >
              <X className="w-6 h-6 text-cyan-500" strokeWidth={2.5} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200 flex-shrink-0 space-y-4">
            <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
              <div className="pl-5 pr-3 py-3">
                <Search className="w-5 h-5 text-gray-400" strokeWidth={2.5} />
              </div>
              <input
                type="text"
                placeholder="Buscar por número de documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 py-3 pr-6 bg-transparent outline-none text-gray-700 font-medium"
              />
            </div>

            {/* Filtros de Estado */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-600">Filtrar por:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                    filterStatus === 'all'
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-cyan-400'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFilterStatus('active')}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all flex items-center gap-2 ${
                    filterStatus === 'active'
                      ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-green-400'
                  }`}
                >
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Al día
                </button>
                <button
                  onClick={() => setFilterStatus('expired')}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all flex items-center gap-2 ${
                    filterStatus === 'expired'
                      ? 'bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-red-400'
                  }`}
                >
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  Vencido
                </button>
                <button
                  onClick={() => setFilterStatus('baja')}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all flex items-center gap-2 ${
                    filterStatus === 'baja'
                      ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  De Baja
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto p-6">
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="sticky top-0">
                  <tr className="bg-gradient-to-r from-gray-100 to-gray-200 border-b-2 border-gray-300">
                    <th className="px-4 py-4 text-left font-bold text-gray-700 text-sm">
                      Documento
                    </th>
                    <th className="px-4 py-4 text-left font-bold text-gray-700 text-sm">
                      Nombre
                    </th>
                    <th className="px-4 py-4 text-left font-bold text-gray-700 text-sm">
                      Celular
                    </th>
                    <th className="px-4 py-4 text-left font-bold text-gray-700 text-sm">
                      Fecha de Nac.
                    </th>
                    <th className="px-4 py-4 text-left font-bold text-gray-700 text-sm">
                      Gmail
                    </th>
                    <th className="px-4 py-4 text-left font-bold text-gray-700 text-sm">
                      Vencimiento
                    </th>
                    <th className="px-4 py-4 text-center font-bold text-gray-700 text-sm">
                      Estado
                    </th>
                    <th className="px-4 py-4 text-center font-bold text-gray-700 text-sm">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc) => {
                    const { status, color } = getRowStatus(doc);
                    return (
                      <tr
                        key={doc.id}
                        className={`border-b border-gray-200 ${color} hover:opacity-80 cursor-pointer transition-opacity`}
                        onClick={() => setSelectedMember(doc)}
                      >
                        <td className="px-4 py-4 text-gray-700 font-medium text-sm">
                          {doc.documento}
                        </td>
                        <td className="px-4 py-4 text-gray-600 text-sm">
                          {doc.nombre || '-'}
                        </td>
                        <td className="px-4 py-4 text-gray-600 text-sm">
                          {doc.celular || '-'}
                        </td>
                        <td className="px-4 py-4 text-gray-600 text-sm">
                          {formatFechaNacimiento(doc.fechaNacimiento)}
                        </td>
                        <td className="px-4 py-4 text-gray-600 text-sm">
                          {doc.gmail || '-'}
                        </td>
                        <td className="px-4 py-4 text-gray-600 text-sm">
                          {doc.vencimiento}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            status === 'expired' ? 'bg-red-500 text-white' :
                            status === 'warning' ? 'bg-yellow-500 text-white' :
                            status === 'baja' ? 'bg-gray-500 text-white' :
                            'bg-green-500 text-white'
                          }`}>
                            {status === 'expired' ? 'VENCIDO' :
                             status === 'warning' ? 'POR VENCER' :
                             status === 'baja' ? 'DE BAJA' : 'AL DÍA'}
                          </span>
                        </td>
                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setEditingDocument(doc)}
                              className="p-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            {status === 'expired' && (
                              <button
                                onClick={() => onRefresh(doc.id)}
                                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                title="Cambiar a Al Día"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                            )}
                            {doc.baja ? (
                              <button
                                onClick={() => onBaja(doc.id)}
                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                title="Dar de Alta"
                              >
                                <User className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBajaClick(doc)}
                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                title="Dar de Baja"
                              >
                                <UserX className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {editingDocument && (
          <EditDocumentModal
            onClose={() => setEditingDocument(null)}
            document={editingDocument}
            onSave={handleEdit}
            dayPrices={dayPrices}
          />
        )}
      </div>

      {/* Modal de Detalles Completos del Miembro */}
      {selectedMember && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[60]"
          onClick={() => setSelectedMember(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white p-3 rounded-full">
                  <User className="w-7 h-7 text-cyan-500" strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-bold text-white">Información Completa del Miembro</h2>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="bg-white hover:bg-gray-100 p-2 rounded-full transition-all"
              >
                <X className="w-6 h-6 text-cyan-500" strokeWidth={2.5} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-4">
              {/* Documento y Nombre */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-5 rounded-xl border-2 border-cyan-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-600">Documento</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{selectedMember.documento}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border-2 border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-600">Nombre Completo</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{selectedMember.nombre}</p>
                </div>
              </div>

              {/* Fecha de Nacimiento y Género */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
                    <span className="text-sm font-semibold text-gray-600">Fecha de Nacimiento</span>
                  </div>
                  <p className="text-xl font-bold text-gray-800">{formatFechaNacimiento(selectedMember.fechaNacimiento)}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-green-600" strokeWidth={2.5} />
                    <span className="text-sm font-semibold text-gray-600">Género</span>
                  </div>
                  <p className="text-xl font-bold text-gray-800">{selectedMember.genero}</p>
                </div>
              </div>

              {/* Celular y Gmail */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-xl border-2 border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-5 h-5 text-orange-600" strokeWidth={2.5} />
                    <span className="text-sm font-semibold text-gray-600">Celular</span>
                  </div>
                  <p className="text-xl font-bold text-gray-800">{selectedMember.celular || '-'}</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-rose-50 p-5 rounded-xl border-2 border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-5 h-5 text-red-600" strokeWidth={2.5} />
                    <span className="text-sm font-semibold text-gray-600">Gmail</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800 break-all">{selectedMember.gmail || '-'}</p>
                </div>
              </div>

              {/* Plan y Monto */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-5 rounded-xl border-2 border-violet-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-600">Plan Contratado</span>
                  </div>
                  <p className="text-xl font-bold text-violet-600">{selectedMember.planNombre}</p>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-5 rounded-xl border-2 border-teal-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-600">Monto</span>
                  </div>
                  <p className="text-2xl font-bold text-teal-600">{selectedMember.monto}</p>
                </div>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-lime-50 to-green-50 p-5 rounded-xl border-2 border-lime-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-600">Fecha de Alta</span>
                  </div>
                  <p className="text-xl font-bold text-gray-800">{selectedMember.fechaAlta}</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-5 rounded-xl border-2 border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-600">Vencimiento</span>
                  </div>
                  <p className="text-xl font-bold text-gray-800">{selectedMember.vencimiento}</p>
                </div>
              </div>

              {/* Botón Cerrar */}
              <div className="pt-4">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="w-full px-6 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Baja */}
      {confirmBaja.show && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[70]"
          onClick={() => setConfirmBaja({ show: false, memberId: 0, memberName: '', isBaja: false })}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white p-3 rounded-full">
                  <UserX className="w-7 h-7 text-cyan-500" strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-bold text-white">Confirmación de Baja</h2>
              </div>
              <button
                onClick={() => setConfirmBaja({ show: false, memberId: 0, memberName: '', isBaja: false })}
                className="bg-white hover:bg-gray-100 p-2 rounded-full transition-all"
              >
                <X className="w-6 h-6 text-cyan-500" strokeWidth={2.5} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-4">
              <p className="text-xl font-bold text-gray-800">¿Estás seguro de que deseas dar de baja a {confirmBaja.memberName}?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setConfirmBaja({ show: false, memberId: 0, memberName: '', isBaja: false })}
                  className="px-6 py-4 bg-gray-300 text-gray-700 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmBajaAction}
                  className="px-6 py-4 bg-red-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}