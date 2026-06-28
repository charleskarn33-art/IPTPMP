import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, MapPin, User, Calendar, CheckCircle, XCircle, MinusCircle } from 'lucide-react'
import { mockInspections } from '../../lib/mockData'
import type { PMStatus } from '../../lib/types'

const statusBadge: Record<PMStatus, string> = {
  completed: 'bg-green-100 text-green-800 border-green-200',
  in_progress: 'bg-orange-100 text-orange-800 border-orange-200',
  draft: 'bg-gray-100 text-gray-600 border-gray-200',
  under_review: 'bg-blue-100 text-blue-800 border-blue-200',
  reviewed: 'bg-purple-100 text-purple-800 border-purple-200',
  archived: 'bg-slate-100 text-slate-600 border-slate-200',
}

const statusLabel: Record<PMStatus, string> = {
  completed: 'Completed', in_progress: 'In Progress', draft: 'Draft',
  under_review: 'Under Review', reviewed: 'Reviewed', archived: 'Archived',
}

const sectionData = [
  { name: 'Generator', completion: 85, items: [
    { q: 'Is the generator operational?', r: 'yes' },
    { q: 'Fuel level adequate (>50%)?', r: 'yes', measurement: '75%' },
    { q: 'Oil level within normal range?', r: 'yes' },
    { q: 'No visible oil/fuel leaks?', r: 'no', comment: 'Minor oil seepage near gasket', corrective_action: 'Schedule gasket replacement within 7 days' },
    { q: 'Runtime hours logged?', r: 'yes', measurement: '2450 hrs' },
    { q: 'Battery voltage normal?', r: 'yes', measurement: '12.8V' },
  ]},
  { name: 'DC System', completion: 100, items: [
    { q: 'Rectifier operating normally?', r: 'yes' },
    { q: 'DC output voltage within spec?', r: 'yes', measurement: '48.2V' },
    { q: 'Load current within limits?', r: 'yes', measurement: '32A' },
    { q: 'No alarms on rectifier?', r: 'yes' },
  ]},
  { name: 'Battery', completion: 100, items: [
    { q: 'Battery float voltage normal?', r: 'yes', measurement: '54.2V' },
    { q: 'No swollen/damaged cells?', r: 'yes' },
    { q: 'Terminals clean and tight?', r: 'yes' },
    { q: 'Battery room temperature normal?', r: 'yes', measurement: '24°C' },
  ]},
  { name: 'Solar', completion: 100, items: [
    { q: 'Panels clean and undamaged?', r: 'yes' },
    { q: 'Solar charge controller operational?', r: 'yes' },
    { q: 'Panel output voltage normal?', r: 'yes', measurement: '42V' },
  ]},
  { name: 'Cleaning', completion: 80, items: [
    { q: 'Site exterior clean?', r: 'yes' },
    { q: 'Equipment room clean?', r: 'yes' },
    { q: 'No vegetation overgrowth?', r: 'no', comment: 'Grass needs cutting around perimeter', corrective_action: 'Schedule clearing within 2 weeks' },
    { q: 'Drainage clear?', r: 'yes' },
    { q: 'Perimeter fence intact?', r: 'yes' },
  ]},
  { name: 'RMS', completion: 100, items: [
    { q: 'RMS unit online?', r: 'yes' },
    { q: 'All sensors reporting?', r: 'yes' },
    { q: 'Communication link active?', r: 'yes' },
  ]},
]

export default function InspectionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const ins = mockInspections.find(i => i.id === id) || mockInspections[0]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors"
      >
        <ArrowLeft size={16} /> Back to PM List
      </button>

      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-slate-900">{ins.site_name}</h1>
              <span className="text-sm bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{ins.site_code}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusBadge[ins.status]}`}>
                {statusLabel[ins.status]}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              {ins.region && (
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-slate-400" /> {ins.region}
                </span>
              )}
              {ins.technician_name && (
                <span className="flex items-center gap-1">
                  <User size={13} className="text-slate-400" /> {ins.technician_name}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar size={13} className="text-slate-400" /> {ins.inspection_date}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 border border-slate-200 px-3 py-2 rounded-lg text-sm hover:bg-slate-50">
              <Download size={14} /> Export PDF
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-600">Overall Completion</span>
            <span className="text-sm font-semibold">{ins.overall_completion}%</span>
          </div>
          <div className="bg-slate-100 rounded-full h-2">
            <div className="bg-red-500 h-2 rounded-full" style={{ width: `${ins.overall_completion}%` }} />
          </div>
        </div>
      </div>

      {/* Section summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {sectionData.map(s => (
          <div key={s.name} className="bg-white rounded-xl border border-slate-200 p-3">
            <div className="text-sm font-medium text-slate-800 mb-2">{s.name}</div>
            <div className="bg-slate-100 rounded-full h-1.5 mb-1">
              <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${s.completion}%` }} />
            </div>
            <div className="text-xs text-slate-500">{s.completion}%</div>
          </div>
        ))}
      </div>

      {/* Detailed sections */}
      <div className="space-y-4">
        {sectionData.map(section => (
          <div key={section.name} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800">{section.name}</h3>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${section.completion === 100 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {section.completion}%
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {section.items.map((item, idx) => (
                <div key={idx} className="px-5 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      {item.r === 'yes' && <CheckCircle size={16} className="text-green-500 flex-shrink-0" />}
                      {item.r === 'no' && <XCircle size={16} className="text-red-500 flex-shrink-0" />}
                      {item.r === 'na' && <MinusCircle size={16} className="text-slate-400 flex-shrink-0" />}
                      <span className="text-sm text-slate-700">{item.q}</span>
                    </div>
                    {'measurement' in item && item.measurement && (
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono flex-shrink-0">
                        {item.measurement}
                      </span>
                    )}
                  </div>
                  {item.r === 'no' && (
                    <div className="ml-6 mt-2 space-y-1">
                      {'comment' in item && item.comment && (
                        <div className="text-xs text-slate-500">
                          <span className="font-medium">Comment: </span>{item.comment}
                        </div>
                      )}
                      {'corrective_action' in item && item.corrective_action && (
                        <div className="text-xs text-orange-700 bg-orange-50 px-2 py-1 rounded">
                          <span className="font-medium">Corrective Action: </span>{item.corrective_action}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Status workflow */}
      <div className="mt-6 bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-3">Change Status</h3>
        <div className="flex flex-wrap gap-2">
          {(['draft','in_progress','completed','under_review','reviewed','archived'] as PMStatus[]).map(s => (
            <button
              key={s}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors hover:opacity-80 ${statusBadge[s]}`}
            >
              {statusLabel[s]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
