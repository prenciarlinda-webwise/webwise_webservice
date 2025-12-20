import Link from 'next/link'
import { siteConfig } from '@/data/site'

export const metadata = {
  title: 'Terms and Agreements',
  description: `Terms and Agreements for ${siteConfig.name} - Read our terms of service, payment terms, and service level expectations.`,
}

export default function TermsAndAgreementsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-16 lg:py-20">
        <div className="container px-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Terms and Agreements
            </h1>
            <p className="text-lg text-white/80">
              Last updated: December 2024
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto">

            <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Agreement to Terms</h2>
            <p className="text-text-secondary mb-4 leading-relaxed">
              By accessing or using the services provided by {siteConfig.name} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you agree to be bound by these Terms and Agreements. If you do not agree to these terms, please do not use our services.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Services Overview</h2>
            <p className="text-text-secondary mb-4 leading-relaxed">
              {siteConfig.name} provides professional web design, web development, SEO (Search Engine Optimization), and digital marketing services. Our services are tailored to meet the specific needs of each client based on the selected package and scope of work.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Service Packages and Results</h2>
            <div className="bg-accent/10 border-l-4 border-accent p-6 my-6 rounded-r-lg">
              <h3 className="text-xl font-bold text-accent mb-3">Important Notice About Results and Response Times</h3>
              <p className="text-text-secondary leading-relaxed">
                <strong className="text-primary">Results and response times vary based on the package you choose.</strong> Different service packages include different levels of support, turnaround times, and scope of work. Higher-tier packages typically include faster response times, more comprehensive services, and dedicated support. The specific deliverables, timelines, and expected outcomes for your project will be outlined in your individual service agreement or proposal.
              </p>
            </div>

            <h3 className="text-xl font-bold text-primary mt-8 mb-3">SEO Services</h3>
            <p className="text-text-secondary mb-4 leading-relaxed">
              Search engine optimization is a long-term strategy. Results depend on various factors including:
            </p>
            <ul className="list-disc ml-6 mb-4 space-y-2">
              <li className="text-text-secondary">Your selected package and level of investment</li>
              <li className="text-text-secondary">Current state of your website and online presence</li>
              <li className="text-text-secondary">Competition in your industry and local market</li>
              <li className="text-text-secondary">The keywords and markets being targeted</li>
              <li className="text-text-secondary">Implementation of our recommendations</li>
            </ul>
            <p className="text-text-secondary mb-4 leading-relaxed">
              While we employ industry best practices and proven strategies, we cannot guarantee specific rankings or traffic increases as search engine algorithms are controlled by third parties and subject to change.
            </p>

            <h3 className="text-xl font-bold text-primary mt-8 mb-3">Web Development Services</h3>
            <p className="text-text-secondary mb-4 leading-relaxed">
              Website development timelines and deliverables are based on the package selected and project scope. Factors that may affect project timelines include:
            </p>
            <ul className="list-disc ml-6 mb-4 space-y-2">
              <li className="text-text-secondary">Complexity of design and functionality requirements</li>
              <li className="text-text-secondary">Timeliness of client feedback and content provision</li>
              <li className="text-text-secondary">Number of revision rounds included in your package</li>
              <li className="text-text-secondary">Third-party integrations and custom features</li>
            </ul>

            <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Client Responsibilities</h2>
            <p className="text-text-secondary mb-4 leading-relaxed">To ensure successful project delivery, clients agree to:</p>
            <ul className="list-disc ml-6 mb-4 space-y-2">
              <li className="text-text-secondary">Provide accurate and timely information, content, and feedback</li>
              <li className="text-text-secondary">Review deliverables within reasonable timeframes</li>
              <li className="text-text-secondary">Maintain necessary access to relevant accounts and platforms</li>
              <li className="text-text-secondary">Comply with all applicable laws and regulations</li>
              <li className="text-text-secondary">Not use our services for any unlawful or prohibited purposes</li>
            </ul>

            <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Payment Terms</h2>
            <p className="text-text-secondary mb-4 leading-relaxed">Payment terms are as follows:</p>
            <ul className="list-disc ml-6 mb-4 space-y-2">
              <li className="text-text-secondary"><strong className="text-primary">Website Projects:</strong> A deposit is required before work begins. The remaining balance is due upon project completion or as outlined in your proposal.</li>
              <li className="text-text-secondary"><strong className="text-primary">Monthly SEO Services:</strong> Payment is due at the beginning of each service period. Services will not commence until payment is received.</li>
              <li className="text-text-secondary"><strong className="text-primary">Custom Projects:</strong> Payment schedules for custom projects will be outlined in your individual service agreement.</li>
            </ul>
            <p className="text-text-secondary mb-4 leading-relaxed">
              Late payments may result in service suspension or termination. We reserve the right to charge interest on overdue amounts.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Intellectual Property</h2>
            <h3 className="text-xl font-bold text-primary mt-8 mb-3">Our Work Product</h3>
            <p className="text-text-secondary mb-4 leading-relaxed">
              Upon full payment, clients receive ownership of custom designs and code created specifically for their project. We retain the right to showcase completed work in our portfolio unless otherwise agreed in writing.
            </p>

            <h3 className="text-xl font-bold text-primary mt-8 mb-3">Third-Party Assets</h3>
            <p className="text-text-secondary mb-4 leading-relaxed">
              Some projects may include third-party assets (fonts, images, plugins) that are subject to their own licensing terms. We will inform you of any such requirements.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Confidentiality</h2>
            <p className="text-text-secondary mb-4 leading-relaxed">
              We treat all client information as confidential. We will not disclose your business information, strategies, or data to third parties without your consent, except as required by law.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Limitation of Liability</h2>
            <p className="text-text-secondary mb-4 leading-relaxed">
              To the maximum extent permitted by law, {siteConfig.name} shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
            </p>
            <p className="text-text-secondary mb-4 leading-relaxed">
              Our total liability for any claim arising from our services shall not exceed the amount you paid us for the specific service giving rise to the claim.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Termination</h2>
            <p className="text-text-secondary mb-4 leading-relaxed">
              Either party may terminate ongoing services with 30 days written notice. Upon termination:
            </p>
            <ul className="list-disc ml-6 mb-4 space-y-2">
              <li className="text-text-secondary">Any outstanding payments become immediately due</li>
              <li className="text-text-secondary">Work completed up to the termination date will be delivered</li>
              <li className="text-text-secondary">No refunds will be issued for services already rendered</li>
            </ul>

            <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Dispute Resolution</h2>
            <p className="text-text-secondary mb-4 leading-relaxed">
              Any disputes arising from these terms or our services shall first be addressed through good-faith negotiation. If resolution cannot be reached, disputes shall be subject to binding arbitration in accordance with applicable laws.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Changes to Terms</h2>
            <p className="text-text-secondary mb-4 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services after any changes constitutes acceptance of the new terms.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Governing Law</h2>
            <p className="text-text-secondary mb-4 leading-relaxed">
              These Terms and Agreements shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Contact Information</h2>
            <p className="text-text-secondary mb-4 leading-relaxed">For questions about these Terms and Agreements, please contact us:</p>
            <ul className="list-disc ml-6 mb-4 space-y-2">
              <li className="text-text-secondary">By email: <a href={`mailto:${siteConfig.email}`} className="text-accent hover:underline">{siteConfig.email}</a></li>
              <li className="text-text-secondary">By phone: <a href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, '')}`} className="text-accent hover:underline">{siteConfig.phone}</a></li>
              <li className="text-text-secondary">Through our <Link href="/contact" className="text-accent hover:underline">contact page</Link></li>
            </ul>

          </div>
        </div>
      </section>
    </>
  )
}