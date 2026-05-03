"""Seed Jan–May 2026 monthly plans, granular deliverables, and payments
for the five active retainer clients:

  - paint-techs ($350/mo)
  - gimos-roofing ($400/mo)
  - 904-dumpster ($350/mo)
  - zelo-flooring ($480/mo)
  - illyrian-plumber ($500/mo Jan–Apr, $800 from May)

The narrative across all five is the same:
  M1 (Jan): website build + setup
  M2 (Feb): local SEO foundation — GA4, Search Console, GMB, schema, citations
  M3 (Mar): ongoing — 4 on-page rows, 4 GMB posts, citations, reporting
  M4 (Apr): ongoing — same shape as M3
  M5 (May): backlinks focus + social media (FB+IG) launches; on-page is "done"

Idempotent:
  * MonthlyPlan / ProjectService / Payment get_or_created on natural keys.
  * If a MonthlyPlan already has deliverables, its template-driven rows are
    NOT recreated (so manual edits aren't clobbered) — the payment row is
    still ensured.

Usage:
    python manage.py seed_client_plans
    python manage.py seed_client_plans --slug 904-dumpster   # one client
    python manage.py seed_client_plans --reset-deliverables  # wipe + redo
"""
from __future__ import annotations

import datetime as dt
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction

from django.contrib.auth import get_user_model

from clients.models import (
    Business, BusinessCatalogItem, ClientProfile, Deliverable, MonthlyPlan,
    Project, ProjectService,
)
from payments.models import Payment

User = get_user_model()


# --------------------------------------------------------------------------- #
# Self-managed business: Web Wise (the agency itself).
# No rankings tracking, no payments, deliverables only.
# --------------------------------------------------------------------------- #

WEBWISE_SPEC = {
    'username': 'webwise',
    'first_name': 'Web', 'last_name': 'Wise',
    'email': 'info@websiteandseoagency.com',
    'business': {
        'name': 'Web Wise',
        'business_phone': '',
        'business_email': 'info@websiteandseoagency.com',
        'website_url': 'https://www.websiteandseoagency.com/',
        'business_address': '',
        'business_hours': '',
        'service_areas': ['United States', 'United Kingdom'],
        'industry': 'SEO Agency / Web Development',
        'target_audience': ['UK & US contractors (plumbers, roofers, HVAC, painters, etc.)'],
        'usps': [
            'Static-first Next.js builds — fast, secure, low-maintenance',
            'Local SEO with real DataForSEO-backed rank tracking',
            'In-house design + development + content',
        ],
        'marketing_channels': ['Website', 'Organic SEO', 'LinkedIn', 'Instagram', 'Facebook'],
        'tags': ['agency', 'self-managed', 'seo', 'web-development'],
        # Self-managed — no rank tracking, no SERP scans for our own site.
        'track_organic': False,
        'track_mobile': False,
        'track_maps': False,
        'discovery_enabled': False,
    },
    'catalog': [
        {'name': 'Static Website Build (Next.js)', 'item_type': 'service'},
        {'name': 'Local SEO — Monthly Retainer', 'item_type': 'service'},
        {'name': 'Content Strategy & Writing', 'item_type': 'service'},
        {'name': 'Technical SEO Audit', 'item_type': 'service'},
        {'name': 'Social Media Management', 'item_type': 'service'},
    ],
}


# --------------------------------------------------------------------------- #
# Per-client config: pricing + page topics for on-page rows.
# Page topics are city-aware where relevant.
# --------------------------------------------------------------------------- #

CLIENTS = {
    'paint-techs-llc': {
        'monthly_price': Decimal('350'),
        'price_overrides': {},  # month_index -> Decimal
        'service_name': 'Local SEO + Web Build',
        # On-page topics rotate Mar/Apr; pulled from catalog services.
        'on_page_topics': [
            'Interior Painting · Jacksonville',
            'Exterior Painting · Jacksonville',
            'Cabinet Painting · Nocatee',
            'Commercial Painting · Jacksonville Beach',
        ],
        'gmb_topics_mar': [
            'Spring exterior repaint promo',
            '5-star customer review highlight',
            'Cabinet refresh — before/after',
            'Service spotlight: Jacksonville Beach',
        ],
        'gmb_topics_apr': [
            'Easter weekend availability',
            'Commercial repaint case study',
            'Cabinet refresh — kitchen showcase',
            '5-star customer review highlight',
        ],
        'gmb_topics_may': [
            'May promo: 10% off cabinet packages',
            'Customer testimonial — Nocatee',
        ],
        'social_handles': {
            'facebook': 'Paint-Techs LLC',
            'instagram': '@painttechs',
        },
    },
    'gimos-roofing': {
        'monthly_price': Decimal('400'),
        'price_overrides': {},
        'service_name': 'Local SEO + Web Build',
        # Gimo's gets extra content + social rows in M3/M4/M5 (per request).
        'extras_ongoing_mar': [
            ('content', 'work', 'Blog post — "Common roof problems in Florida humidity"',
             'Long-form, ~1,200 words. Internal links to /roof-repair and /roof-replacement.'),
            ('content', 'work', 'Blog post — "Hurricane prep: roof checklist for FL homeowners"',
             'Seasonal evergreen. Embed a download-able PDF checklist (gated lightly with email).'),
            ('social', 'work', 'Facebook post — Storm-prep tips reel',
             'gimosrenovation: 30-second reel walking through 3 storm-prep steps.'),
            ('social', 'work', 'Instagram carousel — Recent siding job',
             '@gimosrenovation: 5-image carousel with before/after.'),
            ('social', 'work', 'Instagram reel — 15s roof install timelapse',
             '@gimosrenovation: drone overhead + install timelapse.'),
        ],
        'extras_ongoing_apr': [
            ('content', 'work', 'Blog post — "Repair vs replace: when does each make sense?"',
             'Decision-tree-style article. Strong CTA to free-estimate form.'),
            ('content', 'work', 'Blog post — "Choosing the right shingle for Northeast Florida"',
             'Guide to architectural vs 3-tab shingles, climate considerations.'),
            ('social', 'work', 'Facebook post — Customer testimonial reel',
             'gimosrenovation: 20s testimonial clip with location tag.'),
            ('social', 'work', 'Instagram post — Spring promo',
             '@gimosrenovation: branded promo card + caption with discount code.'),
            ('social', 'work', 'Instagram reel — Drone-shot completed project',
             '@gimosrenovation: aerial reveal of a finished roof, 15-20s.'),
        ],
        'extras_may': [
            ('content', 'work', 'Blog post — "What to expect during a roof replacement (day-by-day)"',
             '~1,500 words. Long-form pillar piece designed to attract backlinks.'),
            ('content', 'work', 'Blog post — "Insurance claim guide: storm damage to your roof"',
             'High intent. Includes a phone-call CTA above the fold.'),
            ('social', 'work', 'Instagram reel — Time-of-day roof shots',
             '@gimosrenovation: 15s reel of a roof at sunrise/sunset.'),
            ('social', 'work', 'Facebook post — Memorial Day promo',
             'gimosrenovation: branded promo card, 10% off.'),
        ],
        'on_page_topics': [
            'Roof Replacement · Jacksonville',
            'Roof Repair · Jacksonville',
            'Siding Installation · Atlantic Beach',
            'Custom Design & Finishing · Ponte Vedra',
        ],
        'gmb_topics_mar': [
            'Storm season roof inspection promo',
            'Customer testimonial — Jacksonville',
            'Siding install — completed project',
            'Free estimate reminder',
        ],
        'gmb_topics_apr': [
            'Spring roof check-up promo',
            'Roof replacement case study',
            'Financing options highlight',
            'Customer testimonial — Atlantic Beach',
        ],
        'gmb_topics_may': [
            'May: book your hurricane-prep inspection',
            'Recent siding job — Fernandina Beach',
        ],
        'social_handles': {
            'facebook': 'gimosrenovation',
            'instagram': '@gimosrenovation',
        },
    },
    '904-dumpster': {
        'monthly_price': Decimal('350'),
        'price_overrides': {},
        'service_name': 'Local SEO + Web Build',
        'on_page_topics': [
            '10-Yard Roll-off · Jacksonville',
            '15-Yard Roll-off · Jacksonville',
            '20-Yard Roll-off · Duval County',
            'Junk Removal Residential · Jacksonville',
        ],
        'gmb_topics_mar': [
            'Same-day delivery promo',
            'Driveway-friendly: protective boards',
            'Weekend availability reminder',
            'Customer testimonial — contractor',
        ],
        'gmb_topics_apr': [
            'Spring cleanout promo',
            'Demolition project showcase',
            'Realtor move-out service spotlight',
            'Customer testimonial — homeowner',
        ],
        'gmb_topics_may': [
            'May yard-cleanup deal',
            'Same-day vs national brokers (saved hours)',
        ],
        'social_handles': {
            'facebook': '904dumpster',
            'instagram': '@904dumpster',
        },
    },
    'zelo-flooring': {
        'monthly_price': Decimal('480'),
        'price_overrides': {},
        'service_name': 'Local SEO + Web Build',
        'on_page_topics': [
            'Vinyl Plank Flooring · San Diego',
            'Hardwood Flooring · La Jolla',
            'Epoxy Garage Flooring · Carlsbad',
            'Tile Installation · Chula Vista',
        ],
        'gmb_topics_mar': [
            'Vinyl plank vs hardwood — buying guide',
            'Customer testimonial — La Jolla',
            'Showroom photos: epoxy garage',
            'Free in-home estimate offer',
        ],
        'gmb_topics_apr': [
            'Spring renovation tile package',
            'Hardwood refinish before/after',
            'Customer testimonial — Carlsbad',
            'Eco-friendly flooring options',
        ],
        'gmb_topics_may': [
            'May install promo — bathroom flooring',
            'Customer testimonial — Encinitas',
        ],
        'social_handles': {
            'facebook': 'zeloflooring',
            'instagram': '@zeloflooring',
        },
    },
    'illyrian-plumber': {
        'monthly_price': Decimal('500'),
        # User said: $500 Jan-Apr, $800 from May.
        'price_overrides': {5: Decimal('800')},
        'service_name': 'Local SEO + Web Build',
        'on_page_topics': [
            'Emergency Plumbing 24/7 · Newark',
            'Routine Plumbing Repairs · Jersey City',
            'Plumbing Installations · East Brunswick',
            'Water Heater Repair · Elizabeth',
        ],
        'gmb_topics_mar': [
            '24/7 emergency response promo',
            'Frozen pipe prevention reminder',
            'On-time guarantee highlight',
            'Customer testimonial — Newark',
        ],
        'gmb_topics_apr': [
            'Spring plumbing tune-up offer',
            'Water heater install case study',
            'Customer testimonial — Jersey City',
            'On-time guarantee highlight',
        ],
        'gmb_topics_may': [
            'May 24/7 emergency promo',
            'Customer testimonial — Elizabeth',
        ],
        'social_handles': {
            'facebook': 'illyrianplumber',
            'instagram': '@illyrianplumber',
        },
    },
}


# --------------------------------------------------------------------------- #
# Month templates — return list of (category, kind, title, description) tuples.
# Each function takes the client config so we can inject business-specific bits.
# --------------------------------------------------------------------------- #

def m1_january(business: Business, catalog: list[BusinessCatalogItem]) -> list[tuple]:
    """Website build & setup. One row per service page from the catalog,
    plus the homepage / about / contact / brand polish rows."""
    rows: list[tuple] = []
    rows.append(('design',      'work', 'Brand & logo polish',
                 'Refine the existing brand assets — primary logo, color palette, and typography '
                 'baked into the new site.'))
    rows.append(('development', 'work', 'Website build — homepage',
                 'Hero, services overview, social proof, contact CTA. Mobile-first.'))
    rows.append(('development', 'work', 'Website build — about page',
                 'Founder story, team, service area map, license / insurance info.'))
    rows.append(('development', 'work', 'Website build — contact page',
                 'NAP block, contact form (reCAPTCHA-gated), Google Maps embed, hours.'))
    # One row per catalog service so each service page is its own deliverable.
    for item in catalog:
        if item.item_type != BusinessCatalogItem.ItemType.SERVICE:
            continue
        rows.append((
            'development', 'work', f'Service page — {item.name}',
            f'Dedicated page for "{item.name}". Includes pricing block (where applicable), '
            'in-line FAQs, schema markup, and conversion CTA.',
        ))
    rows.append(('keyword_research', 'work', 'Keyword research & site map',
                 'Map every service page to its primary + secondary keywords before launch — '
                 'no retrofitting later.'))
    rows.append(('content', 'work', 'Content writing — service pages',
                 'Long-form copy for each service page, written for the assigned target keyword.'))
    rows.append(('qa', 'work', 'Pre-launch QA',
                 'Lighthouse pass, broken-link check, mobile-viewport sweep, form-submission test, '
                 'analytics tag check.'))
    return rows


def m2_february(business: Business) -> list[tuple]:
    """Local SEO foundation — tracking, GMB, indexing, schema, citations starter."""
    return [
        ('technical', 'configuration', 'Google Analytics 4 setup',
         'Property created, tag installed via Tag Manager, conversion events for form-fill, '
         'phone-click, and email-click defined.'),
        ('technical', 'configuration', 'Google Search Console setup',
         'Domain-property verified (DNS TXT), sitemap submitted, mobile-usability + Core Web '
         'Vitals reports enabled.'),
        ('technical', 'configuration', 'Bing Webmaster Tools setup',
         'Verified, sitemap submitted — Bing still drives a non-trivial share of "near me" '
         'queries on Edge.'),
        ('gbp_setup', 'configuration', 'GMB optimization (full pass)',
         'Categories tightened, services list aligned with website, photos uploaded, hours/holiday '
         'hours set, Q&A seeded with the 8 most common questions.'),
        ('audit', 'work', 'NAP audit across existing citations',
         'Whitespark/BrightLocal pull → fix Name/Address/Phone mismatches across Yelp, Nextdoor, '
         'Yellow Pages, BBB, and any vertical-specific directories.'),
        ('technical', 'configuration', 'Schema markup — LocalBusiness + Service',
         'JSON-LD blocks for LocalBusiness on the homepage, Service on every service page, '
         'BreadcrumbList sitewide.'),
        ('citation', 'work', 'Foundational citation set (10 directories)',
         'Submit to the top 10 local-SEO citations: Yelp, Yellow Pages, BBB, Foursquare, '
         'Manta, Brownbook, MapQuest, Bing Places, Apple Maps, Hotfrog.'),
        ('reporting', 'report', 'Foundation report',
         'One-page status summary: indexing, GBP score, NAP cleanliness, citation count, '
         'baseline rankings, recommended next steps.'),
    ]


def m3_or_m4_ongoing(
    business: Business, on_page_topics: list[str], gmb_topics: list[str], month_label: str,
    extras: list[tuple] | None = None,
) -> list[tuple]:
    """Ongoing month — 4 on-page rows, 4 GMB posts, citations, reporting.
    Optional `extras` (content/social/etc.) get appended before the report row."""
    rows: list[tuple] = []
    for topic in on_page_topics:
        rows.append((
            'on_page', 'work', f'On-page optimization — {topic}',
            'Title tag, meta description, H1/H2 alignment with target keyword, internal links '
            'in/out, image alt-text, schema check.',
        ))
    for topic in gmb_topics:
        rows.append((
            'gbp_post', 'work', f'GMB post — {topic}',
            'Image + caption + CTA. Scheduled to maintain weekly cadence on the GMB profile.',
        ))
    rows.append((
        'citation', 'work', 'Citation creation (5 new directories)',
        'Niche/vertical-specific directories appropriate for the industry — extends the '
        'NAP graph beyond the foundational set from M2.',
    ))
    rows.append((
        'review', 'work', 'Review-request campaign',
        'Send review-request links to recent paying customers; flag and respond to any new '
        'public reviews on GMB.',
    ))
    if extras:
        rows.extend(extras)
    rows.append((
        'reporting', 'report', f'{month_label} report',
        'Rankings, GBP impressions/calls/directions, organic sessions, leads. Trend vs the '
        'previous month + recommended adjustments.',
    ))
    return rows


def webwise_months() -> list[tuple]:
    """5-month plan for Web Wise (self-managed). Site already exists, so M1
    is audit-and-strategy rather than build. Focus areas per request:
    on-page · technical · geo-AEO · content · social · ads."""

    def page(topic: str) -> tuple:
        return (
            'on_page', 'work', f'On-page optimization — {topic}',
            'Title/meta refresh, heading audit, internal links, image alt-text, schema.',
        )

    def technical(title: str, desc: str) -> tuple:
        return ('technical', 'work', title, desc)

    def aeo(title: str, desc: str) -> tuple:
        return ('aeo', 'work', title, desc)

    def content(title: str, desc: str) -> tuple:
        return ('content', 'work', title, desc)

    def social(title: str, desc: str) -> tuple:
        return ('social', 'work', title, desc)

    def ads(title: str, desc: str) -> tuple:
        return ('ads', 'work', title, desc)

    months: list[tuple] = []

    # ---- M1 — January: audit + strategy
    months.append((
        dt.date(2026, 1, 1), 'M1 — Audit & strategy',
        MonthlyPlan.Status.COMPLETED, [
            technical('Lighthouse audit (sitewide)',
                      'Performance/Accessibility/SEO/Best-Practices for top 20 pages.'),
            technical('Crawl audit (Screaming Frog)',
                      'Broken links, redirect chains, orphan pages, canonical conflicts.'),
            aeo('FAQ schema rollout — service hub pages',
                'JSON-LD FAQPage schema added to /seo-services, /local-seo, /technical-seo, etc.'),
            page('Homepage'),
            page('About'),
            content('Editorial calendar — Q1',
                    '12-post calendar covering local-SEO, GMB, and AEO topics. Each entry tagged '
                    'with target keyword + funnel stage.'),
            social('Social channel audit (FB / IG / LinkedIn)',
                   'Profile completeness, branding consistency, engagement baseline. Document gaps.'),
            social('Social content calendar — Q1',
                   '3 posts/week per channel. Mixed: educational, case study, promo.'),
            ads('Google Ads — account audit',
                'Existing campaigns review (if any), keyword overlap, negative-keyword list, '
                'extension coverage. Document what to keep vs rebuild.'),
            ads('Meta Ads — account audit',
                'FB/IG ad-account hygiene check, pixel verification, audience review.'),
        ],
    ))

    # ---- M2 — February: technical foundations + first content batch
    months.append((
        dt.date(2026, 2, 1), 'M2 — Technical & content foundations',
        MonthlyPlan.Status.COMPLETED, [
            technical('Schema markup expansion',
                      'Service, Organization, BreadcrumbList sitewide. JSON-LD validated in '
                      'Schema.org validator.'),
            technical('Core Web Vitals — LCP optimization',
                      'Hero image preload, font-display: swap, eliminate render-blocking JS on '
                      'service pages.'),
            technical('Sitemap + robots.txt review',
                      'Sitemap split (pages / blog / industries), robots cleaned of legacy entries.'),
            aeo('Q&A page expansion — local SEO hub',
                'Add 12 long-tail questions to /local-seo with structured answers (40-60 words each).'),
            content('Blog post — "Local SEO checklist for contractors (2026)"',
                    '~1,800 words pillar piece. Target keyword: "local SEO contractors".'),
            content('Blog post — "GMB ranking factors that actually move the needle"',
                    '~1,400 words. Internal links to /local-seo and /technical-seo.'),
            page('Local SEO hub'),
            page('Technical SEO hub'),
            social('February posting cadence — FB/IG/LinkedIn',
                   '12 posts (3/week × ~4 weeks per channel). Mix evergreen + 1 promo/week.'),
            ads('Google Ads — branded campaign rebuild',
                'Single SKAG-style ad group for "web wise" branded queries. CPC capped tightly.'),
            ads('Meta Ads — retargeting audience seed',
                'Pixel-fired audiences (90-day visitors, video-watchers) ready for May campaign.'),
        ],
    ))

    # ---- M3 — March: ongoing
    months.append((
        dt.date(2026, 3, 1), 'M3 — Ongoing on-page · content · social · ads',
        MonthlyPlan.Status.COMPLETED, [
            page('Homepage hero + CTA refresh'),
            page('Pricing page meta + structure'),
            page('Case studies index'),
            page('Contact page schema (LocalBusiness)'),
            technical('Image optimization sweep — top 30 pages',
                      'WebP conversion, lazy-loading audit, responsive srcset coverage.'),
            aeo('AEO — answer-block injection on top 5 service pages',
                '60-word direct-answer block + supporting bullet list, formatted for featured-snippet capture.'),
            content('Blog post — "How to read your GMB Insights without a dashboard tool"',
                    '~1,200 words. Practical screenshots.'),
            content('Blog post — "AEO vs traditional SEO — what changed in 2026"',
                    '~1,500 words. Pillar piece with download-able comparison table.'),
            content('Blog post — "Choosing a CMS for SEO: WordPress vs Next.js (real costs)"',
                    '~1,400 words. Internal links to service pages.'),
            content('Blog post — "Schema markup for contractors (copy-paste templates)"',
                    '~1,000 words. Includes 4 ready-to-use JSON-LD blocks.'),
            social('LinkedIn post — case study #1 (anonymized client wins)',
                   '300-word post + 2 graphics. Focus: rank improvement metrics.'),
            social('LinkedIn post — thought leadership on AEO',
                   '500-word post. Author voice, not corporate.'),
            social('Instagram reel — 30s "behind-the-build" of a Next.js site',
                   '@webwise / @websiteandseoagency: behind-scenes of one client build.'),
            social('Facebook post × 4 — March cadence',
                   '4 posts (weekly): mix of educational / case study / promo / quote card.'),
            social('Instagram carousel — "5 GMB mistakes contractors make"',
                   '5-slide educational carousel.'),
            ads('Google Ads — service-line campaign launch (Local SEO)',
                'Campaign #1: Local SEO service. Geo-targeted to UK + US contractor cities. '
                'Conversion = contact-form submit.'),
            ads('Meta Ads — March awareness flight',
                'IG/FB awareness creative. Audience = lookalike of past leads. £/£ split.'),
        ],
    ))

    # ---- M4 — April: ongoing (different topics)
    months.append((
        dt.date(2026, 4, 1), 'M4 — Ongoing on-page · content · social · ads',
        MonthlyPlan.Status.COMPLETED, [
            page('Service page — Local SEO'),
            page('Service page — Technical SEO'),
            page('Service page — Web Development'),
            page('Industry page — Plumbers'),
            technical('Internal linking sweep — 50 page audit',
                      'Identify orphan / under-linked pages and add contextual links from hub pages.'),
            aeo('AEO — "near me" query expansion across industry pages',
                '"Near me" question variants seeded into FAQ blocks on plumbers/roofers/HVAC pages.'),
            content('Blog post — "Static vs WordPress: 3-year cost breakdown"',
                    '~1,600 words. Long-form pillar with maintenance-cost calculator.'),
            content('Blog post — "Citation building in 2026 — what still works"',
                    '~1,200 words. Internal links to local-SEO service.'),
            content('Blog post — "How we 4×ed a roofer\'s GBP calls in 90 days"',
                    'Anonymized case study. ~1,400 words. CTA: book a call.'),
            content('Blog post — "Schema for service-area businesses (no physical address)"',
                    '~1,100 words. Practical JSON-LD examples.'),
            social('LinkedIn post — case study #2',
                   'Different vertical from March. 300-word post + before/after metric graphic.'),
            social('LinkedIn post — myth-busting (AEO is not just FAQ schema)',
                   '500-word post. Quote-able takeaway in bold.'),
            social('Instagram reel — 30s "process tour" (audit → fix → rank)',
                   '@webwise: 30-second process explainer with captions.'),
            social('Facebook post × 4 — April cadence',
                   '4 posts (weekly).'),
            social('Instagram carousel — "10 schema types every contractor needs"',
                   '10-slide educational carousel.'),
            ads('Google Ads — service-line campaign #2 (Web Development)',
                'Campaign #2: web build leads. Same conversion event, separate budget.'),
            ads('Meta Ads — retargeting flight (April)',
                'Sequenced creative to 90-day site visitors. Goal: book a call.'),
        ],
    ))

    # ---- M5 — May: in_progress, expand cadence + start LinkedIn ads
    months.append((
        dt.date(2026, 5, 1), 'M5 — Scale content + ads',
        MonthlyPlan.Status.IN_PROGRESS, [
            page('Homepage — May refresh (new social proof block)'),
            page('Pricing page — clearer tier comparison'),
            page('Case studies — index revamp'),
            page('Service page — Content Strategy'),
            technical('Performance pass — Core Web Vitals re-check',
                      'Re-run Lighthouse, address any regressions from new content/social embeds.'),
            aeo('AEO — voice-search query coverage',
                'Add conversational "how do I…" / "what is the best…" question blocks across hubs.'),
            content('Blog post — "GBP posts that actually drive traffic (data study)"',
                    '~1,500 words. Original data from 12 client GBPs.'),
            content('Blog post — "When NOT to do local SEO (honest take)"',
                    '~1,000 words. Counter-intuitive POV piece for engagement.'),
            content('Blog post — "Migrating from WordPress to Next.js — the SEO checklist"',
                    '~1,800 words. Lead-gen magnet.'),
            content('Blog post — "How AEO will eat 30% of your CTR (and what to do)"',
                    '~1,400 words. Forward-looking POV.'),
            social('LinkedIn post × 2 — case study + opinion',
                   '2 posts on LinkedIn. Mid-week + Friday slot.'),
            social('Instagram reel × 2 — process + result',
                   '@webwise: 2 reels (30s each). One process, one before/after result.'),
            social('Facebook post × 4 — May cadence',
                   '4 posts (weekly).'),
            social('Instagram carousel × 2 — educational',
                   '2 carousels: AEO basics + "5 SEO myths".'),
            social('TikTok pilot — 3 short videos',
                   'Repurpose IG reels with captions; test platform fit.'),
            ads('Google Ads — May optimization pass',
                'Pause low-CTR keywords, expand on top 20% performers, refresh ad copy.'),
            ads('Meta Ads — May campaign expansion',
                'Add UK-only ad set (separate from US). Creative refresh.'),
            ads('LinkedIn Ads — pilot launch',
                'Sponsored content targeting marketing managers at SMB contractors. £20/day cap. '
                'Conversion = newsletter signup.'),
            ('reporting', 'report', 'May report',
             'Traffic, rankings, leads (form/call), social reach, ad spend & CAC, content '
             'engagement. Tie metrics back to spend.'),
        ],
    ))

    return months


def m5_may(
    business: Business, on_page_topics: list[str], gmb_topics_may: list[str],
    social_handles: dict[str, str], extras: list[tuple] | None = None,
) -> list[tuple]:
    """May — backlinks focus + social media launch + ongoing GMB.
    On-page is intentionally minimal here ("on-page is all done")."""
    rows: list[tuple] = []
    # Backlinks (5 separate rows so each is trackable).
    rows.extend([
        ('backlink', 'work', 'Backlink — local Chamber of Commerce',
         'Membership listing + city-of-business directory link.'),
        ('backlink', 'work', 'Backlink — niche directory submission',
         'Submit to the leading vertical-specific directory for this industry (e.g. roofing.com, '
         'plumbing.com, dumpsters.com depending on the business).'),
        ('backlink', 'work', 'Backlink — guest-post outreach #1',
         'Pitch a 800–1,200 word post to a local-news / community blog. Backlink to a '
         'service page in the author bio.'),
        ('backlink', 'work', 'Backlink — supplier reciprocal',
         'Reach out to a key supplier and exchange testimonial-for-link on their partners page.'),
        ('backlink', 'work', 'Backlink — sponsorship or local event',
         'Identify a local event/charity to sponsor in exchange for a do-follow link.'),
    ])
    # Social — Facebook + Instagram launches as separate rows.
    fb = social_handles.get('facebook', 'business page')
    ig = social_handles.get('instagram', 'business profile')
    rows.extend([
        ('social', 'work', 'Social media — content calendar (May)',
         f'4-week posting calendar covering Facebook ({fb}) and Instagram ({ig}). '
         '2 posts/wk per channel, mixed promo/educational/UGC.'),
        ('social', 'work', 'Facebook post 1 — service spotlight',
         f'{fb}: announce the May focus service with image carousel + CTA to the website.'),
        ('social', 'work', 'Facebook post 2 — customer testimonial',
         f'{fb}: 5-star review with hero photo, tagged location.'),
        ('social', 'work', 'Instagram post 1 — before/after carousel',
         f'{ig}: 5-image carousel from a recent project. Hashtag pack tuned to local geo.'),
        ('social', 'work', 'Instagram post 2 — reel (15s)',
         f'{ig}: 15-second reel highlighting the most photogenic part of the service.'),
        ('social', 'work', 'Instagram story series — week 1',
         f'{ig}: behind-the-scenes story drops to keep top-of-feed presence.'),
    ])
    # On-page is intentionally light — single homepage refresh.
    rows.append((
        'on_page', 'work', 'On-page refresh — homepage',
        'Hero copy + meta tweak. On-page work is otherwise complete — May focus is '
        'off-site (backlinks) and social.',
    ))
    # GMB cadence continues even though on-page is done.
    for topic in gmb_topics_may:
        rows.append((
            'gbp_post', 'work', f'GMB post — {topic}',
            'Image + caption + CTA. Continue weekly cadence.',
        ))
    if extras:
        rows.extend(extras)
    rows.append((
        'reporting', 'report', 'May report',
        'Backlinks acquired (count + DR), social-media reach, rankings, GBP metrics, leads.',
    ))
    return rows


# --------------------------------------------------------------------------- #
# Command
# --------------------------------------------------------------------------- #

class Command(BaseCommand):
    help = 'Seed Jan–May 2026 monthly plans + deliverables + payments for the 5 retainer clients.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--slug', help='Run for one business slug only (e.g. 904-dumpster).',
        )
        parser.add_argument(
            '--reset-deliverables', action='store_true',
            help='Delete existing deliverables on each plan before reseeding. Destructive.',
        )

    @transaction.atomic
    def handle(self, *args, **opts):
        only_slug = opts.get('slug')
        reset = opts['reset_deliverables']

        all_slugs = list(CLIENTS) + ['web-wise']
        target_slugs = [s for s in all_slugs if not only_slug or s == only_slug]
        if only_slug and only_slug not in all_slugs:
            self.stderr.write(self.style.ERROR(
                f'Unknown slug "{only_slug}". Known: {", ".join(all_slugs)}.'
            ))
            return

        for slug in target_slugs:
            if slug == 'web-wise':
                self._seed_webwise(reset=reset)
            else:
                self._seed_one(slug, reset=reset)

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('Done. Plans, deliverables, and payments seeded.'))

    # ------------------------------------------------------------------ #
    def _ensure_webwise_business(self) -> Business:
        """Create the Web Wise user / ClientProfile / Business if missing.

        Web Wise is the agency itself — registered in the dashboard so we can
        track our own deliverables (content, social, ads) without paying
        ourselves. Tracking flags off; rankings are not relevant here.
        """
        spec = WEBWISE_SPEC
        user, _ = User.objects.get_or_create(
            username=spec['username'],
            defaults={
                'email': spec['email'],
                'first_name': spec['first_name'],
                'last_name': spec['last_name'],
                'role': 'client',  # use 'client' so the Business FK works the standard way
            },
        )
        profile, _ = ClientProfile.objects.get_or_create(
            user=user,
            defaults={
                'business_name': spec['business']['name'],
                'business_email': spec['business'].get('business_email', ''),
            },
        )
        biz_data = dict(spec['business'])
        biz, biz_new = Business.objects.get_or_create(
            client=profile, name=biz_data['name'], defaults=biz_data,
        )
        if not biz_new:
            for k, v in biz_data.items():
                setattr(biz, k, v)
            biz.save()
        # Catalog (idempotent — wipe + re-add).
        BusinessCatalogItem.objects.filter(business=biz).delete()
        for idx, item in enumerate(spec['catalog']):
            BusinessCatalogItem.objects.create(business=biz, sort_order=idx, **item)
        return biz

    # ------------------------------------------------------------------ #
    def _seed_webwise(self, reset: bool):
        biz = self._ensure_webwise_business()
        self.stdout.write(self.style.HTTP_INFO(
            f'\n▸ {biz.name}  (self-managed — no payments)'
        ))

        # Resolve Aurora once. Social + ads deliverables get assigned to her.
        aurora = User.objects.filter(
            first_name__iexact='aurora',
        ).first()
        if not aurora:
            self.stdout.write(self.style.WARNING(
                '  ⚠ Aurora not found — social/ads rows will be unassigned.'
            ))

        project, _ = Project.objects.get_or_create(
            business=biz, kind=Project.Kind.LOCAL_SEO,
            defaults={'name': 'Self-managed SEO', 'status': Project.Status.ACTIVE,
                      'start_date': dt.date(2026, 1, 1)},
        )
        service, _ = ProjectService.objects.get_or_create(
            business=biz, project=project, name='Self-managed (deliverables only)',
            defaults={
                'description': 'On-page · technical · geo-AEO · content · social · ads. '
                               'No retainer — internal work tracking only.',
                'status': ProjectService.Status.IN_PROGRESS,
                'monthly_price': None,
            },
        )

        for month_date, theme, plan_status, deliverable_rows in webwise_months():
            plan, plan_new = MonthlyPlan.objects.get_or_create(
                project_service=service, month=month_date,
                defaults={'status': plan_status, 'notes': f'{theme}.'},
            )
            existing = plan.deliverables.count()
            if existing and not reset:
                self.stdout.write(
                    f'  ↺ {month_date:%b %Y} — {existing} deliverables already present, '
                    'skipping (use --reset-deliverables to wipe).'
                )
                continue
            if reset and existing:
                plan.deliverables.all().delete()
            for idx, row in enumerate(deliverable_rows):
                category, kind, title, description = row
                d_status = (
                    Deliverable.Status.COMPLETED if plan_status == MonthlyPlan.Status.COMPLETED
                    else (Deliverable.Status.IN_PROGRESS if idx < 3 else Deliverable.Status.NOT_STARTED)
                )
                # Per request: social + ads tasks for Web Wise go to Aurora.
                assignee = aurora if category in ('social', 'ads') else None
                Deliverable.objects.create(
                    monthly_plan=plan,
                    category=category,
                    kind=kind,
                    title=title,
                    description=description,
                    status=d_status,
                    sort_order=idx,
                    assigned_to=assignee,
                    completed_date=(month_date.replace(day=28) if d_status == Deliverable.Status.COMPLETED else None),
                )
            self.stdout.write(
                f'  ✓ {month_date:%b %Y} — {len(deliverable_rows)} deliverables created.'
            )

    # ------------------------------------------------------------------ #
    def _seed_one(self, slug: str, reset: bool):
        try:
            biz = Business.objects.get(slug=slug)
        except Business.DoesNotExist:
            self.stdout.write(self.style.WARNING(
                f'  skipped — Business slug={slug!r} not found. Run seed_initial_data first.'
            ))
            return

        cfg = CLIENTS[slug]
        self.stdout.write(self.style.HTTP_INFO(
            f'\n▸ {biz.name}  (${cfg["monthly_price"]}/mo)'
        ))

        # Project + ProjectService — get_or_create so we don't double up.
        project, _ = Project.objects.get_or_create(
            business=biz, kind=Project.Kind.LOCAL_SEO,
            defaults={'name': 'Local SEO', 'status': Project.Status.ACTIVE,
                      'start_date': dt.date(2026, 1, 1)},
        )
        if not project.start_date:
            project.start_date = dt.date(2026, 1, 1)
            project.save(update_fields=['start_date'])

        service, _ = ProjectService.objects.get_or_create(
            business=biz, project=project, name=cfg['service_name'],
            defaults={
                'description': 'M1 site build → M2 SEO foundation → M3+ ongoing optimization '
                               '→ M5 backlinks + social.',
                'status': ProjectService.Status.IN_PROGRESS,
                'monthly_price': cfg['monthly_price'],
            },
        )
        if service.monthly_price != cfg['monthly_price']:
            service.monthly_price = cfg['monthly_price']
            service.save(update_fields=['monthly_price'])

        catalog = list(BusinessCatalogItem.objects.filter(business=biz).order_by('sort_order'))

        # Build the per-month spec list. Tuples are (date, theme, status, deliverable_rows).
        months_spec: list[tuple[dt.date, str, str, list[tuple]]] = [
            (dt.date(2026, 1, 1), 'M1 — Website build & setup',
             MonthlyPlan.Status.COMPLETED,
             m1_january(biz, catalog)),
            (dt.date(2026, 2, 1), 'M2 — Local SEO foundation',
             MonthlyPlan.Status.COMPLETED,
             m2_february(biz)),
            (dt.date(2026, 3, 1), 'M3 — Ongoing SEO',
             MonthlyPlan.Status.COMPLETED,
             m3_or_m4_ongoing(biz, cfg['on_page_topics'], cfg['gmb_topics_mar'], 'March',
                              extras=cfg.get('extras_ongoing_mar'))),
            (dt.date(2026, 4, 1), 'M4 — Ongoing SEO',
             MonthlyPlan.Status.COMPLETED,
             m3_or_m4_ongoing(biz, cfg['on_page_topics'], cfg['gmb_topics_apr'], 'April',
                              extras=cfg.get('extras_ongoing_apr'))),
            (dt.date(2026, 5, 1), 'M5 — Backlinks + Social Media',
             MonthlyPlan.Status.IN_PROGRESS,
             m5_may(biz, cfg['on_page_topics'], cfg['gmb_topics_may'], cfg['social_handles'],
                    extras=cfg.get('extras_may'))),
        ]

        for month_date, theme, plan_status, deliverable_rows in months_spec:
            self._seed_month(
                service=service, biz=biz, cfg=cfg,
                month_date=month_date, theme=theme,
                plan_status=plan_status, deliverable_rows=deliverable_rows,
                reset=reset,
            )

    # ------------------------------------------------------------------ #
    def _seed_month(self, *, service, biz, cfg, month_date, theme, plan_status,
                    deliverable_rows, reset):
        plan, plan_new = MonthlyPlan.objects.get_or_create(
            project_service=service, month=month_date,
            defaults={
                'status': plan_status,
                'notes': f'{theme}.',
                'monthly_retainer': cfg['monthly_price'],
            },
        )
        # Keep the retainer in sync (handles price changes mid-cycle).
        if plan.monthly_retainer != cfg['monthly_price']:
            plan.monthly_retainer = cfg['monthly_price']
            plan.save(update_fields=['monthly_retainer'])

        existing_count = plan.deliverables.count()
        if existing_count and not reset:
            self.stdout.write(
                f'  ↺ {month_date:%b %Y} — {existing_count} deliverables already present, '
                'leaving as is (use --reset-deliverables to wipe).'
            )
        else:
            if reset and existing_count:
                plan.deliverables.all().delete()
            # Past months marked completed; May is in_progress / not_started mix.
            for idx, row in enumerate(deliverable_rows):
                category, kind, title, description = row
                d_status = (
                    Deliverable.Status.COMPLETED if plan_status == MonthlyPlan.Status.COMPLETED
                    else (Deliverable.Status.IN_PROGRESS if idx < 3 else Deliverable.Status.NOT_STARTED)
                )
                Deliverable.objects.create(
                    monthly_plan=plan,
                    category=category,
                    kind=kind,
                    title=title,
                    description=description,
                    status=d_status,
                    sort_order=idx,
                    completed_date=(month_date.replace(day=28) if d_status == Deliverable.Status.COMPLETED else None),
                )
            self.stdout.write(
                f'  ✓ {month_date:%b %Y} — {len(deliverable_rows)} deliverables created.'
            )

        # Payment row (idempotent on plan — Payment has no native unique constraint
        # on plan, so we filter manually).
        amount = cfg['price_overrides'].get(month_date.month, cfg['monthly_price'])
        is_past = month_date <= dt.date(2026, 4, 30)
        pay_status = Payment.Status.PAID if is_past else Payment.Status.UPCOMING
        existing_payment = Payment.objects.filter(
            project_service=service, monthly_plan=plan,
            payment_type=Payment.Type.PREDETERMINED,
        ).first()
        defaults = {
            'amount': amount,
            'payment_type': Payment.Type.PREDETERMINED,
            'status': pay_status,
            'description': f'{biz.name} — {month_date:%B %Y} retainer',
            'due_date': month_date.replace(day=5),
            'paid_date': month_date.replace(day=10) if is_past else None,
        }
        if existing_payment:
            for k, v in defaults.items():
                setattr(existing_payment, k, v)
            existing_payment.save()
        else:
            Payment.objects.create(project_service=service, monthly_plan=plan, **defaults)
