import { useState } from 'react';
import { X } from 'lucide-react';
import { Plan } from './PlanConfigModal';

interface AddDocumentModalProps {
  onClose: () => void;
  onAdd: (document: {
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
  }) => void;
  plans: Plan[];
}

export function AddDocumentModal({ onClose, onAdd, plans }: AddDocumentModalProps) {
  const [formData, setFormData] = useState({
    documento: '',
    nombre: '',
    fechaNacimiento: '',
    celular: '',
    gmail: '',
    genero: 'Masculino' as 'Masculino' | 'Femenino' | 'No binario',
    planId: plans.length > 0 ? plans[0].id : 0
  });

  const selectedPlan = plans.find(p => p.id === formData.planId);

  const today = new Date();
  const fechaAlta = today.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });

  // Calcular vencimiento según el tipo de plan
  const calculateVencimiento = () => {
    if (!selectedPlan) return '';
    
    const vencimientoDate = new Date(today);
    
    if (selectedPlan.tipo === 'semanal' && selectedPlan.dias) {
      // Para planes semanales: sumar días
      vencimientoDate.setDate(vencimientoDate.getDate() + selectedPlan.dias);
    } else if (selectedPlan.tipo === 'mensual' && selectedPlan.meses) {
      // Para planes mensuales: sumar meses
      vencimientoDate.setMonth(vencimientoDate.getMonth() + selectedPlan.meses);
    }
    
    return vencimientoDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const vencimiento = calculateVencimiento();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.documento.trim()) {
      alert('El documento es obligatorio');
      return;
    }

    if (!formData.nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    if (!selectedPlan) {
      alert('Selecciona un plan');
      return;
    }

    onAdd({
      documento: formData.documento.trim(),
      nombre: formData.nombre.trim(),
      fechaNacimiento: formData.fechaNacimiento,
      celular: formData.celular.trim(),
      gmail: formData.gmail.trim(),
      genero: formData.genero,
      fechaAlta,
      monto: `$${selectedPlan.montoFinal.toFixed(2)}`,
      vencimiento,
      planNombre: selectedPlan.nombre
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-6 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-white">Agregar Miembro</h2>
          <button
            onClick={onClose}
            className="bg-white hover:bg-gray-100 p-2 rounded-full transition-all"
          >
            <X className="w-6 h-6 text-cyan-500" strokeWidth={2.5} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Documento */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Documento <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.documento}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, '');
                setFormData({ ...formData, documento: numericValue });
              }}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
              placeholder="Ej: 12345678"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Solo números, sin prefijo DNI</p>
          </div>

          {/* Nombre y Apellido */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre y Apellido <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
              placeholder="Nombre completo del miembro"
              required
            />
          </div>

          {/* Fecha de Nacimiento */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fecha de Nacimiento <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.fechaNacimiento}
              onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Celular */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Celular <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.celular}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, '');
                setFormData({ ...formData, celular: numericValue });
              }}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
              placeholder="Ej: 1234567890"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Solo números</p>
          </div>

          {/* Gmail */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Gmail <span className="text-gray-400 text-xs">(opcional)</span>
            </label>
            <input
              type="email"
              value={formData.gmail}
              onChange={(e) => setFormData({ ...formData, gmail: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
              placeholder="ejemplo@gmail.com"
            />
          </div>

          {/* Género */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Género <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.genero}
              onChange={(e) => setFormData({ ...formData, genero: e.target.value as 'Masculino' | 'Femenino' | 'No binario' })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors cursor-pointer"
              required
            >
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="No binario">No binario</option>
            </select>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-gray-200 my-6"></div>

          {/* Plan */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Plan <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.planId}
              onChange={(e) => setFormData({ ...formData, planId: Number(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors cursor-pointer"
            >
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.nombre} - ${plan.montoFinal.toFixed(2)}
                  {plan.descuento > 0 && ` (-${plan.descuento}%)`}
                </option>
              ))}
            </select>
          </div>

          {selectedPlan && (
            <>
              {/* Fecha de Alta */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de Alta
                </label>
                <div className="px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50">
                  <span className="text-base font-semibold text-gray-700">
                    {fechaAlta}
                  </span>
                </div>
              </div>

              {/* Vencimiento */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de Vencimiento
                </label>
                <div className="px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50">
                  <span className="text-base font-semibold text-gray-700">
                    {vencimiento}
                  </span>
                </div>
              </div>

              {/* Monto a Pagar */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Monto a Pagar
                </label>
                <div className="px-4 py-3 border-2 border-cyan-300 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-cyan-600">
                      ${selectedPlan.montoFinal.toFixed(2)}
                    </span>
                    {selectedPlan.descuento > 0 && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500 line-through">
                          ${selectedPlan.monto.toFixed(2)}
                        </p>
                        <p className="text-sm font-bold text-green-600">
                          {selectedPlan.descuento}% OFF
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Buttons */}
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
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}