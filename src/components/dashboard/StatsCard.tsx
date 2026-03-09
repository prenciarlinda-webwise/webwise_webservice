interface StatsCardProps {
  label: string
  value: string
  sub?: string
  color?: 'default' | 'green' | 'yellow' | 'red' | 'blue'
}

const colorMap = {
  default: 'bg-bg-secondary',
  green: 'bg-green-50',
  yellow: 'bg-yellow-50',
  red: 'bg-red-50',
  blue: 'bg-blue-50',
}

export default function StatsCard({ label, value, sub, color = 'default' }: StatsCardProps) {
  return (
    <div className={`${colorMap[color]} rounded-xl p-6`}>
      <p className="text-sm text-text-secondary mb-1">{label}</p>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
      {sub && <p className="text-xs text-text-muted mt-1">{sub}</p>}
    </div>
  )
}
