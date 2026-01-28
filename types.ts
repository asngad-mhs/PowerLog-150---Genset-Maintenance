export enum MaintenanceType {
  ROUTINE = 'Harian',
  WEEKLY = 'Mingguan',
  SERVICE = 'Service Berkala',
  REPAIR = 'Perbaikan'
}

export interface LogEntry {
  id: string;
  date: string;
  time: string;
  operator: string;
  hourMeter: number;
  voltageOutput: number; // Volts (e.g. 380-400)
  frequency: number; // Hz
  batteryVoltage: number; // VDC
  oilPressure: number; // Bar/Psi
  waterTemp: number; // Celcius
  fuelLevel: number; // Percentage
  type: MaintenanceType;
  notes: string;
}

export interface GensetStats {
  totalHours: number;
  lastService: string;
  fuelStatus: number;
  batteryHealth: number;
}