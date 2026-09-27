import React, { useState } from 'react';
import {
  Receipt,
  Search,
  CreditCard,
  QrCode,
  DollarSign,
  Printer,
  CheckCircle2,
  Clock,
  Building,
  User,
  Shield,
  X,
  FileText,
  Percent,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export default function Billing() {
  const { bills, settleBill, patients } = useHospital();

  const [selectedBill, setSelectedBill] = useState(bills[0]);
  const [paymentMode, setPaymentMode] = useState('UPI / Card');
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [customDiscount, setCustomDiscount] = useState(selectedBill?.discount || 0);

  // Switch Bill
  const handleSelectBill = (bill) => {
    setSelectedBill(bill);
    setPaymentMode(bill.paymentMethod || 'UPI / Card');
    setCustomDiscount(bill.discount || 0);
  };

  const handleSettleAndPrint = () => {
    settleBill(selectedBill.billNo, paymentMode);
    setIsReceiptModalOpen(true);
  };

  const calculatedTotal = (selectedBill?.subtotal || 0) - Number(customDiscount);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Central Cashier & Invoicing Terminal</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              Station #02 Active
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Consolidated outpatient fee, pharmacy items, laboratory diagnostics, and insurance settlement
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs text-xs flex items-center gap-3">
            <span className="text-slate-500">Today's Station Collections:</span>
            <span className="font-bold text-teal-800 text-sm">₹84,500</span>
          </div>
        </div>
      </div>

      {/* Main Billing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Bills Ledger (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Pending & Recent Invoices
              </h3>
              <span className="text-xs text-slate-400">{bills.length} bills</span>
            </div>

            {/* Bill List */}
            <div className="space-y-2">
              {bills.map((bill) => {
                const isSelected = selectedBill?.billNo === bill.billNo;
                const isPaid = bill.status === 'Paid';

                return (
                  <div
                    key={bill.billNo}
                    onClick={() => handleSelectBill(bill)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-teal-50/40 border-teal-700 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-800">
                        {bill.billNo}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          isPaid
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {bill.status}
                      </span>
                    </div>

                    <div className="mt-2 flex items-baseline justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800">{bill.patientName}</div>
                        <div className="text-[11px] text-slate-400">
                          Token: {bill.token} • UHID: {bill.uhid}
                        </div>
                      </div>
                      <div className="text-sm font-extrabold text-slate-900">
                        ₹{bill.total}
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{bill.department}</span>
                      <span>{bill.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Invoicing Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-5">
            {/* Top Invoice Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                    {selectedBill?.billNo}
                  </span>
                  <h2 className="text-base font-bold text-slate-900">{selectedBill?.patientName}</h2>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  UHID: <span className="font-mono text-slate-700">{selectedBill?.uhid}</span> • Token: <strong className="text-slate-800">{selectedBill?.token}</strong> • {selectedBill?.department}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    selectedBill?.status === 'Paid'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  Status: {selectedBill?.status}
                </span>
              </div>
            </div>

            {/* Itemized Services Breakdown Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-teal-700" />
                  <span>Itemized Charges Breakdown</span>
                </h3>
                <span className="text-[11px] text-slate-400">Verified by Medical Records</span>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[10px] uppercase">
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Service / Procedure / Medication</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedBill?.items.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-semibold text-slate-400">{index + 1}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{item.desc}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-slate-800">
                          ₹{item.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Calculations & Insurance Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-teal-700" />
                  <span>TPA & Insurance Policy</span>
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  {selectedBill?.tpa}
                </div>
                <div className="text-[11px] text-slate-400">
                  Pre-authorization approval reference: <span className="font-mono text-slate-600">AUTH-99120-ST</span>
                </div>
              </div>

              {/* Subtotal, discount and Net Total */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Gross Subtotal:</span>
                  <span className="font-semibold text-slate-800">₹{selectedBill?.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <span>Discount / TPA Concession:</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <span>₹</span>
                    <input
                      type="number"
                      value={customDiscount}
                      onChange={(e) => setCustomDiscount(e.target.value)}
                      className="w-16 px-1.5 py-0.5 text-right bg-white border border-slate-200 rounded text-xs"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Healthcare GST (exempt):</span>
                  <span className="font-semibold text-slate-800">₹0</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex items-baseline justify-between">
                  <span className="font-bold text-slate-900 text-sm">Net Payable Total:</span>
                  <span className="font-extrabold text-teal-800 text-lg">
                    ₹{calculatedTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Tender Payment Method
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {['UPI / QR', 'Cash', 'Credit Card', 'TPA Insurance'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMode(method)}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                      paymentMode === method
                        ? 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {method === 'UPI / QR' && <QrCode className="w-3.5 h-3.5" />}
                    {method === 'Cash' && <DollarSign className="w-3.5 h-3.5" />}
                    {method === 'Credit Card' && <CreditCard className="w-3.5 h-3.5" />}
                    {method === 'TPA Insurance' && <Shield className="w-3.5 h-3.5" />}
                    <span>{method}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Bottom Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                Cashier: {selectedBill?.cashier}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsReceiptModalOpen(true)}
                  className="px-4 py-2 border border-slate-200 hover:border-teal-700 text-slate-700 hover:text-teal-700 text-xs font-semibold rounded-md shadow-2xs transition flex items-center gap-2"
                >
                  <Printer className="w-3.5 h-3.5 text-teal-700" />
                  <span>Preview Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={handleSettleAndPrint}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-md shadow-xs transition flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Settle & Print Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Receipt Modal Preview */}
      {isReceiptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Controls */}
            <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50 no-print">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-teal-700" />
                <span className="text-xs font-bold text-slate-800">Hospital Receipt Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setIsReceiptModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Receipt Invoice */}
            <div className="p-8 bg-white text-slate-900 space-y-5">
              {/* Hospital Header */}
              <div className="text-center border-b border-slate-200 pb-4">
                <div className="inline-block w-7 h-7 rounded bg-teal-800 text-white font-bold text-xs leading-7 mb-1">
                  AC
                </div>
                <h1 className="text-base font-bold text-slate-900 uppercase tracking-tight">
                  AEGIS CARE MULTISPECIALTY HOSPITAL
                </h1>
                <p className="text-[10px] text-slate-500">
                  Plot 14-B, Health Boulevard, Central Zone • GSTIN: 07AAACA4910C1Z8
                </p>
                <div className="text-[11px] font-bold text-teal-800 mt-2 uppercase tracking-wider">
                  OFFICIAL CASHIER PAYMENT RECEIPT
                </div>
              </div>

              {/* Receipt Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50/70 p-3 rounded border border-slate-200">
                <div>
                  <div><span className="text-slate-400">Invoice #:</span> <strong className="font-mono text-slate-800">{selectedBill?.billNo}</strong></div>
                  <div><span className="text-slate-400">Patient:</span> <strong className="text-slate-800">{selectedBill?.patientName}</strong></div>
                  <div><span className="text-slate-400">UHID:</span> <span className="font-mono text-slate-700">{selectedBill?.uhid}</span></div>
                </div>
                <div className="text-right">
                  <div><span className="text-slate-400">Date:</span> 27 Sep 2026, 09:30 AM</div>
                  <div><span className="text-slate-400">Doctor:</span> {selectedBill?.doctor}</div>
                  <div><span className="text-slate-400">Tender Mode:</span> <strong className="text-teal-800">{paymentMode}</strong></div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 text-slate-600 font-semibold text-[10px] uppercase">
                  <tr>
                    <th className="p-2 border-b">Item Description</th>
                    <th className="p-2 border-b text-center">Category</th>
                    <th className="p-2 border-b text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedBill?.items.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2 text-slate-800">{item.desc}</td>
                      <td className="p-2 text-center text-slate-500 text-[10px]">{item.category}</td>
                      <td className="p-2 text-right font-medium text-slate-800">₹{item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="border-t border-slate-200 pt-2 text-xs space-y-1 text-right">
                <div><span className="text-slate-500">Gross Total:</span> ₹{selectedBill?.subtotal.toLocaleString()}</div>
                <div><span className="text-slate-500">Discount / TPA Waiver:</span> -₹{Number(customDiscount).toLocaleString()}</div>
                <div className="text-sm font-extrabold text-teal-800 pt-1 border-t border-slate-100">
                  Net Amount Received: ₹{calculatedTotal.toLocaleString()}
                </div>
              </div>

              {/* Barcode & Cashier Seal */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div>
                  {/* Clean SVG Barcode Representation */}
                  <div className="flex items-center gap-0.5 h-8">
                    {[2, 4, 1, 3, 2, 5, 1, 3, 4, 2, 1, 3, 5, 2, 4, 1, 2, 4, 3, 2, 5].map((w, i) => (
                      <div
                        key={i}
                        className="bg-slate-800 h-full"
                        style={{ width: `${w}px` }}
                      />
                    ))}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 mt-1">AC-INV-982410-REC</div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-semibold text-emerald-700 uppercase border border-emerald-300 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                    ✓ PAID & SETTLED
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Authorized Cashier Desk #2</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
