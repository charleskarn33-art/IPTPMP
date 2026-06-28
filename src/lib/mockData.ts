import type { Site, Technician, Inspection, Region } from './types'

export const COUNTIES = [
  'Bomi', 'Bong', 'Gbarpolu', 'Grand Bassa', 'Grand Cape Mount',
  'Grand Gedeh', 'Grand Kru', 'Lofa', 'Margibi', 'Maryland',
  'Montserrado', 'Nimba', 'River Cess', 'River Gee', 'Sinoe'
]

export const mockTechnicians: Technician[] = [
  { id: '1', employee_id: 'IPT-800811', name: 'Adam Kiazolu', phone: '+231 77 505 8482', status: 'Active', created_at: '2024-01-01' },
  { id: '2', employee_id: 'IPT-800416', name: 'Benjamn B. Gaye', email: 'benjamn.g@iptpowertech.com', phone: '0772558385', region: 'Bomi', specialization: 'All Systems', status: 'Active', created_at: '2024-01-01' },
  { id: '3', employee_id: 'IPT-800417', name: 'Joseph Johnson', email: 'joseph.j@iptpowertech.com', phone: '0772558369', region: 'Montserrado', specialization: 'All Systems', status: 'Active', created_at: '2024-01-01' },
  { id: '4', employee_id: 'IPT-800418', name: 'Kalifah Konneh', email: 'kalifah.k@iptpowertech.com', phone: '0772558370', region: 'Montserrado', specialization: 'All Systems', status: 'Active', created_at: '2024-01-01' },
  { id: '5', employee_id: 'IPT-800419', name: 'Olushoto Oladele', email: 'olushoto.o@iptpowertech.com', phone: '0772833766', region: 'Montserrado', specialization: 'All Systems', status: 'Active', created_at: '2024-01-01' },
  { id: '6', employee_id: 'IPT-800427', name: 'Augustine Soribah', email: 'augustine.s@iptpowertech.com', phone: '0775236268', region: 'Lofa', specialization: 'All Systems', status: 'Active', created_at: '2024-01-01' },
  { id: '7', employee_id: 'IPT-800090', name: 'Abel Tarr', email: 'abel.t@iptpowertech.com', phone: '0773985789', region: 'River Gee', specialization: 'All Systems', status: 'Active', created_at: '2024-01-01' },
  { id: '8', employee_id: 'IPT-800421', name: 'Moses Kollie', email: 'moses.k@iptpowertech.com', phone: '0772558371', region: 'Montserrado', specialization: 'All Systems', status: 'Active', created_at: '2024-01-01' },
  { id: '9', employee_id: 'IPT-800422', name: 'Jacob Fayiah', email: 'jacob.f@iptpowertech.com', phone: '0772558372', region: 'Montserrado', specialization: 'All Systems', status: 'Active', created_at: '2024-01-01' },
  { id: '10', employee_id: 'IPT-800423', name: 'Mohammed Konneh', email: 'mohammed.k@iptpowertech.com', phone: '0772558373', region: 'Montserrado', specialization: 'All Systems', status: 'Active', created_at: '2024-01-01' },
  { id: '11', employee_id: 'IPT-800424', name: 'Aaron Gotogo', email: 'aaron.g@iptpowertech.com', phone: '0772558374', region: 'Bong', specialization: 'All Systems', status: 'Active', created_at: '2024-01-01' },
  { id: '12', employee_id: 'IPT-800425', name: 'Kollie Moses', email: 'kollie.m@iptpowertech.com', phone: '0772558375', region: 'Bong', specialization: 'All Systems', status: 'Active', created_at: '2024-01-01' },
  { id: '13', employee_id: 'IPT-800426', name: 'Abraham Cole', email: 'abraham.c@iptpowertech.com', phone: '0772558376', region: 'Gbarpolu', specialization: 'All Systems', status: 'Active', created_at: '2024-01-01' },
  { id: '14', employee_id: 'IPT-800428', name: 'Kerkulah Moses', email: 'kerkulah.m@iptpowertech.com', phone: '0772558377', region: 'Bong', specialization: 'All Systems', status: 'Active', created_at: '2024-01-01' },
  { id: '15', employee_id: 'IPT-800429', name: 'Kollie Aaron', email: 'kollie.a@iptpowertech.com', phone: '0772558378', region: 'Bong', specialization: 'All Systems', status: 'Active', created_at: '2024-01-01' },
]

const siteNames = [
  'Baiyema', 'Gbarnga 8', 'Duport Road Junction', 'Hotel Africa 2', 'King Farm',
  'Banjor Road', 'ISI Factory 2', 'Yargaryah', 'Sinkor', 'Congo Town',
  'Paynesville', 'Clara Town', 'New Georgia', 'Brewerville', 'Gardnersville',
  'Red Light', 'Barnesville', 'Caldwell', 'Virginia', 'Klay',
  'Tubmanburg', 'Suehn', 'Gbarnga', 'Salala', 'Phebe',
  'Totota', 'Bong Mines', 'Voinjama', 'Foya', 'Kolahun',
  'Zorzor', 'Vahun', 'Robertsport', 'Sinje', 'Bomi Hills',
  'Buchanan', 'Cestos', 'Rivercess', 'Barclayville', 'Greenville',
  'Fishtown', 'River Gee', 'Harper', 'Pleebo', 'Cavalla',
  'Zwedru', 'Tchien', 'Nimba', 'Ganta', 'Sanniquellie',
]

function generateSites(): Site[] {
  const sites: Site[] = []
  const types: Array<'Greenfield' | 'Outdoor' | 'Indoor'> = ['Greenfield', 'Outdoor', 'Indoor']
  const techs = mockTechnicians.map(t => t.name)

  let id = 1000
  for (let i = 0; i < 576; i++) {
    const county = COUNTIES[i % COUNTIES.length]
    const name = `${siteNames[i % siteNames.length]}${i > siteNames.length ? ' ' + Math.floor(i / siteNames.length) : ''}`
    const type = types[i % 3]
    const tech = techs[i % techs.length]
    sites.push({
      id: String(i + 1),
      site_id_code: String(id + i),
      name,
      region: county,
      county,
      status: 'Active',
      type,
      generators: i % 3 === 0 ? 0 : 1,
      kva: 30,
      panels: (i % 50) * 2,
      assigned_technician: tech,
      last_inspection_date: '2026-06-24',
      created_at: '2024-01-01',
    })
  }
  return sites
}

export const mockSites: Site[] = generateSites()

export const mockInspections: Inspection[] = [
  { id: '1', site_id: '1', site_name: 'Baiyema', site_code: '1418', technician_name: 'Adam Kiazolu', region: 'Bong', county: 'Bong', inspection_date: '2026-06-24', status: 'completed', overall_completion: 0, created_at: '2026-06-24', updated_at: '2026-06-24' },
  { id: '2', site_id: '2', site_name: 'Hotel Africa 2', site_code: '1443', technician_name: 'Mohammed Konneh', region: 'Montserrado', county: 'Montserrado', inspection_date: '2026-06-24', status: 'completed', overall_completion: 100, created_at: '2026-06-24', updated_at: '2026-06-24' },
  { id: '3', site_id: '3', site_name: 'King farm', site_code: '1440', technician_name: 'Jacob Fayiah', region: 'Montserrado', county: 'Montserrado', inspection_date: '2026-06-10', status: 'completed', overall_completion: 100, created_at: '2026-06-10', updated_at: '2026-06-10' },
  { id: '4', site_id: '4', site_name: 'Banjor Road', site_code: '1508', technician_name: 'Mohammed Konneh', region: 'Montserrado', county: 'Montserrado', inspection_date: '2026-06-23', status: 'completed', overall_completion: 85, created_at: '2026-06-23', updated_at: '2026-06-23' },
  { id: '5', site_id: '5', site_name: 'ISI Factory 2', site_code: '1331', technician_name: 'Jacob Fayiah', region: 'Montserrado', county: 'Montserrado', inspection_date: '2026-06-20', status: 'completed', overall_completion: 100, created_at: '2026-06-20', updated_at: '2026-06-20' },
  { id: '6', site_id: '6', site_name: 'Congo Town', site_code: '1220', technician_name: 'Moses Kollie', region: 'Montserrado', county: 'Montserrado', inspection_date: '2026-06-18', status: 'in_progress', overall_completion: 45, created_at: '2026-06-18', updated_at: '2026-06-18' },
  { id: '7', site_id: '7', site_name: 'Paynesville', site_code: '1335', technician_name: 'Khalifa Konneh', region: 'Montserrado', county: 'Montserrado', inspection_date: '2026-06-15', status: 'in_progress', overall_completion: 60, created_at: '2026-06-15', updated_at: '2026-06-15' },
  { id: '8', site_id: '8', site_name: 'Gbarnga 8', site_code: '1801', technician_name: 'Kerkulah Moses', region: 'Bong', county: 'Bong', inspection_date: '2026-06-12', status: 'completed', overall_completion: 100, created_at: '2026-06-12', updated_at: '2026-06-12' },
  { id: '9', site_id: '9', site_name: 'Voinjama', site_code: '1650', technician_name: 'Augustine Soribah', region: 'Lofa', county: 'Lofa', inspection_date: '2026-06-10', status: 'completed', overall_completion: 90, created_at: '2026-06-10', updated_at: '2026-06-10' },
  { id: '10', site_id: '10', site_name: 'Buchanan', site_code: '1420', technician_name: 'Abel Tarr', region: 'Grand Bassa', county: 'Grand Bassa', inspection_date: '2026-06-08', status: 'completed', overall_completion: 75, created_at: '2026-06-08', updated_at: '2026-06-08' },
]

for (let i = 10; i < 222; i++) {
  const county = COUNTIES[i % COUNTIES.length]
  const site = mockSites[i]
  mockInspections.push({
    id: String(i + 1),
    site_id: site.id,
    site_name: site.name,
    site_code: site.site_id_code,
    technician_name: mockTechnicians[i % mockTechnicians.length].name,
    region: county,
    county,
    inspection_date: '2026-05-15',
    status: 'completed',
    overall_completion: 80 + (i % 20),
    created_at: '2026-05-15',
    updated_at: '2026-05-15',
  })
}

export const mockRegions: Region[] = [
  { name: 'Bomi', sites: 18, technicians: 2, completion_pct: 100, open_pm: 0 },
  { name: 'Bong', sites: 45, technicians: 4, completion_pct: 100, open_pm: 0 },
  { name: 'Gbarpolu', sites: 22, technicians: 2, completion_pct: 100, open_pm: 0 },
  { name: 'Grand Bassa', sites: 38, technicians: 3, completion_pct: 100, open_pm: 0 },
  { name: 'Grand Cape Mount', sites: 15, technicians: 2, completion_pct: 100, open_pm: 0 },
  { name: 'Grand Gedeh', sites: 20, technicians: 2, completion_pct: 100, open_pm: 0 },
  { name: 'Grand Kru', sites: 25, technicians: 2, completion_pct: 100, open_pm: 0 },
  { name: 'Lofa', sites: 55, technicians: 3, completion_pct: 100, open_pm: 0 },
  { name: 'Margibi', sites: 28, technicians: 2, completion_pct: 100, open_pm: 0 },
  { name: 'Maryland', sites: 22, technicians: 2, completion_pct: 100, open_pm: 0 },
  { name: 'Montserrado', sites: 126, technicians: 8, completion_pct: 98, open_pm: 2 },
  { name: 'Nimba', sites: 65, technicians: 4, completion_pct: 91, open_pm: 3 },
  { name: 'River Cess', sites: 8, technicians: 1, completion_pct: 0, open_pm: 0 },
  { name: 'River Gee', sites: 22, technicians: 2, completion_pct: 100, open_pm: 0 },
  { name: 'Sinoe', sites: 12, technicians: 1, completion_pct: 100, open_pm: 0 },
]

export const countyCompletions = [
  { county: 'Bomi', completed: 2, total: 2 },
  { county: 'Bong', completed: 8, total: 8 },
  { county: 'Gbarpolu', completed: 6, total: 6 },
  { county: 'Grand Bassa', completed: 7, total: 7 },
  { county: 'Grand Cape Mount', completed: 2, total: 2 },
  { county: 'Grand Gedeh', completed: 2, total: 2 },
  { county: 'Grand Kru', completed: 7, total: 7 },
  { county: 'Lofa', completed: 12, total: 12 },
  { county: 'Margibi', completed: 4, total: 4 },
  { county: 'Maryland', completed: 4, total: 4 },
  { county: 'Montserrado', completed: 124, total: 126 },
  { county: 'Nimba', completed: 29, total: 32 },
  { county: 'River Cess', completed: 0, total: 0 },
  { county: 'River Gee', completed: 7, total: 7 },
  { county: 'Sinoe', completed: 1, total: 1 },
]

export const generatorChecklist = [
  { id: 'g1', question: 'Is the generator operational?', measurement_unit: '' },
  { id: 'g2', question: 'Fuel level adequate (>50%)?', measurement: 'fuel_level', measurement_unit: '%' },
  { id: 'g3', question: 'Oil level within normal range?', measurement_unit: '' },
  { id: 'g4', question: 'Coolant level adequate?', measurement_unit: '' },
  { id: 'g5', question: 'No visible oil/fuel leaks?', measurement_unit: '' },
  { id: 'g6', question: 'Runtime hours logged?', measurement: 'runtime_hours', measurement_unit: 'hrs' },
  { id: 'g7', question: 'Battery voltage normal?', measurement: 'battery_voltage', measurement_unit: 'V' },
  { id: 'g8', question: 'Output voltage within spec?', measurement: 'output_voltage', measurement_unit: 'V' },
  { id: 'g9', question: 'Air filter clean?', measurement_unit: '' },
  { id: 'g10', question: 'All alarms cleared?', measurement_unit: '' },
]

export const dcSystemChecklist = [
  { id: 'd1', question: 'Rectifier operating normally?', measurement_unit: '' },
  { id: 'd2', question: 'DC output voltage within spec?', measurement: 'dc_voltage', measurement_unit: 'V' },
  { id: 'd3', question: 'Load current within limits?', measurement: 'load_current', measurement_unit: 'A' },
  { id: 'd4', question: 'No alarms on rectifier?', measurement_unit: '' },
  { id: 'd5', question: 'All modules operational?', measurement_unit: '' },
  { id: 'd6', question: 'Cabinet temperature normal?', measurement: 'temperature', measurement_unit: '°C' },
]

export const batteryChecklist = [
  { id: 'b1', question: 'Battery float voltage normal?', measurement: 'float_voltage', measurement_unit: 'V' },
  { id: 'b2', question: 'No swollen/damaged cells?', measurement_unit: '' },
  { id: 'b3', question: 'Terminals clean and tight?', measurement_unit: '' },
  { id: 'b4', question: 'Battery room temperature normal?', measurement: 'temperature', measurement_unit: '°C' },
  { id: 'b5', question: 'Battery backup time adequate?', measurement_unit: '' },
  { id: 'b6', question: 'No acid spills?', measurement_unit: '' },
]

export const solarChecklist = [
  { id: 's1', question: 'Panels clean and undamaged?', measurement_unit: '' },
  { id: 's2', question: 'Solar charge controller operational?', measurement_unit: '' },
  { id: 's3', question: 'Panel output voltage normal?', measurement: 'panel_voltage', measurement_unit: 'V' },
  { id: 's4', question: 'Charge current adequate?', measurement: 'charge_current', measurement_unit: 'A' },
  { id: 's5', question: 'All connections secure?', measurement_unit: '' },
]

export const cleaningChecklist = [
  { id: 'c1', question: 'Site exterior clean?', measurement_unit: '' },
  { id: 'c2', question: 'Equipment room clean?', measurement_unit: '' },
  { id: 'c3', question: 'No vegetation overgrowth?', measurement_unit: '' },
  { id: 'c4', question: 'Drainage clear?', measurement_unit: '' },
  { id: 'c5', question: 'Perimeter fence intact?', measurement_unit: '' },
]

export const rmsChecklist = [
  { id: 'r1', question: 'RMS unit online?', measurement_unit: '' },
  { id: 'r2', question: 'All sensors reporting?', measurement_unit: '' },
  { id: 'r3', question: 'Alarms configured correctly?', measurement_unit: '' },
  { id: 'r4', question: 'Communication link active?', measurement_unit: '' },
  { id: 'r5', question: 'Data logged for last 30 days?', measurement_unit: '' },
]
