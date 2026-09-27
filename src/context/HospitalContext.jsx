import React, { createContext, useContext, useState } from 'react';

const HospitalContext = createContext(null);

export const initialPatients = [
  {
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
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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
  // ICU WARD (Floor 2)
  { id: 'ICU-201', floor: 'Floor 2', ward: 'ICU', status: 'Occupied', patient: 'Sunil Mathur', uhid: 'AC-11902', doctor: 'Dr. Meera Nambiar', admitted: '25 Sep 2026', o2: 'Active (6L/min)', nurse: 'Sr. Mary' },
  { id: 'ICU-202', floor: 'Floor 2', ward: 'ICU', status: 'Occupied', patient: 'Kiran Bedi', uhid: 'AC-11943', doctor: 'Dr. Vivek Sharma', admitted: '26 Sep 2026', o2: 'Ventilator Mode', nurse: 'Sr. Mary' },
  { id: 'ICU-203', floor: 'Floor 2', ward: 'ICU', status: 'Available', patient: null, uhid: null, doctor: null, admitted: null, o2: 'Standby', nurse: 'Sr. Ancy' },
  { id: 'ICU-204', floor: 'Floor 2', ward: 'ICU', status: 'Maintenance', patient: null, uhid: null, doctor: null, admitted: null, o2: 'Calibration', nurse: 'Staff' },
  { id: 'ICU-205', floor: 'Floor 2', ward: 'ICU', status: 'Occupied', patient: 'Harish Rao', uhid: 'AC-11884', doctor: 'Dr. Alok Verma', admitted: '24 Sep 2026', o2: 'Active (2L/min)', nurse: 'Sr. Grace' },
  { id: 'ICU-206', floor: 'Floor 2', ward: 'ICU', status: 'Available', patient: null, uhid: null, doctor: null, admitted: null, o2: 'Standby', nurse: 'Sr. Grace' },

  // GENERAL WARD (Floor 1)
  { id: 'GEN-101', floor: 'Floor 1', ward: 'General Ward', status: 'Occupied', patient: 'Manoj Tiwari', uhid: 'AC-30911', doctor: 'Dr. Anita Desai', admitted: '26 Sep 2026', o2: 'Normal', nurse: 'Sr. Deepa' },
  { id: 'GEN-102', floor: 'Floor 1', ward: 'General Ward', status: 'Occupied', patient: 'Devendra Pal', uhid: 'AC-30912', doctor: 'Dr. Manoj Patel', admitted: '26 Sep 2026', o2: 'Normal', nurse: 'Sr. Deepa' },
  { id: 'GEN-103', floor: 'Floor 1', ward: 'General Ward', status: 'Available', patient: null, uhid: null, doctor: null, admitted: null, o2: 'Available', nurse: 'Sr. Deepa' },
  { id: 'GEN-104', floor: 'Floor 1', ward: 'General Ward', status: 'Available', patient: null, uhid: null, doctor: null, admitted: null, o2: 'Available', nurse: 'Sr. Deepa' },
  { id: 'GEN-105', floor: 'Floor 1', ward: 'General Ward', status: 'Occupied', patient: 'Sushila Devi', uhid: 'AC-30944', doctor: 'Dr. Anita Desai', admitted: '25 Sep 2026', o2: 'Active (2L/min)', nurse: 'Sr. Latha' },
  { id: 'GEN-106', floor: 'Floor 1', ward: 'General Ward', status: 'Maintenance', patient: null, uhid: null, doctor: null, admitted: null, o2: 'Sanitizing', nurse: 'Staff' },
  { id: 'GEN-107', floor: 'Floor 1', ward: 'General Ward', status: 'Occupied', patient: 'Balram Sethi', uhid: 'AC-30955', doctor: 'Dr. Manoj Patel', admitted: '24 Sep 2026', o2: 'Normal', nurse: 'Sr. Latha' },
  { id: 'GEN-108', floor: 'Floor 1', ward: 'General Ward', status: 'Available', patient: null, uhid: null, doctor: null, admitted: null, o2: 'Available', nurse: 'Sr. Latha' },

  // DELUXE SUITES (Floor 3)
  { id: 'DLX-301', floor: 'Floor 3', ward: 'Deluxe Rooms', status: 'Occupied', patient: 'Vijay Singhania', uhid: 'AC-50021', doctor: 'Dr. Vivek Sharma', admitted: '26 Sep 2026', o2: 'Available', nurse: 'Sr. Reshma' },
  { id: 'DLX-302', floor: 'Floor 3', ward: 'Deluxe Rooms', status: 'Available', patient: null, uhid: null, doctor: null, admitted: null, o2: 'Available', nurse: 'Sr. Reshma' },
  { id: 'DLX-303', floor: 'Floor 3', ward: 'Deluxe Rooms', status: 'Occupied', patient: 'Nandita Kapoor', uhid: 'AC-50044', doctor: 'Dr. Sneha Roy', admitted: '25 Sep 2026', o2: 'Available', nurse: 'Sr. Reshma' },
  { id: 'DLX-304', floor: 'Floor 3', ward: 'Deluxe Rooms', status: 'Available', patient: null, uhid: null, doctor: null, admitted: null, o2: 'Available', nurse: 'Sr. Reshma' },
  { id: 'DLX-305', floor: 'Floor 3', ward: 'Deluxe Rooms', status: 'Maintenance', patient: null, uhid: null, doctor: null, admitted: null, o2: 'Deep Cleaning', nurse: 'Staff' },
  { id: 'DLX-306', floor: 'Floor 3', ward: 'Deluxe Rooms', status: 'Available', patient: null, uhid: null, doctor: null, admitted: null, o2: 'Available', nurse: 'Sr. Reshma' },
];

export const initialBills = [
  {
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
  const [activeConsultationPatient, setActiveConsultationPatient] = useState(initialPatients[1]); // Ramesh Verma
  const [toastMessage, setToastMessage] = useState(null);
  const [isOpdModalOpen, setIsOpdModalOpen] = useState(false);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Add new OPD slip
  const addOpdPatient = (patientData) => {
    const nextTokenNum = 100 + patients.length + 1;
    const rawSymptoms = patientData.symptoms?.trim() || 'General Consultation';
    const half = Math.floor(rawSymptoms.length / 2);
    const cleanedSymptoms =
      rawSymptoms.length > 10 && rawSymptoms.slice(0, half) === rawSymptoms.slice(half)
        ? rawSymptoms.slice(0, half)
        : rawSymptoms;

    const newPatient = {
      token: `A-${nextTokenNum}`,
      uhid: `AC-${Math.floor(10000 + Math.random() * 90000)}`,
      name: patientData.name,
      age: Number(patientData.age),
      gender: patientData.gender,
      department: patientData.department,
      doctor: patientData.doctor || 'Dr. Anita Desai',
      symptoms: cleanedSymptoms,
      vitals: {
        bp: patientData.bp || '120/80',
        pulse: patientData.pulse || '76',
        temp: patientData.temp || '98.6',
        weight: patientData.weight || '65',
        spo2: patientData.spo2 || '99',
      },
      status: 'In-Queue',
      priority: patientData.priority || 'Normal',
      waitTime: 'Just arrived',
      registeredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      history: {
        allergies: 'None recorded',
        chronic: 'None',
        lastVisit: 'First Visit',
      },
      prescriptions: [],
    };

    setPatients((prev) => [newPatient, ...prev]);
    showToast(`OPD Slip issued: Token #${newPatient.token} (${newPatient.name}) for ${newPatient.department}`);
    return newPatient;
  };

  // Call next patient
  const callNextPatient = (department) => {
    const waiting = patients.find(
      (p) => p.status === 'In-Queue' && (!department || department === 'All' || p.department === department)
    );
    if (!waiting) {
      showToast('No patients currently in queue for this selection.', 'info');
      return null;
    }

    setPatients((prev) =>
      prev.map((p) => {
        if (p.token === waiting.token) {
          return { ...p, status: 'With Doctor' };
        }
        if (p.status === 'With Doctor' && (!department || department === 'All' || p.department === department)) {
          return { ...p, status: 'Completed' };
        }
        return p;
      })
    );

    setActiveConsultationPatient({ ...waiting, status: 'With Doctor' });
    showToast(`Called Token #${waiting.token}: ${waiting.name} to ${waiting.doctor}'s room`);
    return waiting;
  };

  // Update patient status
  const updatePatientStatus = (token, status) => {
    setPatients((prev) =>
      prev.map((p) => (p.token === token ? { ...p, status } : p))
    );
    showToast(`Updated Token #${token} status to "${status}"`);
  };

  // Save consultation notes & medicines
  const saveConsultation = (token, diagnosisList, prescriptions, notes, vitals) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.token === token) {
          return {
            ...p,
            status: 'Completed',
            diagnosis: diagnosisList,
            prescriptions: prescriptions,
            doctorNotes: notes,
            vitals: vitals || p.vitals,
          };
        }
        return p;
      })
    );
    showToast(`Consultation saved for Token #${token}. Sent to Pharmacy & Billing!`);
  };

  // Toggle bed status
  const updateBedStatus = (bedId, newStatus, patientName = null) => {
    setBeds((prev) =>
      prev.map((b) => {
        if (b.id === bedId) {
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
  };

  // Settle bill
  const settleBill = (billNo, paymentMethod = 'UPI / Card') => {
    setBills((prev) =>
      prev.map((b) => (b.billNo === billNo ? { ...b, status: 'Paid', paymentMethod } : b))
    );
    showToast(`Bill #${billNo} settled successfully via ${paymentMethod}!`);
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
        toastMessage,
        showToast,
        isOpdModalOpen,
        setIsOpdModalOpen,
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
