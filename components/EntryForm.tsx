import React, { useState } from 'react';
import { LogEntry, MaintenanceType } from '../types';

interface EntryFormProps {
  onSubmit: (entry: Omit<LogEntry, 'id'>) => void;
  onCancel: () => void;
}

export const EntryForm: React.FC<EntryFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<LogEntry, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    operator: '',
    hourMeter: 0,
    voltageOutput: 380,
    frequency: 50.0,
    batteryVoltage: 26.5,
    oilPressure: 4.5,
    waterTemp: 70,
    fuelLevel: 80,
    type: MaintenanceType.ROUTINE,
    notes: 'Kondisi Normal'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'hourMeter' || name === 'voltageOutput' || name === 'frequency' || name === 'batteryVoltage' || name === 'oilPressure' || name === 'waterTemp' || name === 'fuelLevel') 
        ? parseFloat(value) 
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6 mb-6 animate-fade-in-down">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800">Input Data Perawatan Baru</h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Identitas */}
        <div className="lg:col-span-4 border-b border-slate-100 pb-2 mb-2">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Identitas & Waktu</h4>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
          <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Jam</label>
          <input required type="time" name="time" value={formData.time} onChange={handleChange} className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nama Operator</label>
          <input required type="text" name="operator" value={formData.operator} onChange={handleChange} placeholder="Nama Anda" className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Perawatan</label>
          <select name="type" value={formData.type} onChange={handleChange} className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-sm">
            {Object.values(MaintenanceType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Engine Params */}
        <div className="lg:col-span-4 border-b border-slate-100 pb-2 mb-2 mt-2">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Parameter Mesin (Engine)</h4>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Hour Meter</label>
          <input required type="number" step="0.1" name="hourMeter" value={formData.hourMeter} onChange={handleChange} className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Suhu Air (°C)</label>
          <input required type="number" name="waterTemp" value={formData.waterTemp} onChange={handleChange} className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tekanan Oli (Bar)</label>
          <input required type="number" step="0.1" name="oilPressure" value={formData.oilPressure} onChange={handleChange} className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Level Solar (%)</label>
          <input required type="number" min="0" max="100" name="fuelLevel" value={formData.fuelLevel} onChange={handleChange} className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-sm" />
        </div>

        {/* Electrical Params */}
        <div className="lg:col-span-4 border-b border-slate-100 pb-2 mb-2 mt-2">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kelistrikan (Electrical)</h4>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tegangan Output (V)</label>
          <input required type="number" name="voltageOutput" value={formData.voltageOutput} onChange={handleChange} className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Frekuensi (Hz)</label>
          <input required type="number" step="0.1" name="frequency" value={formData.frequency} onChange={handleChange} className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tegangan Baterai (V)</label>
          <input required type="number" step="0.1" name="batteryVoltage" value={formData.batteryVoltage} onChange={handleChange} className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-sm" />
        </div>

        <div className="lg:col-span-4">
           <label className="block text-sm font-medium text-slate-700 mb-1">Catatan Tambahan</label>
           <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-sm" rows={2}></textarea>
        </div>

        <div className="lg:col-span-4 flex justify-end space-x-3 pt-4 border-t border-slate-100">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">
            Batal
          </button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Simpan Data
          </button>
        </div>
      </form>
    </div>
  );
};