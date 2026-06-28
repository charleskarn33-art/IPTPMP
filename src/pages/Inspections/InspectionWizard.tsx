import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Search, MapPin, User, Calendar, Navigation, CheckCircle } from 'lucide-react'
import { mockSites, mockTechnicians, generatorChecklist, dcSystemChecklist, batteryChecklist, solarChecklist, cleaningChecklist, rmsChecklist } from '../../lib/mockData'
import type { Site, Technician } from '../../lib/types'

type Response = 'yes' | 'no' | 'na' | null

interface SectionState {
  name: string
  items: Array<{
    id: string
    question: string
    response: Response
    comment: string
    corrective_action: string
    measurement: string
    measurement_unit: string
  }>
  comments: string
}

function buildSection(name: string, checklist: Array<{ id: string; question: string; measurement?: string; measurement_unit: string }>): SectionState {
  return {
    name,
    items: checklist.map(item => ({
      id: item.id,
      question: item.question,
      response: null,
      comment: '',
      corrective_action: '',
      measurement: '',
      measurement_unit: item.measurement_unit,
    })),
    comments: '',
  }
}

const initialSections: SectionState[] = [
  buildSection('Generator', generatorChecklist),
  buildSection('DC System', dcSystemChecklist),
  buildSection('Battery', batteryChecklist),
  buildSection('Solar', solarChecklist),
  buildSection('Cleaning', cleaningChecklist),
  buildSection('RMS', rmsChecklist),
]

function sectionCompletion(s: SectionState): number {
  const answered = s.items.filter(i => i.response !== null).length
  return s.items.length > 0 ? Math.round((answered / s.items.length) * 100) : 0
}

// Step 1: Select Site
function Step1({ onSelect }: { onSelect: (site: Site) => void }) {
  const [search, setSearch] = useState('')
  const sites = mockSites.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.site_id_code.includes(search))

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Select Site</h2>
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search sites..."
          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {sites.slice(0, 20).map(site => (
          <button
            key={site.id}
            onClick={() => onSelect(site)}
            className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-red-300 hover:bg-red-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-800 text-sm">{site.name}</div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded">{site.site_id_code}</span>
                  <span className="flex items-center gap-1"><MapPin size={10} />{site.county}</span>
                </div>
              </div>
              <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{site.type}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// Step 2: Technician + Date + GPS
function Step2({
  site,
  techId, setTechId,
  date, setDate,
  gps, captureGps,
}: {
  site: Site
  techId: string; setTechId: (v: string) => void
  date: string; setDate: (v: string) => void
  gps: { lat: number; lng: number } | null; captureGps: () => void
}) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-slate-800">Inspection Details</h2>
      <div className="bg-slate-50 rounded-lg p-4">
        <div className="text-xs text-slate-500 mb-1">Selected Site</div>
        <div className="font-semibold text-slate-800">{site.name}</div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
          <span>{site.site_id_code}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><MapPin size={10} />{site.county}</span>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          <span className="flex items-center gap-1"><User size={13} /> Technician</span>
        </label>
        <select
          value={techId}
          onChange={e => setTechId(e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">Select technician...</option>
          {mockTechnicians.map(t => (
            <option key={t.id} value={t.id}>{t.name} ({t.employee_id})</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          <span className="flex items-center gap-1"><Calendar size={13} /> Inspection Date</span>
        </label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <span className="flex items-center gap-1"><Navigation size={13} /> GPS Location</span>
        </label>
        {gps ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
            <CheckCircle size={14} className="inline mr-2" />
            {gps.lat.toFixed(6)}, {gps.lng.toFixed(6)}
          </div>
        ) : (
          <button
            onClick={captureGps}
            className="flex items-center gap-2 border border-dashed border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-600 hover:border-red-400 hover:text-red-600 transition-colors w-full justify-center"
          >
            <Navigation size={14} /> Capture GPS Location
          </button>
        )}
      </div>
    </div>
  )
}

// Step 3: Inspection Sections
function Step3({ sections, setSections }: { sections: SectionState[]; setSections: (s: SectionState[]) => void }) {
  const [activeSection, setActiveSection] = useState(0)

  const updateResponse = (sIdx: number, iIdx: number, response: Response) => {
    const updated = sections.map((s, si) =>
      si !== sIdx ? s : {
        ...s,
        items: s.items.map((item, ii) => ii !== iIdx ? item : { ...item, response }),
      }
    )
    setSections(updated)
  }

  const updateField = (sIdx: number, iIdx: number, field: 'comment' | 'corrective_action' | 'measurement', value: string) => {
    const updated = sections.map((s, si) =>
      si !== sIdx ? s : {
        ...s,
        items: s.items.map((item, ii) => ii !== iIdx ? item : { ...item, [field]: value }),
      }
    )
    setSections(updated)
  }

  const section = sections[activeSection]
  const completion = sectionCompletion(section)

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Inspection Checklist</h2>
      <div className="flex gap-2 flex-wrap mb-4">
        {sections.map((s, i) => {
          const pct = sectionCompletion(s)
          return (
            <button
              key={s.name}
              onClick={() => setActiveSection(i)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                i === activeSection
                  ? 'bg-red-600 text-white border-red-600'
                  : pct === 100
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              }`}
            >
              {s.name} {pct > 0 && <span className="ml-1 opacity-70">{pct}%</span>}
            </button>
          )
        })}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-200">
          <h3 className="font-semibold text-slate-800">{section.name}</h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${completion === 100 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
            {completion}%
          </span>
        </div>
        <div className="divide-y divide-slate-100">
          {section.items.map((item, iIdx) => (
            <div key={item.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm text-slate-700 flex-1">{item.question}</p>
                <div className="flex gap-2 flex-shrink-0">
                  {(['yes', 'no', 'na'] as Response[]).map(r => (
                    <button
                      key={r as string}
                      onClick={() => updateResponse(activeSection, iIdx, r)}
                      className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                        item.response === r
                          ? (r === 'yes' ? 'bg-green-600 text-white border-green-600'
                          : r === 'no' ? 'bg-red-600 text-white border-red-600'
                          : 'bg-slate-600 text-white border-slate-600')
                          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {r === 'na' ? 'N/A' : r ? r.charAt(0).toUpperCase() + r.slice(1) : ''}
                    </button>
                  ))}
                </div>
              </div>
              {item.measurement_unit && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={item.measurement}
                    onChange={e => updateField(activeSection, iIdx, 'measurement', e.target.value)}
                    placeholder={`Reading (${item.measurement_unit})`}
                    className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 w-48 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              )}
              {item.response === 'no' && (
                <div className="mt-3 space-y-2 ml-0 bg-red-50 rounded-lg p-3">
                  <textarea
                    value={item.comment}
                    onChange={e => updateField(activeSection, iIdx, 'comment', e.target.value)}
                    placeholder="Comment (required for No)"
                    rows={2}
                    className="w-full text-sm border border-red-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  />
                  <textarea
                    value={item.corrective_action}
                    onChange={e => updateField(activeSection, iIdx, 'corrective_action', e.target.value)}
                    placeholder="Corrective action required"
                    rows={2}
                    className="w-full text-sm border border-red-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Step 4: Review + Submit
function Step4({
  site, technician, date, gps, sections,
  onSaveDraft, onSubmit,
}: {
  site: Site
  technician: Technician | undefined
  date: string
  gps: { lat: number; lng: number } | null
  sections: SectionState[]
  onSaveDraft: () => void
  onSubmit: () => void
}) {
  const overall = Math.round(sections.reduce((acc, s) => acc + sectionCompletion(s), 0) / sections.length)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Review & Submit</h2>
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-slate-500 text-xs">Site</div>
            <div className="font-medium">{site.name} ({site.site_id_code})</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs">Region</div>
            <div className="font-medium">{site.county}</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs">Technician</div>
            <div className="font-medium">{technician?.name || 'Not selected'}</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs">Date</div>
            <div className="font-medium">{date}</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs">GPS</div>
            <div className="font-medium">{gps ? `${gps.lat.toFixed(4)}, ${gps.lng.toFixed(4)}` : 'Not captured'}</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs">Overall Completion</div>
            <div className="font-medium">{overall}%</div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-medium text-slate-800 mb-3">Section Summary</h3>
        <div className="space-y-2">
          {sections.map(s => {
            const pct = sectionCompletion(s)
            return (
              <div key={s.name} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 w-28">{s.name}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                  <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-slate-500 w-8 text-right">{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onSaveDraft}
          className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Save as Draft
        </button>
        <button
          onClick={onSubmit}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
        >
          Submit Inspection
        </button>
      </div>
    </div>
  )
}

const STEPS = ['Select Site', 'Details', 'Inspection', 'Review']

export default function InspectionWizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [site, setSite] = useState<Site | null>(null)
  const [techId, setTechId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null)
  const [sections, setSections] = useState<SectionState[]>(initialSections)
  const [submitted, setSubmitted] = useState(false)

  const technician = mockTechnicians.find(t => t.id === techId)

  const captureGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setGps({ lat: 6.3008, lng: -10.7969 }) // Monrovia fallback
      )
    } else {
      setGps({ lat: 6.3008, lng: -10.7969 })
    }
  }

  const canNext = () => {
    if (step === 0) return !!site
    if (step === 1) return !!techId && !!date
    return true
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center py-20">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Inspection Submitted!</h2>
        <p className="text-slate-500 mb-6">The PM inspection for <strong>{site?.name}</strong> has been submitted successfully.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('/inspections')} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium">
            View All Inspections
          </button>
          <button onClick={() => navigate('/')} className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50">
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">New PM Inspection</h1>
        <div className="flex items-center gap-0">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1">
              <div className={`flex items-center gap-2 ${i <= step ? 'text-red-600' : 'text-slate-400'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  i < step ? 'bg-red-600 border-red-600 text-white'
                  : i === step ? 'border-red-600 text-red-600'
                  : 'border-slate-200 text-slate-400'
                }`}>
                  {i < step ? <CheckCircle size={14} /> : i + 1}
                </div>
                <span className="text-xs font-medium hidden sm:block">{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-red-600' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        {step === 0 && <Step1 onSelect={site => { setSite(site); setStep(1) }} />}
        {step === 1 && site && (
          <Step2
            site={site}
            techId={techId} setTechId={setTechId}
            date={date} setDate={setDate}
            gps={gps} captureGps={captureGps}
          />
        )}
        {step === 2 && (
          <Step3 sections={sections} setSections={setSections} />
        )}
        {step === 3 && site && (
          <Step4
            site={site}
            technician={technician}
            date={date}
            gps={gps}
            sections={sections}
            onSaveDraft={() => navigate('/inspections')}
            onSubmit={handleSubmit}
          />
        )}

        {step > 0 && step < 3 && (
          <div className="flex justify-between mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft size={14} /> Previous
            </button>
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-40"
            >
              Next <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
