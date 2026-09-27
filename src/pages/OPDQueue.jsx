import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  PhoneCall,
  Plus,
  Clock,
  CheckCircle2,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  Activity,
  HeartPulse,
  Thermometer,
  Scale,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export default function OPDQueue() {
  const {
    patients,
    callNextPatient,
    updatePatientStatus,
    setActiveConsultationPatient,
    setIsOpdModalOpen,
  } = useHospital();

  const navigate = useNavigate();

  // Filters
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedToken, setExpandedToken] = useState(null);

  const departments = [
    'All',
    'General Medicine',
    'Cardiology',
    'Orthopedics',
    'Pediatrics',
    'Neurology',
  ];

  const filteredPatients = patients.filter((patient) => {
    const matchesDept = selectedDept === 'All' || patient.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || patient.status === selectedStatus;
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.uhid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.doctor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesStatus && matchesSearch;
  });

  const inQueueCount = patients.filter((p) => p.status === 'In-Queue').length;
  const withDoctorCount = patients.filter((p) => p.status === 'With Doctor').length;
  const completedCount = patients.filter((p) => p.status === 'Completed').length;

  const handleStartConsult = (patient) => {
    updatePatientStatus(patient.token, 'With Doctor');
    setActiveConsultationPatient(patient);
    navigate('/doctor-console');
  };

  const toggleRowExpansion = (token) => {
    setExpandedToken((prev) => (prev === token ? null : token));
  };

  // Helper to sanitize duplicate strings in symptoms
  const cleanSymptoms = (text) => {
    if (!text) return 'Routine checkup and clinical assessment';
    // If the string contains a direct duplicate repeat like "XYZXYZ", clean it
    const half = Math.floor(text.length / 2);
    if (text.length > 10 && text.slice(0, half) === text.slice(half)) {
      return text.slice(0, half);
    }
    return text;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>OPD Queue & Triage</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/70">
              Live Session
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time patient queue, token progression, and triage distribution
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => callNextPatient(selectedDept === 'All' ? null : selectedDept)}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200/80 hover:border-teal-700 text-slate-700 hover:text-teal-800 rounded-lg text-xs font-semibold shadow-2xs transition"
          >
            <PhoneCall className="w-3.5 h-3.5 text-teal-700" />
            <span>Call Next ({selectedDept})</span>
          </button>
          <button
            onClick={() => setIsOpdModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Patient</span>
          </button>
        </div>
      </div>

      {/* Streamlined, Minimal Metrics Strip */}
      <div className="bg-white rounded-xl border border-slate-200/60 p-4 shadow-2xs">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 gap-y-3">
          {/* Total Registered */}
          <div
            onClick={() => setSelectedStatus('All')}
            className="px-4 cursor-pointer hover:opacity-80 transition"
          >
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Total Outpatients
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-slate-900">{patients.length}</span>
              <span className="text-[11px] text-slate-400">active roster</span>
            </div>
          </div>

          {/* In Queue (Waiting) */}
          <div
            onClick={() => setSelectedStatus('In-Queue')}
            className="px-4 cursor-pointer hover:opacity-80 transition"
          >
            <div className="text-[11px] font-medium text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>In Waiting Queue</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-slate-900">{inQueueCount}</span>
              <span className="text-[11px] text-amber-700 font-medium">~14m avg wait</span>
            </div>
          </div>

          {/* With Doctor */}
          <div
            onClick={() => setSelectedStatus('With Doctor')}
            className="px-4 cursor-pointer hover:opacity-80 transition"
          >
            <div className="text-[11px] font-medium text-teal-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <span>In Consultation</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-slate-900">{withDoctorCount}</span>
              <span className="text-[11px] text-teal-700 font-medium">active in rooms</span>
            </div>
          </div>

          {/* Completed */}
          <div
            onClick={() => setSelectedStatus('Completed')}
            className="px-4 cursor-pointer hover:opacity-80 transition"
          >
            <div className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Consult Completed</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold text-slate-900">{completedCount}</span>
              <span className="text-[11px] text-emerald-700 font-medium">sent to billing/Rx</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/60 p-3 shadow-2xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Department Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedDept === dept
                    ? 'bg-teal-700 text-white shadow-2xs font-semibold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Clean Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search token, UHID, patient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200/70 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-700 text-slate-800 placeholder-slate-400 transition"
            />
          </div>
        </div>
      </div>

      {/* De-Cluttered, Airy Outpatient Queue Table */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/70 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-6">Token #</th>
                <th className="py-3 px-6">Patient Profile</th>
                <th className="py-3 px-6">Department & Doctor</th>
                <th className="py-3 px-6">Priority</th>
                <th className="py-3 px-6">Queue Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    No matching patients found.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const isWithDoctor = patient.status === 'With Doctor';
                  const isCompleted = patient.status === 'Completed';
                  const isExpanded = expandedToken === patient.token;

                  return (
                    <React.Fragment key={patient.token}>
                      <tr
                        onClick={() => toggleRowExpansion(patient.token)}
                        className={`cursor-pointer transition-colors duration-150 ${
                          isExpanded
                            ? 'bg-teal-50/20'
                            : isWithDoctor
                            ? 'bg-teal-50/10 hover:bg-teal-50/20'
                            : 'hover:bg-slate-50/60'
                        }`}
                      >
                        {/* Token # */}
                        <td className="py-4 px-6">
                          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200/70 inline-block shadow-2xs">
                            {patient.token}
                          </span>
                        </td>

                        {/* Patient Profile */}
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900 text-sm">{patient.name}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {patient.age} yrs • {patient.gender} • <span className="font-mono text-slate-600 font-medium">{patient.uhid}</span>
                          </div>
                        </td>

                        {/* Department & Doctor */}
                        <td className="py-4 px-6">
                          <div className="font-semibold text-slate-800">{patient.department}</div>
                          <div className="text-[11px] text-teal-700 font-medium mt-0.5">
                            {patient.doctor}
                          </div>
                        </td>

                        {/* Priority Badge */}
                        <td className="py-4 px-6">
                          {patient.priority === 'Urgent' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200/80">
                              Urgent
                            </span>
                          ) : patient.priority === 'Senior Citizen' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                              Sr. Citizen
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                              Normal
                            </span>
                          )}
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-6">
                          {isWithDoctor ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse" />
                              With Doctor
                            </span>
                          ) : isCompleted ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Done
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              In-Queue
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleStartConsult(patient)}
                              className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-2xs transition inline-flex items-center gap-1.5"
                            >
                              <Stethoscope className="w-3.5 h-3.5" />
                              <span>Attend</span>
                            </button>

                            <button
                              onClick={() => toggleRowExpansion(patient.token)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                              title="Toggle Patient Details"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-slate-600" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Smooth Expandable Row Accordion for Clinical Details */}
                      {isExpanded && (
                        <tr className="bg-slate-50/70 border-y border-slate-200/60">
                          <td colSpan={6} className="py-4 px-8">
                            <div className="bg-white rounded-xl border border-slate-200/70 p-4 shadow-2xs space-y-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                                <div>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Presenting Complaints / Triage Clinical Notes
                                  </div>
                                  <p className="text-xs font-medium text-slate-800 mt-1">
                                    {cleanSymptoms(patient.symptoms)}
                                  </p>
                                </div>

                                <div className="flex items-center gap-3">
                                  <span className="text-[11px] text-slate-400">
                                    Wait Time: <strong className="text-slate-700">{patient.waitTime}</strong>
                                  </span>
                                  <span className="text-[11px] text-slate-400">
                                    Registered at: <strong className="text-slate-700">{patient.registeredAt}</strong>
                                  </span>
                                </div>
                              </div>

                              {/* Vitals Summary Strip */}
                              <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                  Triage Recorded Vitals
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                                    <div className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                                      <Activity className="w-3 h-3 text-teal-700" /> Blood Pressure
                                    </div>
                                    <div className="font-bold text-slate-800 mt-0.5">
                                      {patient.vitals?.bp || '120/80'} <span className="text-[10px] font-normal text-slate-400">mmHg</span>
                                    </div>
                                  </div>

                                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                                    <div className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                                      <HeartPulse className="w-3 h-3 text-red-600" /> Pulse Rate
                                    </div>
                                    <div className="font-bold text-slate-800 mt-0.5">
                                      {patient.vitals?.pulse || '76'} <span className="text-[10px] font-normal text-slate-400">bpm</span>
                                    </div>
                                  </div>

                                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                                    <div className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                                      <Thermometer className="w-3 h-3 text-amber-600" /> Temperature
                                    </div>
                                    <div className="font-bold text-slate-800 mt-0.5">
                                      {patient.vitals?.temp || '98.6'} <span className="text-[10px] font-normal text-slate-400">°F</span>
                                    </div>
                                  </div>

                                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                                    <div className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                                      <Scale className="w-3 h-3 text-teal-700" /> Weight
                                    </div>
                                    <div className="font-bold text-slate-800 mt-0.5">
                                      {patient.vitals?.weight || '65'} <span className="text-[10px] font-normal text-slate-400">kg</span>
                                    </div>
                                  </div>

                                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                                    <div className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                                      <Activity className="w-3 h-3 text-teal-700" /> SpO2 Oxygen
                                    </div>
                                    <div className="font-bold text-slate-800 mt-0.5">
                                      {patient.vitals?.spo2 || '99'} <span className="text-[10px] font-normal text-slate-400">%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Footer Actions inside Drawer */}
                              <div className="pt-2 flex items-center justify-between">
                                <div className="text-[11px] text-slate-500">
                                  Allergies: <span className="font-semibold text-slate-700">{patient.history?.allergies || 'None recorded'}</span> • Past Visit: <span className="text-slate-600">{patient.history?.lastVisit || 'First Encounter'}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <select
                                    value={patient.status}
                                    onChange={(e) => updatePatientStatus(patient.token, e.target.value)}
                                    className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium"
                                  >
                                    <option value="In-Queue">Set In-Queue</option>
                                    <option value="With Doctor">Set With Doctor</option>
                                    <option value="Completed">Set Completed</option>
                                  </select>

                                  <button
                                    onClick={() => handleStartConsult(patient)}
                                    className="px-3.5 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs"
                                  >
                                    <span>Open Consultation Desk</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
