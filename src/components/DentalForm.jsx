import React, { useState, useEffect } from 'react';
import VisualSelector from './VisualSelector';
import { Save, ArrowRight, ArrowLeft, CheckCircle2, UserCheck, Activity, Stethoscope } from 'lucide-react';

export default function DentalForm({ initialFicha = null, onSaved, onCancel }) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form State initialized to match the fields of ficha optimizada.docx
  const [formData, setFormData] = useState({
    id: '',
    dni: '',
    nombres: '',
    edad: '',
    sexo: 'Masculino',
    fecha: new Date().toISOString().split('T')[0],
    examenExtraoral: {
      biotipo: 'Meso Facial',
      perfil: 'Convexo',
      simetria: 'Simétrico',
      observacionesSimetria: ''
    },
    examenIntraoral: {
      queilogramaComisura: '',
      codificacionSuzuki: '',
      palatograma: '',
      relacionMaxilarMandibular: 'Protrusión Maxilar',
      relacionMolar: 'Clase I',
      relacionCanina: 'Clase I',
      maloclusiones: [],
      overjet: 2.0,
      overbite: 2.0,
      arcosDentales: {
        superior: 'Parabólico/U',
        inferior: 'Ovoide'
      },
      kennedy: {
        clase: 'Clase I',
        modificacion: 'Sin modificación'
      },
      curvaSpee: {
        medida: 1.5,
        estado: 'Normal'
      }
    },
    diagnostico: ''
  });

  useEffect(() => {
    if (initialFicha) {
      setFormData(prev => ({
        ...prev,
        ...initialFicha,
        examenExtraoral: { ...prev.examenExtraoral, ...initialFicha.examenExtraoral },
        examenIntraoral: { ...prev.examenIntraoral, ...initialFicha.examenIntraoral }
      }));
    }
  }, [initialFicha]);

  const updateExtraoral = (key, value) => {
    setFormData(prev => ({
      ...prev,
      examenExtraoral: {
        ...prev.examenExtraoral,
        [key]: value
      }
    }));
  };

  const updateIntraoral = (key, value) => {
    setFormData(prev => ({
      ...prev,
      examenIntraoral: {
        ...prev.examenIntraoral,
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.dni || !formData.nombres) {
      setError('Por favor complete el DNI y los Nombres del paciente');
      setStep(1);
      return;
    }

    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('dental_token');
      const res = await fetch('/api/fichas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar la ficha');
      }

      if (onSaved) onSaved(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Option definitions with images from /images/
  const biotipoOptions = [
    { label: 'a) Meso Facial', value: 'Meso Facial', desc: 'Proporciones faciales balanceadas' },
    { label: 'b) Dólico Facial', value: 'Dólico Facial', desc: 'Rostro alargado y estrecho' },
    { label: 'c) Braqui Facial', value: 'Braqui Facial', desc: 'Rostro ancho y corto' }
  ];

  const perfilOptions = [
    { label: 'a) Convexo', value: 'Convexo', desc: 'Perfil prominente en el tercio medio' },
    { label: 'b) Cóncavo', value: 'Cóncavo', desc: 'Perfil retrusivo en el tercio medio' },
    { label: 'c) Recto', value: 'Recto', desc: 'Alineación perfil recto' }
  ];

  const simetriaOptions = [
    { label: 'a) Simétrico', value: 'Simétrico', desc: 'Línea media facial centrada' },
    { label: 'b) Asimétrico', value: 'Asimétrico', desc: 'Desviación en mentón o tercios' }
  ];

  const maxilarOptions = [
    { label: 'Protrusión Maxilar', value: 'Protrusión Maxilar' },
    { label: 'Protrusión Mandibular', value: 'Protrusión Mandibular' },
    { label: 'Retrusión Maxilar', value: 'Retrusión Maxilar' },
    { label: 'Retrusión Mandibular', value: 'Retrusión Mandibular' }
  ];

  const molarOptions = [
    { label: 'Clase I', value: 'Clase I', desc: 'Normoclusión molar' },
    { label: 'Clase II Div.1', value: 'Clase II Div.1', desc: 'Distoclusión con incisivos vestibulizados' },
    { label: 'Clase II Div.2', value: 'Clase II Div.2', desc: 'Distoclusión con incisivos lingualizados' },
    { label: 'Clase III', value: 'Clase III', desc: 'Mesioclusión molar' }
  ];

  const caninaOptions = [
    { label: 'Clase I', value: 'Clase I' },
    { label: 'Clase II', value: 'Clase II' },
    { label: 'Clase III', value: 'Clase III' }
  ];

  const maloclusionOptions = [
    { label: 'Mordida abierta', value: 'Mordida abierta' },
    { label: 'Mordida cruzada anterior', value: 'Mordida cruzada anterior' },
    { label: 'Mordida cruzada posterior', value: 'Mordida cruzada posterior' }
  ];

  const arcosOptions = [
    { label: 'Ovoide', value: 'Ovoide' },
    { label: 'Cuadrado', value: 'Cuadrado' },
    { label: 'Triangular', value: 'Triangular' },
    { label: 'Parabólico/U', value: 'Parabólico/U' },
    { label: 'Redonda', value: 'Redonda' }
  ];

  const kennedyClassOptions = [
    { label: 'Clase I', value: 'Clase I', desc: 'Edentulismo bilateral posterior' },
    { label: 'Clase II', value: 'Clase II', desc: 'Edentulismo unilateral posterior' },
    { label: 'Clase III', value: 'Clase III', desc: 'Edentulismo unilateral dentosoportado' },
    { label: 'Clase IV', value: 'Clase IV', desc: 'Edentulismo anterior cruzando línea media' }
  ];

  const kennedyModOptions = [
    { label: 'Sin mod.', value: 'Sin modificación' },
    { label: 'Mod 1', value: 'Mod 1' },
    { label: 'Mod 2', value: 'Mod 2' },
    { label: 'Mod 3', value: 'Mod 3' }
  ];

  const speeOptions = [
    { label: 'Normal', value: 'Normal' },
    { label: 'Aumentada', value: 'Aumentada' },
    { label: 'Plana/Invertida', value: 'Plana/Invertida' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      
      {/* Step Header Indicator */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {formData.id ? 'Editar Ficha Clínica' : 'Nueva Ficha de Evaluación Estomatológica'}
            </h2>
            <p className="text-xs text-slate-500">Ingrese los datos clínicos del paciente con asistencia gráfica</p>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-500 hover:text-slate-800 text-sm font-medium px-3 py-1.5 rounded-lg border border-slate-200"
          >
            Cancelar
          </button>
        </div>

        {/* Step Wizard Tabs */}
        <div className="grid grid-cols-4 gap-2 mt-6">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
              step === 1 ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4 hidden sm:block" />
            <span>1. Filiación</span>
          </button>

          <button
            onClick={() => setStep(2)}
            className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
              step === 2 ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Activity className="w-4 h-4 hidden sm:block" />
            <span>2. Extraoral</span>
          </button>

          <button
            onClick={() => setStep(3)}
            className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
              step === 3 ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Stethoscope className="w-4 h-4 hidden sm:block" />
            <span>3. Intraoral</span>
          </button>

          <button
            onClick={() => setStep(4)}
            className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
              step === 4 ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 hidden sm:block" />
            <span>4. Diagnóstico</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm rounded-r-xl">
          {error}
        </div>
      )}

      {/* STEP 1: DATOS FILIATORIOS */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-lg border-b pb-3">1. Datos Filiatorios del Paciente</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nombres y Apellidos *</label>
              <input
                type="text"
                required
                value={formData.nombres}
                onChange={e => setFormData({ ...formData, nombres: e.target.value })}
                placeholder="ej. Juan Carlos Pérez"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">DNI / Documento Identidad *</label>
              <input
                type="text"
                required
                value={formData.dni}
                onChange={e => setFormData({ ...formData, dni: e.target.value })}
                placeholder="ej. 73940192"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Edad</label>
              <input
                type="number"
                value={formData.edad}
                onChange={e => setFormData({ ...formData, edad: e.target.value })}
                placeholder="ej. 25"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Sexo</label>
              <select
                value={formData.sexo}
                onChange={e => setFormData({ ...formData, sexo: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Fecha de Consulta</label>
              <input
                type="date"
                value={formData.fecha}
                onChange={e => setFormData({ ...formData, fecha: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-colors"
            >
              <span>Siguiente: Examen Extraoral</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: EXAMEN EXTRAORAL */}
      {step === 2 && (
        <div className="space-y-6">
          <VisualSelector
            title="1) Biotipo Facial"
            options={biotipoOptions}
            value={formData.examenExtraoral.biotipo}
            onChange={val => updateExtraoral('biotipo', val)}
            imageSrc="/images/biotipo.jpeg"
            helpText="Seleccione según las proporciones del cráneo"
          />

          <VisualSelector
            title="2) Perfil Facial"
            options={perfilOptions}
            value={formData.examenExtraoral.perfil}
            onChange={val => updateExtraoral('perfil', val)}
            imageSrc="/images/perfil.png"
            helpText="Evaluación del perfil lateral facial"
          />

          <VisualSelector
            title="3) Simetría Facial"
            options={simetriaOptions}
            value={formData.examenExtraoral.simetria}
            onChange={val => updateExtraoral('simetria', val)}
            imageSrc="/images/simetria.png"
            helpText="Evaluación respecto a la línea media facial"
          />

          {formData.examenExtraoral.simetria === 'Asimétrico' && (
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Detalle de Asimetría</label>
              <input
                type="text"
                value={formData.examenExtraoral.observacionesSimetria}
                onChange={e => updateExtraoral('observacionesSimetria', e.target.value)}
                placeholder="Desviación de mentón a la derecha, etc."
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          )}

          <div className="flex justify-between pt-4 bg-white p-4 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 px-4 py-2 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-colors"
            >
              <span>Siguiente: Examen Intraoral</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: EXAMEN INTRAORAL */}
      {step === 3 && (
        <div className="space-y-6">
          
          {/* Queilograma y Palatograma */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 text-base">Queilograma & Palatograma</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Clasificación según comisura</label>
                <input
                  type="text"
                  value={formData.examenIntraoral.queilogramaComisura}
                  onChange={e => updateIntraoral('queilogramaComisura', e.target.value)}
                  placeholder="ej. Horizontal, Caída, Eleva"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Codificación Suzuki y Tsuchihashi</label>
                <input
                  type="text"
                  value={formData.examenIntraoral.codificacionSuzuki}
                  onChange={e => updateIntraoral('codificacionSuzuki', e.target.value)}
                  placeholder="ej. Tipo I, Tipo II"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Palatograma (Observación Zonas Palatinas)</label>
              <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                <img src="/images/palatograma.png" alt="Palatograma" className="h-36 object-contain rounded-lg" />
                <textarea
                  rows="3"
                  value={formData.examenIntraoral.palatograma}
                  onChange={e => updateIntraoral('palatograma', e.target.value)}
                  placeholder="Observaciones de zonas 1 a 4, rugas palatinas o líneas de referencia A, R, B..."
                  className="w-full p-3 border border-slate-300 rounded-xl text-sm bg-white"
                />
              </div>
            </div>
          </div>

          <VisualSelector
            title="3. Relación Maxilar/Mandibular"
            options={maxilarOptions}
            value={formData.examenIntraoral.relacionMaxilarMandibular}
            onChange={val => updateIntraoral('relacionMaxilarMandibular', val)}
          />

          <VisualSelector
            title="4. Relación Molar (Angle)"
            options={molarOptions}
            value={formData.examenIntraoral.relacionMolar}
            onChange={val => updateIntraoral('relacionMolar', val)}
            imageSrc="/images/relacion_molar.png"
            helpText="Clasificación de Angle"
          />

          <VisualSelector
            title="5. Relación Canina"
            options={caninaOptions}
            value={formData.examenIntraoral.relacionCanina}
            onChange={val => updateIntraoral('relacionCanina', val)}
            imageSrc="/images/relacion_canina.png"
          />

          <VisualSelector
            title="6. Maloclusiones Dentales (Plano Espacial)"
            options={maloclusionOptions}
            value={formData.examenIntraoral.maloclusiones}
            onChange={val => updateIntraoral('maloclusiones', val)}
            isMulti={true}
            imageSrc="/images/maloclusiones.png"
            helpText="Puede seleccionar múltiples opciones"
          />

          {/* Overjet y Overbite */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 text-base">7. Dimensión Horizontal y Vertical</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="flex justify-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                <img src="/images/overjet_overbite.png" alt="Overjet y Overbite" className="h-44 object-contain rounded-lg" />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Overjet (Resalte horizontal en mm)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      value={formData.examenIntraoral.overjet}
                      onChange={e => updateIntraoral('overjet', parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm pr-12"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400">mm</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Overbite (Sobremordida vertical en mm)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      value={formData.examenIntraoral.overbite}
                      onChange={e => updateIntraoral('overbite', parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm pr-12"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400">mm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Arcos Dentales */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 text-base">8. Arcos Dentales</h4>
            
            <div className="flex justify-center bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3">
              <img src="/images/arcos_dentales.png" alt="Forma de arcos dentales" className="max-h-36 object-contain rounded-lg" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Arco Superior</label>
                <select
                  value={formData.examenIntraoral.arcosDentales.superior}
                  onChange={e => updateIntraoral('arcosDentales', { ...formData.examenIntraoral.arcosDentales, superior: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm bg-white"
                >
                  {arcosOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Arco Inferior</label>
                <select
                  value={formData.examenIntraoral.arcosDentales.inferior}
                  onChange={e => updateIntraoral('arcosDentales', { ...formData.examenIntraoral.arcosDentales, inferior: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm bg-white"
                >
                  {arcosOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Kennedy & Curva Spee */}
          <VisualSelector
            title="9. Clasificación de Kennedy (Edentulismo Parcial)"
            options={kennedyClassOptions}
            value={formData.examenIntraoral.kennedy.clase}
            onChange={val => updateIntraoral('kennedy', { ...formData.examenIntraoral.kennedy, clase: val })}
            imageSrc="/images/kennedy.png"
          />

          <VisualSelector
            title="Modificación de Kennedy"
            options={kennedyModOptions}
            value={formData.examenIntraoral.kennedy.modificacion}
            onChange={val => updateIntraoral('kennedy', { ...formData.examenIntraoral.kennedy, modificacion: val })}
          />

          {/* Curva Spee */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 text-base">10. Curva de Spee</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="flex justify-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                <img src="/images/spee.jpeg" alt="Curva de Spee" className="h-28 object-contain rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Medición en mm</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.examenIntraoral.curvaSpee.medida}
                  onChange={e => updateIntraoral('curvaSpee', { ...formData.examenIntraoral.curvaSpee, medida: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Estado</label>
                <select
                  value={formData.examenIntraoral.curvaSpee.estado}
                  onChange={e => updateIntraoral('curvaSpee', { ...formData.examenIntraoral.curvaSpee, estado: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm bg-white"
                >
                  {speeOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 bg-white p-4 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 px-4 py-2 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(4)}
              className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-colors"
            >
              <span>Siguiente: Diagnóstico</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: DIAGNÓSTICO Y GUARDADO */}
      {step === 4 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-lg border-b pb-3">4. Conclusiones y Diagnóstico Odontológico</h3>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Observaciones Diagnósticas y Plan de Tratamiento</label>
            <textarea
              rows="5"
              value={formData.diagnostico}
              onChange={e => setFormData({ ...formData, diagnostico: e.target.value })}
              placeholder="Describa los hallazgos principales, diagnóstico oclusal, recomendaciones ortodónticas y plan de tratamiento..."
              className="w-full p-4 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-600">
            <p className="font-semibold text-slate-800 text-sm">Resumen de Guardado Remoto:</p>
            <p>• Paciente: <strong className="text-slate-900">{formData.nombres}</strong> (DNI: {formData.dni})</p>
            <p>• Biotipo: <strong>{formData.examenExtraoral.biotipo}</strong> | Perfil: <strong>{formData.examenExtraoral.perfil}</strong></p>
            <p>• Oclusión: <strong>{formData.examenIntraoral.relacionMolar}</strong> | Canina: <strong>{formData.examenIntraoral.relacionCanina}</strong></p>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 px-4 py-2 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{saving ? 'Guardando en Servidor...' : 'Guardar Ficha Clínica'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
