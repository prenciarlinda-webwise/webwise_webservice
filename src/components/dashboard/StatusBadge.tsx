const styles: Record<string, string> = {
  paid: 'bg-green-100 text-green-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-green-100 text-green-700',
  in_progress: 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700',
  upcoming: 'bg-blue-100 text-blue-700',
  overdue: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-600',
  paused: 'bg-gray-100 text-gray-600',
  not_started: 'bg-gray-100 text-gray-600',
  predetermined: 'bg-purple-100 text-purple-700',
  custom: 'bg-accent/10 text-accent',
}

export default function StatusBadge({ status }: { status: string }) {
  const label = status.replace(/_/g, ' ')
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {label}
    </span>
  )
}
