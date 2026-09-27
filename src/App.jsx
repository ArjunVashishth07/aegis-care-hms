import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HospitalProvider } from './context/HospitalContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import OPDQueue from './pages/OPDQueue';
import DoctorConsole from './pages/DoctorConsole';
import Departments from './pages/Departments';
import Billing from './pages/Billing';
import BedManagement from './pages/BedManagement';

export default function App() {
  return (
    <HospitalProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="opd" element={<OPDQueue />} />
            <Route path="doctor-console" element={<DoctorConsole />} />
            <Route path="departments" element={<Departments />} />
            <Route path="billing" element={<Billing />} />
            <Route path="beds" element={<BedManagement />} />
            {/* Fallback to Dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HospitalProvider>
  );
}
