import React, { useState } from 'react';
import {
  Stethoscope,
  User,
  HeartPulse,
  Activity,
  Thermometer,
  Scale,
  Droplets,
  AlertTriangle,
  History,
  FileText,
  Plus,
  Trash2,
  Printer,
  Send,
  CheckCircle2,
  X,
  QrCode,
  Shield,
  Pill,
  Clock,
  Sparkles
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

const commonDiagnoses = [
  'Essential Hypertension',
  'Type-2 Diabetes Mellitus',
  'Mild Dyslipidemia',
  'Gastroesophageal Reflux (GERD)',
  'Acute Viral Pharyngitis',
  'Bronchial Asthma',
  'Osteoarthritis Knee',
  'Tension Headache',
];

export default function DoctorConsole() {
  const {
    patients,
    activeConsultationPatient,
    setActiveConsultationPatient,
    saveConsultation,
    showToast,
  } = useHospital();

  const currentPatient = activeConsultationPatient || patients[1];

  // Vitals State
  const [vitals, setVitals] = useState({
    bp: currentPatient?.vitals?.bp || '138/88',
    pulse: currentPatient?.vitals?.pulse || '78',
    temp: currentPatient?.vitals?.temp || '98.4',
    weight: currentPatient?.vitals?.weight || '74',
    spo2: currentPatient?.vitals?.spo2 || '98',
  });

  // Diagnoses chips state
  const [selectedDiagnoses, setSelectedDiagnoses] = useState([
    'Essential Hypertension',
    'Mild Dyslipidemia',
  ]);
  const [customDiagnosisInput, setCustomDiagnosisInput] = useState('');

  // Medications state
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: 'Telmisartan 40mg',
      dosage: '1 Tablet',
      freq: '1-0-0 (Morning)',
      days: '30 Days',
      instruction: 'After breakfast',
    },
    {
      id: 2,
      name: 'Metformin 500mg',
      dosage: '1 Tablet',
      freq: '1-0-1 (After Meals)',
      days: '30 Days',
      instruction: 'With meals',
    },
    {
      id: 3,
      name: 'Atorvastatin 10mg',
      dosage: '1 Tablet',
      freq: '0-0-1 (Night)',
      days: '30 Days',
      instruction: 'Before bedtime',
    },
  ]);

  const [doctorNotes, setDoctorNotes] = useState(
    'Salt restricted diet (<5g/day). Regular 30 min brisk walk. Follow-up after 4 weeks with Fasting Blood Sugar and Lipid Profile.'
  );

  // Print Preview Modal State
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Quick Switch Patient
  const handleSelectPatient = (e) => {
    const selected = patients.find((p) => p.token === e.target.value);
    if (selected) {
      setActiveConsultationPatient(selected);
      setVitals({
        bp: selected.vitals?.bp || '120/80',
        pulse: selected.vitals?.pulse || '72',
        temp: selected.vitals?.temp || '98.6',
        weight: selected.vitals?.weight || '70',
        spo2: selected.vitals?.spo2 || '99',
      });
    }
  };

  const toggleDiagnosis = (diag) => {
    if (selectedDiagnoses.includes(diag)) {
      setSelectedDiagnoses(selectedDiagnoses.filter((d) => d !== diag));
    } else {
      setSelectedDiagnoses([...selectedDiagnoses, diag]);
    }
  };

  const handleAddCustomDiagnosis = (e) => {
    e.preventDefault();
    if (customDiagnosisInput.trim() && !selectedDiagnoses.includes(customDiagnosisInput.trim())) {
      setSelectedDiagnoses([...selectedDiagnoses, customDiagnosisInput.trim()]);
      setCustomDiagnosisInput('');
    }
  };

  const handleAddMedicationRow = () => {
    const newMed = {
      id: Date.now(),
      name: 'Pantoprazole 40mg',
      dosage: '1 Tablet',
      freq: '1-0-0 (Morning)',
      days: '14 Days',
      instruction: '30 mins before breakfast',
    };
    setMedications([...medications, newMed]);
  };

  const handleUpdateMed = (id, field, value) => {
    setMedications(
      medications.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleRemoveMed = (id) => {
    setMedications(medications.filter((m) => m.id !== id));
  };

  const handleSaveAndSendPharmacy = () => {
    saveConsultation(
      currentPatient.token,
      selectedDiagnoses,
      medications,
      doctorNotes,
      vitals
    );
  };

  const handlePrintSlip = () => {
    setIsPrintModalOpen(true);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Banner: Active Patient Selector */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-700 text-white flex flex-col items-center justify-center shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Token</span>
            <span className="text-sm font-extrabold">{currentPatient.token}</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">{currentPatient.name}</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {currentPatient.age} Y / {currentPatient.gender}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono text-teal-800 bg-teal-50 border border-teal-200">
                UHID: {currentPatient.uhid}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Chief Complaints: <span className="text-slate-800 font-medium">{currentPatient.symptoms}</span>
            </p>
          </div>
        </div>

        {/* Patient Switcher & Status */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-slate-400 font-medium">Switch Active Patient</div>
            <select
              value={currentPatient.token}
              onChange={handleSelectPatient}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded px-2.5 py-1 focus:ring-1 focus:ring-teal-700"
            >
              {patients.map((p) => (
                <option key={p.token} value={p.token}>
                  {p.token} - {p.name} ({p.department})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintSlip}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-white border border-slate-200 text-slate-700 hover:text-teal-700 hover:border-teal-600/40 text-xs font-semibold shadow-2xs transition"
            >
              <Printer className="w-3.5 h-3.5 text-teal-700" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={handleSaveAndSendPharmacy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Save & Pharmacy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Clinical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Patient Medical History & Clinical Baseline (5 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Critical Clinical Alerts */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Allergies & Contraindications</span>
            </h3>
            <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 font-medium">
              ⚠️ Allergies: <span className="font-bold">{currentPatient.history.allergies}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <span className="font-semibold text-slate-900">Chronic Conditions:</span>{' '}
              {currentPatient.history.chronic}
            </div>
          </div>

          {/* Vitals Baseline Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <HeartPulse className="w-3.5 h-3.5 text-teal-700" />
                <span>Recorded Vitals</span>
              </h3>
              <span className="text-[10px] text-slate-400">Triage: 09:05 AM</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                  <Activity className="w-3 h-3 text-teal-700" /> Blood Pressure
                </div>
                <div className="text-base font-bold text-slate-900 mt-1">{vitals.bp} <span className="text-[10px] text-slate-400 font-normal">mmHg</span></div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                  <HeartPulse className="w-3 h-3 text-red-600" /> Pulse
                </div>
                <div className="text-base font-bold text-slate-900 mt-1">{vitals.pulse} <span className="text-[10px] text-slate-400 font-normal">bpm</span></div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-amber-600" /> Temperature
                </div>
                <div className="text-base font-bold text-slate-900 mt-1">{vitals.temp} <span className="text-[10px] text-slate-400 font-normal">°F</span></div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                  <Scale className="w-3 h-3 text-teal-700" /> Weight & SpO2
                </div>
                <div className="text-base font-bold text-slate-900 mt-1">{vitals.weight}kg <span className="text-xs font-normal text-slate-500">/ {vitals.spo2}%</span></div>
              </div>
            </div>
          </div>

          {/* Past Visits & Longitudinal History */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <History className="w-3.5 h-3.5 text-teal-700" />
              <span>Prior Consultations & Visits</span>
            </h3>

            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-200 text-xs">
                <div className="flex items-center justify-between text-slate-500 text-[10px] font-medium">
                  <span>12 Aug 2026 • OPD Card #0412</span>
                  <span className="text-teal-700 font-semibold">Dr. Vivek Sharma</span>
                </div>
                <p className="font-semibold text-slate-800 mt-1">Diagnosis: Early Stage Mild Hypertension</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Advised Telmisartan 20mg, ECG showed normal sinus rhythm.</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-200 text-xs">
                <div className="flex items-center justify-between text-slate-500 text-[10px] font-medium">
                  <span>14 May 2026 • Annual Executive Health</span>
                  <span className="text-teal-700 font-semibold">Dr. Anita Desai</span>
                </div>
                <p className="font-semibold text-slate-800 mt-1">HbA1c: 6.8% (Borderline Diabetic)</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Advised lifestyle modification, dietary counseling.</p>
              </div>
            </div>
          </div>

          {/* Attached Diagnostics & Lab Reports */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-teal-700" />
              <span>Diagnostics on Record</span>
            </h3>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer">
                <span className="font-medium text-slate-700">12-Lead Resting ECG</span>
                <span className="text-[11px] text-teal-700 font-semibold">Normal (27 Sep)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer">
                <span className="font-medium text-slate-700">Lipid Profile & HbA1c</span>
                <span className="text-[11px] text-amber-700 font-semibold">Pending Lab (Today)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Digital Rx Pad (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-5">
            {/* Header of Rx */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold font-serif text-lg">
                  ℞
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Digital Prescription & Clinical Orders</h3>
                  <p className="text-xs text-slate-400">Consultation Desk: Dr. Vivek Sharma (CMO)</p>
                </div>
              </div>
              <div className="text-right text-xs text-slate-500">
                <span>Date: </span>
                <span className="font-semibold text-slate-800">27 Sep 2026</span>
              </div>
            </div>

            {/* Quick Vitals Editable Inputs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Update Current Encounter Vitals
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                <div>
                  <span className="text-[10px] text-slate-500 font-medium">BP (mmHg)</span>
                  <input
                    type="text"
                    value={vitals.bp}
                    onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded font-semibold text-slate-800 focus:bg-white focus:ring-1 focus:ring-teal-700"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-medium">Pulse (bpm)</span>
                  <input
                    type="text"
                    value={vitals.pulse}
                    onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded font-semibold text-slate-800 focus:bg-white focus:ring-1 focus:ring-teal-700"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-medium">Temp (°F)</span>
                  <input
                    type="text"
                    value={vitals.temp}
                    onChange={(e) => setVitals({ ...vitals, temp: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded font-semibold text-slate-800 focus:bg-white focus:ring-1 focus:ring-teal-700"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-medium">Weight (kg)</span>
                  <input
                    type="text"
                    value={vitals.weight}
                    onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded font-semibold text-slate-800 focus:bg-white focus:ring-1 focus:ring-teal-700"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-medium">SpO2 (%)</span>
                  <input
                    type="text"
                    value={vitals.spo2}
                    onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded font-semibold text-slate-800 focus:bg-white focus:ring-1 focus:ring-teal-700"
                  />
                </div>
              </div>
            </div>

            {/* Diagnosis Multi-Chips */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Provisional / Confirmed Diagnosis
                </label>
                <span className="text-[11px] text-slate-400">Click chips to toggle</span>
              </div>

              {/* Selected Diagnosis Badges */}
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {selectedDiagnoses.map((diag) => (
                  <span
                    key={diag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-700 text-white shadow-2xs"
                  >
                    <span>{diag}</span>
                    <button
                      type="button"
                      onClick={() => toggleDiagnosis(diag)}
                      className="hover:bg-teal-800 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Common diagnosis recommendation pills */}
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[10px] text-slate-400 font-medium mr-1">Suggestions:</span>
                {commonDiagnoses
                  .filter((d) => !selectedDiagnoses.includes(d))
                  .slice(0, 5)
                  .map((diag) => (
                    <button
                      key={diag}
                      type="button"
                      onClick={() => toggleDiagnosis(diag)}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
                    >
                      + {diag}
                    </button>
                  ))}
              </div>

              {/* Add custom diagnosis input */}
              <form onSubmit={handleAddCustomDiagnosis} className="mt-2.5 flex gap-2">
                <input
                  type="text"
                  placeholder="Type other diagnosis and press Enter..."
                  value={customDiagnosisInput}
                  onChange={(e) => setCustomDiagnosisInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-700"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded border border-slate-200"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Interactive "Add Medication" Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-teal-700" />
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Prescribed Medications (Rx Table)
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleAddMedicationRow}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-semibold transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Medicine Row</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[10px] uppercase">
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Medicine & Strength</th>
                      <th className="py-2.5 px-3">Dosage</th>
                      <th className="py-2.5 px-3">Frequency</th>
                      <th className="py-2.5 px-3">Duration</th>
                      <th className="py-2.5 px-3">Instructions</th>
                      <th className="py-2.5 px-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {medications.map((med, index) => (
                      <tr key={med.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-semibold text-slate-400">
                          {index + 1}
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={med.name}
                            onChange={(e) => handleUpdateMed(med.id, 'name', e.target.value)}
                            className="w-full px-2 py-1 bg-transparent border border-transparent hover:border-slate-200 focus:border-teal-700 focus:bg-white rounded font-medium text-slate-800"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={med.dosage}
                            onChange={(e) => handleUpdateMed(med.id, 'dosage', e.target.value)}
                            className="w-24 px-2 py-1 bg-transparent border border-transparent hover:border-slate-200 focus:border-teal-700 focus:bg-white rounded text-slate-700"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <select
                            value={med.freq}
                            onChange={(e) => handleUpdateMed(med.id, 'freq', e.target.value)}
                            className="px-2 py-1 bg-transparent border border-transparent hover:border-slate-200 focus:border-teal-700 focus:bg-white rounded text-slate-700 text-xs"
                          >
                            <option>1-0-0 (Morning)</option>
                            <option>0-0-1 (Night)</option>
                            <option>1-0-1 (After Meals)</option>
                            <option>1-1-1 (Thrice a day)</option>
                            <option>SOS (As Needed)</option>
                          </select>
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={med.days}
                            onChange={(e) => handleUpdateMed(med.id, 'days', e.target.value)}
                            className="w-20 px-2 py-1 bg-transparent border border-transparent hover:border-slate-200 focus:border-teal-700 focus:bg-white rounded text-slate-700"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={med.instruction}
                            onChange={(e) => handleUpdateMed(med.id, 'instruction', e.target.value)}
                            className="w-full px-2 py-1 bg-transparent border border-transparent hover:border-slate-200 focus:border-teal-700 focus:bg-white rounded text-slate-600 text-xs"
                          />
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveMed(med.id)}
                            className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-slate-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Doctor Advice / Clinical Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Physician's Advice & Dietary Regimen
              </label>
              <textarea
                rows={3}
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                placeholder="Specific instructions, dietary precautions, activity levels, follow-up date..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-1 focus:ring-teal-700 focus:outline-none text-slate-800"
              />
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-teal-700" />
                <span>Digitally countersigned by Dr. Vivek Sharma (Reg #MC-44910)</span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handlePrintSlip}
                  className="px-4 py-2 border border-slate-200 hover:border-teal-600 text-slate-700 hover:text-teal-700 text-xs font-semibold rounded-md shadow-2xs transition flex items-center gap-2"
                >
                  <Printer className="w-3.5 h-3.5 text-teal-700" />
                  <span>Preview & Print Rx</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndSendPharmacy}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-md shadow-xs transition flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Save & Transmit to Pharmacy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Prescription Modal Preview */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Control Header */}
            <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50 no-print">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-teal-700" />
                <span className="text-xs font-bold text-slate-800">Prescription Slip Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Authentic Printable Hospital Letterhead Prescription Slip */}
            <div className="p-8 bg-white text-slate-900 space-y-6">
              {/* Hospital Header */}
              <div className="border-b-2 border-teal-800 pb-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-teal-800 text-white font-bold flex items-center justify-center text-sm">
                      AC
                    </div>
                    <div>
                      <h1 className="text-lg font-bold text-teal-900 tracking-tight">
                        AEGIS CARE MULTISPECIALTY HOSPITAL
                      </h1>
                      <p className="text-[10px] text-slate-500 font-medium">
                        Plot 14-B, Health Boulevard, Central Zone • Ph: +91 11 4982 0000 • NABH Accredited
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800">OUTPATIENT SLIP (Rx)</div>
                  <div className="text-[10px] font-mono text-slate-500">Token: {currentPatient.token}</div>
                  <div className="text-[10px] font-mono text-slate-500">UHID: {currentPatient.uhid}</div>
                </div>
              </div>

              {/* Patient Demographics & Doctor Info */}
              <div className="grid grid-cols-2 gap-4 text-xs border border-slate-200 p-3 rounded-lg bg-slate-50/50">
                <div>
                  <div><span className="text-slate-500">Patient:</span> <strong className="text-slate-800">{currentPatient.name}</strong></div>
                  <div><span className="text-slate-500">Age / Gender:</span> {currentPatient.age} Y / {currentPatient.gender}</div>
                  <div><span className="text-slate-500">Vitals:</span> BP {vitals.bp}, Pulse {vitals.pulse} bpm, Temp {vitals.temp}°F</div>
                </div>
                <div>
                  <div><span className="text-slate-500">Doctor:</span> <strong className="text-teal-800">Dr. Vivek Sharma</strong></div>
                  <div><span className="text-slate-500">Designation:</span> MD (Med), DM (Cardiology), CMO</div>
                  <div><span className="text-slate-500">Date:</span> 27 Sep 2026 | 09:25 AM</div>
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Diagnosis / Clinical Impression:
                </div>
                <div className="text-xs font-medium text-slate-800 pl-2 border-l-2 border-teal-700">
                  {selectedDiagnoses.join(' • ')}
                </div>
              </div>

              {/* Rx Medicines */}
              <div>
                <div className="text-base font-serif font-bold text-teal-900 mb-2">℞ Medications</div>
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 text-slate-600 font-semibold text-[10px] uppercase">
                    <tr>
                      <th className="p-2 border-b">Medicine</th>
                      <th className="p-2 border-b">Dosage</th>
                      <th className="p-2 border-b">Schedule (M-A-N)</th>
                      <th className="p-2 border-b">Duration</th>
                      <th className="p-2 border-b">Special Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {medications.map((m) => (
                      <tr key={m.id}>
                        <td className="p-2 font-semibold text-slate-800">{m.name}</td>
                        <td className="p-2 text-slate-600">{m.dosage}</td>
                        <td className="p-2 text-slate-700 font-medium">{m.freq}</td>
                        <td className="p-2 text-slate-600">{m.days}</td>
                        <td className="p-2 text-slate-500 text-[11px]">{m.instruction}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Advice */}
              <div className="border border-slate-200 p-3 rounded-lg bg-slate-50/30">
                <div className="text-xs font-bold text-slate-700 mb-1">Advice & Dietary Instructions:</div>
                <p className="text-xs text-slate-600">{doctorNotes}</p>
              </div>

              {/* Footer with Seal & QR */}
              <div className="pt-6 border-t border-slate-200 flex items-end justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-14 h-14 border border-slate-300 rounded p-1 flex items-center justify-center bg-slate-50">
                    <QrCode className="w-11 h-11 text-slate-700" />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Scan for authentic digital validation.<br />
                    Dispense only on registered pharmacy terminal.
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-serif italic text-teal-800 font-bold text-sm">
                    Vivek Sharma
                  </div>
                  <div className="text-xs font-semibold text-slate-800">Dr. Vivek Sharma</div>
                  <div className="text-[10px] text-slate-500">Reg. No: 44910-DMC</div>
                  <div className="text-[9px] text-teal-700 font-medium">Chief Medical Officer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
