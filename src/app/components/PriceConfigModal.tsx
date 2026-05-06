import { useState } from 'react';
import { X, DollarSign } from 'lucide-react';

interface PriceConfigModalProps {
  onClose: () => void;
  dayPrices: { [key: number]: number };
  onSave: (prices: { [key: number]: number }) => void;
}

export function PriceConfigModal({ onClose, dayPrices, onSave }: PriceConfigModalProps) {
  const [prices, setPrices] = useState<{ [key: number]: number }>(dayPrices);

  const handlePriceChange = (day: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    setPrices({ ...prices, [day]: numValue });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(prices);
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
          <div className="flex items-center gap-3">
            <DollarSign className="w-7 h-7 text-white" strokeWidth={2.5} />
            <h2 className="text-2xl font-bold text-white">Configurar Precios</h2>
          </div>
          <button
            onClick={onClose}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-all"
          >
            <X className="w-6 h-6 text-white" strokeWidth={2.5} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <div key={day} className="flex items-center gap-4">
              <label className="flex-shrink-0 w-20 text-sm font-semibold text-gray-700">
                {day} {day === 1 ? 'día' : 'días'}:
              </label>
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                  $
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={prices[day]}
                  onChange={(e) => handlePriceChange(day, e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors font-semibold"
                />
              </div>
            </div>
          ))}

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
