import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Clock,
  MapPin,
  Award,
  Users,
  Star,
  CheckCircle2,
  Calendar,
  MessageSquare,
  ArrowRight,
  Stethoscope,
  Heart,
  Bone,
  Baby,
  Activity,
  AlertCircle
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export default function Departments() {
  const { doctors, patients, setIsOpdModalOpen } = useHospital();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('All');

  const deptCategories = [
    'All',
    'Cardiology',
    'General Medicine',
    'Orthopedics',
    'Pediatrics',
    'Neurology',
    'Emergency & Trauma',
  ];

  const filteredDoctors = activeTab === 'All'
    ? doctors
    : doctors.filter((doc) => doc.department === activeTab);

  const getDeptIcon = (dept) => {
    switch (dept) {
      case 'Cardiology':
        return Heart;
      case 'Orthopedics':
        return Bone;
      case 'Pediatrics':
        return Baby;
      case 'Emergency & Trauma':
        return Activity;
      default:
        return Stethoscope;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Clinical Departments & Consulting Faculty</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-700 border border-slate-200">
              6 Active Wings
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Roster of clinical specialists, OPD consulting chambers, and active patient queue load
          </p>
        </div>

        <button
          onClick={() => setIsOpdModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-md text-xs font-semibold shadow-xs transition"
        >
          <span>Book Appointment Slip</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Department Selector Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {deptCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === cat
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Department Overview Banner (Dynamic based on selected tab) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {activeTab === 'All' ? 'Hospital Outpatient Faculty' : `${activeTab} Division`}
            </h2>
            <p className="text-xs text-slate-500">
              {activeTab === 'All'
                ? 'Showing all active departments with operational shifts and consult chambers'
                : `Dedicated specialty wing with specialized diagnostics, OPD chambers, and emergency coverage.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-[10px] text-slate-400 font-medium">Duty Doctors</div>
            <div className="text-sm font-bold text-slate-800 mt-0.5">{filteredDoctors.length} On Duty</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-[10px] text-slate-400 font-medium">Daily OPD Avg</div>
            <div className="text-sm font-bold text-teal-800 mt-0.5">380+ Patients</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-[10px] text-slate-400 font-medium">Compliance</div>
            <div className="text-sm font-bold text-emerald-700 mt-0.5">NABH Class A</div>
          </div>
        </div>
      </div>

      {/* Doctor Profile Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDoctors.map((doc) => {
          const Icon = getDeptIcon(doc.department);
          const isAvailable = doc.status === 'Available';
          const isInConsult = doc.status === 'In Consultation';

          return (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all duration-150 flex flex-col justify-between"
            >
              <div className="p-5 space-y-4">
                {/* Top Badge & Room */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    <Icon className="w-3.5 h-3.5 text-teal-700" />
                    <span>{doc.department}</span>
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      isAvailable
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : isInConsult
                        ? 'bg-teal-50 text-teal-800 border border-teal-200'
                        : 'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isAvailable
                          ? 'bg-emerald-500'
                          : isInConsult
                          ? 'bg-teal-600'
                          : 'bg-blue-500'
                      }`}
                    />
                    {doc.status}
                  </span>
                </div>

                {/* Profile Header */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-700 text-white font-bold text-sm flex items-center justify-center shadow-xs flex-shrink-0">
                    {doc.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      {doc.name}
                    </h3>
                    <p className="text-[11px] text-teal-700 font-medium mt-0.5">
                      {doc.qualification}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                      <Award className="w-3 h-3 text-slate-400" />
                      <span>{doc.experience} Experience</span>
                    </div>
                  </div>
                </div>

                {/* Chamber Location & OPD Hours */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-800">{doc.room}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{doc.hours}</span>
                  </div>
                </div>

                {/* Queue Load Bar */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400">Current Queue Load:</span>
                    <div className="font-bold text-slate-900 flex items-baseline gap-1">
                      <span>{doc.currentQueue}</span>
                      <span className="text-[10px] text-slate-400 font-normal">waiting</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400">Patients Seen Today:</span>
                    <div className="font-bold text-teal-800">
                      {doc.patientsToday} consults
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer Actions */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between rounded-b-xl">
                <button
                  onClick={() => navigate('/opd')}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>View Queue</span>
                </button>

                <button
                  onClick={() => navigate('/doctor-console')}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:border-teal-700 text-slate-700 hover:text-teal-700 rounded text-xs font-semibold shadow-2xs transition"
                >
                  Open Chamber
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
