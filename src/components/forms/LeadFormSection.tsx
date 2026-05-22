import LeadForm from '@/components/forms/LeadForm'

interface LeadFormSectionProps {
  source: string
  heading?: string
  subheading?: string
  variant?: 'audit' | 'contact'
  ctaLabel?: string
  background?: 'secondary' | 'white'
  defaultService?: string
}

export default function LeadFormSection({
  background = 'secondary',
  ...formProps
}: LeadFormSectionProps) {
  return (
    <section className={`py-24 ${background === 'white' ? 'bg-white' : 'bg-bg-secondary'}`}>
      <div className="container px-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-border">
          <LeadForm {...formProps} />
        </div>
      </div>
    </section>
  )
}
