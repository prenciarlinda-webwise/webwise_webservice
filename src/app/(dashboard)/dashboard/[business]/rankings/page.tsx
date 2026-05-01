'use client'

import { useEffect, useState, useMemo, useRef, use } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import PageHeader from '@/components/dashboard/PageHeader'
import {
  RefreshCw, Plus, Trash2, ExternalLink, Eye, ArrowUp, ArrowDown,
  Search, X, ArrowUpRight, ArrowDownRight,
} from 'lucide-react'

type Tab = 'summary' | 'competitors' | 'discovery'
type Device = 'desktop' | 'mobile' | 'local_pack' | 'local_finder'
type Preset = 'all' | 'top10' | 'top20' | 'top50' | 'not_found'

interface Row {
  keyword_id: number
  keyword_text: string
  search_volume: number | null
  keyword_difficulty: number | null
  location_code: number | null
  location_name: string
  desktop_rank: number | null
  desktop_change: number | null
  desktop_url: string
  desktop_serp_url: string
  desktop_screenshot_url: string
  mobile_rank: number | null
  mobile_change: number | null
  mobile_url: string
  mobile_serp_url: string
  mobile_screenshot_url: string
  pack_rank: number | null
  pack_change: number | null
  pack_serp_url: string
  pack_screenshot_url: string
  finder_rank: number | null
  finder_change: number | null
  finder_serp_url: string
  finder_screenshot_url: string
  last_checked: string | null
}

interface DeviceSummary {
  found: number
  avg_rank: number | null
  improved: number
  declined: number
  new: number
  lost?: number
  in_top_3: number
  in_top_10: number
  in_top_20: number
  in_top_50: number
}

interface SummaryResp {
  total_keywords: number
  desktop: DeviceSummary
  mobile: DeviceSummary
  local_pack: DeviceSummary
  local_finder: DeviceSummary
}

interface LatestResp { summary: SummaryResp; keywords: Array<Record<string, unknown>> }
interface CompareResp { date_current: string; date_previous: string; summary: SummaryResp; keywords: Array<Record<string, unknown>> }
interface DistributionResp { device: string; days: number; total_tracked: number; buckets: string[]; rows: Array<Record<string, unknown>> }
interface AvgHistoryResp {
  days: number
  rows: Array<{ date: string; desktop: number | null; mobile: number | null; local_pack: number | null; local_finder: number | null }>
}
interface DatesResp { dates: Array<{ date: string; keywords_checked: number }> }
interface Competitor { id: number; business: number; domain: string; name: string; is_auto_discovered: boolean }
interface DiscoveryRun { id: number; run_date: string; total_keywords_found: number; new_keywords_found: number; status: string }
interface DiscoveryResult { id: number; keyword_text: string; rank_absolute: number | null; search_volume: number | null; keyword_difficulty: number | null; is_promoted: boolean }

const DEVICE_LABEL: Record<Device, string> = {
  desktop: 'Desktop', mobile: 'Mobile', local_pack: 'Local Pack', local_finder: 'Local Finder',
}

const BUCKETS: Array<{ id: string; label: string; color: string }> = [
  { id: 'top_1', label: '#1', color: '#1f7a3a' },
  { id: 'top_2_5', label: '#2-5', color: '#3aa55c' },
  { id: 'top_6_10', label: '#6-10', color: '#6dd089' },
  { id: 'top_11_20', label: '#11-20', color: '#e5c95b' },
  { id: 'top_21_50', label: '#21-50', color: '#e88135' },
  { id: 'beyond_50', label: '#51+', color: '#d04a4a' },
  { id: 'unranked', label: '-', color: '#cbd5e1' },
]

function rankColor(rank: number | null | undefined): string {
  if (rank == null) return '#cbd5e1'
  const clamped = Math.min(Math.max(rank, 1), 50)
  const ratio = (clamped - 1) / 49
  const hue = 120 - ratio * 120
  return `hsl(${hue}, 65%, 42%)`
}

const numOrNull = (v: unknown): number | null => (typeof v === 'number' ? v : null)
const strOrEmpty = (v: unknown): string => (typeof v === 'string' ? v : '')

function normalizeLatest(k: Record<string, unknown>): Row {
  return {
    keyword_id: Number(k.keyword_id),
    keyword_text: strOrEmpty(k.keyword_text),
    search_volume: numOrNull(k.search_volume),
    keyword_difficulty: numOrNull(k.keyword_difficulty),
    location_code: numOrNull(k.location_code),
    location_name: strOrEmpty(k.location_name),
    desktop_rank: numOrNull(k.organic_rank),
    desktop_change: numOrNull(k.organic_rank_change),
    desktop_url: strOrEmpty(k.organic_url),
    desktop_serp_url: strOrEmpty(k.organic_serp_url),
    desktop_screenshot_url: strOrEmpty(k.organic_screenshot_url),
    mobile_rank: numOrNull(k.mobile_rank),
    mobile_change: numOrNull(k.mobile_rank_change),
    mobile_url: strOrEmpty(k.mobile_url),
    mobile_serp_url: strOrEmpty(k.mobile_serp_url),
    mobile_screenshot_url: strOrEmpty(k.mobile_screenshot_url),
    pack_rank: numOrNull(k.maps_rank),
    pack_change: numOrNull(k.maps_rank_change),
    pack_serp_url: strOrEmpty(k.maps_serp_url),
    pack_screenshot_url: strOrEmpty(k.maps_screenshot_url),
    finder_rank: numOrNull(k.local_finder_rank),
    finder_change: numOrNull(k.local_finder_rank_change),
    finder_serp_url: strOrEmpty(k.local_finder_serp_url),
    finder_screenshot_url: strOrEmpty(k.local_finder_screenshot_url),
    last_checked: typeof k.last_checked === 'string' ? k.last_checked : null,
  }
}

function normalizeCompare(k: Record<string, unknown>, base?: Row): Row {
  return {
    keyword_id: Number(k.keyword_id),
    keyword_text: strOrEmpty(k.keyword_text),
    search_volume: numOrNull(k.search_volume),
    keyword_difficulty: base?.keyword_difficulty ?? null,
    location_code: base?.location_code ?? null,
    location_name: base?.location_name ?? '',
    desktop_rank: numOrNull(k.organic_rank),
    desktop_change: numOrNull(k.organic_change),
    desktop_url: strOrEmpty(k.organic_url),
    desktop_serp_url: strOrEmpty(k.organic_serp_url),
    desktop_screenshot_url: strOrEmpty(k.organic_screenshot_url),
    mobile_rank: numOrNull(k.organic_mobile_rank),
    mobile_change: numOrNull(k.organic_mobile_change),
    mobile_url: strOrEmpty(k.organic_mobile_url),
    mobile_serp_url: strOrEmpty(k.organic_mobile_serp_url),
    mobile_screenshot_url: strOrEmpty(k.organic_mobile_screenshot_url),
    pack_rank: numOrNull(k.local_pack_rank),
    pack_change: numOrNull(k.local_pack_change),
    pack_serp_url: strOrEmpty(k.local_pack_serp_url),
    pack_screenshot_url: strOrEmpty(k.local_pack_screenshot_url),
    finder_rank: numOrNull(k.local_finder_rank),
    finder_change: numOrNull(k.local_finder_change),
    finder_serp_url: strOrEmpty(k.local_finder_serp_url),
    finder_screenshot_url: strOrEmpty(k.local_finder_screenshot_url),
    last_checked: base?.last_checked ?? null,
  }
}

type Align = 'left' | 'right' | 'center'
interface Col {
  id: string
  label: string
  width: string
  align: Align
  alwaysVisible?: boolean
  sortKey: keyof Row
  numeric?: boolean
}

const COLUMNS: Col[] = [
  { id: 'keyword_text', label: 'Keyword', width: '20%', align: 'left', alwaysVisible: true, sortKey: 'keyword_text' },
  { id: 'location_name', label: 'Location', width: '14%', align: 'left', sortKey: 'location_name' },
  { id: 'search_volume', label: 'Vol.', width: '6%', align: 'right', sortKey: 'search_volume', numeric: true },
  { id: 'keyword_difficulty', label: 'KD', width: '5%', align: 'right', sortKey: 'keyword_difficulty', numeric: true },
  { id: 'desktop_rank', label: 'Desktop', width: '7%', align: 'right', sortKey: 'desktop_rank', numeric: true },
  { id: 'desktop_change', label: 'Δ', width: '5%', align: 'right', sortKey: 'desktop_change', numeric: true },
  { id: 'mobile_rank', label: 'Mobile', width: '7%', align: 'right', sortKey: 'mobile_rank', numeric: true },
  { id: 'mobile_change', label: 'Δ', width: '5%', align: 'right', sortKey: 'mobile_change', numeric: true },
  { id: 'pack_rank', label: 'Pack', width: '6%', align: 'right', sortKey: 'pack_rank', numeric: true },
  { id: 'pack_change', label: 'Δ', width: '5%', align: 'right', sortKey: 'pack_change', numeric: true },
  { id: 'finder_rank', label: 'Finder', width: '7%', align: 'right', sortKey: 'finder_rank', numeric: true },
  { id: 'finder_change', label: 'Δ', width: '5%', align: 'right', sortKey: 'finder_change', numeric: true },
  { id: 'last_checked', label: 'Last scan', width: '8%', align: 'left', sortKey: 'last_checked' },
]

export default function RankingsDetailPage({ params }: { params: Promise<{ business: string }> }) {
  const { business: businessSlug } = use(params)
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>('summary')

  const [latest, setLatest] = useState<LatestResp | null>(null)
  const [compareData, setCompareData] = useState<CompareResp | null>(null)
  const [distribution, setDistribution] = useState<DistributionResp | null>(null)
  const [avgHistory, setAvgHistory] = useState<AvgHistoryResp | null>(null)
  const [scanDates, setScanDates] = useState<DatesResp['dates']>([])
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [runs, setRuns] = useState<DiscoveryRun[]>([])
  const [discoveryResults, setDiscoveryResults] = useState<DiscoveryResult[]>([])

  const [refreshing, setRefreshing] = useState(false)
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null)
  const [newCompDomain, setNewCompDomain] = useState('')
  const [selectedRun, setSelectedRun] = useState<number | null>(null)

  const [device, setDevice] = useState<Device>('desktop')
  const [search, setSearch] = useState('')
  const [preset, setPreset] = useState<Preset>('all')
  const [sortCol, setSortCol] = useState<string>('keyword_text')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  // Columns hidden by default (Δ columns to keep table tidy until user opts in).
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(new Set([
    'desktop_change', 'mobile_change', 'pack_change', 'finder_change',
  ]))
  const [showColMenu, setShowColMenu] = useState(false)
  const [compareDate, setCompareDate] = useState<string>('')

  const isPrivileged = user?.role === 'admin' || user?.is_supervisor === true

  useEffect(() => {
    if (!isPrivileged) return
    api.get<LatestResp>(`/seo/businesses/${businessSlug}/rankings/latest/`).then(setLatest).catch(() => setLatest(null))
    api.get<AvgHistoryResp>(`/seo/businesses/${businessSlug}/rankings/avg-history/?days=90`).then(setAvgHistory).catch(() => setAvgHistory(null))
    api.get<DatesResp>(`/seo/businesses/${businessSlug}/rankings/dates/`).then(d => setScanDates(d.dates ?? [])).catch(() => setScanDates([]))
    api.get<{ results: Competitor[] } | Competitor[]>(`/seo/businesses/${businessSlug}/competitors/`).then(d => setCompetitors(Array.isArray(d) ? d : (d.results ?? []))).catch(() => setCompetitors([]))
    api.get<{ results: DiscoveryRun[] } | DiscoveryRun[]>(`/seo/businesses/${businessSlug}/discovery/runs/`).then(d => setRuns(Array.isArray(d) ? d : (d.results ?? []))).catch(() => setRuns([]))
  }, [businessSlug, isPrivileged])

  useEffect(() => {
    if (!isPrivileged) return
    api.get<DistributionResp>(`/seo/businesses/${businessSlug}/rankings/distribution/?device=${device}&days=90`).then(setDistribution).catch(() => setDistribution(null))
  }, [businessSlug, isPrivileged, device])

  useEffect(() => {
    if (!compareDate || !isPrivileged) { setCompareData(null); return }
    api.get<CompareResp>(`/seo/businesses/${businessSlug}/rankings/compare/?date_previous=${compareDate}`).then(setCompareData).catch(() => setCompareData(null))
  }, [businessSlug, isPrivileged, compareDate])

  useEffect(() => {
    if (selectedRun) {
      api.get<{ results: DiscoveryResult[] } | DiscoveryResult[]>(`/seo/businesses/${businessSlug}/discovery/runs/${selectedRun}/results/`)
        .then(d => setDiscoveryResults(Array.isArray(d) ? d : (d.results ?? [])))
        .catch(() => setDiscoveryResults([]))
    }
  }, [businessSlug, selectedRun])

  const rows: Row[] = useMemo(() => {
    if (!latest?.keywords) return []
    const baseRows = latest.keywords.map(normalizeLatest)
    if (!compareData?.keywords) return baseRows
    const baseById = new Map(baseRows.map(r => [r.keyword_id, r]))
    return compareData.keywords.map(k => normalizeCompare(k, baseById.get(Number(k.keyword_id))))
  }, [latest, compareData])

  const summary = compareData?.summary ?? latest?.summary

  const filteredRows = useMemo(() => {
    let r = rows
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      r = r.filter(x => x.keyword_text.toLowerCase().includes(q) || x.location_name.toLowerCase().includes(q))
    }
    switch (preset) {
      case 'top10': r = r.filter(x => x.desktop_rank != null && x.desktop_rank <= 10); break
      case 'top20': r = r.filter(x => x.desktop_rank != null && x.desktop_rank <= 20); break
      case 'top50': r = r.filter(x => x.desktop_rank != null && x.desktop_rank <= 50); break
      case 'not_found': r = r.filter(x => x.desktop_rank == null && x.mobile_rank == null); break
    }
    const col = COLUMNS.find(c => c.id === sortCol)
    const sortKey = col?.sortKey ?? 'keyword_text'
    const numeric = col?.numeric ?? false
    const dir = sortDir === 'asc' ? 1 : -1
    r = [...r].sort((a, b) => {
      const av = a[sortKey] as number | string | null
      const bv = b[sortKey] as number | string | null
      // Nulls always at the bottom regardless of direction.
      if (av == null && bv == null) return 0
      if (av == null) return 1
      if (bv == null) return -1
      if (numeric) return ((av as number) - (bv as number)) * dir
      return String(av).localeCompare(String(bv)) * dir
    })
    return r
  }, [rows, search, preset, sortCol, sortDir])

  const handleRunCheck = async () => {
    if (refreshing) return
    setRefreshing(true)
    setRefreshMessage(null)
    try {
      const resp = await api.post<{ task_id: string; keywords_to_refresh: number; message: string }>(`/seo/businesses/${businessSlug}/rankings/refresh/`, {})
      setRefreshMessage(`Queued — checking ${resp.keywords_to_refresh} keywords. Polling…`)
      const startedAt = Date.now()
      const poll = async () => {
        if (Date.now() - startedAt > 5 * 60 * 1000) {
          setRefreshing(false); setRefreshMessage('Timed out. The check may still be running.'); return
        }
        try {
          const status = await api.get<{ ready: boolean; state: string }>(`/seo/rankings/refresh-status/${resp.task_id}/`)
          if (status.ready) {
            setRefreshing(false); setRefreshMessage(`Done (${status.state})`)
            api.get<LatestResp>(`/seo/businesses/${businessSlug}/rankings/latest/`).then(setLatest)
            api.get<DatesResp>(`/seo/businesses/${businessSlug}/rankings/dates/`).then(d => setScanDates(d.dates ?? []))
          } else setTimeout(poll, 3000)
        } catch { setRefreshing(false); setRefreshMessage('Failed to poll task status.') }
      }
      setTimeout(poll, 3000)
    } catch (err: unknown) {
      setRefreshing(false)
      const detail = typeof err === 'object' && err && 'detail' in err ? String((err as { detail: string }).detail) : 'Refresh failed.'
      setRefreshMessage(detail)
    }
  }

  const handleAddCompetitor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCompDomain.trim()) return
    await api.post(`/seo/businesses/${businessSlug}/competitors/`, { domain: newCompDomain.trim(), name: newCompDomain.trim() })
    setNewCompDomain('')
    const d = await api.get<{ results: Competitor[] } | Competitor[]>(`/seo/businesses/${businessSlug}/competitors/`)
    setCompetitors(Array.isArray(d) ? d : (d.results ?? []))
  }

  const handleDeleteCompetitor = async (id: number) => {
    if (!confirm('Remove this competitor?')) return
    await api.delete(`/seo/businesses/${businessSlug}/competitors/${id}/`)
    setCompetitors(prev => prev.filter(c => c.id !== id))
  }

  const handlePromote = async (resultId: number) => {
    await api.post(`/seo/businesses/${businessSlug}/discovery/promote/`, { result_ids: [resultId] })
    setDiscoveryResults(prev => prev.map(r => r.id === resultId ? { ...r, is_promoted: true } : r))
  }

  const toggleSort = (col: Col) => {
    if (sortCol === col.id) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col.id); setSortDir(col.numeric ? 'asc' : 'asc') }
  }

  if (!isPrivileged) {
    return <div className="py-20 text-center text-text-muted">Rankings are only available to supervisors and admins.</div>
  }

  const visibleCols = COLUMNS.filter(c => !hiddenCols.has(c.id))

  const localPackCoverage = summary?.total_keywords
    ? ((summary.local_pack.found / summary.total_keywords) * 100).toFixed(1)
    : null

  const movement = summary
    ? {
        improved: summary.desktop.improved + summary.mobile.improved + summary.local_pack.improved + summary.local_finder.improved,
        declined: summary.desktop.declined + summary.mobile.declined + summary.local_pack.declined + summary.local_finder.declined,
        new: summary.desktop.new + summary.mobile.new + summary.local_pack.new + summary.local_finder.new,
        lost: (summary.desktop.lost ?? 0) + (summary.mobile.lost ?? 0) + (summary.local_pack.lost ?? 0) + (summary.local_finder.lost ?? 0),
      }
    : null

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rankings"
        description={businessSlug}
        action={
          <div className="flex items-center gap-3">
            <Link href={`/dashboard/${businessSlug}`} className="text-sm text-text-muted hover:text-text-primary">← Business</Link>
            <button
              onClick={handleRunCheck}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 disabled:opacity-60"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Checking…' : 'Run check'}
            </button>
          </div>
        }
      />

      {refreshMessage && <div className="px-4 py-2 rounded-lg bg-accent/10 text-sm">{refreshMessage}</div>}

      <div className="flex border-b border-border">
        {(['summary', 'competitors', 'discovery'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
              tab === t ? 'border-accent text-text-primary' : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'summary' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <OverviewCard title="Average Google Position">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold">
                  {summary?.desktop.avg_rank != null ? summary.desktop.avg_rank.toFixed(1) : '—'}
                </span>
                <TrendArrow current={summary?.desktop.avg_rank ?? null} history={avgHistory?.rows.map(r => r.desktop) ?? []} lowerIsBetter />
              </div>
              <Sparkline values={(avgHistory?.rows ?? []).map(r => r.desktop)} flipY />
            </OverviewCard>

            <OverviewCard title="Keyword and Positional Movement">
              <div className="flex items-center gap-6">
                <Movement label="Keyword Change" up={movement?.new ?? 0} down={movement?.lost ?? 0} />
                <Movement label="Positional Change" up={movement?.improved ?? 0} down={movement?.declined ?? 0} />
              </div>
            </OverviewCard>

            <OverviewCard title="Google Local Pack Coverage">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold">{localPackCoverage != null ? `${localPackCoverage}%` : '—'}</span>
                <span className="text-xs text-text-muted">{summary?.local_pack.found ?? 0} / {summary?.total_keywords ?? 0}</span>
              </div>
              <BucketBar device="local_pack" distribution={distribution} />
            </OverviewCard>
          </div>

          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-medium mb-3">Average Google Position</h3>
            <LineChart rows={avgHistory?.rows ?? []} />
          </div>

          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Positions</h3>
              <div className="flex border border-border rounded-lg overflow-hidden">
                {(['desktop', 'mobile', 'local_pack', 'local_finder'] as Device[]).map(d => (
                  <button
                    key={d}
                    onClick={() => setDevice(d)}
                    className={`px-3 py-1 text-xs ${device === d ? 'bg-primary text-white' : 'text-text-secondary hover:bg-bg-secondary'}`}
                  >
                    {DEVICE_LABEL[d]}
                  </button>
                ))}
              </div>
            </div>
            <VerticalStack distribution={distribution} onPick={d => setCompareDate(d)} />
          </div>

          <div className="bg-white rounded-xl border border-border p-4 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder='Search keywords (e.g. "near me")…'
                  className="w-full pl-9 pr-8 py-2 border border-border rounded-lg text-sm"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                    <X size={14} />
                  </button>
                )}
              </div>
              <select value={compareDate} onChange={e => setCompareDate(e.target.value)} className="px-3 py-2 border border-border rounded-lg text-sm" title="Compare ranks vs a previous scan date">
                <option value="">Compare with…</option>
                {scanDates.map(d => <option key={d.date} value={d.date}>{new Date(d.date).toLocaleDateString()} ({d.keywords_checked})</option>)}
              </select>
              {compareDate && <button onClick={() => setCompareDate('')} className="text-xs text-text-muted hover:text-text-primary">Clear compare</button>}
              <div className="relative">
                <button onClick={() => setShowColMenu(s => !s)} className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:bg-bg-secondary">
                  <Eye size={14} /> Columns ({visibleCols.length}/{COLUMNS.length})
                </button>
                {showColMenu && (
                  <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-border rounded-lg shadow-lg p-2 min-w-[200px]">
                    {COLUMNS.map(c => (
                      <label key={c.id} className={`flex items-center gap-2 px-2 py-1 text-sm hover:bg-bg-secondary rounded ${c.alwaysVisible ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                        <input
                          type="checkbox"
                          checked={!hiddenCols.has(c.id)}
                          disabled={c.alwaysVisible}
                          onChange={() => {
                            if (c.alwaysVisible) return
                            setHiddenCols(prev => {
                              const next = new Set(prev)
                              if (next.has(c.id)) next.delete(c.id); else next.add(c.id)
                              return next
                            })
                          }}
                        />
                        {c.label === 'Δ' ? `Δ (${prevColLabel(c.id)})` : c.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {(
                [
                  ['all', 'All'], ['top10', 'Top 10'], ['top20', 'Top 20'], ['top50', 'Top 50'], ['not_found', 'Not found'],
                ] as Array<[Preset, string]>
              ).map(([p, label]) => (
                <button
                  key={p}
                  onClick={() => setPreset(p)}
                  className={`px-3 py-1 text-xs rounded-full border ${preset === p ? 'bg-primary text-white border-primary' : 'border-border text-text-secondary hover:bg-bg-secondary'}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <p className="text-xs text-text-muted">
              {filteredRows.length} of {rows.length} keywords · sort by clicking column headers
              {compareDate && ` · comparing vs ${new Date(compareDate).toLocaleDateString()}`}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-border">
            <table className="w-full text-sm" style={{ tableLayout: 'fixed' }}>
              <colgroup>
                {visibleCols.map(c => <col key={c.id} style={{ width: c.width }} />)}
                <col style={{ width: '40px' }} />
              </colgroup>
              <thead className="bg-bg-secondary text-xs text-text-muted">
                <tr>
                  {visibleCols.map(c => (
                    <th
                      key={c.id}
                      onClick={() => toggleSort(c)}
                      className={`px-3 py-3 cursor-pointer hover:text-text-primary select-none whitespace-nowrap ${
                        c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : 'text-left'
                      }`}
                    >
                      <span className={`inline-flex items-center gap-1 ${c.align === 'right' ? 'justify-end' : ''}`}>
                        {c.label}
                        {sortCol === c.id && (sortDir === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />)}
                      </span>
                    </th>
                  ))}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map(r => (
                  <tr key={r.keyword_id} className="border-t border-border hover:bg-bg-secondary/30">
                    {visibleCols.map(c => (
                      <td
                        key={c.id}
                        className={`px-3 py-3 whitespace-nowrap overflow-hidden text-ellipsis ${
                          c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : 'text-left'
                        }`}
                        title={cellTitle(r, c.id)}
                      >
                        {renderCell(r, c.id)}
                      </td>
                    ))}
                    <td className="px-3 py-3 text-right">
                      {r.desktop_url && (
                        <a href={r.desktop_url} target="_blank" rel="noreferrer" className="text-text-muted hover:text-accent inline-block">
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredRows.length === 0 && (
                  <tr><td colSpan={visibleCols.length + 1} className="px-4 py-12 text-center text-text-muted">
                    No keywords match the current filters.
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'competitors' && (
        <div className="space-y-4">
          <form onSubmit={handleAddCompetitor} className="flex items-center gap-2 bg-white p-4 rounded-xl border border-border">
            <input value={newCompDomain} onChange={e => setNewCompDomain(e.target.value)} placeholder="competitor.com" className="flex-1 px-3 py-2 border border-border rounded-lg text-sm" />
            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg">
              <Plus size={14} /> Add competitor
            </button>
          </form>
          <div className="bg-white rounded-xl border border-border">
            {competitors.length === 0 ? (
              <p className="p-6 text-sm text-text-muted">No competitors tracked.</p>
            ) : (
              <ul>
                {competitors.map(c => (
                  <li key={c.id} className="flex items-center justify-between p-4 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium">{c.domain}</p>
                      {c.is_auto_discovered && <p className="text-xs text-text-muted">Auto-discovered</p>}
                    </div>
                    <button onClick={() => handleDeleteCompetitor(c.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {tab === 'discovery' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white rounded-xl border border-border">
            <div className="p-4 border-b border-border"><h3 className="font-medium">Discovery runs</h3></div>
            {runs.length === 0 ? (
              <p className="p-4 text-sm text-text-muted">No runs yet. Discovery is scheduled monthly.</p>
            ) : (
              <ul>
                {runs.map(r => (
                  <li key={r.id}>
                    <button
                      onClick={() => setSelectedRun(r.id)}
                      className={`w-full text-left p-4 border-b border-border last:border-0 hover:bg-bg-secondary/30 ${selectedRun === r.id ? 'bg-bg-secondary/40' : ''}`}
                    >
                      <p className="font-medium text-sm">{new Date(r.run_date).toLocaleDateString()}</p>
                      <p className="text-xs text-text-muted">{r.total_keywords_found} found · {r.new_keywords_found} new</p>
                      <p className="text-xs text-text-muted capitalize">{r.status}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="md:col-span-2 bg-white rounded-xl border border-border">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-medium">Results</h3>
              {selectedRun && <span className="text-xs text-text-muted">Run #{selectedRun}</span>}
            </div>
            {!selectedRun ? <p className="p-4 text-sm text-text-muted">Pick a run to see discovered keywords.</p>
              : discoveryResults.length === 0 ? <p className="p-4 text-sm text-text-muted">No results in this run.</p>
              : (
                <table className="w-full text-sm">
                  <thead className="bg-bg-secondary text-xs text-text-muted">
                    <tr>
                      <th className="px-3 py-2 text-left">Keyword</th>
                      <th className="px-3 py-2 text-right">Rank</th>
                      <th className="px-3 py-2 text-right">Vol.</th>
                      <th className="px-3 py-2 text-right">KD</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {discoveryResults.slice(0, 50).map(r => (
                      <tr key={r.id} className="border-t border-border">
                        <td className="px-3 py-2">{r.keyword_text}</td>
                        <td className="px-3 py-2 text-right">{r.rank_absolute ?? '—'}</td>
                        <td className="px-3 py-2 text-right">{r.search_volume ?? '—'}</td>
                        <td className="px-3 py-2 text-right">{r.keyword_difficulty ?? '—'}</td>
                        <td className="px-3 py-2 text-right">
                          {r.is_promoted ? <span className="text-xs text-green-600">Tracked</span> : <button onClick={() => handlePromote(r.id)} className="text-xs text-accent hover:underline">Promote</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
          </div>
        </div>
      )}
    </div>
  )
}

function prevColLabel(id: string): string {
  const idx = COLUMNS.findIndex(c => c.id === id)
  return COLUMNS[idx - 1]?.label ?? ''
}

function cellTitle(r: Row, col: string): string {
  switch (col) {
    case 'keyword_text': return r.keyword_text
    case 'location_name': return r.location_code != null ? `${r.location_name} (${r.location_code})` : r.location_name
    default: return ''
  }
}

function renderCell(r: Row, col: string) {
  switch (col) {
    case 'keyword_text':
      return <span className="font-medium">{r.keyword_text}</span>
    case 'location_name':
      return r.location_name ? (
        <span className="text-xs text-text-muted">
          {r.location_name}{r.location_code != null && <span className="ml-1 opacity-60">({r.location_code})</span>}
        </span>
      ) : <span className="text-text-muted">—</span>
    case 'search_volume':
      return r.search_volume != null ? <span className="tabular-nums">{r.search_volume}</span> : <span className="text-text-muted">—</span>
    case 'keyword_difficulty':
      return r.keyword_difficulty != null ? <span className="tabular-nums">{r.keyword_difficulty}</span> : <span className="text-text-muted">—</span>
    case 'desktop_rank':
      return <RankCell rank={r.desktop_rank} url={r.desktop_url} serpUrl={r.desktop_serp_url} screenshotUrl={r.desktop_screenshot_url} location={r.location_name} keyword={r.keyword_text} />
    case 'desktop_change':
      return <ChangeCell change={r.desktop_change} />
    case 'mobile_rank':
      return <RankCell rank={r.mobile_rank} url={r.mobile_url} serpUrl={r.mobile_serp_url} screenshotUrl={r.mobile_screenshot_url} location={r.location_name} keyword={r.keyword_text} />
    case 'mobile_change':
      return <ChangeCell change={r.mobile_change} />
    case 'pack_rank':
      return <RankCell rank={r.pack_rank} serpUrl={r.pack_serp_url} screenshotUrl={r.pack_screenshot_url} location={r.location_name} keyword={r.keyword_text} />
    case 'pack_change':
      return <ChangeCell change={r.pack_change} />
    case 'finder_rank':
      return <RankCell rank={r.finder_rank} serpUrl={r.finder_serp_url} screenshotUrl={r.finder_screenshot_url} location={r.location_name} keyword={r.keyword_text} />
    case 'finder_change':
      return <ChangeCell change={r.finder_change} />
    case 'last_checked':
      return r.last_checked ? <span className="text-xs text-text-muted">{new Date(r.last_checked).toLocaleDateString()}</span> : <span className="text-text-muted">—</span>
  }
  return null
}

/**
 * Rank cell with hover popover that's positioned via portal at fixed coordinates,
 * so it isn't clipped by table-row overflow. Stays open while the mouse is on
 * either the badge or the popover (with a 200ms grace timer).
 */
function RankCell({ rank, url, serpUrl, screenshotUrl, location, keyword }: {
  rank: number | null
  url?: string
  serpUrl?: string
  screenshotUrl?: string
  location?: string
  keyword: string
}) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const triggerRef = useRef<HTMLSpanElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (rank == null) return <span className="text-text-muted">—</span>

  const onEnter = () => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null }
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect()
      const popoverW = 320
      const left = Math.min(window.innerWidth - popoverW - 8, Math.max(8, r.right - popoverW))
      const top = r.bottom + 6
      setPos({ top, left })
    }
    setOpen(true)
  }
  const onLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 200)
  }

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className="inline-block"
      >
        <span
          className="inline-block px-2 py-0.5 rounded text-xs font-semibold text-white tabular-nums cursor-default"
          style={{ background: rankColor(rank) }}
        >
          {rank}
        </span>
      </span>
      {open && pos && mounted && (serpUrl || url || screenshotUrl) && createPortal(
        <div
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          style={{ position: 'fixed', top: pos.top, left: pos.left, width: 320 }}
          className="z-[100] bg-white border border-border rounded-lg shadow-xl p-3"
        >
          <p className="text-xs font-medium mb-1 break-words">{keyword}</p>
          {location && <p className="text-xs text-text-muted mb-2">📍 {location}</p>}
          {url && (
            <p className="text-xs mb-2 break-all">
              <span className="text-text-muted">URL:</span>{' '}
              <a href={url} target="_blank" rel="noreferrer" className="text-accent hover:underline">{url}</a>
            </p>
          )}
          {serpUrl && (
            <p className="text-xs mb-2">
              <a href={serpUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline inline-flex items-center gap-1">
                View SERP <ExternalLink size={10} />
              </a>
            </p>
          )}
          {screenshotUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={screenshotUrl} alt="SERP" className="w-full rounded border border-border" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          )}
        </div>,
        document.body,
      )}
    </>
  )
}

function ChangeCell({ change }: { change: number | null }) {
  if (change == null || change === 0) return <span className="text-text-muted">—</span>
  return change > 0
    ? <span className="inline-flex items-center justify-end gap-0.5 text-green-600 tabular-nums"><ArrowUpRight size={11} />{change}</span>
    : <span className="inline-flex items-center justify-end gap-0.5 text-red-600 tabular-nums"><ArrowDownRight size={11} />{Math.abs(change)}</span>
}

function OverviewCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-3">{title}</p>
      {children}
    </div>
  )
}

function TrendArrow({ current, history, lowerIsBetter }: { current: number | null; history: Array<number | null>; lowerIsBetter?: boolean }) {
  if (current == null) return null
  const valid = history.filter((v): v is number => v != null)
  if (valid.length < 2) return null
  const previous = valid[0]
  const diff = current - previous
  if (Math.abs(diff) < 0.05) return null
  const isImprovement = lowerIsBetter ? diff < 0 : diff > 0
  const cls = isImprovement ? 'text-green-600' : 'text-red-600'
  const Arrow = diff < 0 ? ArrowDownRight : ArrowUpRight
  return (
    <span className={`inline-flex items-center text-xs ${cls}`}>
      <Arrow size={12} />
      {Math.abs(diff).toFixed(1)}
    </span>
  )
}

function Movement({ label, up, down }: { label: string; up: number; down: number }) {
  return (
    <div>
      <div className="flex items-baseline gap-3">
        <span className="text-xl font-semibold text-green-600 inline-flex items-center"><ArrowUpRight size={16} />{up}</span>
        <span className="text-xl font-semibold text-red-600 inline-flex items-center"><ArrowDownRight size={16} />{down}</span>
      </div>
      <p className="text-xs text-text-muted">{label}</p>
    </div>
  )
}

function Sparkline({ values, flipY }: { values: Array<number | null>; flipY?: boolean }) {
  const points = values.map((v, i) => ({ i, v })).filter((p): p is { i: number; v: number } => p.v != null)
  if (points.length < 2) return null
  const maxY = Math.max(...points.map(p => p.v))
  const minY = Math.min(...points.map(p => p.v))
  const range = maxY - minY || 1
  const w = 200, h = 28
  const x = (i: number) => (i / Math.max(points.length - 1, 1)) * w
  const y = (v: number) => flipY ? ((v - minY) / range) * h : h - ((v - minY) / range) * h
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-7 mt-2">
      <polyline
        points={points.map((p, i) => `${x(i)},${y(p.v)}`).join(' ')}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function BucketBar({ device, distribution }: { device: Device; distribution: DistributionResp | null }) {
  if (!distribution || distribution.device !== device || !distribution.rows.length) return null
  const last = distribution.rows[distribution.rows.length - 1]
  const total = BUCKETS.reduce((s, b) => s + (Number(last[b.id]) || 0), 0)
  if (!total) return null
  return (
    <div className="flex h-2 rounded overflow-hidden mt-2">
      {BUCKETS.map(b => {
        const v = Number(last[b.id]) || 0
        if (!v) return null
        return <div key={b.id} style={{ width: `${(v / total) * 100}%`, background: b.color }} />
      })}
    </div>
  )
}

/**
 * Time-aware multi-line chart:
 * - X axis spans only [first scan date, last scan date] (no padding for missing days).
 * - Points placed at their actual chronological position so gaps are visible.
 * - Y axis flipped: lower rank (#1) at top.
 */
function LineChart({ rows }: { rows: AvgHistoryResp['rows'] }) {
  if (!rows.length) return <p className="text-sm text-text-muted">No data.</p>
  const series: Array<keyof AvgHistoryResp['rows'][0]> = ['desktop', 'mobile', 'local_pack', 'local_finder']
  const colors: Record<string, string> = { desktop: '#3b82f6', mobile: '#22c55e', local_pack: '#f97316', local_finder: '#a855f7' }
  const allValues = rows.flatMap(r => series.map(s => r[s] as number | null).filter((v): v is number => v != null))
  if (!allValues.length) return <p className="text-sm text-text-muted">No data.</p>

  const maxY = Math.max(...allValues)
  const minY = Math.min(...allValues)
  const yRange = maxY - minY || 1
  const minT = new Date(rows[0].date).getTime()
  const maxT = new Date(rows[rows.length - 1].date).getTime()
  const tRange = maxT - minT || 1

  const w = 800, h = 240, padX = 44, padY = 20, padBottom = 32
  const innerW = w - 2 * padX
  const x = (date: string) => padX + ((new Date(date).getTime() - minT) / tRange) * innerW
  const y = (v: number) => padY + ((v - minY) / yRange) * (h - padY - padBottom)

  const yTicks = [Math.ceil(minY), Math.round((minY + maxY) / 2), Math.floor(maxY)].filter((v, i, a) => a.indexOf(v) === i)

  const xTickIndices = pickTicks(rows.length, 6)

  return (
    <div className="space-y-2">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-56">
        {yTicks.map(t => (
          <g key={t}>
            <line x1={padX} y1={y(t)} x2={w - padX} y2={y(t)} stroke="#e5e7eb" strokeDasharray="2,2" />
            <text x={padX - 8} y={y(t) + 3} textAnchor="end" fontSize="10" fill="#94a3b8">{t}</text>
          </g>
        ))}
        {xTickIndices.map(i => {
          const date = rows[i].date
          return (
            <text key={i} x={x(date)} y={h - 8} textAnchor="middle" fontSize="10" fill="#94a3b8">
              {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </text>
          )
        })}
        {series.map(s => {
          const points = rows.map(r => ({ date: r.date, v: r[s] as number | null })).filter((p): p is { date: string; v: number } => p.v != null)
          if (!points.length) return null
          return (
            <g key={s as string}>
              {points.length >= 2 && (
                <polyline
                  points={points.map(p => `${x(p.date)},${y(p.v)}`).join(' ')}
                  fill="none"
                  stroke={colors[s as string]}
                  strokeWidth="2"
                />
              )}
              {points.map(p => (
                <circle key={p.date} cx={x(p.date)} cy={y(p.v)} r="3" fill={colors[s as string]} />
              ))}
            </g>
          )
        })}
      </svg>
      <div className="flex flex-wrap items-center gap-4 text-xs justify-center">
        {series.map(s => (
          <span key={s as string} className="flex items-center gap-1">
            <span className="inline-block w-3 h-0.5" style={{ background: colors[s as string] }} />
            {s === 'desktop' ? 'Organic Desktop' : s === 'mobile' ? 'Organic Mobile' : s === 'local_pack' ? 'Local Pack' : 'Local Finder'}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Vertical stacked-bars distribution. Bars are positioned at their actual scan-date
 * positions on a time axis (so gaps in scan dates show as gaps in the chart),
 * and the chart only spans [first scan, last scan] — no empty padding before.
 */
function VerticalStack({ distribution, onPick }: { distribution: DistributionResp | null; onPick: (date: string) => void }) {
  if (!distribution || !distribution.rows.length) return <p className="text-sm text-text-muted">No data.</p>
  const rows = distribution.rows
  const max = Math.max(...rows.map(r => BUCKETS.reduce((s, b) => s + (Number(r[b.id]) || 0), 0)), 1)

  const w = 800, h = 240, padX = 30, padY = 16, padBottom = 32
  const innerW = w - 2 * padX
  const innerH = h - padY - padBottom

  const minT = new Date(String(rows[0].date)).getTime()
  const maxT = new Date(String(rows[rows.length - 1].date)).getTime()
  const tRange = maxT - minT || 1
  const xPos = (dateStr: string) => padX + ((new Date(dateStr).getTime() - minT) / tRange) * innerW
  const barW = Math.max(8, Math.min(28, innerW / Math.max(rows.length, 1) - 4))

  const xTickIndices = pickTicks(rows.length, 6)

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-60">
          {rows.map((row) => {
            const date = String(row.date)
            const xCenter = xPos(date)
            const barX = xCenter - barW / 2
            let yCursor = padY + innerH
            return (
              <g key={date}>
                {BUCKETS.map(b => {
                  const v = Number(row[b.id]) || 0
                  if (!v) return null
                  const segH = (v / max) * innerH
                  const y = yCursor - segH
                  const seg = (
                    <rect key={b.id} x={barX} y={y} width={barW} height={segH} fill={b.color}>
                      <title>{`${date} · ${b.label}: ${v}`}</title>
                    </rect>
                  )
                  yCursor = y
                  return seg
                })}
                <rect
                  x={barX}
                  y={padY}
                  width={barW}
                  height={innerH}
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={() => onPick(date)}
                >
                  <title>Compare current ranks vs {date}</title>
                </rect>
              </g>
            )
          })}
          {xTickIndices.map(i => {
            const date = String(rows[i].date)
            return (
              <text key={i} x={xPos(date)} y={h - 8} textAnchor="middle" fontSize="10" fill="#94a3b8">
                {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </text>
            )
          })}
        </svg>
      </div>
      <div className="flex flex-col gap-1.5 text-xs pt-2 shrink-0">
        {BUCKETS.map(b => (
          <span key={b.id} className="flex items-center gap-2">
            <span className="inline-block w-4 h-3 rounded-sm" style={{ background: b.color }} />
            {b.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function pickTicks(total: number, want: number): number[] {
  if (total <= want) return Array.from({ length: total }, (_, i) => i)
  const step = (total - 1) / (want - 1)
  const out = new Set<number>()
  for (let i = 0; i < want; i++) out.add(Math.round(i * step))
  return Array.from(out).sort((a, b) => a - b)
}
