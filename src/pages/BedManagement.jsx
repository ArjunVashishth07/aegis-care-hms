import React, { useState } from 'react';
import {
  BedDouble,
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  HeartPulse,
  Filter,
  X,
  Plus,
  ArrowRight,
  ShieldAlert,
  Building
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export default function BedManagement() {
  const { beds, updateBedStatus } = useHospital();

  const [selectedFloor, setSelectedFloor] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeBedModal, setActiveBedModal] = useState(null);
  const [admitPatientName, setAdmitPatientName] = useState('');

  const floors = ['All', 'Floor 1', 'Floor 2', 'Floor 3'];

  const filteredBeds = beds.filter((bed) => {
    const matchesFloor = selectedFloor === 'All' || bed.floor === selectedFloor;
    const matchesStatus = selectedStatus === 'All' || bed.status === selectedStatus;
    return matchesFloor && matchesStatus;
  });

  const availableCount = beds.filter((b) => b.status === 'Available').length;
  const occupiedCount = beds.filter((b) => b.status === 'Occupied').length;
  const maintenanceCount = beds.filter((b) => b.status === 'Maintenance').length;

  const handleOpenBedModal = (bed) => {
    setActiveBedModal(bed);
    setAdmitPatientName('');
  };

  const handleStatusChange = (newStatus) => {
    if (activeBedModal) {
      updateBedStatus(
        activeBedModal.id,
        newStatus,
        newStatus === 'Occupied' ? admitPatientName || 'Emergency Admission' : null
      );
      setActiveBedModal(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Inpatient Bed Matrix & Ward Allocation</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-teal-50 text-teal-700 border border-teal-200">
              Live Sensor Status
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time occupancy across Intensive Care (ICU), Step-Down HDU, General Wards, and Suites
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-700">ICU O2 Central Grid:</span>
            <span className="text-emerald-700 font-bold">100% Pressure</span>
          </div>
        </div>
      </div>

      {/* KPI Counters & Legend Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Total Beds */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Total Bed Inventory</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">80 Beds</div>
          <div className="text-[10px] text-slate-400 mt-1">Across 3 Hospital Floors</div>
        </div>

        {/* Available Beds */}
        <div
          onClick={() => setSelectedStatus(selectedStatus === 'Available' ? 'All' : 'Available')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            selectedStatus === 'Available'
              ? 'bg-emerald-50/40 border-emerald-600 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">Available Beds</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-900 mt-1">{availableCount} Free</div>
          <div className="text-[10px] text-emerald-700 mt-1">Sanitized & ready for intake</div>
        </div>

        {/* Occupied Beds */}
        <div
          onClick={() => setSelectedStatus(selectedStatus === 'Occupied' ? 'All' : 'Occupied')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            selectedStatus === 'Occupied'
              ? 'bg-slate-100 border-slate-500 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Occupied Beds</span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{occupiedCount} Inpatients</div>
          <div className="text-[10px] text-slate-500 mt-1">70% Hospital Census</div>
        </div>

        {/* Maintenance */}
        <div
          onClick={() => setSelectedStatus(selectedStatus === 'Maintenance' ? 'All' : 'Maintenance')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            selectedStatus === 'Maintenance'
              ? 'bg-amber-50/50 border-amber-600 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800">Under Sanitization</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-900 mt-1">{maintenanceCount} Beds</div>
          <div className="text-[10px] text-amber-700 mt-1">Terminal cleaning / Calibration</div>
        </div>
      </div>

      {/* Floor Filter Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-teal-700" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Select Ward Floor:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {floors.map((floor) => (
            <button
              key={floor}
              onClick={() => setSelectedFloor(floor)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                selectedFloor === floor
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {floor === 'Floor 1'
                ? 'Floor 1 (General Ward)'
                : floor === 'Floor 2'
                ? 'Floor 2 (ICU & HDU)'
                : floor === 'Floor 3'
                ? 'Floor 3 (Deluxe Suites)'
                : 'All Floors'}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Bed Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBeds.map((bed) => {
          const isAvailable = bed.status === 'Available';
          const isOccupied = bed.status === 'Occupied';
          const isMaintenance = bed.status === 'Maintenance';

          return (
            <div
              key={bed.id}
              onClick={() => handleOpenBedModal(bed)}
              className={`rounded-xl p-4 transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-md ${
                isAvailable
                  ? 'bg-white border-2 border-emerald-500/80 hover:border-emerald-600'
                  : isOccupied
                  ? 'bg-slate-100 border border-slate-300/80 text-slate-700'
                  : 'bg-amber-50/60 border border-amber-300 text-amber-900'
              }`}
            >
              {/* Top Card Bar */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold tracking-tight font-mono">
                  {bed.id}
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isAvailable
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : isOccupied
                      ? 'bg-slate-200 text-slate-800 border-slate-300'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}
                >
                  {bed.status}
                </span>
              </div>

              {/* Ward & Floor */}
              <div className="mt-1 text-[11px] font-semibold text-slate-500">
                {bed.ward} • {bed.floor}
              </div>

              {/* Patient or Bed Content */}
              <div className="mt-3 pt-2 border-t border-slate-200/80">
                {isOccupied ? (
                  <div className="space-y-1">
                    <div className="font-bold text-xs text-slate-900 truncate">
                      {bed.patient}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      UHID: {bed.uhid}
                    </div>
                    <div className="text-[10px] text-teal-800 font-medium">
                      In-Charge: {bed.doctor}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      O2: {bed.o2} • Nurse: {bed.nurse}
                    </div>
                  </div>
                ) : isAvailable ? (
                  <div className="space-y-1 py-1 text-center">
                    <div className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Ready for Admission</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Oxygen line: {bed.o2} • Assigned Nurse: {bed.nurse}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 py-1 text-center">
                    <div className="text-xs font-bold text-amber-800 flex items-center justify-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Under Maintenance</span>
                    </div>
                    <div className="text-[10px] text-amber-700">
                      Procedure: {bed.o2}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Card Click Footer */}
              <div className="mt-3 pt-2 border-t border-slate-200/60 text-right">
                <span className="text-[10px] font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1">
                  <span>Manage Bed</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bed Details & Management Modal */}
      {activeBedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-teal-700" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Bed Management: {activeBedModal.id}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {activeBedModal.ward} • {activeBedModal.floor}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveBedModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {activeBedModal.status === 'Occupied' ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-xs">
                    <div><span className="text-slate-500">Admitted Patient:</span> <strong className="text-slate-900">{activeBedModal.patient}</strong></div>
                    <div><span className="text-slate-500">UHID:</span> <span className="font-mono text-slate-700">{activeBedModal.uhid}</span></div>
                    <div><span className="text-slate-500">Attending Consultant:</span> <strong className="text-teal-800">{activeBedModal.doctor}</strong></div>
                    <div><span className="text-slate-500">Admission Date:</span> {activeBedModal.admitted}</div>
                    <div><span className="text-slate-500">Oxygen Mode:</span> {activeBedModal.o2}</div>
                    <div><span className="text-slate-500">Duty Nurse:</span> {activeBedModal.nurse}</div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => handleStatusChange('Available')}
                      className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-semibold shadow-xs"
                    >
                      Discharge Patient & Mark Available
                    </button>
                    <button
                      onClick={() => handleStatusChange('Maintenance')}
                      className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded text-xs font-semibold"
                    >
                      Mark for Sanitization / Maintenance
                    </button>
                  </div>
                </div>
              ) : activeBedModal.status === 'Available' ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200 text-xs text-emerald-900">
                    Bed is clean, disinfected, and ready for immediate inpatient admission.
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Admit Patient Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Harish Chandra"
                      value={admitPatientName}
                      onChange={(e) => setAdmitPatientName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded focus:ring-1 focus:ring-teal-700"
                    />
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => handleStatusChange('Occupied')}
                      className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-semibold shadow-xs"
                    >
                      Confirm Inpatient Admission
                    </button>
                    <button
                      onClick={() => handleStatusChange('Maintenance')}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium"
                    >
                      Set to Maintenance Mode
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    Bed is currently undergoing terminal sanitation and equipment checks.
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => handleStatusChange('Available')}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-xs"
                    >
                      Sanitization Complete (Mark Available)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
