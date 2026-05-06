import { useState } from 'react';
import { X, Lock, Plus, Edit2, Trash2, Tag, Percent } from 'lucide-react';

export interface Plan {
  id: number;
  tipo: 'semanal' | 'mensual';
  nombre: string;
  dias?: number;
  meses?: number;
  monto: number;
  descuento: number;
  montoFinal: number;
}

interface PlanConfigModalProps {
  onClose: () => void;
  plans: Plan[];
  onSave: (plans: Plan[], username: string) => void;
  currentUser: string;
}

const PLAN_OPTIONS = {
  semanal: [
    { value: '2-dias', label: '2 Días', dias: 30 },
    { value: '3-dias', label: '3 Días', dias: 30 },
    { value: '4-dias', label: '4 Días', dias: 30 },
    { value: 'pase-libre', label: 'Pase Libre', dias: 30 }
  ],
  mensual: [
    { value: 'bimestral', label: 'Bimestral', meses: 2 },
    { value: 'trimestral', label: 'Trimestral', meses: 3 },
    { value: 'semestral', label: 'Semestral', meses: 6 }
  ]
};

export function PlanConfigModal({ onClose, plans, onSave, currentUser }: PlanConfigModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [localPlans, setLocalPlans] = useState<Plan[]>(plans);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ show: boolean; planId: number; planName: string }>({
    show: false,
    planId: 0,
    planName: ''
  });
  
  // Form fields
  const [tipo, setTipo] = useState<'semanal' | 'mensual'>('semanal');
  const [planSeleccionado, setPlanSeleccionado] = useState('');
  const [monto, setMonto] = useState('');
  const [showDescuento, setShowDescuento] = useState(false);
  const [descuento, setDescuento] = useState('0');

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

  const calculateFinalAmount = (baseAmount: number, discount: number) => {
    return baseAmount - (baseAmount * discount / 100);
  };

  const resetForm = () => {
    setTipo('semanal');
    setPlanSeleccionado('');
    setMonto('');
    setDescuento('0');
    setShowDescuento(false);
    setEditingPlan(null);
    setShowAddForm(false);
  };

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    const baseAmount = parseFloat(monto) || 0;
    const discountPercent = parseFloat(descuento) || 0;

    const planData = tipo === 'semanal' 
      ? PLAN_OPTIONS.semanal.find(p => p.value === planSeleccionado)
      : PLAN_OPTIONS.mensual.find(p => p.value === planSeleccionado);

    if (!planData) return;

    const newPlan: Plan = {
      id: localPlans.length > 0 ? Math.max(...localPlans.map(p => p.id)) + 1 : 1,
      tipo,
      nombre: planData.label,
      dias: 'dias' in planData ? planData.dias : undefined,
      meses: 'meses' in planData ? planData.meses : undefined,
      monto: baseAmount,
      descuento: discountPercent,
      montoFinal: calculateFinalAmount(baseAmount, discountPercent)
    };

    setLocalPlans([...localPlans, newPlan]);
    resetForm();
  };

  const handleEditPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    const baseAmount = parseFloat(monto) || 0;
    const discountPercent = parseFloat(descuento) || 0;

    const planData = tipo === 'semanal' 
      ? PLAN_OPTIONS.semanal.find(p => p.value === planSeleccionado)
      : PLAN_OPTIONS.mensual.find(p => p.value === planSeleccionado);

    if (!planData) return;

    const updatedPlan: Plan = {
      ...editingPlan,
      tipo,
      nombre: planData.label,
      dias: 'dias' in planData ? planData.dias : undefined,
      meses: 'meses' in planData ? planData.meses : undefined,
      monto: baseAmount,
      descuento: discountPercent,
      montoFinal: calculateFinalAmount(baseAmount, discountPercent)
    };

    setLocalPlans(localPlans.map(p => p.id === editingPlan.id ? updatedPlan : p));
    resetForm();
  };

  const handleDeletePlan = (id: number) => {
    const plan = localPlans.find(p => p.id === id);
    if (plan) {
      setConfirmDelete({
        show: true,
        planId: id,
        planName: plan.nombre
      });
    }
  };

  const confirmDeletePlan = () => {
    setLocalPlans(localPlans.filter(p => p.id !== confirmDelete.planId));
    setConfirmDelete({ show: false, planId: 0, planName: '' });
  };

  const handleStartEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setTipo(plan.tipo);
    
    // Encontrar el valor correcto del plan
    const planOptions = plan.tipo === 'semanal' ? PLAN_OPTIONS.semanal : PLAN_OPTIONS.mensual;
    const foundPlan = planOptions.find(p => p.label === plan.nombre);
    if (foundPlan) {
      setPlanSeleccionado(foundPlan.value);
    }
    
    setMonto(plan.monto.toString());
    setDescuento(plan.descuento.toString());
    setShowDescuento(plan.descuento > 0);
    setShowAddForm(true);
  };

  const handleSubmit = () => {
    onSave(localPlans, currentUser);
    onClose();
  };

  const currentPlanOptions = tipo === 'semanal' ? PLAN_OPTIONS.semanal : PLAN_OPTIONS.mensual;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-6 h-6 text-white" strokeWidth={2.5} />
            <h2 className="text-xl font-bold text-white">Gestionar Planes</h2>
          </div>
          <button
            onClick={onClose}
            className="bg-white hover:bg-gray-100 p-1.5 rounded-full transition-all"
          >
            <X className="w-5 h-5 text-cyan-500" strokeWidth={2.5} />
          </button>
        </div>

        {!isAuthenticated ? (
          // Auth Form
          <form onSubmit={handleAuth} className="p-6 space-y-4">
            <div className="flex justify-center mb-3">
              <div className="bg-cyan-100 p-3 rounded-full">
                <Lock className="w-7 h-7 text-cyan-600" strokeWidth={2.5} />
              </div>
            </div>
            
            <p className="text-center text-gray-600 font-medium text-sm">
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
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>

            {error && (
              <div className="bg-red-100 border-2 border-red-400 text-red-700 px-3 py-2 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              Continuar
            </button>
          </form>
        ) : (
          // Plans Management
          <>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Add/Edit Form Column */}
                <div>
                  {showAddForm ? (
                    <form onSubmit={editingPlan ? handleEditPlan : handleAddPlan} className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-xl border-2 border-cyan-200 space-y-3">
                      <h3 className="font-bold text-base text-gray-700 mb-2">
                        {editingPlan ? 'Editar Plan' : 'Agregar Nuevo Plan'}
                      </h3>
                      
                      {/* Tipo de Plan */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Tipo de Plan
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setTipo('semanal');
                              setPlanSeleccionado('');
                            }}
                            className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                              tipo === 'semanal'
                                ? 'bg-cyan-500 text-white'
                                : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-cyan-300'
                            }`}
                          >
                            Semanal
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTipo('mensual');
                              setPlanSeleccionado('');
                            }}
                            className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                              tipo === 'mensual'
                                ? 'bg-cyan-500 text-white'
                                : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-cyan-300'
                            }`}
                          >
                            Mensual
                          </button>
                        </div>
                      </div>

                      {/* Plan Selection */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Seleccionar Plan
                        </label>
                        <select
                          value={planSeleccionado}
                          onChange={(e) => setPlanSeleccionado(e.target.value)}
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors text-sm"
                          required
                        >
                          <option value="">-- Selecciona --</option>
                          {currentPlanOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Monto */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Monto ($)
                        </label>
                        <input
                          type="number"
                          value={monto}
                          onChange={(e) => setMonto(e.target.value)}
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors text-sm"
                          placeholder="50"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>

                      {/* Descuento Button/Field */}
                      {!showDescuento ? (
                        <button
                          type="button"
                          onClick={() => setShowDescuento(true)}
                          className="w-full px-3 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2 text-sm"
                        >
                          <Percent className="w-4 h-4" />
                          Agregar Descuento
                        </button>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-sm font-semibold text-gray-700">
                              Descuento (%)
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setShowDescuento(false);
                                setDescuento('0');
                              }}
                              className="text-xs text-red-600 hover:text-red-700 font-semibold"
                            >
                              Quitar
                            </button>
                          </div>
                          <select
                            value={descuento}
                            onChange={(e) => setDescuento(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors text-sm"
                          >
                            <option value="0">0%</option>
                            <option value="5">5%</option>
                            <option value="10">10%</option>
                            <option value="15">15%</option>
                            <option value="20">20%</option>
                            <option value="25">25%</option>
                            <option value="30">30%</option>
                            <option value="35">35%</option>
                            <option value="40">40%</option>
                            <option value="45">45%</option>
                            <option value="50">50%</option>
                            <option value="55">55%</option>
                            <option value="60">60%</option>
                            <option value="65">65%</option>
                            <option value="70">70%</option>
                            <option value="75">75%</option>
                            <option value="80">80%</option>
                            <option value="85">85%</option>
                            <option value="90">90%</option>
                            <option value="95">95%</option>
                            <option value="100">100%</option>
                          </select>
                        </div>
                      )}

                      {/* Preview */}
                      {monto && (
                        <div className="bg-white p-2.5 rounded-lg border-2 border-cyan-300">
                          <p className="text-xs font-medium text-gray-600">Precio Final:</p>
                          <p className="text-xl font-bold text-cyan-600">
                            ${calculateFinalAmount(parseFloat(monto) || 0, parseFloat(descuento) || 0).toFixed(2)}
                          </p>
                          {showDescuento && parseFloat(descuento) > 0 && (
                            <p className="text-xs text-green-600 font-semibold">
                              Ahorro: ${(parseFloat(monto) * parseFloat(descuento) / 100).toFixed(2)}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={resetForm}
                          className="flex-1 px-3 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-sm"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 text-sm"
                        >
                          {editingPlan ? 'Actualizar' : 'Agregar'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="w-full px-3 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" strokeWidth={2.5} />
                      Agregar Nuevo Plan
                    </button>
                  )}
                </div>

                {/* Plans List Column */}
                <div className="space-y-2">
                  <h3 className="font-bold text-base text-gray-700">Planes Actuales</h3>
                  
                  <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2">
                    {localPlans.length === 0 ? (
                      <div className="text-center py-6 text-gray-500">
                        <p className="text-sm">No hay planes configurados</p>
                        <p className="text-xs">Agrega tu primer plan</p>
                      </div>
                    ) : (
                      localPlans.map((plan) => (
                        <div key={plan.id} className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-cyan-300 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-sm text-gray-800">{plan.nombre}</h4>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                  plan.tipo === 'semanal' 
                                    ? 'bg-purple-100 text-purple-700' 
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {plan.tipo === 'semanal' ? 'Semanal' : 'Mensual'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                                {plan.dias && <span className="font-semibold">{plan.dias} días</span>}
                                {plan.meses && <span className="font-semibold">{plan.meses} {plan.meses === 1 ? 'mes' : 'meses'}</span>}
                                <span>•</span>
                                <span>Base: ${plan.monto.toFixed(2)}</span>
                                {plan.descuento > 0 && (
                                  <>
                                    <span>•</span>
                                    <span className="text-green-600 font-semibold">-{plan.descuento}%</span>
                                  </>
                                )}
                              </div>
                              <div className="mt-1">
                                <span className="text-lg font-bold text-cyan-600">${plan.montoFinal.toFixed(2)}</span>
                              </div>
                            </div>
                            
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => handleStartEdit(plan)}
                                className="p-1.5 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                                title="Editar"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeletePlan(plan.id)}
                                className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 bg-gray-50 border-t-2 border-gray-200 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-5 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                Guardar Cambios
              </button>
            </div>
          </>
        )}
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete.show && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]"
          onClick={() => setConfirmDelete({ show: false, planId: 0, planName: '' })}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            <div className="bg-gradient-to-r from-red-400 to-red-500 p-6">
              <h3 className="text-xl font-bold text-white">Confirmar Eliminación</h3>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 font-medium text-center">
                ¿Estás seguro de eliminar el plan <span className="font-bold text-red-600">{confirmDelete.planName}</span>?
              </p>
              <p className="text-sm text-gray-500 text-center mt-2">
                Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => setConfirmDelete({ show: false, planId: 0, planName: '' })}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeletePlan}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-400 to-red-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}