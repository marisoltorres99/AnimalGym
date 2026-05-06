import { Users, DollarSign, FileText, X } from 'lucide-react';

interface ConfigMenuProps {
  onClose: () => void;
  onSelectOption: (option: 'members' | 'prices' | 'registry') => void;
  isAdmin: boolean;
}

export function ConfigMenu({ onClose, onSelectOption, isAdmin }: ConfigMenuProps) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      {/* Menu */}
      <div 
        className="absolute left-0 top-full mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border-2 border-gray-200"
        style={{ fontFamily: 'Poppins, sans-serif', minWidth: '280px' }}
      >
        <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-4 flex items-center justify-between">
          <h3 className="text-white font-bold text-lg">Configuración</h3>
          <button
            onClick={onClose}
            className="bg-white hover:bg-gray-100 p-1.5 rounded-full transition-all"
          >
            <X className="w-5 h-5 text-cyan-500" strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-2">
          <button
            onClick={() => {
              onSelectOption('members');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyan-50 transition-all hover:scale-105 active:scale-95 group"
          >
            <div className="bg-cyan-100 p-2 rounded-lg group-hover:bg-cyan-200 transition-colors">
              <Users className="w-5 h-5 text-cyan-600" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-gray-700">Miembros</span>
          </button>

          <button
            onClick={() => {
              onSelectOption('prices');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyan-50 transition-all hover:scale-105 active:scale-95 group"
          >
            <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition-colors">
              <DollarSign className="w-5 h-5 text-green-600" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-gray-700">Planes</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => {
                onSelectOption('registry');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyan-50 transition-all hover:scale-105 active:scale-95 group"
            >
              <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200 transition-colors">
                <FileText className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
              </div>
              <span className="font-semibold text-gray-700">Registro</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}