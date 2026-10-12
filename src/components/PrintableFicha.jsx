import React from 'react';
import { Printer, ArrowLeft, Download } from 'lucide-react';

export default function PrintableFicha({ ficha, onBack }) {
  if (!ficha) return null;

  const handlePrint = () => {
    window.print();
  };

  const {
    dni,
    nombres,
    edad,
    sexo,
    fecha,
    examenExtraoral = {},
    examenIntraoral = {},
    diagnostico,
    creadoPor
  } = ficha;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top action bar (hidden on print) */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm no-print">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a expedientes</span>
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir / Exportar a PDF</span>
        </button>
      </div>

      {/* Official Clinical Sheet Container (Printable Area) */}
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-slate-200 space-y-8 print:shadow-none print:border-none print:p-0 print:m-0">
        
        {/* Document Header */}
        <div className="text-center border-b-2 border-slate-800 pb-4">
          <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-900">Ficha de Evaluación Estomatológica & Ortodóntica</h1>
          <p className="text-xs text-slate-600 uppercase mt-1">Historia Clínica Dental Digital - Registro Oficial</p>
        </div>

        {/* Patient Filiatory Data */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="block text-xs font-bold text-slate-500 uppercase">Nombres y Apellidos</span>
            <span className="font-semibold text-slate-900">{nombres || '___'}</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-500 uppercase">DNI / Documento</span>
            <span className="font-semibold text-slate-900">{dni || '___'}</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-500 uppercase">Edad / Sexo</span>
            <span className="font-semibold text-slate-900">{edad ? `${edad} años` : '___'} / {sexo || '___'}</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-500 uppercase">Fecha de Atención</span>
            <span className="font-semibold text-slate-900">{fecha || '___'}</span>
          </div>
        </div>

        {/* A. EXAMEN EXTRAORAL */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold border-b border-slate-300 pb-1 text-slate-900">A. EXAMEN EXTRAORAL</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">1) Biotipo Facial:</span>
              <span className="text-teal-800 font-semibold">{examenExtraoral.biotipo || 'No registrado'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">2) Perfil Facial:</span>
              <span className="text-teal-800 font-semibold">{examenExtraoral.perfil || 'No registrado'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">3) Simetría:</span>
              <span className="text-teal-800 font-semibold">{examenExtraoral.simetria || 'No registrado'}</span>
              {examenExtraoral.observacionesSimetria && (
                <p className="text-xs text-slate-500 mt-1">{examenExtraoral.observacionesSimetria}</p>
              )}
            </div>
          </div>
        </div>

        {/* B. EXAMEN INTRAORAL */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold border-b border-slate-300 pb-1 text-slate-900">B. EXAMEN INTRAORAL</h2>

          {/* Queilograma & Palatograma */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="p-4 border border-slate-200 rounded-xl space-y-2">
              <h3 className="font-bold text-slate-800">1. Queilograma</h3>
              <p><span className="text-slate-600 font-medium">Clasificación según comisura:</span> {examenIntraoral.queilogramaComisura || '___'}</p>
              <p><span className="text-slate-600 font-medium">Codificación Suzuki y Tsuchihashi:</span> {examenIntraoral.codificacionSuzuki || '___'}</p>
            </div>
            <div className="p-4 border border-slate-200 rounded-xl space-y-2">
              <h3 className="font-bold text-slate-800">2. Palatograma</h3>
              <p className="text-slate-700">{examenIntraoral.palatograma || 'Sin observaciones de zonas palatinas'}</p>
            </div>
          </div>

          {/* Relaciones Oclusales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 border border-slate-200 rounded-lg">
              <span className="font-bold text-slate-700 block">3. Relación Maxilar/Mandibular:</span>
              <span className="text-slate-900 font-semibold">{examenIntraoral.relacionMaxilarMandibular || '___'}</span>
            </div>
            <div className="p-3 border border-slate-200 rounded-lg">
              <span className="font-bold text-slate-700 block">4. Relación Molar (Angle):</span>
              <span className="text-slate-900 font-semibold">{examenIntraoral.relacionMolar || '___'}</span>
            </div>
            <div className="p-3 border border-slate-200 rounded-lg">
              <span className="font-bold text-slate-700 block">5. Relación Canina:</span>
              <span className="text-slate-900 font-semibold">{examenIntraoral.relacionCanina || '___'}</span>
            </div>
          </div>

          {/* Maloclusiones */}
          <div className="p-4 border border-slate-200 rounded-xl text-sm space-y-2">
            <h3 className="font-bold text-slate-800">6. Maloclusiones Dentales (Plano Espacial):</h3>
            {examenIntraoral.maloclusiones && examenIntraoral.maloclusiones.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {examenIntraoral.maloclusiones.map((m, i) => (
                  <span key={i} className="bg-slate-100 text-slate-800 px-3 py-1 rounded-md font-medium border border-slate-200">
                    ✓ {m}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-slate-500">Ninguna maloclusión registrada</span>
            )}
          </div>

          {/* Medidas Horizontales y Verticales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-teal-50/50 border border-teal-200 rounded-lg">
              <span className="font-bold text-slate-700 block">7. Dimensión Horizontal (Overjet):</span>
              <span className="text-teal-900 font-bold text-base">{examenIntraoral.overjet ?? '___'} mm</span>
            </div>
            <div className="p-3 bg-teal-50/50 border border-teal-200 rounded-lg">
              <span className="font-bold text-slate-700 block">Dimensión Vertical (Overbite):</span>
              <span className="text-teal-900 font-bold text-base">{examenIntraoral.overbite ?? '___'} mm</span>
            </div>
            <div className="p-3 bg-teal-50/50 border border-teal-200 rounded-lg">
              <span className="font-bold text-slate-700 block">10. Curva de Spee:</span>
              <span className="text-teal-900 font-bold text-base">{examenIntraoral.curvaSpee?.medida ?? '___'} mm ({examenIntraoral.curvaSpee?.estado || 'Normal'})</span>
            </div>
          </div>

          {/* Arcos Dentales y Clasificación Kennedy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="p-4 border border-slate-200 rounded-xl space-y-2">
              <h3 className="font-bold text-slate-800">8. Arcos Dentales</h3>
              <p><span className="text-slate-600 font-medium">Arco Superior:</span> <span className="font-semibold">{examenIntraoral.arcosDentales?.superior || '___'}</span></p>
              <p><span className="text-slate-600 font-medium">Arco Inferior:</span> <span className="font-semibold">{examenIntraoral.arcosDentales?.inferior || '___'}</span></p>
            </div>
            <div className="p-4 border border-slate-200 rounded-xl space-y-2">
              <h3 className="font-bold text-slate-800">9. Clasificación de Kennedy</h3>
              <p><span className="text-slate-600 font-medium">Clase:</span> <span className="font-semibold">{examenIntraoral.kennedy?.clase || '___'}</span></p>
              <p><span className="text-slate-600 font-medium">Modificación:</span> <span className="font-semibold">{examenIntraoral.kennedy?.modificacion || 'Sin modificación'}</span></p>
            </div>
          </div>

          {/* Diagnóstico General */}
          {diagnostico && (
            <div className="p-4 bg-slate-50 border-l-4 border-teal-600 rounded-r-xl space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Conclusiones y Diagnóstico</h3>
              <p className="text-slate-700 text-sm">{diagnostico}</p>
            </div>
          )}

        </div>

        {/* Document Footer & Signatures */}
        <div className="pt-12 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs text-slate-600">
          <div>
            <div className="border-b border-slate-400 w-48 mx-auto mb-2"></div>
            <p className="font-semibold text-slate-800">Firma / Sello del Odontólogo</p>
            <p>{creadoPor || 'Especialista a cargo'}</p>
          </div>
          <div>
            <div className="border-b border-slate-400 w-48 mx-auto mb-2"></div>
            <p className="font-semibold text-slate-800">Conformidad del Paciente</p>
            <p>DNI: {dni || '___'}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
