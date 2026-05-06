import { useState } from 'react';
import { X, Lock, DollarSign } from 'lucide-react';

interface PriceConfigWithAuthProps {
  onClose: () => void;
  dayPrices: { [key: number]: number };
  onSave: (prices: { [key: number]: number }, username: string) => void;
  currentUser: string;
}

export function PriceConfigWithAuth({ onClose, dayPrices, onSave, currentUser }: PriceConfigWithAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [prices, setPrices] = useState<{ [key: number]: number }>(dayPrices);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentUser === 'Admin' && password === 'Grandioso') {
      setIsAuthenticated(true);
      setError('');
    } else if (currentUser === 'Profe' && password === 'AnimalGym') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const handlePriceChange = (day: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    setPrices({ ...prices, [day]: numValue });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(prices, currentUser);
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
            className="bg-white hover:bg-gray-100 p-2 rounded-full transition-all"
          >
            <X className="w-6 h-6 text-cyan-500" strokeWidth={2.5} />
          </button>
        </div>

        {!isAuthenticated ? (
          // Auth Form
          <form onSubmit={handleAuth} className="p-6 space-y-5">
            <div className="flex justify-center mb-4">
              <div className="bg-cyan-100 p-4 rounded-full">
                <Lock className="w-8 h-8 text-cyan-600" strokeWidth={2.5} />
              </div>
            </div>
            
            <p className="text-center text-gray-600 font-medium">
              Ingresa tu contraseña para continuar
            </p>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>

            {error && (
              <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              Continuar
            </button>
          </form>
        ) : (
          // Price Config Form
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div key={day} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-semibold text-gray-700">{day} {day === 1 ? 'día' : 'días'}</span>
                <input
                  type="number"
                  value={prices[day]}
                  onChange={(e) => setPrices({ ...prices, [day]: Number(e.target.value) })}
                  className="w-24 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors text-center font-semibold"
                  min="0"
                  step="1"
                />
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
        )}
      </div>
    </div>
  );
}