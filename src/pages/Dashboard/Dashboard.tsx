import { useNavigate } from 'react-router-dom'
import { ClipboardList, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '../../contexts/AuthContext'
import { countyCompletions, mockInspections, mockRegions } from '../../lib/mockData'

const barData = mockRegions.map(r => ({ name: r.name.replace(' ', '\n'), value: r.sites }))

const statusBadge: Record<string, string> = {
  completed: 'bg-green-100 text-green-800',
  in_progress: 'bg-orange-100 text-orange-800',
  draft: 'bg-gray-100 text-gray-800',
  under_review: 'bg-blue-100 text-blue-800',
  reviewed: 'bg-purple-100 text-purple-800',
  archived: 'bg-slate-100 text-slate-600',
}

const statusLabel: Record<string, string> = {
  completed: 'Completed',
  in_progress: 'In Progress',
  draft: 'Draft',
  under_review: 'Under Review',
  reviewed: 'Reviewed',
  archived: 'Archived',
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const recent = mockInspections.slice(0, 5)

  const total = 222
  const completed = 217
  const inProgress = 2
  const withFailures = 159

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome, {user?.email}</h1>
          <p className="text-slate-500 text-sm mt-0.5">IPT PowerTech — Preventative Maintenance</p>
        </div>
        <button
          onClick={() => navigate('/inspections/new')}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          New PM
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Total PM</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{total}</p>
          </div>
          <ClipboardList size={24} className="text-slate-400" />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Completed</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{completed}</p>
          </div>
          <CheckCircle size={24} className="text-green-500" />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">In Progress</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{inProgress}</p>
          </div>
          <Clock size={24} className="text-orange-400" />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">With Failures</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{withFailures}</p>
          </div>
          <AlertCircle size={24} className="text-orange-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Completed PM by County */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Completed PM by County</h2>
          <div className="space-y-2.5">
            {countyCompletions.filter(c => c.total > 0).map(c => (
              <div key={c.county} className="flex items-center gap-3">
                <span className="text-xs text-slate-600 w-32 flex-shrink-0">{c.county}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: c.total > 0 ? `${(c.completed / c.total) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-xs text-slate-500 w-10 text-right">
                  {c.completed}/{c.total}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recent.map(ins => (
              <div
                key={ins.id}
                className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 cursor-pointer hover:bg-slate-50 rounded px-2"
                onClick={() => navigate(`/inspections/${ins.id}`)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">{ins.site_name}</div>
                    <div className="text-xs text-slate-400">{ins.inspection_date}</div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[ins.status]}`}>
                  {statusLabel[ins.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inspections by Region chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-900 mb-4">Inspections by Region</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#dc2626" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
