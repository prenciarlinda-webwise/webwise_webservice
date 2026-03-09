interface PageHeaderProps {
  title: string
  description?: React.ReactNode
  action?: React.ReactNode
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        {description && <p className="text-text-secondary mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
