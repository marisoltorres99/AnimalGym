import { X, Calendar, DollarSign, Clock, CreditCard } from 'lucide-react';

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
}

interface MemberDetailsModalProps {
  onClose: () => void;
  member: Document;
  status: 'expired' | 'warning' | 'active';
  onGoToPayment: () => void;
}

export function MemberDetailsModal({ onClose, member, status, onGoToPayment }: MemberDetailsModalProps) {
  const getStatusColor = () => {
    if (status === 'expired') return 'from-red-400 to-red-600';
    if (status === 'warning') return 'from-yellow-400 to-yellow-600';
    return 'from-green-400 to-green-600';
  };

  const getStatusText = () => {
    if (status === 'expired') return 'VENCIDO';
    if (status === 'warning') return 'POR VENCER';
    return 'AL DÍA';
  };

  const getStatusBadgeColor = () => {
    if (status === 'expired') return 'bg-red-500';
    if (status === 'warning') return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${getStatusColor()} p-6 flex items-center justify-between`}>
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">Detalles del Miembro</h2>
            <span className={`${getStatusBadgeColor()} text-white px-4 py-1 rounded-full text-sm font-bold inline-block`}>
              {getStatusText()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="bg-white hover:bg-gray-100 p-2 rounded-full transition-all"
          >
            <X className="w-6 h-6 text-gray-700" strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Documento */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-5 rounded-xl border-2 border-cyan-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-cyan-500 p-2 rounded-lg">
                <CreditCard className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-semibold text-gray-600">Documento</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{member.documento}</p>
          </div>

          {/* Nombre */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-xl border-2 border-purple-200">
            <span className="text-sm font-semibold text-gray-600 block mb-2">Nombre del Miembro</span>
            <p className="text-2xl font-bold text-gray-800">{member.nombre || 'Sin nombre registrado'}</p>
          </div>

          {/* Información de fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-5 rounded-xl border-2 border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-green-600" strokeWidth={2.5} />
                <span className="text-sm font-semibold text-gray-600">Fecha de Alta</span>
              </div>
              <p className="text-xl font-bold text-gray-800">{member.fechaAlta}</p>
            </div>

            <div className="bg-orange-50 p-5 rounded-xl border-2 border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-orange-600" strokeWidth={2.5} />
                <span className="text-sm font-semibold text-gray-600">Vencimiento</span>
              </div>
              <p className="text-xl font-bold text-gray-800">{member.vencimiento}</p>
            </div>
          </div>

          {/* Información de pago */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-5 rounded-xl border-2 border-blue-200">
              <span className="text-sm font-semibold text-gray-600 block mb-2">Plan</span>
              <p className="text-3xl font-bold text-blue-600">{member.planNombre}</p>
            </div>

            <div className="bg-emerald-50 p-5 rounded-xl border-2 border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />
                <span className="text-sm font-semibold text-gray-600">Monto</span>
              </div>
              <p className="text-3xl font-bold text-emerald-600">{member.monto}</p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            {status === 'expired' && (
              <button
                onClick={() => {
                  onGoToPayment();
                  onClose();
                }}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <DollarSign className="w-5 h-5" strokeWidth={2.5} />
                A Pagar
              </button>
            )}
            <button
              onClick={onClose}
              className={`${status === 'expired' ? 'flex-1' : 'w-full'} px-6 py-4 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors`}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}