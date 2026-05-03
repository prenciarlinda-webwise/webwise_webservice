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

// DataforSEO's CDN purges screenshot URLs after 30-60 days. If a stored URL
// still points at api.dataforseo.com/cdn, it's guaranteed to 404 — skip
// rendering the <img> instead of letting the browser fire a useless request.
function isExpiredScreenshotUrl(url: string): boolean {
  return url.includes('api.dataforseo.com/cdn/')
}

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
  const [discovering, setDiscovering] = useState(false)
  const [discoveryMessage, setDiscoveryMessage] = useState<string | null>(null)

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
  // Snapshot drill-down: when set, opens a modal showing keyword rankings
  // exactly as they were on this date (read straight from SERPResult /
  // MapsRankResult / LocalFinderResult — no recomputation).
  const [snapshotDate, setSnapshotDate] = useState<string | null>(null)
  const [snapshotData, setSnapshotData] = useState<CompareResp | null>(null)

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

  // Fetch the historical snapshot when a chart bar is clicked. Uses the same
  // /compare/ endpoint with date_current=X and no date_previous — that gives
  // us "what did the rankings look like on this exact date" without diff data.
  useEffect(() => {
    if (!snapshotDate || !isPrivileged) { setSnapshotData(null); return }
    api.get<CompareResp>(`/seo/businesses/${businessSlug}/rankings/compare/?date_current=${snapshotDate}`)
      .then(setSnapshotData).catch(() => setSnapshotData(null))
  }, [businessSlug, isPrivileged, snapshotDate])

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
      setRefreshMessage(`Queued — checking ${resp.keywords_to_refresh} keywords…`)
      const startedAt = Date.now()
      const poll = async () => {
        if (Date.now() - startedAt > 15 * 60 * 1000) {
          setRefreshing(false); setRefreshMessage('Timed out after 15 minutes. The check may still be running in the background.'); return
        }
        try {
          const status = await api.get<{
            ready: boolean
            state: string
            progress?: { checked: number; failed: number; total: number; current_keyword?: string; current_business?: string; api_errors?: string[] }
            result?: { keywords_checked: number; keywords_failed?: number; total?: number; api_errors?: string[]; status?: string }
            error?: string
            traceback?: string
          }>(`/seo/rankings/refresh-status/${resp.task_id}/`)

          // PROGRESS — keep refreshing flag on, surface live counter.
          if (status.state === 'PROGRESS' && status.progress) {
            const { checked, failed, total, current_keyword, current_business } = status.progress
            const fragment = current_keyword
              ? ` · checking "${current_keyword}"${current_business ? ` (${current_business})` : ''}`
              : ''
            const failTag = failed ? ` · ${failed} failed` : ''
            setRefreshMessage(`Refreshing ${checked + failed}/${total}${failTag}${fragment}`)
            setTimeout(poll, 2000)
            return
          }

          if (!status.ready) {
            // PENDING / STARTED — task hasn't picked up yet or hasn't emitted progress.
            setRefreshMessage(`${status.state === 'PENDING' ? 'Queued' : 'Starting'} — waiting for worker…`)
            setTimeout(poll, 2000)
            return
          }

          // Terminal states — stop polling.
          setRefreshing(false)
          if (status.state === 'SUCCESS' && status.result) {
            const r = status.result
            const checked = r.keywords_checked ?? 0
            const total = r.total ?? checked
            const failed = r.keywords_failed ?? 0
            const apiErrs = r.api_errors ?? []
            const parts = [`Done — ${checked}/${total} keywords checked`]
            if (failed) parts.push(`${failed} failed`)
            if (apiErrs.length) parts.push(`API errors: ${apiErrs.slice(0, 2).join(' · ')}${apiErrs.length > 2 ? ` (+${apiErrs.length - 2} more)` : ''}`)
            setRefreshMessage(parts.join(' · '))
          } else if (status.state === 'FAILURE') {
            setRefreshMessage(`Failed: ${status.error ?? 'Unknown error'}${status.traceback ? ` — ${status.traceback.split('\n').pop() ?? ''}` : ''}`)
          } else {
            setRefreshMessage(`Done (${status.state})`)
          }
          api.get<LatestResp>(`/seo/businesses/${businessSlug}/rankings/latest/`).then(setLatest)
          api.get<DatesResp>(`/seo/businesses/${businessSlug}/rankings/dates/`).then(d => setScanDates(d.dates ?? []))
        } catch {
          setRefreshing(false); setRefreshMessage('Failed to poll task status.')
        }
      }
      setTimeout(poll, 2000)
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

  const handleRunDiscovery = async () => {
    if (discovering) return
    setDiscovering(true)
    setDiscoveryMessage('Queued — running keyword discovery…')
    try {
      const resp = await api.post<{ task_id: string; message: string }>(`/seo/businesses/${businessSlug}/discovery/refresh/`, {})
      setDiscoveryMessage(resp.message ?? 'Discovery queued.')
      const startedAt = Date.now()
      const poll = async () => {
        if (Date.now() - startedAt > 10 * 60 * 1000) {
          setDiscovering(false); setDiscoveryMessage('Timed out after 10 minutes — check the runs list below.'); return
        }
        try {
          const status = await api.get<{ ready: boolean; state: string; result?: unknown; error?: string }>(`/seo/rankings/refresh-status/${resp.task_id}/`)
          if (status.ready) {
            setDiscovering(false)
            if (status.state === 'SUCCESS') setDiscoveryMessage('Discovery finished — refreshing runs list.')
            else if (status.state === 'FAILURE') setDiscoveryMessage(`Failed: ${status.error ?? 'Unknown error'}`)
            else setDiscoveryMessage(`Done (${status.state})`)
            api.get<{ results: DiscoveryRun[] } | DiscoveryRun[]>(`/seo/businesses/${businessSlug}/discovery/runs/`)
              .then(d => setRuns(Array.isArray(d) ? d : (d.results ?? [])))
          } else setTimeout(poll, 3000)
        } catch { setDiscovering(false); setDiscoveryMessage('Failed to poll task status.') }
      }
      setTimeout(poll, 3000)
    } catch (err: unknown) {
      setDiscovering(false)
      const detail = typeof err === 'object' && err && 'detail' in err ? String((err as { detail: string }).detail) : 'Discovery failed to start.'
      setDiscoveryMessage(detail)
    }
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
            {tab === 'summary' && (
              <button
                onClick={handleRunCheck}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 disabled:opacity-60"
                title="Scan SERP rankings for all tracked keywords (also refreshes competitor positions)"
              >
                <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                {refreshing ? 'Checking…' : 'Run check'}
              </button>
            )}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {(['desktop', 'mobile', 'local_pack', 'local_finder'] as Device[]).map(d => (
              <DeviceSummaryCard
                key={d}
                title={DEVICE_LABEL[d]}
                deviceSummary={summary ? summary[d] : null}
                history={(avgHistory?.rows ?? []).map(r => r[d])}
              />
            ))}
          </div>

          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-medium mb-3">Average Google Position</h3>
            <LineChart rows={avgHistory?.rows ?? []} onPick={d => setSnapshotDate(d)} />
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
            <VerticalStack distribution={distribution} onPick={d => setSnapshotDate(d)} />
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
          <div className="px-4 py-3 rounded-lg bg-bg-secondary/50 border border-border text-xs text-text-muted">
            Competitor positions are captured automatically each time you click <strong>Run check</strong> on the Summary tab — no separate scan to trigger here. Add a domain below to start tracking it; the next rank check will record where it ranks for each of your tracked keywords.
          </div>
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
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-border p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Keyword discovery</p>
              <p className="text-xs text-text-muted">Finds keywords this domain already ranks for. Runs automatically on the 1st of every month — use the button to run it on demand.</p>
            </div>
            <button
              onClick={handleRunDiscovery}
              disabled={discovering}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 disabled:opacity-60 shrink-0"
            >
              <RefreshCw size={14} className={discovering ? 'animate-spin' : ''} />
              {discovering ? 'Running…' : 'Run discovery'}
            </button>
          </div>
          {discoveryMessage && <div className="px-4 py-2 rounded-lg bg-accent/10 text-sm">{discoveryMessage}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white rounded-xl border border-border">
            <div className="p-4 border-b border-border"><h3 className="font-medium">Discovery runs</h3></div>
            {runs.length === 0 ? (
              <p className="p-4 text-sm text-text-muted">No runs yet. Click <em>Run discovery</em> above to fetch the first batch.</p>
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
        </div>
      )}

      {snapshotDate && (
        <SnapshotModal
          date={snapshotDate}
          data={snapshotData}
          onClose={() => setSnapshotDate(null)}
        />
      )}
    </div>
  )
}

/**
 * Modal showing keyword rankings exactly as they were on a specific scan date.
 * Reads from the same /compare/ endpoint with date_current=X (no
 * date_previous), so values come straight from SERPResult / MapsRankResult /
 * LocalFinderResult — no recomputation, no comparison framing.
 */
function SnapshotModal({ date, data, onClose }: { date: string; data: CompareResp | null; onClose: () => void }) {
  // Close on Escape so the modal feels native.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const dateLabel = new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  const rows = (data?.keywords ?? []) as Array<Record<string, unknown>>

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Rankings snapshot</p>
            <h3 className="font-semibold text-base">{dateLabel}</h3>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary p-1">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          {!data ? (
            <p className="p-6 text-sm text-text-muted">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="p-6 text-sm text-text-muted">No rankings recorded for this date.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-bg-secondary text-xs text-text-muted sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left">Keyword</th>
                  <th className="px-3 py-2 text-right">Vol.</th>
                  <th className="px-3 py-2 text-right">Desktop</th>
                  <th className="px-3 py-2 text-right">Mobile</th>
                  <th className="px-3 py-2 text-right">Pack</th>
                  <th className="px-3 py-2 text-right">Finder</th>
                  <th className="px-3 py-2 text-left">URL</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => {
                  const url = strOrEmpty(r.organic_url)
                  return (
                    <tr key={Number(r.keyword_id)} className="border-t border-border">
                      <td className="px-3 py-2 font-medium">{strOrEmpty(r.keyword_text)}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{numOrNull(r.search_volume) ?? '—'}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{numOrNull(r.organic_rank) ?? '—'}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{numOrNull(r.organic_mobile_rank) ?? '—'}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{numOrNull(r.local_pack_rank) ?? '—'}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{numOrNull(r.local_finder_rank) ?? '—'}</td>
                      <td className="px-3 py-2 max-w-xs truncate">
                        {url ? <a href={url} target="_blank" rel="noreferrer" className="text-accent hover:underline">{url}</a> : <span className="text-text-muted">—</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
        <div className="px-5 py-3 border-t border-border text-xs text-text-muted">
          {data ? `${rows.length} keyword${rows.length === 1 ? '' : 's'}` : ''}
        </div>
      </div>
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
      return <RankCell rank={r.desktop_rank} change={r.desktop_change} url={r.desktop_url} serpUrl={r.desktop_serp_url} screenshotUrl={r.desktop_screenshot_url} location={r.location_name} keyword={r.keyword_text} searchVolume={r.search_volume} keywordDifficulty={r.keyword_difficulty} lastChecked={r.last_checked} deviceLabel="Desktop" />
    case 'desktop_change':
      return <ChangeCell change={r.desktop_change} />
    case 'mobile_rank':
      return <RankCell rank={r.mobile_rank} change={r.mobile_change} url={r.mobile_url} serpUrl={r.mobile_serp_url} screenshotUrl={r.mobile_screenshot_url} location={r.location_name} keyword={r.keyword_text} searchVolume={r.search_volume} keywordDifficulty={r.keyword_difficulty} lastChecked={r.last_checked} deviceLabel="Mobile" />
    case 'mobile_change':
      return <ChangeCell change={r.mobile_change} />
    case 'pack_rank':
      return <RankCell rank={r.pack_rank} change={r.pack_change} serpUrl={r.pack_serp_url} screenshotUrl={r.pack_screenshot_url} location={r.location_name} keyword={r.keyword_text} searchVolume={r.search_volume} keywordDifficulty={r.keyword_difficulty} lastChecked={r.last_checked} deviceLabel="Local Pack" />
    case 'pack_change':
      return <ChangeCell change={r.pack_change} />
    case 'finder_rank':
      return <RankCell rank={r.finder_rank} change={r.finder_change} serpUrl={r.finder_serp_url} screenshotUrl={r.finder_screenshot_url} location={r.location_name} keyword={r.keyword_text} searchVolume={r.search_volume} keywordDifficulty={r.keyword_difficulty} lastChecked={r.last_checked} deviceLabel="Local Finder" />
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
function RankCell({ rank, change, url, serpUrl, screenshotUrl, location, keyword, searchVolume, keywordDifficulty, lastChecked, deviceLabel }: {
  rank: number | null
  change?: number | null
  url?: string
  serpUrl?: string
  screenshotUrl?: string
  location?: string
  keyword: string
  searchVolume?: number | null
  keywordDifficulty?: number | null
  lastChecked?: string | null
  deviceLabel?: string
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
      {open && pos && mounted && createPortal(
        <div
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          style={{ position: 'fixed', top: pos.top, left: pos.left, width: 320 }}
          className="z-[100] bg-white border border-border rounded-lg shadow-xl p-3"
        >
          <p className="text-xs font-medium mb-1 break-words">{keyword}</p>
          {location && <p className="text-xs text-text-muted mb-2">📍 {location}</p>}

          {/* Numeric stats — every cell has a value, "—" when missing. */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs mb-2 py-1.5 border-y border-border">
            <span className="text-text-muted">{deviceLabel ? `${deviceLabel} rank` : 'Rank'}</span>
            <span className="text-right tabular-nums font-medium">{rank ?? '—'}</span>
            {change != null && change !== 0 && (
              <>
                <span className="text-text-muted">Change</span>
                <span className={`text-right tabular-nums font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {change > 0 ? `+${change}` : change}
                </span>
              </>
            )}
            <span className="text-text-muted">Volume</span>
            <span className="text-right tabular-nums">{searchVolume != null ? searchVolume.toLocaleString() : '—'}</span>
            <span className="text-text-muted">KD</span>
            <span className="text-right tabular-nums">{keywordDifficulty ?? '—'}</span>
            {lastChecked && (
              <>
                <span className="text-text-muted">Last scan</span>
                <span className="text-right tabular-nums">{new Date(lastChecked).toLocaleDateString()}</span>
              </>
            )}
          </div>

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
          {screenshotUrl && !isExpiredScreenshotUrl(screenshotUrl) && (
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

/**
 * Per-device summary card. One per Desktop / Mobile / Local Pack / Local Finder.
 * Shows the average rank (with trend arrow + sparkline) and the keyword
 * movement breakdown (improved vs declined, plus new vs lost) — so the user
 * can see at a glance whether each device-type is gaining or losing ground.
 */
function DeviceSummaryCard({ title, deviceSummary, history }: {
  title: string
  deviceSummary: DeviceSummary | null | undefined
  history: Array<number | null>
}) {
  const avg = deviceSummary?.avg_rank ?? null
  const improved = deviceSummary?.improved ?? 0
  const declined = deviceSummary?.declined ?? 0
  const newKws = deviceSummary?.new ?? 0
  const lostKws = deviceSummary?.lost ?? 0
  const found = deviceSummary?.found ?? 0
  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-3">{title}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-semibold tabular-nums">{avg != null ? avg.toFixed(1) : '—'}</span>
        <TrendArrow current={avg} history={history} lowerIsBetter />
        <span className="text-xs text-text-muted ml-auto">avg of {found}</span>
      </div>
      <Sparkline values={history} flipY />
      <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        <span className="text-text-muted">Position</span>
        <span className="text-right tabular-nums">
          <span className="text-green-600 inline-flex items-center"><ArrowUpRight size={11} />{improved}</span>
          <span className="mx-1.5 text-text-muted">·</span>
          <span className="text-red-600 inline-flex items-center"><ArrowDownRight size={11} />{declined}</span>
        </span>
        <span className="text-text-muted">Keywords</span>
        <span className="text-right tabular-nums">
          <span className="text-green-600 inline-flex items-center"><ArrowUpRight size={11} />{newKws}</span>
          <span className="mx-1.5 text-text-muted">·</span>
          <span className="text-red-600 inline-flex items-center"><ArrowDownRight size={11} />{lostKws}</span>
        </span>
      </div>
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
 * - X axis spans [first scan date, today] so the chart's right edge always
 *   reads as "today" — a visible gap appears when scans are stale.
 * - SVG width tracks its container (no viewBox letterboxing) so content
 *   stretches edge-to-edge instead of floating in the middle.
 * - Y axis flipped: lower rank (#1) at top.
 */
const SERIES: Array<{ key: keyof AvgHistoryResp['rows'][0]; label: string; color: string }> = [
  { key: 'desktop',      label: 'Organic Desktop', color: '#3b82f6' },
  { key: 'mobile',       label: 'Organic Mobile',  color: '#22c55e' },
  { key: 'local_pack',   label: 'Local Pack',      color: '#f97316' },
  { key: 'local_finder', label: 'Local Finder',    color: '#a855f7' },
]

function LineChart({ rows, onPick }: { rows: AvgHistoryResp['rows']; onPick: (date: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(800)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    setW(el.clientWidth)
    const ro = new ResizeObserver(() => setW(el.clientWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  if (!rows.length) return <p className="text-sm text-text-muted">No data.</p>
  const allValues = rows.flatMap(r => SERIES.map(s => r[s.key] as number | null).filter((v): v is number => v != null))
  if (!allValues.length) return <p className="text-sm text-text-muted">No data.</p>

  const maxY = Math.max(...allValues)
  const minY = Math.min(...allValues)
  const yRange = maxY - minY || 1

  const todayMidnight = new Date(); todayMidnight.setHours(0, 0, 0, 0)
  const minT = new Date(rows[0].date).getTime()
  const lastT = new Date(rows[rows.length - 1].date).getTime()
  const maxT = Math.max(lastT, todayMidnight.getTime())
  const tRange = maxT - minT || 1

  const h = 240, padX = 44, padY = 20, padBottom = 32
  const innerW = Math.max(w - 2 * padX, 1)
  const x = (t: number) => padX + ((t - minT) / tRange) * innerW
  const y = (v: number) => padY + ((v - minY) / yRange) * (h - padY - padBottom)

  const yTicks = [Math.ceil(minY), Math.round((minY + maxY) / 2), Math.floor(maxY)].filter((v, i, a) => a.indexOf(v) === i)
  const xTicks = buildTimeTicks(minT, maxT, 6)
  const showTodayMarker = lastT < todayMidnight.getTime()

  const rowTimes = rows.map(r => new Date(r.date).getTime())

  // Pick the row whose date is closest to the cursor's time. Cursor →
  // SVG-coord time → nearest row index. Quadratic in row count is fine —
  // we have at most ~100 dates per chart.
  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const xRel = (e.clientX - rect.left) * (w / rect.width)
    if (xRel < padX || xRel > w - padX) { setHoverIdx(null); return }
    const t = minT + ((xRel - padX) / innerW) * tRange
    let best = 0, bestDist = Infinity
    for (let i = 0; i < rowTimes.length; i++) {
      const d = Math.abs(rowTimes[i] - t)
      if (d < bestDist) { bestDist = d; best = i }
    }
    setHoverIdx(best)
  }

  const hoverRow = hoverIdx != null ? rows[hoverIdx] : null
  const hoverX = hoverIdx != null ? x(rowTimes[hoverIdx]) : 0
  // Anchor tooltip to cursor side that has more room.
  const tipLeft = hoverIdx != null ? (hoverX > w / 2 ? hoverX - 200 : hoverX + 12) : 0

  return (
    <div ref={containerRef} className="space-y-2 relative">
      <svg
        width={w} height={h} className="block"
        onMouseMove={onMove}
        onMouseLeave={() => setHoverIdx(null)}
        onClick={() => { if (hoverIdx != null) onPick(rows[hoverIdx].date) }}
        style={{ cursor: hoverIdx != null ? 'pointer' : 'default' }}
      >
        {yTicks.map(t => (
          <g key={t}>
            <line x1={padX} y1={y(t)} x2={w - padX} y2={y(t)} stroke="#e5e7eb" strokeDasharray="2,2" />
            <text x={padX - 8} y={y(t) + 3} textAnchor="end" fontSize="10" fill="#94a3b8">{t}</text>
          </g>
        ))}
        {xTicks.map((tick, i) => (
          <g key={i}>
            <line x1={x(tick.t)} y1={padY} x2={x(tick.t)} y2={h - padBottom} stroke="#f1f5f9" />
            <text x={x(tick.t)} y={h - 8} textAnchor="middle" fontSize="10" fill="#94a3b8">{tick.label}</text>
          </g>
        ))}
        {showTodayMarker && (
          <g>
            <line x1={x(todayMidnight.getTime())} y1={padY} x2={x(todayMidnight.getTime())} y2={h - padBottom}
              stroke="#cbd5e1" strokeDasharray="3,3" />
            <text x={x(todayMidnight.getTime())} y={padY - 6} textAnchor="middle" fontSize="9" fill="#94a3b8">today</text>
          </g>
        )}
        {SERIES.map(s => {
          const points = rows
            .map(r => ({ t: new Date(r.date).getTime(), v: r[s.key] as number | null }))
            .filter((p): p is { t: number; v: number } => p.v != null)
          if (!points.length) return null
          return (
            <g key={s.key as string}>
              {points.length >= 2 && (
                <polyline
                  points={points.map(p => `${x(p.t)},${y(p.v)}`).join(' ')}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2"
                />
              )}
              {points.map(p => (
                <circle key={p.t} cx={x(p.t)} cy={y(p.v)} r="3" fill={s.color} />
              ))}
            </g>
          )
        })}
        {hoverIdx != null && (
          <line x1={hoverX} y1={padY} x2={hoverX} y2={h - padBottom} stroke="#94a3b8" strokeDasharray="2,2" />
        )}
      </svg>
      {hoverRow && (
        <div
          className="absolute pointer-events-none bg-white border border-border rounded-lg shadow-lg p-2 text-xs z-10"
          style={{ left: tipLeft, top: padY + 4, minWidth: 180 }}
        >
          <p className="font-semibold mb-1">
            {new Date(hoverRow.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
          <p className="text-[10px] text-text-muted mb-1.5">click to view rankings on this date</p>
          {SERIES.map(s => {
            const v = hoverRow[s.key] as number | null
            return (
              <div key={s.key as string} className="flex items-center justify-between gap-3 py-0.5">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-0.5" style={{ background: s.color }} />
                  {s.label}
                </span>
                <span className="tabular-nums">{v != null ? `#${v.toFixed(1)}` : '—'}</span>
              </div>
            )
          })}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-4 text-xs justify-center">
        {SERIES.map(s => (
          <span key={s.key as string} className="flex items-center gap-1">
            <span className="inline-block w-3 h-0.5" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Vertical stacked-bars distribution — categorical x-axis.
 * - One evenly-spaced bar per scan, regardless of calendar gap. Avoids
 *   awkward clustering when scans happen on irregular dates.
 * - Date labels still show the actual scan date — relationship to the
 *   calendar is preserved via labels, not via x-position.
 * - Caption above the chart calls out total scans + freshness of the
 *   most recent one (so the "gap since last scan" is still visible).
 */
function VerticalStack({ distribution, onPick }: { distribution: DistributionResp | null; onPick: (date: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(800)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    setW(el.clientWidth)
    const ro = new ResizeObserver(() => setW(el.clientWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  if (!distribution || !distribution.rows.length) return <p className="text-sm text-text-muted">No data.</p>
  const rows = distribution.rows
  const max = Math.max(...rows.map(r => BUCKETS.reduce((s, b) => s + (Number(r[b.id]) || 0), 0)), 1)

  const h = 240, padX = 30, padY = 16, padBottom = 32
  const innerW = Math.max(w - 2 * padX, 1)
  const innerH = h - padY - padBottom

  const n = rows.length
  const slot = innerW / n
  const barW = Math.max(6, Math.min(36, slot * 0.7))
  const xCenter = (i: number) => padX + slot * (i + 0.5)

  // Pick ~6 row indices to label so date ticks don't crowd. Always include
  // the first and last.
  const wantTicks = Math.min(6, n)
  const tickIndices = wantTicks <= 1
    ? [0]
    : Array.from(new Set(Array.from({ length: wantTicks }, (_, i) =>
        Math.round((i * (n - 1)) / (wantTicks - 1))
      )))

  // Freshness caption — shows gap to today even though the chart itself is categorical.
  const todayMidnight = new Date(); todayMidnight.setHours(0, 0, 0, 0)
  const lastT = new Date(String(rows[n - 1].date)).getTime()
  const daysSince = Math.max(0, Math.round((todayMidnight.getTime() - lastT) / 86400000))
  const lastLabel = new Date(String(rows[n - 1].date)).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  const caption = daysSince === 0
    ? `${n} scan${n === 1 ? '' : 's'} · last today`
    : `${n} scan${n === 1 ? '' : 's'} · last on ${lastLabel} (${daysSince} day${daysSince === 1 ? '' : 's'} ago)`

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const xRel = (e.clientX - rect.left) * (w / rect.width)
    const i = Math.floor((xRel - padX) / slot)
    if (i >= 0 && i < n) setHoverIdx(i)
    else setHoverIdx(null)
  }

  const hoverRow = hoverIdx != null ? rows[hoverIdx] : null
  const hoverTotal = hoverRow ? BUCKETS.reduce((s, b) => s + (Number(hoverRow[b.id]) || 0), 0) : 0
  const hoverX = hoverIdx != null ? xCenter(hoverIdx) : 0
  const tipLeft = hoverIdx != null ? (hoverX > w / 2 ? hoverX - 200 : hoverX + 12) : 0

  return (
    <div className="space-y-2">
      <p className="text-xs text-text-muted">{caption}</p>
      <div className="flex gap-4">
        <div ref={containerRef} className="flex-1 min-w-0 relative">
          <svg
            width={w} height={h} className="block"
            onMouseMove={onMove}
            onMouseLeave={() => setHoverIdx(null)}
            onClick={() => { if (hoverIdx != null) onPick(String(rows[hoverIdx].date)) }}
            style={{ cursor: hoverIdx != null ? 'pointer' : 'default' }}
          >
            {hoverIdx != null && (
              <rect x={xCenter(hoverIdx) - slot / 2} y={padY} width={slot} height={innerH} fill="#94a3b8" opacity="0.08" />
            )}
            {rows.map((row, i) => {
              const date = String(row.date)
              const xc = xCenter(i)
              const barX = xc - barW / 2
              let yCursor = padY + innerH
              return (
                <g key={date}>
                  {BUCKETS.map(b => {
                    const v = Number(row[b.id]) || 0
                    if (!v) return null
                    const segH = (v / max) * innerH
                    const y = yCursor - segH
                    yCursor = y
                    return (
                      <rect key={b.id} x={barX} y={y} width={barW} height={segH} fill={b.color} />
                    )
                  })}
                </g>
              )
            })}
            {tickIndices.map(i => (
              <text key={i} x={xCenter(i)} y={h - 8} textAnchor="middle" fontSize="10" fill="#94a3b8">
                {new Date(String(rows[i].date)).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </text>
            ))}
          </svg>
          {hoverRow && (
            <div
              className="absolute pointer-events-none bg-white border border-border rounded-lg shadow-lg p-2 text-xs z-10"
              style={{ left: tipLeft, top: padY + 4, minWidth: 180 }}
            >
              <p className="font-semibold mb-1">
                {new Date(String(hoverRow.date)).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              <p className="text-[10px] text-text-muted mb-1.5">click to view rankings on this date</p>
              <div className="space-y-0.5">
                {BUCKETS.map(b => {
                  const v = Number(hoverRow[b.id]) || 0
                  return (
                    <div key={b.id} className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-1.5">
                        <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: b.color }} />
                        {b.label}
                      </span>
                      <span className="tabular-nums">{v || '—'}</span>
                    </div>
                  )
                })}
                <div className="flex items-center justify-between gap-3 pt-1 mt-1 border-t border-border font-semibold">
                  <span>Total</span>
                  <span className="tabular-nums">{hoverTotal}</span>
                </div>
              </div>
            </div>
          )}
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
    </div>
  )
}

/**
 * Pick `count` evenly-spaced time ticks across [minT, maxT].
 * Used for x-axis labels so they spread uniformly even when scan dates cluster.
 */
function buildTimeTicks(minT: number, maxT: number, count: number): Array<{ t: number; label: string }> {
  const range = maxT - minT
  if (range <= 0) return [{ t: minT, label: new Date(minT).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) }]
  const out: Array<{ t: number; label: string }> = []
  for (let i = 0; i < count; i++) {
    const t = minT + (i / (count - 1)) * range
    out.push({ t, label: new Date(t).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) })
  }
  return out
}
