import { useState } from 'react';
import { X } from 'lucide-react';

interface Document {
  id: number;
  documento: string;
  nombre: string;
  fechaPago: string;
  vencimiento: string;
  dias: number;
  monto: string;
}

interface EditDocumentModalProps {
  onClose: () => void;
  document: Document;
  onSave: (document: Document) => void;
  dayPrices: { [key: number]: number };
}

export function EditDocumentModal({ onClose, document, onSave, dayPrices }: EditDocumentModalProps) {
  const [formData, setFormData] = useState(document);

  const handleDaysChange = (days: number) => {
    setFormData({
      ...formData,
      dias: days,
      monto: `$${dayPrices[days]}`
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.documento.trim()) {
      alert('El documento es obligatorio');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Editar Documento</h2>
          <button
            onClick={onClose}
            className="bg-white hover:bg-gray-100 p-2 rounded-full transition-all"
          >
            <X className="w-6 h-6 text-cyan-500" strokeWidth={2.5} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Documento <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.documento}
              onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fecha de pago
            </label>
            <input
              type="text"
              value={formData.fechaPago}
              disabled
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Días
            </label>
            <select
              value={formData.dias}
              onChange={(e) => handleDaysChange(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <option key={day} value={day}>
                  {day} {day === 1 ? 'día' : 'días'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Vencimiento
            </label>
            <input
              type="text"
              value={formData.vencimiento}
              disabled
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Monto
            </label>
            <div className="px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50">
              <span className="text-2xl font-bold text-cyan-600">
                {formData.monto}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}