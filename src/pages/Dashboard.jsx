import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  BedDouble,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowRight,
  Stethoscope,
  Heart,
  Bone,
  Baby,
  PhoneCall,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export default function Dashboard() {
  const { patients, stats, callNextPatient, setActiveConsultationPatient } = useHospital();
  const navigate = useNavigate();

  const departmentLoads = [
    {
      name: 'General Medicine',
      code: 'GEN',
      icon: Stethoscope,
      doctor: 'Dr. Anita Desai',
      room: 'Room 102',
      waiting: 48,
      avgWait: '18 mins',
      trend: '+4 last hr',
    },
    {
      name: 'Cardiology',
      code: 'CARD',
      icon: Heart,
      doctor: 'Dr. Vivek Sharma',
      room: 'Room 204',
      waiting: 26,
      avgWait: '24 mins',
      trend: 'Active Consult',
    },
    {
      name: 'Orthopedics',
      code: 'ORTH',
      icon: Bone,
      doctor: 'Dr. Manoj Patel',
      room: 'Room 108',
      waiting: 34,
      avgWait: '15 mins',
      trend: 'Normal flow',
    },
    {
      name: 'Pediatrics',
      code: 'PED',
      icon: Baby,
      doctor: 'Dr. Sneha Roy',
      room: 'Room 114',
      waiting: 34,
      avgWait: '12 mins',
      trend: 'Normal flow',
    },
  ];

  const handleOpenConsultation = (patient) => {
    setActiveConsultationPatient(patient);
    navigate('/doctor-console');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Hospital Operations Command Center</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              Live Operations
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational snapshot of outpatient traffic, clinical load, bed capacity, and revenue
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => callNextPatient('General Medicine')}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200/80 hover:border-teal-700 text-slate-700 hover:text-teal-800 rounded-lg text-xs font-semibold shadow-2xs transition"
          >
            <PhoneCall className="w-3.5 h-3.5 text-teal-700" />
            <span>Call Next General OPD</span>
          </button>
          <button
            onClick={() => navigate('/opd')}
            className="flex items-center gap-2 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs transition"
          >
            <span>View Full Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Streamlined Horizontal Metrics Strip */}
      <div className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-2xs">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 gap-y-4">
          {/* Today's OPD */}
          <div className="px-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Today's Outpatients
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full font-medium border border-emerald-200/70">
                +12%
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{stats.totalOpd}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {stats.inQueue} waiting • <span className="text-teal-700 font-medium">{stats.completed} seen</span>
            </div>
          </div>

          {/* Active Doctors */}
          <div className="px-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Active Clinicians
              </span>
              <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full font-medium">
                6 Wings
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{stats.activeDoctors}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              12 in OPD chambers • 3 on rounds
            </div>
          </div>

          {/* Beds Available */}
          <div className="px-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Inpatient Bed Census
              </span>
              <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-full font-medium border border-amber-200/70">
                70% Filled
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-teal-800">{stats.availableBeds}</span>
              <span className="text-sm font-semibold text-slate-400">/ 80 Free</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              2 ICU available • 12 General free
            </div>
          </div>

          {/* Today's Revenue */}
          <div className="px-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Station Collections
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full font-medium border border-emerald-200/70">
                Settled
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{stats.revenue}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              OPD + Pharmacy + Diagnostics
            </div>
          </div>
        </div>
      </div>

      {/* Department Load Cards with Refined Airy Padding */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Department Load & Triage Capacity
          </h2>
          <span className="text-[11px] text-slate-400">Continuous telemetry sync</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {departmentLoads.map((dept) => {
            const Icon = dept.icon;
            return (
              <div
                key={dept.name}
                className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-2xs hover:shadow-xs transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-800">{dept.name}</h3>
                      <p className="text-[11px] text-slate-400">{dept.room}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/70">
                    {dept.code}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Waiting Queue</div>
                    <div className="text-lg font-bold text-slate-900 flex items-baseline gap-1">
                      <span>{dept.waiting}</span>
                      <span className="text-[10px] font-normal text-slate-400">patients</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-medium">Est. Wait</div>
                    <div className="text-xs font-semibold text-slate-700 flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {dept.avgWait}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 truncate max-w-[130px]">{dept.doctor}</span>
                  <button
                    onClick={() => callNextPatient(dept.name)}
                    className="text-teal-700 hover:text-teal-900 font-semibold cursor-pointer flex items-center gap-1"
                  >
                    <span>Call</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* De-Cluttered Live Outpatient Queue Table */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Live Outpatient Queue & Consultation Progression
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time patient trajectory from triage slip issue to doctor desk
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              Showing <strong className="text-slate-800 font-semibold">{patients.length}</strong> active visits
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/70 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-6">Token #</th>
                <th className="py-3 px-6">Patient Profile</th>
                <th className="py-3 px-6">Department & Doctor</th>
                <th className="py-3 px-6">Priority</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.map((patient) => {
                const isWithDoctor = patient.status === 'With Doctor';
                const isCompleted = patient.status === 'Completed';

                return (
                  <tr
                    key={patient.token}
                    className={`hover:bg-slate-50/60 transition-colors ${
                      isWithDoctor ? 'bg-teal-50/15' : ''
                    }`}
                  >
                    {/* Token */}
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200/70 inline-block shadow-2xs">
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

                    {/* Priority */}
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

                    {/* Action */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleOpenConsultation(patient)}
                        className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-2xs transition inline-flex items-center gap-1.5"
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>Consult</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
