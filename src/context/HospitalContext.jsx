import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const HospitalContext = createContext(null);

export const initialPatients = [
  {
    id: 'b1111111-1111-1111-1111-111111111111',
    token: 'A-101',
    uhid: 'AC-88219',
    name: 'Rajesh Mukherjee',
    age: 46,
    gender: 'Male',
    department: 'General Medicine',
    doctor: 'Dr. Anita Desai',
    symptoms: 'Persistent fever, body ache, mild dry cough',
    vitals: { bp: '124/82', pulse: '82', temp: '100.2', weight: '71', spo2: '98' },
    status: 'In-Queue',
    priority: 'Normal',
    waitTime: '12 min',
    registeredAt: '08:45 AM',
    history: {
      allergies: 'None known',
      chronic: 'Hypertension (3 yrs)',
      lastVisit: '14 May 2026',
    },
    prescriptions: [
      { name: 'Paracetamol', dosage: '650 mg', freq: '1-0-1 (After Food)', days: '5 Days' },
      { name: 'Cetirizine', dosage: '10 mg', freq: '0-0-1 (Night)', days: '3 Days' },
    ],
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    token: 'A-102',
    uhid: 'AC-98241',
    name: 'Ramesh Verma',
    age: 52,
    gender: 'Male',
    department: 'Cardiology',
    doctor: 'Dr. Vivek Sharma',
    symptoms: 'Exertional chest heaviness, palpitations, fatigue',
    vitals: { bp: '138/88', pulse: '78', temp: '98.4', weight: '74', spo2: '98' },
    status: 'With Doctor',
    priority: 'Urgent',
    waitTime: '0 min',
    registeredAt: '09:00 AM',
    history: {
      allergies: 'Penicillin, Sulfa drugs',
      chronic: 'Type-2 Diabetes Mellitus, Dyslipidemia',
      lastVisit: '12 Aug 2026',
    },
    prescriptions: [
      { name: 'Telmisartan', dosage: '40 mg', freq: '1-0-0 (Morning)', days: '30 Days' },
      { name: 'Metformin', dosage: '500 mg', freq: '1-0-1 (After Meals)', days: '30 Days' },
      { name: 'Atorvastatin', dosage: '10 mg', freq: '0-0-1 (Night)', days: '30 Days' },
    ],
  },
  {
    id: 'b3333333-3333-3333-3333-333333333333',
    token: 'A-103',
    uhid: 'AC-74512',
    name: 'Priyanka Sen',
    age: 29,
    gender: 'Female',
    department: 'Pediatrics',
    doctor: 'Dr. Sneha Roy',
    symptoms: 'Child having recurrent wheezing and nighttime coughing',
    vitals: { bp: '110/70', pulse: '92', temp: '99.1', weight: '58', spo2: '97' },
    status: 'In-Queue',
    priority: 'Normal',
    waitTime: '20 min',
    registeredAt: '09:10 AM',
    history: {
      allergies: 'Dust, Pollen',
      chronic: 'Mild Asthma',
      lastVisit: '03 Feb 2026',
    },
    prescriptions: [
      { name: 'Montelukast', dosage: '10 mg', freq: '0-0-1 (Night)', days: '15 Days' },
      { name: 'Levosalbutamol Inhaler', dosage: '100 mcg', freq: '2 puffs SOS', days: '30 Days' },
    ],
  },
  {
    id: 'b4444444-4444-4444-4444-444444444444',
    token: 'A-104',
    uhid: 'AC-65109',
    name: 'Surinder Kaur',
    age: 68,
    gender: 'Female',
    department: 'Orthopedics',
    doctor: 'Dr. Manoj Patel',
    symptoms: 'Bilateral knee joint pain, morning stiffness > 30 mins',
    vitals: { bp: '142/90', pulse: '76', temp: '98.2', weight: '68', spo2: '96' },
    status: 'In-Queue',
    priority: 'Senior Citizen',
    waitTime: '8 min',
    registeredAt: '09:15 AM',
    history: {
      allergies: 'Aspirin',
      chronic: 'Osteoarthritis Grade-3, Osteopenia',
      lastVisit: '22 Jul 2026',
    },
    prescriptions: [
      { name: 'Diacerein + Glucosamine', dosage: '50/750 mg', freq: '1-0-1', days: '60 Days' },
      { name: 'Calcium + Vit D3', dosage: '500 mg', freq: '0-1-0', days: '30 Days' },
    ],
  },
  {
    id: 'b5555555-5555-5555-5555-555555555555',
    token: 'A-105',
    uhid: 'AC-39120',
    name: 'Mohammad Farooq',
    age: 38,
    gender: 'Male',
    department: 'General Medicine',
    doctor: 'Dr. Anita Desai',
    symptoms: 'Acute epigastric burning pain, acid regurgitation',
    vitals: { bp: '120/78', pulse: '72', temp: '98.6', weight: '80', spo2: '99' },
    status: 'Completed',
    priority: 'Normal',
    waitTime: '0 min',
    registeredAt: '08:20 AM',
    history: {
      allergies: 'None',
      chronic: 'Non-ulcer dyspepsia',
      lastVisit: '10 Jan 2026',
    },
    prescriptions: [
      { name: 'Pantoprazole', dosage: '40 mg', freq: '1-0-0 (30 min before food)', days: '14 Days' },
      { name: 'Sucralfate Suspension', dosage: '10 ml', freq: '1-1-1 (Before food)', days: '7 Days' },
    ],
  },
  {
    id: 'b6666666-6666-6666-6666-666666666666',
    token: 'A-106',
    uhid: 'AC-51204',
    name: 'Ananya Roy',
    age: 34,
    gender: 'Female',
    department: 'Cardiology',
    doctor: 'Dr. Vivek Sharma',
    symptoms: 'Periodic palpitations and lightheadedness under stress',
    vitals: { bp: '116/74', pulse: '88', temp: '98.5', weight: '55', spo2: '99' },
    status: 'In-Queue',
    priority: 'Normal',
    waitTime: '28 min',
    registeredAt: '09:25 AM',
    history: {
      allergies: 'None',
      chronic: 'Sinus Tachycardia',
      lastVisit: 'First Visit',
    },
    prescriptions: [],
  },
];

export const initialDoctors = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    name: 'Dr. Vivek Sharma',
    role: 'Chief Medical Officer & Senior Interventional Cardiologist',
    department: 'Cardiology',
    room: 'Room 204 (OPD Block B)',
    hours: '08:30 AM - 02:00 PM',
    qualification: 'MBBS, MD (Medicine), DM (Cardiology), FACC',
    experience: '18 Years',
    avatar: 'VS',
    status: 'In Consultation',
    currentQueue: 14,
    rating: 4.9,
    patientsToday: 28,
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    name: 'Dr. Anita Desai',
    role: 'Senior Consultant Physician',
    department: 'General Medicine',
    room: 'Room 102 (OPD Block A)',
    hours: '09:00 AM - 03:00 PM',
    qualification: 'MBBS, MD (Internal Medicine)',
    experience: '14 Years',
    avatar: 'AD',
    status: 'Available',
    currentQueue: 18,
    rating: 4.8,
    patientsToday: 32,
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    name: 'Dr. Manoj Patel',
    role: 'Head of Joint Replacement & Arthroscopy',
    department: 'Orthopedics',
    room: 'Room 108 (OPD Block A)',
    hours: '09:30 AM - 01:30 PM',
    qualification: 'MBBS, MS (Ortho), M.Ch (UK)',
    experience: '16 Years',
    avatar: 'MP',
    status: 'In Consultation',
    currentQueue: 12,
    rating: 4.9,
    patientsToday: 24,
  },
  {
    id: 'a4444444-4444-4444-4444-444444444444',
    name: 'Dr. Sneha Roy',
    role: 'Pediatric Specialist & Neonatologist',
    department: 'Pediatrics',
    room: 'Room 114 (OPD Child Care Wing)',
    hours: '09:00 AM - 02:30 PM',
    qualification: 'MBBS, MD (Pediatrics), Fellowship Neonatology',
    experience: '11 Years',
    avatar: 'SR',
    status: 'Available',
    currentQueue: 9,
    rating: 4.9,
    patientsToday: 21,
  },
  {
    id: 'a5555555-5555-5555-5555-555555555555',
    name: 'Dr. Alok Verma',
    role: 'Senior Neurologist & Stroke Specialist',
    department: 'Neurology',
    room: 'Room 305 (Neuro Sciences Wing)',
    hours: '10:00 AM - 04:00 PM',
    qualification: 'MBBS, MD, DM (Neurology)',
    experience: '15 Years',
    avatar: 'AV',
    status: 'On Rounds',
    currentQueue: 6,
    rating: 4.7,
    patientsToday: 15,
  },
  {
    id: 'a6666666-6666-6666-6666-666666666666',
    name: 'Dr. Meera Nambiar',
    role: 'Head of Emergency & Critical Care',
    department: 'Emergency & Trauma',
    room: 'Trauma Bay 1 & 2',
    hours: '24x7 Shift In-Charge',
    qualification: 'MBBS, MD (Emergency Medicine), FEM',
    experience: '12 Years',
    avatar: 'MN',
    status: 'Available',
    currentQueue: 4,
    rating: 4.9,
    patientsToday: 22,
  },
];

export const initialBeds = [
  { id: 'ICU-201', dbId: null, floor: 'Floor 2', ward: 'ICU', status: 'Occupied', patient: 'Ramesh Verma', uhid: 'AC-98241', doctor: 'Dr. Vivek Sharma', admitted: '25 Sep 2026', o2: 'Active (6L/min)', nurse: 'Sr. Mary' },
  { id: 'ICU-202', dbId: null, floor: 'Floor 2', ward: 'ICU', status: 'Occupied', patient: 'Rajesh Mukherjee', uhid: 'AC-88219', doctor: 'Dr. Vivek Sharma', admitted: '26 Sep 2026', o2: 'Ventilator Mode', nurse: 'Sr. Mary' },
  { id: 'ICU-203', dbId: null, floor: 'Floor 2', ward: 'ICU', status: 'Available', patient: null, uhid: null, doctor: null, admitted: null, o2: 'Standby', nurse: 'Sr. Ancy' },
  { id: 'ICU-204', dbId: null, floor: 'Floor 2', ward: 'ICU', status: 'Maintenance', patient: null, uhid: null, doctor: null, admitted: null, o2: 'Calibration', nurse: 'Staff' },
  { id: 'ICU-205', dbId: null, floor: 'Floor 2', ward: 'ICU', status: 'Available', patient: null, uhid: null, doctor: null, admitted: null, o2: 'Standby', nurse: 'Sr. Grace' },
  { id: 'ICU-206', dbId: null, floor: 'Floor 2', ward: 'ICU', status: 'Available', patient: null, uhid: null, doctor: null, admitted: null, o2: 'Standby', nurse: 'Sr. Grace' },
  { id: 'GEN-101', dbId: null, floor: 'Floor 1', ward: 'General Ward', status: 'Occupied', patient: 'Mohammad Farooq', uhid: 'AC-39120', doctor: 'Dr. Anita Desai', admitted: '26 Sep 2026', o2: 'Normal', nurse: 'Sr. Deepa' },
  { id: 'GEN-102', dbId: null, floor: 'Floor 1', ward: 'General Ward', status: 'Occupied', patient: 'Surinder Kaur', uhid: 'AC-65109', doctor: 'Dr. Manoj Patel', admitted: '26 Sep 2026', o2: 'Normal', nurse: 'Sr. Deepa' },
  { id: 'GEN-103', dbId: null, floor: 'Floor 1', ward: 'General Ward', status: 'Available', patient: null, uhid: null, doctor: null, admitted: null, o2: 'Available', nurse: 'Sr. Deepa' },
  { id: 'GEN-104', dbId: null, floor: 'Floor 1', ward: 'General Ward', status: 'Available', patient: null, uhid: null, doctor: null, admitted: null, o2: 'Available', nurse: 'Sr. Deepa' },
  { id: 'GEN-105', dbId: null, floor: 'Floor 1', ward: 'General Ward', status: 'Available', patient: null, uhid: null, doctor: null, admitted: null, o2: 'Available', nurse: 'Sr. Latha' },
  { id: 'GEN-106', dbId: null, floor: 'Floor 1', ward: 'General Ward', status: 'Maintenance', patient: null, uhid: null, doctor: null, admitted: null, o2: 'Sanitizing', nurse: 'Staff' },
  { id: 'GEN-107', dbId: null, floor: 'Floor 1', ward: 'General Ward', status: 'Available', patient: null, uhid: null, doctor: null, admitted: null, o2: 'Available', nurse: 'Sr. Latha' },
  { id: 'GEN-108', dbId: null, floor: 'Floor 1', ward: 'General Ward', status: 'Available', patient: null, uhid: null, doctor: null, admitted: null, o2: 'Available', nurse: 'Sr. Latha' },
  { id: 'DLX-301', dbId: null, floor: 'Floor 3', ward: 'Deluxe Rooms', status: 'Occupied', patient: 'Priyanka Sen', uhid: 'AC-74512', doctor: 'Dr. Vivek Sharma', admitted: '26 Sep 2026', o2: 'Available', nurse: 'Sr. Reshma' },
  { id: 'DLX-302', dbId: null, floor: 'Floor 3', ward: 'Deluxe Rooms', status: 'Available', patient: null, uhid: null, doctor: null, admitted: null, o2: 'Available', nurse: 'Sr. Reshma' },
  { id: 'DLX-303', dbId: null, floor: 'Floor 3', ward: 'Deluxe Rooms', status: 'Available', patient: null, uhid: null, doctor: null, admitted: null, o2: 'Available', nurse: 'Sr. Reshma' },
  { id: 'DLX-304', dbId: null, floor: 'Floor 3', ward: 'Deluxe Rooms', status: 'Available', patient: null, uhid: null, doctor: null, admitted: null, o2: 'Available', nurse: 'Sr. Reshma' },
  { id: 'DLX-305', dbId: null, floor: 'Floor 3', ward: 'Deluxe Rooms', status: 'Maintenance', patient: null, uhid: null, doctor: null, admitted: null, o2: 'Deep Cleaning', nurse: 'Staff' },
  { id: 'DLX-306', dbId: null, floor: 'Floor 3', ward: 'Deluxe Rooms', status: 'Available', patient: null, uhid: null, doctor: null, admitted: null, o2: 'Available', nurse: 'Sr. Reshma' },
];

export const initialBills = [
  {
    id: 'bill-1',
    billNo: 'INV-2026-0941',
    token: 'A-102',
    uhid: 'AC-98241',
    patientName: 'Ramesh Verma',
    doctor: 'Dr. Vivek Sharma',
    department: 'Cardiology',
    date: '27 Sep 2026',
    time: '09:20 AM',
    items: [
      { desc: 'Cardiology Specialist Consultation', category: 'OPD Fee', amount: 800 },
      { desc: '12-Lead ECG Analysis', category: 'Diagnostics', amount: 450 },
      { desc: 'Comprehensive Lipid Profile & HbA1c', category: 'Laboratory', amount: 1100 },
      { desc: 'Pharmacy Dispense (Telmisartan + Metformin)', category: 'Pharmacy', amount: 420 },
      { desc: 'Administrative & Medical Record Fee', category: 'Hospital', amount: 100 },
    ],
    tpa: 'Star Health Insurance (Co-pay 10%)',
    subtotal: 2870,
    discount: 270,
    total: 2600,
    paymentMethod: 'UPI / Card',
    status: 'Pending',
    cashier: 'Pooja Nair (Station #2)',
  },
  {
    id: 'bill-2',
    billNo: 'INV-2026-0940',
    token: 'A-105',
    uhid: 'AC-39120',
    patientName: 'Mohammad Farooq',
    doctor: 'Dr. Anita Desai',
    department: 'General Medicine',
    date: '27 Sep 2026',
    time: '08:50 AM',
    items: [
      { desc: 'General Medicine Consultation', category: 'OPD Fee', amount: 500 },
      { desc: 'Pharmacy: Pantoprazole + Sucralfate', category: 'Pharmacy', amount: 360 },
      { desc: 'Registration & UHID Card Fee', category: 'Hospital', amount: 100 },
    ],
    tpa: 'Self Pay (Cash)',
    subtotal: 960,
    discount: 60,
    total: 900,
    paymentMethod: 'Cash',
    status: 'Paid',
    cashier: 'Pooja Nair (Station #2)',
  },
  {
    id: 'bill-3',
    billNo: 'INV-2026-0939',
    token: 'A-099',
    uhid: 'AC-42119',
    patientName: 'Sarita Trivedi',
    doctor: 'Dr. Manoj Patel',
    department: 'Orthopedics',
    date: '27 Sep 2026',
    time: '08:30 AM',
    items: [
      { desc: 'Orthopedic Consultation Fee', category: 'OPD Fee', amount: 700 },
      { desc: 'Digital Bilateral Knee X-Ray (AP/Lat)', category: 'Radiology', amount: 950 },
      { desc: 'Support Knee Brace (Small)', category: 'Consumables', amount: 650 },
    ],
    tpa: 'HDFC ERGO Health',
    subtotal: 2300,
    discount: 0,
    total: 2300,
    paymentMethod: 'Credit Card',
    status: 'Paid',
    cashier: 'Amit K (Station #1)',
  },
];

export function HospitalProvider({ children }) {
  const [patients, setPatients] = useState(initialPatients);
  const [doctors, setDoctors] = useState(initialDoctors);
  const [beds, setBeds] = useState(initialBeds);
  const [bills, setBills] = useState(initialBills);
  const [activeConsultationPatient, setActiveConsultationPatient] = useState(initialPatients[1]);
  const [toastMessage, setToastMessage] = useState(null);
  const [rateLimitNotice, setRateLimitNotice] = useState(null);
  const [isOpdModalOpen, setIsOpdModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('connecting');

  const showToast = useCallback((message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage((current) => (current?.message === message ? null : current));
    }, 4500);
  }, []);

  // Sync data from backend
  const refreshData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      // 1. Fetch appointments queue
      const aptRes = await api.appointments.getQueue().catch(() => null);
      if (aptRes?.success && Array.isArray(aptRes.data)) {
        const livePatients = aptRes.data.map((apt) => ({
          id: apt.id,
          token: apt.token_no,
          uhid: apt.patient?.uhid || 'AC-00000',
          name: apt.patient?.full_name || 'Patient',
          age: apt.patient?.age || 35,
          gender: apt.patient?.gender || 'Male',
          department: apt.doctor?.department || 'General Medicine',
          doctor: apt.doctor?.full_name || 'Consultant',
          status: apt.status || 'In-Queue',
          priority: apt.queue_priority || 'Normal',
          symptoms: 'Outpatient consultation & triage',
          vitals: { bp: '120/80', pulse: '76', temp: '98.6', weight: '65', spo2: '99' },
          history: { allergies: 'None recorded', chronic: 'None', lastVisit: 'Prior Visit' },
          prescriptions: [],
          waitTime: 'In room',
          registeredAt: new Date(apt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
        if (livePatients.length > 0) {
          setPatients(livePatients);
        }
      }

      // 2. Fetch beds
      const bedsRes = await api.beds.getAll().catch(() => null);
      if (bedsRes?.success && Array.isArray(bedsRes.data)) {
        const liveBeds = bedsRes.data.map((b) => ({
          id: b.bed_number,
          dbId: b.id,
          floor: b.ward === 'General Ward' ? 'Floor 1' : b.ward === 'ICU' ? 'Floor 2' : 'Floor 3',
          ward: b.ward,
          department: b.department,
          status: b.status,
          patient: b.patient?.full_name || null,
          uhid: b.patient?.uhid || null,
          doctor: 'Dr. Vivek Sharma',
          admitted: b.admitted_at ? new Date(b.admitted_at).toLocaleDateString() : null,
          o2: b.ward === 'ICU' ? 'Central O2 Active' : 'Normal',
          nurse: 'Duty Staff',
        }));
        if (liveBeds.length > 0) {
          setBeds(liveBeds);
        }
      }

      // 3. Fetch bills
      const billsRes = await api.bills.getAll().catch(() => null);
      if (billsRes?.success && Array.isArray(billsRes.data)) {
        const liveBills = billsRes.data.map((b) => ({
          id: b.id,
          billNo: b.bill_number,
          token: 'A-102',
          uhid: b.patient?.uhid || 'AC-00000',
          patientName: b.patient?.full_name || 'Patient',
          doctor: 'Dr. Vivek Sharma',
          department: 'Cardiology',
          date: new Date(b.created_at).toLocaleDateString(),
          time: new Date(b.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          items: b.items || [],
          subtotal: Number(b.total_amount),
          discount: 0,
          total: Number(b.total_amount),
          paymentMethod: b.payment_method || 'UPI / Card',
          status: b.payment_status,
          cashier: 'Station #2',
        }));
        if (liveBills.length > 0) {
          setBills(liveBills);
        }
      }

      // 4. Fetch doctors
      const docRes = await api.doctors.getAll().catch(() => null);
      if (docRes?.success && Array.isArray(docRes.data)) {
        const liveDoctors = docRes.data.map((doc, idx) => ({
          id: doc.id,
          name: doc.full_name,
          role: doc.specialization,
          department: doc.department,
          room: doc.room_no || 'Consultation Room',
          hours: '09:00 AM - 02:00 PM',
          qualification: 'MBBS, MD',
          experience: '12+ Years',
          avatar: doc.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2),
          status: doc.is_available ? 'Available' : 'On Rounds',
          currentQueue: doc.currentQueue || 0,
          rating: 4.9,
          patientsToday: 20 + idx * 4,
        }));
        if (liveDoctors.length > 0) {
          setDoctors(liveDoctors);
        }
      }

      setBackendStatus('connected');
    } catch (err) {
      console.warn('Backend sync paused:', err.message);
      setBackendStatus('offline');
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  // Mount effect & Rate limiter listener
  useEffect(() => {
    refreshData();

    // Listen for rate-limit 429 events
    const handleRateLimit = (e) => {
      setRateLimitNotice(e.detail);
      showToast(`Rate Limit Alert: ${e.detail.message}`, 'error');
      setTimeout(() => {
        setRateLimitNotice(null);
      }, (e.detail.retryAfter || 5) * 1000);
    };

    window.addEventListener('hms:rate-limited', handleRateLimit);
    return () => {
      window.removeEventListener('hms:rate-limited', handleRateLimit);
    };
  }, [refreshData, showToast]);

  // Add new OPD slip
  const addOpdPatient = async (patientData) => {
    try {
      const res = await api.appointments.book({
        name: patientData.name,
        age: patientData.age,
        gender: patientData.gender,
        department: patientData.department,
        priority: patientData.priority,
        phone: patientData.phone,
      });

      if (res?.success) {
        showToast(`OPD Slip issued: Token #${res.data.token_no} (${patientData.name})`);
        await refreshData(true);
        return res.data;
      }
    } catch (err) {
      if (err.status === 429) return;
      // Fallback in-memory insertion if server offline
      const nextTokenNum = 100 + patients.length + 1;
      const newPatient = {
        id: `local-${Date.now()}`,
        token: `A-${nextTokenNum}`,
        uhid: `AC-${Math.floor(10000 + Math.random() * 90000)}`,
        name: patientData.name,
        age: Number(patientData.age),
        gender: patientData.gender,
        department: patientData.department,
        doctor: patientData.doctor || 'Dr. Anita Desai',
        symptoms: patientData.symptoms || 'General Consultation',
        vitals: { bp: '120/80', pulse: '76', temp: '98.6', weight: '65', spo2: '99' },
        status: 'In-Queue',
        priority: patientData.priority || 'Normal',
        waitTime: 'Just arrived',
        registeredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        history: { allergies: 'None recorded', chronic: 'None', lastVisit: 'First Visit' },
        prescriptions: [],
      };
      setPatients((prev) => [newPatient, ...prev]);
      showToast(`OPD Slip issued: Token #${newPatient.token} (${newPatient.name})`);
      return newPatient;
    }
  };

  // Call next patient
  const callNextPatient = async (department) => {
    try {
      const res = await api.appointments.callNext(department);
      if (res?.success) {
        showToast(res.message);
        await refreshData(true);
        return res.data;
      }
    } catch (err) {
      if (err.status === 429) return;
      // Fallback in-memory
      const waiting = patients.find(
        (p) => p.status === 'In-Queue' && (!department || department === 'All' || p.department === department)
      );
      if (!waiting) {
        showToast('No patients currently in queue for this selection.', 'info');
        return null;
      }
      setPatients((prev) =>
        prev.map((p) => {
          if (p.token === waiting.token) return { ...p, status: 'With Doctor' };
          if (p.status === 'With Doctor' && (!department || department === 'All' || p.department === department)) {
            return { ...p, status: 'Completed' };
          }
          return p;
        })
      );
      setActiveConsultationPatient({ ...waiting, status: 'With Doctor' });
      showToast(`Called Token #${waiting.token}: ${waiting.name}`);
      return waiting;
    }
  };

  // Update patient status
  const updatePatientStatus = async (tokenOrId, status) => {
    // Optimistic UI update
    setPatients((prev) =>
      prev.map((p) => (p.token === tokenOrId || p.id === tokenOrId ? { ...p, status } : p))
    );
    showToast(`Status updated to "${status}"`);

    const patientObj = patients.find((p) => p.token === tokenOrId || p.id === tokenOrId);
    if (patientObj?.id && !patientObj.id.startsWith('local-')) {
      await api.appointments.updateStatus(patientObj.id, status).catch(() => {});
    }
  };

  // Save consultation notes
  const saveConsultation = (token, diagnosisList, prescriptions, notes, vitals) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.token === token) {
          return {
            ...p,
            status: 'Completed',
            diagnosis: diagnosisList,
            prescriptions,
            doctorNotes: notes,
            vitals: vitals || p.vitals,
          };
        }
        return p;
      })
    );
    showToast(`Consultation saved for Token #${token}. Sent to Pharmacy & Billing!`);
  };

  // Update bed status
  const updateBedStatus = async (bedId, newStatus, patientName = null) => {
    const targetBed = beds.find((b) => b.id === bedId || b.dbId === bedId);

    // Optimistic UI update
    setBeds((prev) =>
      prev.map((b) => {
        if (b.id === bedId || b.dbId === bedId) {
          if (newStatus === 'Available') {
            return { ...b, status: 'Available', patient: null, uhid: null, doctor: null, admitted: null };
          }
          if (newStatus === 'Occupied') {
            return {
              ...b,
              status: 'Occupied',
              patient: patientName || 'Admitted Patient',
              uhid: `AC-${Math.floor(10000 + Math.random() * 90000)}`,
              doctor: 'Dr. Vivek Sharma',
              admitted: '27 Sep 2026',
            };
          }
          return { ...b, status: newStatus };
        }
        return b;
      })
    );
    showToast(`Bed ${bedId} updated to ${newStatus}`);

    // Remote sync if dbId present
    if (targetBed?.dbId) {
      if (newStatus === 'Available') {
        await api.beds.discharge(targetBed.dbId, { next_status: 'Available' }).catch(() => {});
      } else if (newStatus === 'Occupied') {
        await api.beds.allocate(targetBed.dbId, { patient_name: patientName }).catch(() => {});
      } else {
        await api.beds.updateStatus(targetBed.dbId, newStatus).catch(() => {});
      }
    }
  };

  // Settle bill
  const settleBill = async (billNoOrId, paymentMethod = 'UPI / Card') => {
    setBills((prev) =>
      prev.map((b) =>
        b.billNo === billNoOrId || b.id === billNoOrId ? { ...b, status: 'Paid', paymentMethod } : b
      )
    );
    showToast(`Bill #${billNoOrId} settled successfully via ${paymentMethod}!`);

    const billObj = bills.find((b) => b.billNo === billNoOrId || b.id === billNoOrId);
    if (billObj?.id && !billObj.id.startsWith('bill-')) {
      await api.bills.settle(billObj.id, { payment_method: paymentMethod }).catch(() => {});
    }
  };

  // Dynamic stats
  const totalOpdToday = 142 + patients.length - initialPatients.length;
  const inQueueCount = patients.filter((p) => p.status === 'In-Queue').length;
  const inConsultCount = patients.filter((p) => p.status === 'With Doctor').length;
  const completedCount = patients.filter((p) => p.status === 'Completed').length;
  const availableBedsCount = beds.filter((b) => b.status === 'Available').length;
  const occupiedBedsCount = beds.filter((b) => b.status === 'Occupied').length;

  return (
    <HospitalContext.Provider
      value={{
        patients,
        doctors,
        beds,
        bills,
        activeConsultationPatient,
        setActiveConsultationPatient,
        addOpdPatient,
        callNextPatient,
        updatePatientStatus,
        saveConsultation,
        updateBedStatus,
        settleBill,
        refreshData,
        toastMessage,
        rateLimitNotice,
        showToast,
        isOpdModalOpen,
        setIsOpdModalOpen,
        isLoading,
        backendStatus,
        stats: {
          totalOpd: totalOpdToday,
          inQueue: inQueueCount,
          inConsult: inConsultCount,
          completed: completedCount,
          activeDoctors: '12/15',
          availableBeds: availableBedsCount,
          totalBeds: beds.length,
          occupiedBeds: occupiedBedsCount,
          revenue: '₹84,500',
        },
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
}

export function useHospital() {
  const ctx = useContext(HospitalContext);
  if (!ctx) throw new Error('useHospital must be used within HospitalProvider');
  return ctx;
}
