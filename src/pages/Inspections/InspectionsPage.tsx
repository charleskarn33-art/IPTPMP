import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Trash2, ChevronRight } from 'lucide-react'
import { mockInspections } from '../../lib/mockData'
import type { PMStatus } from '../../lib/types'

const statusBadge: Record<PMStatus, string> = {
  completed: 'bg-green-100 text-green-700 border-green-200',
  in_progress: 'bg-orange-100 text-orange-700 border-orange-200',
  draft: 'bg-gray-100 text-gray-600 border-gray-200',
  under_review: 'bg-blue-100 text-blue-700 border-blue-200',
  reviewed: 'bg-purple-100 text-purple-700 border-purple-200',
  archived: 'bg-slate-100 text-slate-600 border-slate-200',
}

const statusLabel: Record<PMStatus, string> = {
  completed: 'Completed',
  in_progress: 'In Progress',
  draft: 'Draft',
  under_review: 'Under Review',
  reviewed: 'Reviewed',
  archived: 'Archived',
}

export default function InspectionsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [regionFilter, setRegionFilter] = useState<string>('')

  const filtered = mockInspections.filter(ins => {
    const q = search.toLowerCase()
    if (q && !ins.site_name.toLowerCase().includes(q) && !ins.site_code.includes(q) && !(ins.technician_name || '').toLowerCase().includes(q)) return false
    if (statusFilter && ins.status !== statusFilter) return false
    if (regionFilter && ins.region !== regionFilter) return false
    return true
  })

  const regions = [...new Set(mockInspections.map(i => i.region).filter(Boolean))] as string[]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">PM</h1>
          <p className="text-sm text-slate-500">{mockInspections.length} total records</p>
        </div>
        <button
          onClick={() => navigate('/inspections/new')}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Plus size={16} /> New PM
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search site, code or technician..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="under_review">Under Review</option>
          <option value="reviewed">Reviewed</option>
          <option value="archived">Archived</option>
        </select>
        <select
          value={regionFilter}
          onChange={e => setRegionFilter(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">All Regions</option>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map(ins => (
          <div
            key={ins.id}
            className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-900">{ins.site_name}</span>
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{ins.site_code}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusBadge[ins.status]}`}>
                    {statusLabel[ins.status]}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  {ins.region && <span>{ins.region}</span>}
                  {ins.technician_name && <span>{ins.technician_name}</span>}
                  <span>{ins.inspection_date}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                    <div
                      className="bg-red-500 h-1.5 rounded-full"
                      style={{ width: `${ins.overall_completion}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 w-8 text-right">{ins.overall_completion}%</span>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-3">
                <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={() => navigate(`/inspections/${ins.id}`)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Search size={32} className="mx-auto mb-2 opacity-40" />
            <p>No inspections found</p>
          </div>
        )}
      </div>
    </div>
  )
}
