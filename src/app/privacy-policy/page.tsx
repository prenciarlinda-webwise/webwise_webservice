import Link from 'next/link'
import { siteConfig } from '@/data/site'

export const metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy for ${siteConfig.name} - Learn how we collect, use, and protect your personal information.`,
}

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-16 lg:py-20">
        <div className="container px-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Privacy Policy
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

            <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Introduction</h2>
            <p className="text-text-secondary mb-4 leading-relaxed">
              {siteConfig.name} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at {siteConfig.url} or use our services.
            </p>
            <p className="text-text-secondary mb-4 leading-relaxed">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Information We Collect</h2>

            <h3 className="text-xl font-bold text-primary mt-8 mb-3">Personal Information</h3>
            <p className="text-text-secondary mb-4 leading-relaxed">We may collect personal information that you voluntarily provide to us when you:</p>
            <ul className="list-disc ml-6 mb-4 space-y-2">
              <li className="text-text-secondary">Fill out a contact form or request a quote</li>
              <li className="text-text-secondary">Subscribe to our newsletter</li>
              <li className="text-text-secondary">Engage with us on social media</li>
              <li className="text-text-secondary">Purchase our services</li>
            </ul>
            <p className="text-text-secondary mb-4 leading-relaxed">This information may include:</p>
            <ul className="list-disc ml-6 mb-4 space-y-2">
              <li className="text-text-secondary">Name and business name</li>
              <li className="text-text-secondary">Email address</li>
              <li className="text-text-secondary">Phone number</li>
              <li className="text-text-secondary">Website URL</li>
              <li className="text-text-secondary">Project requirements and business information</li>
            </ul>

            <h3 className="text-xl font-bold text-primary mt-8 mb-3">Automatically Collected Information</h3>
            <p className="text-text-secondary mb-4 leading-relaxed">When you visit our website, we may automatically collect certain information about your device, including:</p>
            <ul className="list-disc ml-6 mb-4 space-y-2">
              <li className="text-text-secondary">IP address</li>
              <li className="text-text-secondary">Browser type and version</li>
              <li className="text-text-secondary">Operating system</li>
              <li className="text-text-secondary">Pages visited and time spent on pages</li>
              <li className="text-text-secondary">Referring website addresses</li>
            </ul>

            <h2 className="text-2xl font-bold text-primary mt-10 mb-4">How We Use Your Information</h2>
            <p className="text-text-secondary mb-4 leading-relaxed">We use the information we collect to:</p>
            <ul className="list-disc ml-6 mb-4 space-y-2">
              <li className="text-text-secondary">Respond to your inquiries and provide customer support</li>
              <li className="text-text-secondary">Deliver the services you have requested</li>
              <li className="text-text-secondary">Send you marketing communications (with your consent)</li>
              <li className="text-text-secondary">Improve our website and services</li>
              <li className="text-text-secondary">Analyze website usage and trends</li>
              <li className="text-text-secondary">Protect against fraud and unauthorized access</li>
            </ul>

            <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Cookies and Tracking Technologies</h2>
            <p className="text-text-secondary mb-4 leading-relaxed">
              We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with small amounts of data that may include an anonymous unique identifier.
            </p>
            <p className="text-text-secondary mb-4 leading-relaxed">We use cookies for:</p>
            <ul className="list-disc ml-6 mb-4 space-y-2">
              <li className="text-text-secondary">Analytics purposes (Google Analytics)</li>
              <li className="text-text-secondary">Remembering your preferences</li>
              <li className="text-text-secondary">Understanding how visitors interact with our website</li>
            </ul>
            <p className="text-text-secondary mb-4 leading-relaxed">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Third-Party Services</h2>
            <p className="text-text-secondary mb-4 leading-relaxed">We may use third-party services that collect, monitor, and analyze data, including:</p>
            <ul className="list-disc ml-6 mb-4 space-y-2">
              <li className="text-text-secondary"><strong className="text-primary">Google Analytics:</strong> For website analytics and performance monitoring</li>
              <li className="text-text-secondary"><strong className="text-primary">Google Tag Manager:</strong> For managing website tags and tracking</li>
            </ul>
            <p className="text-text-secondary mb-4 leading-relaxed">
              These third parties have their own privacy policies addressing how they use such information.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Data Security</h2>
            <p className="text-text-secondary mb-4 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information. However, please note that no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Data Retention</h2>
            <p className="text-text-secondary mb-4 leading-relaxed">
              We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Your Rights</h2>
            <p className="text-text-secondary mb-4 leading-relaxed">Depending on your location, you may have certain rights regarding your personal information, including:</p>
            <ul className="list-disc ml-6 mb-4 space-y-2">
              <li className="text-text-secondary">The right to access your personal information</li>
              <li className="text-text-secondary">The right to correct inaccurate information</li>
              <li className="text-text-secondary">The right to request deletion of your information</li>
              <li className="text-text-secondary">The right to opt-out of marketing communications</li>
              <li className="text-text-secondary">The right to data portability</li>
            </ul>
            <p className="text-text-secondary mb-4 leading-relaxed">
              To exercise any of these rights, please contact us using the information provided below.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Children&apos;s Privacy</h2>
            <p className="text-text-secondary mb-4 leading-relaxed">
              Our website and services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Changes to This Privacy Policy</h2>
            <p className="text-text-secondary mb-4 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date at the top of this page.
            </p>
            <p className="text-text-secondary mb-4 leading-relaxed">
              We encourage you to review this Privacy Policy periodically for any changes.
            </p>

            <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Contact Us</h2>
            <p className="text-text-secondary mb-4 leading-relaxed">If you have any questions about this Privacy Policy, please contact us:</p>
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