import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Building2,
  Receipt,
  BedDouble,
  Plus,
  Search,
  Shield,
  Calendar,
  Clock,
  CheckCircle2,
  X,
  Building
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export default function Layout() {
  const {
    stats,
    addOpdPatient,
    toastMessage,
    isOpdModalOpen,
    setIsOpdModalOpen,
    doctors
  } = useHospital();

  // New OPD Slip Form State
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    department: 'General Medicine',
    doctor: 'Dr. Anita Desai',
    symptoms: '',
    priority: 'Normal',
    bp: '120/80',
    pulse: '76',
    temp: '98.6',
    weight: '65',
    spo2: '99',
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'department'
        ? {
            doctor:
              doctors.find((d) => d.department === value)?.name || 'Dr. Anita Desai',
          }
        : {}),
    }));
  };

  const handleCreateOpd = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age) {
      alert('Please fill out patient name and age.');
      return;
    }
    addOpdPatient({
      ...formData,
      symptoms: formData.symptoms.trim() || 'General Consultation',
    });
    setIsOpdModalOpen(false);
    setFormData({
      name: '',
      age: '',
      gender: 'Male',
      department: 'General Medicine',
      doctor: 'Dr. Anita Desai',
      symptoms: '',
      priority: 'Normal',
      bp: '120/80',
      pulse: '76',
      temp: '98.6',
      weight: '65',
      spo2: '99',
    });
  };

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/opd',
      label: 'OPD Queue & Triage',
      icon: Users,
      badge: stats.inQueue > 0 ? `${stats.inQueue} waiting` : null,
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200/80',
    },
    {
      to: '/doctor-console',
      label: 'Doctor Consultation',
      icon: Stethoscope,
      badge: 'Live Rx',
      badgeColor: 'bg-teal-50 text-teal-800 border-teal-200/80',
    },
    {
      to: '/departments',
      label: 'Departments & Staff',
      icon: Building2,
      badge: '6 Wings',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    {
      to: '/billing',
      label: 'Billing & Cashier',
      icon: Receipt,
      badge: null,
    },
    {
      to: '/beds',
      label: 'Inpatient / Bed Grid',
      icon: BedDouble,
      badge: `${stats.availableBeds} free`,
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50/70 text-slate-900 font-sans antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-8 z-50 flex items-center gap-3 px-4 py-3 bg-white border border-teal-600/30 text-slate-800 rounded-xl shadow-lg shadow-teal-900/5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 flex-shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
              Aegis System Alert
            </div>
            <div className="text-xs font-semibold text-slate-700">{toastMessage.message}</div>
          </div>
        </div>
      )}

      {/* Persistent Left Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200/70 flex flex-col justify-between z-20">
        <div>
          {/* Hospital Brand Header */}
          <div className="h-16 border-b border-slate-200/70 px-6 flex items-center gap-3 bg-white">
            <div className="w-9 h-9 rounded-lg bg-teal-700 flex items-center justify-center text-white shadow-xs">
              <Shield className="w-5 h-5 fill-white/10" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-slate-900 flex items-center gap-1.5">
                <span>Aegis Care</span>
                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200/60">
                  HMS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Enterprise Health Suite</p>
            </div>
          </div>

          {/* Facility Location Strip */}
          <div className="px-6 py-2.5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-teal-700" />
                Main Campus • Block A
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="System Online" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1">
            <div className="px-3 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Clinical & Operations
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? 'text-white' : 'text-slate-400'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            isActive
                              ? 'bg-teal-800 text-teal-100 border-teal-600'
                              : item.badgeColor
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200/70 bg-slate-50/40 space-y-2.5">
          <div className="p-2.5 bg-white rounded-lg border border-slate-200/70 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Emergency Trauma</span>
              <span className="text-red-700 font-bold">Ext. 108</span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Casualty triage nominal
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-medium">
            <span>Aegis Core v2.4</span>
            <span className="text-teal-700 font-semibold">NABH Accredited</span>
          </div>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/70 px-8 flex items-center justify-between z-10">
          {/* Quick Search */}
          <div className="flex items-center gap-3 flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search UHID, Patient name, Doctor..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200/70 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700 focus:bg-white text-slate-800 placeholder-slate-400 transition"
              />
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-4">
            {/* Live Date Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/70 text-xs font-medium text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-teal-700" />
              <span>Sunday, 27 Sep 2026</span>
              <span className="text-slate-300">|</span>
              <Clock className="w-3.5 h-3.5 text-teal-700" />
              <span className="font-semibold text-slate-700">09:30 AM (Shift-1)</span>
            </div>

            {/* Role Badge */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200/70 shadow-2xs">
              <div className="w-7 h-7 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 font-bold text-xs flex items-center justify-center">
                VS
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <span>Dr. Vivek Sharma</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Active On Duty" />
                </div>
                <div className="text-[10px] text-teal-700 font-medium">Chief Medical Officer</div>
              </div>
            </div>

            {/* New OPD Slip Action Button */}
            <button
              onClick={() => setIsOpdModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New OPD Slip</span>
            </button>
          </div>
        </header>

        {/* Content Area with Global Relaxed Breathing Room */}
        <main className="flex-1 overflow-y-auto bg-slate-50/60 p-8">
          <Outlet />
        </main>
      </div>

      {/* Global "New OPD Slip" Registration Modal */}
      {isOpdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-xs">
                  +
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Issue New OPD Token Slip</h3>
                  <p className="text-[11px] text-slate-500">Fast-track patient registration & triage</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpdModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateOpd} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Karan Kapoor"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-700 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Age *
                    </label>
                    <input
                      type="number"
                      name="age"
                      required
                      placeholder="e.g. 36"
                      value={formData.age}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleFormChange}
                      className="w-full px-2 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-700 focus:outline-none"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Target Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-700 focus:outline-none"
                  >
                    <option>General Medicine</option>
                    <option>Cardiology</option>
                    <option>Orthopedics</option>
                    <option>Pediatrics</option>
                    <option>Neurology</option>
                    <option>Emergency & Trauma</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Assigned Doctor
                  </label>
                  <input
                    type="text"
                    name="doctor"
                    readOnly
                    value={formData.doctor}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-600 rounded-lg cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Presenting Complaints
                </label>
                <input
                  type="text"
                  name="symptoms"
                  placeholder="e.g. Chest pain and discomfort"
                  value={formData.symptoms}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-700 focus:outline-none"
                />
              </div>

              {/* Triage Vitals */}
              <div className="p-3 bg-slate-50/80 border border-slate-200/80 rounded-lg">
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Triage Vitals (Optional)
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400">BP (mmHg)</span>
                    <input
                      type="text"
                      name="bp"
                      value={formData.bp}
                      onChange={handleFormChange}
                      className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Pulse (bpm)</span>
                    <input
                      type="text"
                      name="pulse"
                      value={formData.pulse}
                      onChange={handleFormChange}
                      className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Temp (°F)</span>
                    <input
                      type="text"
                      name="temp"
                      value={formData.temp}
                      onChange={handleFormChange}
                      className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Weight (kg)</span>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleFormChange}
                      className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">Priority:</span>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleFormChange}
                    className="px-2 py-1 text-xs bg-white border border-slate-200 rounded"
                  >
                    <option>Normal</option>
                    <option>Senior Citizen</option>
                    <option>Urgent</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOpdModalOpen(false)}
                    className="px-3.5 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs"
                  >
                    Issue Slip
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
