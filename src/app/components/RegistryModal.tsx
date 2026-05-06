import { X, Clock, DollarSign, RefreshCw } from 'lucide-react';

export interface LogEntry {
  id: number;
  timestamp: string;
  user: string;
  action: 'price_change' | 'status_change';
  details: string;
}

interface RegistryModalProps {
  onClose: () => void;
  logs: LogEntry[];
}

export function RegistryModal({ onClose, logs }: RegistryModalProps) {
  const getActionIcon = (action: string) => {
    if (action === 'price_change') {
      return <DollarSign className="w-5 h-5 text-green-600" strokeWidth={2.5} />;
    } else {
      return <RefreshCw className="w-5 h-5 text-blue-600" strokeWidth={2.5} />;
    }
  };

  const getActionColor = (action: string) => {
    if (action === 'price_change') {
      return 'bg-green-100';
    } else {
      return 'bg-blue-100';
    }
  };

  // Ordenar logs del más reciente al más antiguo
  const sortedLogs = [...logs].sort((a, b) => b.id - a.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-6 flex items-center justify-between flex-shrink-0">
          <h2 className="text-2xl font-bold text-white">Registro de Cambios</h2>
          <button
            onClick={onClose}
            className="bg-white hover:bg-gray-100 p-2 rounded-full transition-all"
          >
            <X className="w-6 h-6 text-purple-500" strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {sortedLogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium text-lg">No hay registros disponibles</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedLogs.map((log) => (
                <div
                  key={log.id}
                  className={`${getActionColor(log.action)} p-4 rounded-xl border-2 border-gray-200 hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-2 rounded-lg">
                      {getActionIcon(log.action)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-800">
                          {log.user}
                        </span>
                        <span className="text-gray-500">•</span>
                        <div className="flex items-center gap-1 text-gray-600 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{log.timestamp}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 font-medium">{log.details}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex-shrink-0 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-400 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}