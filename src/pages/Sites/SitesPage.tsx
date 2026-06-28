import { useState } from 'react'
import { Search, Download, Upload, Plus, Pencil, Trash2, Calendar, MapPin, Radio, Users, BarChart2, FileText } from 'lucide-react'
import { mockSites, mockTechnicians, mockRegions, COUNTIES } from '../../lib/mockData'
import type { Site, Technician } from '../../lib/types'

type Tab = 'Sites' | 'Technicians' | 'Regions' | 'Users' | 'Templates'

const tabs: Tab[] = ['Sites', 'Technicians', 'Regions', 'Users', 'Templates']

function SiteCard({ site }: { site: Site }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex gap-3 items-start">
      <input type="radio" className="mt-1 accent-red-600" />
      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
        <Radio size={14} className="text-red-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-900 text-sm">{site.name}</span>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{site.type}</span>
        </div>
        <div className="text-xs text-slate-500 mt-0.5">{site.site_id_code}</div>
        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
          <MapPin size={10} />
          {site.county}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5">
          {(site.generators ?? 0) > 0 && <span>{site.generators} Gen • {site.kva}KVA</span>}
          <span>{site.panels} panels</span>
          {site.assigned_technician && (
            <span className="flex items-center gap-1">
              <Users size={10} />
              {site.assigned_technician}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded">
          <Calendar size={14} />
        </button>
        <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded">
          <Pencil size={14} />
        </button>
        <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

function SitesTab() {
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const filtered = mockSites.filter(s => {
    const q = search.toLowerCase()
    if (q && !s.name.toLowerCase().includes(q) && !s.site_id_code.includes(q)) return false
    if (region && s.county !== region) return false
    if (status && s.status !== status) return false
    return true
  })

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.ceil(filtered.length / pageSize)

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search sites..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <select
          value={region}
          onChange={e => { setRegion(e.target.value); setPage(1) }}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">All Regions</option>
          {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1) }}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <div className="flex-1" />
        <button className="flex items-center gap-2 border border-slate-200 px-3 py-2 rounded-lg text-sm hover:bg-slate-50">
          <Download size={14} /> Export CSV
        </button>
        <button className="flex items-center gap-2 border border-slate-200 px-3 py-2 rounded-lg text-sm hover:bg-slate-50">
          <Upload size={14} /> Import Excel
        </button>
        <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm">
          <Plus size={14} /> Add Site
        </button>
      </div>
      <p className="text-sm text-slate-500 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />
        {filtered.length} sites found
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {paged.map(site => <SiteCard key={site.id} site={site} />)}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 text-sm border rounded disabled:opacity-40 hover:bg-slate-50"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 text-sm border rounded disabled:opacity-40 hover:bg-slate-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

function TechRow({ tech }: { tech: Technician }) {
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50">
      <td className="py-3 px-4 text-sm font-medium text-slate-800">{tech.name}</td>
      <td className="py-3 px-4 text-sm text-slate-500">{tech.employee_id}</td>
      <td className="py-3 px-4 text-sm text-slate-500">{tech.region || '—'}</td>
      <td className="py-3 px-4 text-sm text-slate-500">{tech.specialization || '—'}</td>
      <td className="py-3 px-4 text-sm text-slate-500">
        {[tech.email, tech.phone].filter(Boolean).join(' · ')}
      </td>
      <td className="py-3 px-4">
        {tech.status === 'Active'
          ? <span className="text-xs bg-green-100 text-green-700 border border-green-300 px-2 py-0.5 rounded-full">Active</span>
          : <span className="text-xs border border-slate-300 text-slate-500 px-2 py-0.5 rounded-full">Inactive</span>
        }
      </td>
      <td className="py-3 px-4">
        <div className="flex gap-1">
          <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"><Pencil size={14} /></button>
          <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
        </div>
      </td>
    </tr>
  )
}

function TechniciansTab() {
  const [search, setSearch] = useState('')
  const filtered = mockTechnicians.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search technicians..."
            className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 border border-slate-200 px-3 py-2 rounded-lg text-sm hover:bg-slate-50">
            <Download size={14} /> Export CSV
          </button>
          <button className="flex items-center gap-2 border border-slate-200 px-3 py-2 rounded-lg text-sm hover:bg-slate-50">
            <Upload size={14} /> Import
          </button>
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm">
            <Plus size={14} /> Add Technician
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Name','Employee ID','Region','Specialization','Contact','Status','Actions'].map(h => (
                <th key={h} className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => <TechRow key={t.id} tech={t} />)}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function RegionsTab() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {mockRegions.map(r => (
        <div key={r.name} className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900">{r.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.completion_pct === 100 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
              {r.completion_pct}%
            </span>
          </div>
          <div className="space-y-1 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Sites</span><span className="font-medium">{r.sites}</span>
            </div>
            <div className="flex justify-between">
              <span>Technicians</span><span className="font-medium">{r.technicians}</span>
            </div>
            <div className="flex justify-between">
              <span>Open PM</span><span className="font-medium">{r.open_pm}</span>
            </div>
          </div>
          <div className="mt-3 bg-slate-100 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${r.completion_pct}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function UsersTab() {
  const users = [
    { id: '1', name: 'iptpowertechlib', email: 'iptpowertechlib@gmail.com', role: 'Super Admin', region: 'All', status: 'Active' },
    { id: '2', name: 'Charles Karn', email: 'charles.karn.33@gmail.com', role: 'Maintenance Manager', region: 'Montserrado', status: 'Active' },
  ]
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-700">{users.length} users</h3>
        <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm">
          <Plus size={14} /> Invite User
        </button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Name','Email','Role','Region','Status','Actions'].map(h => (
                <th key={h} className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-sm font-medium">{u.name}</td>
                <td className="py-3 px-4 text-sm text-slate-500">{u.email}</td>
                <td className="py-3 px-4 text-sm text-slate-500">{u.role}</td>
                <td className="py-3 px-4 text-sm text-slate-500">{u.region}</td>
                <td className="py-3 px-4">
                  <span className="text-xs bg-green-100 text-green-700 border border-green-300 px-2 py-0.5 rounded-full">{u.status}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-1">
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"><Pencil size={14} /></button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TemplatesTab() {
  const templates = [
    { id: '1', name: 'IPT PM', sections: 6, items: 36, updatedAt: '2026-01-01' },
  ]
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-700">PM Inspection Templates</h3>
        <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm">
          <Plus size={14} /> New Template
        </button>
      </div>
      <div className="space-y-3">
        {templates.map(t => (
          <div key={t.id} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <FileText size={18} className="text-red-600" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">{t.name}</div>
                <div className="text-xs text-slate-500">{t.sections} sections · {t.items} checklist items · Updated {t.updatedAt}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="text-sm text-red-600 hover:underline">Edit</button>
              <button className="text-sm text-slate-400 hover:underline">Duplicate</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 bg-white rounded-xl border border-slate-200 p-5">
        <h4 className="font-medium text-slate-800 mb-3">IPT PM — Inspection Sections</h4>
        <div className="space-y-2">
          {['Generator', 'DC System', 'Battery', 'Solar', 'Cleaning', 'RMS'].map((s, i) => (
            <div key={s} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <span className="w-5 h-5 bg-red-100 text-red-600 text-xs rounded-full flex items-center justify-center font-bold">{i + 1}</span>
              <span className="text-sm font-medium text-slate-700">{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function SitesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Sites')

  const tabIcons: Record<Tab, React.ReactNode> = {
    Sites: <Radio size={14} />,
    Technicians: <Users size={14} />,
    Regions: <MapPin size={14} />,
    Users: <Users size={14} />,
    Templates: <BarChart2 size={14} />,
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Site Management</h1>
        <p className="text-slate-500 text-sm">Manage sites, technicians, regions and users</p>
      </div>
      <div className="flex gap-1 mb-6 border-b border-slate-200">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tabIcons[tab]}
            {tab}
          </button>
        ))}
      </div>
      {activeTab === 'Sites' && <SitesTab />}
      {activeTab === 'Technicians' && <TechniciansTab />}
      {activeTab === 'Regions' && <RegionsTab />}
      {activeTab === 'Users' && <UsersTab />}
      {activeTab === 'Templates' && <TemplatesTab />}
    </div>
  )
}
