import React, { useState, useEffect } from 'react';
import { LogbookTable } from './components/LogbookTable';
import { EntryForm } from './components/EntryForm';
import { StatsCard } from './components/StatsCard';
import { LogEntry, MaintenanceType } from './types';
import { askGeminiAssistant } from './services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SAMPLE_DATA: LogEntry[] = [
  { id: '1', date: '2023-10-25', time: '08:00', operator: 'Budi Santoso', hourMeter: 12450.5, voltageOutput: 382, frequency: 50.1, batteryVoltage: 26.8, oilPressure: 4.8, waterTemp: 72, fuelLevel: 90, type: MaintenanceType.ROUTINE, notes: 'Normal running test 15 menit' },
  { id: '2', date: '2023-10-26', time: '08:15', operator: 'Agus W', hourMeter: 12450.8, voltageOutput: 380, frequency: 50.0, batteryVoltage: 26.7, oilPressure: 4.7, waterTemp: 75, fuelLevel: 88, type: MaintenanceType.ROUTINE, notes: 'Pengecekan air radiator sedikit kurang' },
  { id: '3', date: '2023-10-27', time: '09:00', operator: 'Budi Santoso', hourMeter: 12451.2, voltageOutput: 381, frequency: 49.9, batteryVoltage: 25.5, oilPressure: 4.6, waterTemp: 78, fuelLevel: 85, type: MaintenanceType.WEEKLY, notes: 'Pembersihan filter udara' },
  { id: '4', date: '2023-10-28', time: '08:00', operator: 'Dedi K', hourMeter: 12452.0, voltageOutput: 379, frequency: 50.2, batteryVoltage: 26.9, oilPressure: 4.8, waterTemp: 73, fuelLevel: 82, type: MaintenanceType.ROUTINE, notes: 'Normal' },
];

function App() {
  const [entries, setEntries] = useState<LogEntry[]>(SAMPLE_DATA);
  const [showForm, setShowForm] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'logbook'>('dashboard');

  const handleAddEntry = (newEntry: Omit<LogEntry, 'id'>) => {
    const entry: LogEntry = {
      ...newEntry,
      id: Date.now().toString(),
    };
    setEntries([entry, ...entries]);
    setShowForm(false);
  };

  const handleDeleteEntry = (id: string) => {
    if(window.confirm('Hapus data ini?')) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  const handlePrint = () => {
    setActiveTab('logbook'); // Ensure table is visible
    setTimeout(() => window.print(), 100);
  };

  const handleAiAsk = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setAiResponse('');
    
    // Create a context string from the last 3 entries
    const contextData = JSON.stringify(entries.slice(0, 3));
    
    const response = await askGeminiAssistant(aiPrompt, contextData);
    setAiResponse(response || 'Tidak ada respon.');
    setIsAiLoading(false);
  };

  // Stats Calculation
  const lastEntry = entries[0] || {};
  const totalHours = entries.length > 0 ? entries[0].hourMeter : 0;
  const avgBattery = entries.length > 0 ? (entries.reduce((acc, curr) => acc + curr.batteryVoltage, 0) / entries.length).toFixed(1) : 0;

  return (
    <div className="min-h-screen pb-12 print:pb-0 print:bg-white">
      
      {/* Header / Navbar */}
      <header className="bg-slate-900 text-white shadow-md print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="h-8 w-8 bg-yellow-500 rounded flex items-center justify-center font-bold text-slate-900">PL</div>
             <h1 className="text-xl font-bold tracking-tight">PowerLog <span className="text-yellow-500">150</span></h1>
          </div>
          <nav className="flex space-x-4">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'dashboard' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('logbook')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'logbook' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
            >
              Logbook Data
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* DASHBOARD VIEW */}
        <div className={`${activeTab === 'dashboard' ? 'block' : 'hidden'} print:hidden space-y-8`}>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard 
              title="Total Run Hours" 
              value={totalHours} 
              unit="Hrs"
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
            />
            <StatsCard 
              title="Status Baterai" 
              value={lastEntry.batteryVoltage || 0} 
              unit="Volts"
              colorClass={(lastEntry.batteryVoltage || 0) < 24 ? "bg-red-50 border-red-200" : "bg-white"}
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/></svg>}
            />
            <StatsCard 
              title="Level Solar" 
              value={lastEntry.fuelLevel || 0} 
              unit="%"
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8"/><path d="M12 2v6"/><path d="M10 5h4"/></svg>}
            />
             <StatsCard 
              title="Entri Log" 
              value={entries.length} 
              unit="Baris"
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>}
            />
          </div>

          {/* Charts Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Tren Suhu Mesin (°C)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[...entries].reverse()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickFormatter={(val) => val.slice(5)} />
                    <YAxis stroke="#94a3b8" fontSize={12} domain={[60, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Line type="monotone" dataKey="waterTemp" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Tren Tegangan Baterai (V)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[...entries].reverse()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickFormatter={(val) => val.slice(5)} />
                    <YAxis stroke="#94a3b8" fontSize={12} domain={[20, 30]} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Line type="monotone" dataKey="batteryVoltage" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* AI Assistant Section */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/><path d="m5.27 10.33-1.42 1.42a2 2 0 0 0 0 2.82l.71.71a2 2 0 0 0 2.82 0l1.42-1.42"/><path d="m17.5 13.5 1.42 1.42a2 2 0 0 1 0 2.82l-.71.71a2 2 0 0 1-2.82 0l-1.42-1.42"/><path d="M19.42 5.09 18 6.5a2.15 2.15 0 0 0-.61 1.5c0 1.25.96 2.37 2.21 2.37 1.29 0 2.4-1.15 2.4-2.4a2.15 2.15 0 0 0-.6-1.5l-1.42-1.42"/><path d="M12 14a6 6 0 0 0-6 6v1h12v-1a6 6 0 0 0-6-6Z"/></svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Genset AI Mechanic</h3>
                <p className="text-slate-300 text-sm mb-4">Tanyakan masalah teknis, jadwal maintenance, atau analisis data logbook Anda.</p>
                
                <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Contoh: Apakah suhu air 95 derajat normal untuk genset 150kVA?" 
                    className="flex-1 px-4 py-2 rounded-md border-none text-slate-900 focus:ring-2 focus:ring-yellow-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleAiAsk()}
                  />
                  <button 
                    onClick={handleAiAsk} 
                    disabled={isAiLoading}
                    className="px-4 py-2 bg-yellow-500 text-slate-900 font-bold rounded-md hover:bg-yellow-400 transition-colors disabled:opacity-50"
                  >
                    {isAiLoading ? 'Analisis...' : 'Tanya'}
                  </button>
                </div>

                {aiResponse && (
                  <div className="bg-white/10 p-4 rounded-md text-sm leading-relaxed border border-white/20 animate-fade-in">
                    <strong className="block text-yellow-400 mb-1">AI Response:</strong>
                    {aiResponse}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* LOGBOOK TABLE VIEW */}
        <div className={activeTab === 'logbook' ? 'block' : 'hidden print:block'}>
          <div className="flex justify-between items-center mb-6 print:hidden">
            <h2 className="text-2xl font-bold text-slate-900">Database Logbook</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowForm(!showForm)} 
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <span>Catat Log Baru</span>
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 border border-slate-300 rounded-md hover:bg-slate-200 transition-colors shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                <span>Cetak / PDF</span>
              </button>
            </div>
          </div>

          {showForm && (
            <EntryForm 
              onSubmit={handleAddEntry} 
              onCancel={() => setShowForm(false)} 
            />
          )}

          <LogbookTable entries={entries} onDelete={handleDeleteEntry} />
        </div>

      </main>

      <footer className="mt-12 py-6 border-t border-slate-200 text-center text-slate-500 text-sm print:hidden">
        <p>&copy; {new Date().getFullYear()} PowerLog System. Designed for 150 kVA Industrial Gensets.</p>
      </footer>
    </div>
  );
}

export default App;