interface FAQ {
  question: string
  answer: string
}

interface FAQSectionProps {
  faqs: FAQ[]
  title?: string
  subtitle?: string
  background?: 'white' | 'gray'
}

export default function FAQSection({
  faqs,
  title = 'Frequently Asked Questions',
  subtitle = 'Get answers to common questions.',
  background = 'white'
}: FAQSectionProps) {
  return (
    <section className={`py-24 ${background === 'gray' ? 'bg-bg-secondary' : ''}`}>
      <div className="container px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-medium rounded-full text-sm mb-4">FAQ</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">{title}</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">{subtitle}</p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-border">
              <h3 className="font-semibold text-primary mb-2">{faq.question}</h3>
              <p className="text-text-secondary">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}