import React from 'react';
import { LogEntry, MaintenanceType } from '../types';

interface LogbookTableProps {
  entries: LogEntry[];
  onDelete: (id: string) => void;
}

export const LogbookTable: React.FC<LogbookTableProps> = ({ entries, onDelete }) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:border-none">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center print:hidden">
        <h2 className="text-lg font-semibold text-slate-800">Riwayat Pencatatan (Log History)</h2>
        <span className="text-sm text-slate-500">Total: {entries.length} Entries</span>
      </div>

      {/* Header for Print Only */}
      <div className="hidden print:block mb-8">
        <h1 className="text-2xl font-bold text-center mb-2">LOGBOOK PERAWATAN GENSET 150 kVA</h1>
        <div className="flex justify-between text-sm border-b-2 border-black pb-2 mb-4">
          <p>Unit ID: <strong>GS-150-A</strong></p>
          <p>Lokasi: <strong>Power House Lt. 1</strong></p>
          <p>Periode: <strong>{new Date().getFullYear()}</strong></p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200 print:bg-gray-100 print:text-black">
            <tr>
              <th className="px-4 py-3 text-center w-12">No</th>
              <th className="px-4 py-3">Tanggal & Waktu</th>
              <th className="px-4 py-3">Operator</th>
              <th className="px-4 py-3 text-right">Hour Meter</th>
              <th className="px-4 py-3 text-right">Volt (V)</th>
              <th className="px-4 py-3 text-right">Freq (Hz)</th>
              <th className="px-4 py-3 text-right">Batt (V)</th>
              <th className="px-4 py-3 text-right">Suhu (°C)</th>
              <th className="px-4 py-3 text-right">Oli (Bar)</th>
              <th className="px-4 py-3">Jenis</th>
              <th className="px-4 py-3">Keterangan</th>
              <th className="px-4 py-3 print:hidden text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 print:divide-gray-300">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-4 py-8 text-center text-slate-400 italic">
                  Belum ada data logbook.
                </td>
              </tr>
            ) : (
              entries.map((entry, index) => (
                <tr key={entry.id} className="hover:bg-slate-50 print:hover:bg-transparent">
                  <td className="px-4 py-3 text-center text-slate-500">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {entry.date} <span className="text-slate-400 text-xs block">{entry.time}</span>
                  </td>
                  <td className="px-4 py-3">{entry.operator}</td>
                  <td className="px-4 py-3 text-right font-mono">{entry.hourMeter}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{entry.voltageOutput}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{entry.frequency}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${entry.batteryVoltage < 24 ? 'text-red-600' : 'text-green-600'}`}>
                    {entry.batteryVoltage}
                  </td>
                  <td className={`px-4 py-3 text-right ${entry.waterTemp > 90 ? 'text-red-600 font-bold' : ''}`}>
                    {entry.waterTemp}
                  </td>
                  <td className="px-4 py-3 text-right">{entry.oilPressure}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full 
                      ${entry.type === MaintenanceType.ROUTINE ? 'bg-blue-100 text-blue-700' : 
                        entry.type === MaintenanceType.REPAIR ? 'bg-red-100 text-red-700' : 
                        'bg-orange-100 text-orange-700'} print:bg-transparent print:text-black print:p-0 print:font-normal`}>
                      {entry.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate print:whitespace-normal">{entry.notes}</td>
                  <td className="px-4 py-3 print:hidden text-center">
                    <button 
                      onClick={() => onDelete(entry.id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      title="Hapus Data"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Signature Area for Print Only */}
      <div className="hidden print:flex justify-between mt-16 px-8 page-break-inside-avoid">
        <div className="text-center">
          <p className="mb-16 border-b border-black w-48 mx-auto"></p>
          <p className="font-bold">Dibuat Oleh (Operator)</p>
        </div>
        <div className="text-center">
          <p className="mb-16 border-b border-black w-48 mx-auto"></p>
          <p className="font-bold">Diperiksa Oleh (Supervisor)</p>
        </div>
        <div className="text-center">
          <p className="mb-16 border-b border-black w-48 mx-auto"></p>
          <p className="font-bold">Diketahui Oleh (Manager)</p>
        </div>
      </div>
    </div>
  );
};