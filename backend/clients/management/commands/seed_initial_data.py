"""Idempotent seed for a fresh server: real clients, Zelo's plan, optional test users.

Usage:
    python manage.py seed_initial_data                    # clients + Zelo plan
    python manage.py seed_initial_data --with-test-users  # also create local test users
    python manage.py seed_initial_data --password '...'   # override temp password

The temp password is read from the ``WEBWISE_SEED_PASSWORD`` env var if set,
falls back to a built-in default. Pass ``--password`` to override either.
"""
import datetime as dt
import os
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction

from clients.models import (
    Business, BusinessCatalogItem, ClientProfile,
    Deliverable, MonthlyPlan, Project, ProjectService,
)
from employees.models import EmployeeProfile

User = get_user_model()

DEFAULT_PASSWORD = 'WebWise2026!'


# --------------------------------------------------------------------------- #
# 1. Real clients (8)
# --------------------------------------------------------------------------- #

CLIENTS = [
    {
        'username': 'painttechs',
        'first_name': 'Paint-Techs', 'last_name': 'LLC',
        'email': 'info@paint-techs.com',
        'business': {
            'name': 'Paint-Techs LLC',
            'business_phone': '(904) 762-7062',
            'business_email': 'info@paint-techs.com',
            'website_url': 'https://www.paint-techs.com',
            'business_address': 'Jacksonville, FL 32246',
            'city': 'Jacksonville', 'state': 'FL', 'zip_code': '32246',
            'business_hours': 'Mon-Sun 8AM-10PM',
            'service_areas': [
                'Nocatee FL', 'Jacksonville FL', 'Jacksonville Beach FL',
                'Atlantic Beach FL', 'Middleburg FL', 'Fernandina Beach FL',
                'Ponte Vedra Beach FL', 'St. Augustine FL', 'Yulee FL', 'Orange Park FL',
            ],
            'google_business_url': 'https://maps.app.goo.gl/cMBt1hHzYeySz4h28',
            'google_business_name': 'Paint-Techs LLC - Painting Company',
            'industry': 'Residential & Commercial Painting',
            'target_audience': ['Homeowners', 'Businesses in Northeast Florida'],
            'usps': [
                'Extended hours (8AM-10PM daily)',
                '5.0 star rating, 41 reviews',
                'Specializes in cabinet painting',
            ],
            'marketing_channels': ['Google Maps', 'Website'],
            'tags': ['painting', 'florida', 'jacksonville', 'priority-nocatee'],
            'track_maps': True,
        },
        'catalog': [
            {'name': 'Interior Painting', 'item_type': 'service'},
            {'name': 'Exterior Painting', 'item_type': 'service'},
            {'name': 'Cabinet Painting', 'item_type': 'service'},
            {'name': 'Commercial Painting', 'item_type': 'service'},
        ],
    },
    {
        'username': 'gimosroofing',
        'first_name': "Gimo's", 'last_name': 'Roofing',
        'email': 'management@gimosroofing.com',
        'business': {
            'name': "Gimo's Roofing",
            'business_phone': '(904) 606-5313',
            'business_email': 'management@gimosroofing.com',
            'website_url': 'https://gimosroofing.com/',
            'business_address': '33 24th Street East, Jacksonville, FL',
            'city': 'Jacksonville', 'state': 'FL',
            'business_hours': 'Mon-Sat 8:00AM-5:30PM',
            'service_areas': [
                'Jacksonville FL', 'Jacksonville Beach FL', 'Atlantic Beach FL',
                'Middleburg FL', 'Fernandina Beach FL', 'Ponte Vedra Beach FL',
                'St. Augustine FL', 'Yulee FL', 'Nocatee FL', 'Orange Park FL',
            ],
            'google_business_url': 'https://www.google.com/maps/place/Gimo%27s+Renovation+%26+Roofing',
            'google_business_name': "Gimo's Renovation & Roofing",
            'facebook_url': 'https://www.facebook.com/gimosrenovation/',
            'instagram_url': 'https://www.instagram.com/gimosrenovation/',
            'booking_url': 'https://www.gimosroofing.com/form/free-estimate-request-form/',
            'industry': 'Roofing',
            'target_audience': ['Homeowners in Jacksonville needing roofing/siding'],
            'usps': [
                'Financing options available',
                'Warranty-backed workmanship',
                'Free estimates',
                'License #CCC1332453',
            ],
            'marketing_channels': ['Website', 'Facebook', 'Instagram', 'Yelp', 'GMB', 'SEO'],
            'tags': ['roofing', 'florida', 'jacksonville', 'siding', 'renovation'],
            'track_maps': True,
            'notes': (
                'License: #CCC1332453\n'
                'YouTube: https://www.youtube.com/channel/UC-Vq8SO3cVfOnWExWnt3K0w\n'
                'LinkedIn: https://www.linkedin.com/company/gimo-s-renovation-roofing/\n'
                'Yelp: https://www.yelp.com/biz/gimos-renovation-and-roofing-jacksonville'
            ),
        },
        'catalog': [
            {'name': 'Roof Installation', 'item_type': 'service', 'price_unit': 'custom'},
            {'name': 'Roof Replacement', 'item_type': 'service',
             'price': Decimal('7900'), 'price_unit': 'starting at'},
            {'name': 'Roof Repair', 'item_type': 'service',
             'price': Decimal('500'), 'price_unit': 'starting at'},
            {'name': 'Siding Installation', 'item_type': 'service'},
            {'name': 'Siding Repair', 'item_type': 'service'},
            {'name': 'Custom Design & Finishing', 'item_type': 'service'},
        ],
    },
    {
        'username': 'northstar',
        'first_name': 'Northstar', 'last_name': 'Home Improvement',
        'email': 'northstarhomeimprovement@gmail.com',
        'business': {
            'name': 'Northstar Home Improvement',
            'business_phone': '(904) 634-8441',
            'website_url': 'https://www.northstarhome.pro/',
            'business_address': '4370 Lake Woodbourne Dr S, Jacksonville, FL 32217',
            'city': 'Jacksonville', 'state': 'FL', 'zip_code': '32217',
            'business_hours': 'Mon-Sat 7AM-7PM, Sun Closed',
            'service_areas': [
                'Nocatee FL', 'Neptune Beach FL', 'Atlantic Beach FL',
                'Fleming Island FL', 'St Johns FL', 'Fruit Cove FL',
                'Middleburg FL', 'Orange Park FL', 'Palm Valley FL',
                'Jacksonville Beach FL', 'Ponte Vedra Beach FL', 'Julington Creek FL',
            ],
            'booking_url': 'https://wa.me/19046348441',
            'industry': 'Home Improvement (Painting, Flooring, Remodeling)',
            'target_audience': ['Jacksonville-area homeowners seeking premium home improvement'],
            'competitors': [
                {'name': 'Paint-Techs LLC', 'notes': 'Overlapping painting services'},
                {'name': "Gimo's Renovation & Roofing", 'notes': 'Overlapping renovation services'},
            ],
            'usps': [
                'Licensed crews', 'Written workmanship warranty',
                'Mess-free service', 'On-time guarantee',
                'Transparent quotes', 'Luxury finishes',
            ],
            'marketing_channels': ['Website', 'WhatsApp Business'],
            'tags': ['painting', 'flooring', 'remodeling', 'florida', 'jacksonville'],
            'track_maps': True,
            'notes': 'Categories: Painter, Painter and Decorator, Kitchen Renovator, '
                     'Flooring contractor, Floor refinishing service.',
        },
        'catalog': [
            {'name': 'Professional Interior Painting', 'item_type': 'service'},
            {'name': 'Professional Exterior Painting', 'item_type': 'service'},
            {'name': 'Cabinet Painting', 'item_type': 'service'},
            {'name': 'Commercial Painting', 'item_type': 'service'},
            {'name': 'Premium Vinyl Plank Flooring', 'item_type': 'service'},
            {'name': 'Tile Installation', 'item_type': 'service'},
            {'name': 'Custom Remodels', 'item_type': 'service'},
            {'name': 'Kitchen Upgrades', 'item_type': 'service'},
            {'name': 'Bathroom Upgrades', 'item_type': 'service'},
        ],
    },
    {
        'username': '904dumpster',
        'first_name': '904', 'last_name': 'Dumpster',
        'email': 'info@904dumpster.com',
        'business': {
            'name': '904 Dumpster',
            'business_phone': '(904) 240-5598',
            'business_email': 'info@904dumpster.com',
            'website_url': 'https://www.904dumpster.com',
            'business_address': '2797 Anniston Rd, Jacksonville, FL 32246',
            'city': 'Jacksonville', 'state': 'FL', 'zip_code': '32246',
            'business_hours': 'Mon-Fri 8AM-7PM, Sat-Sun 8AM-5PM',
            'service_areas': ['Jacksonville FL', 'Duval County FL'],
            'facebook_url': 'https://www.facebook.com/904dumpster',
            'instagram_url': 'https://www.instagram.com/904dumpster',
            'industry': 'Waste Management / Construction Logistics',
            'target_audience': ['General Contractors', 'Homeowners', 'Property Managers'],
            'competitors': [
                {'name': 'Bin There Dump That Jacksonville'},
                {'name': 'Dumpster Dudez'},
                {'name': 'Waste Pro'},
            ],
            'usps': [
                'Driveway-friendly (protective boards)',
                'Same-day or next-day delivery',
                'Open Saturday and Sunday',
            ],
            'marketing_channels': ['GMB', 'Facebook Ads', 'Citations', 'Referrals from local roofers'],
            'nap_status': 'High (cleaning in progress for defunct citations)',
            'tags': ['dumpster-rental', 'waste-management', 'florida', 'jacksonville'],
            'track_maps': True,
        },
        'catalog': [
            {'name': '10 Yard Roll-off Dumpster', 'item_type': 'service'},
            {'name': '15 Yard Roll-off Dumpster', 'item_type': 'service'},
            {'name': '20 Yard Roll-off Dumpster', 'item_type': 'service'},
            {'name': 'Full-Service Junk Removal — Residential', 'item_type': 'service'},
            {'name': 'Full-Service Junk Removal — Commercial', 'item_type': 'service'},
            {'name': 'Demolition & Debris Hauling', 'item_type': 'service'},
        ],
    },
    {
        'username': 'illyrianplumber',
        'first_name': 'Illyrian', 'last_name': 'Plumber',
        'email': 'info@illyriangroupllc.com',
        'business': {
            'name': 'Illyrian Plumber',
            'business_phone': '(718) 427-4396',
            'business_email': 'info@illyriangroupllc.com',
            'website_url': 'https://www.illyrianplumber.com/',
            'business_address': '697 Old Bridge Turnpike, East Brunswick, NJ 08816',
            'city': 'East Brunswick', 'state': 'NJ', 'zip_code': '08816',
            'business_hours': '24/7 — 7 days a week, 365 days',
            'service_areas': [
                'Newark NJ', 'Jersey City NJ', 'Paterson NJ', 'Elizabeth NJ',
                'Camden NJ', 'Trenton NJ', 'Clifton NJ', 'East Brunswick NJ',
            ],
            'industry': 'Emergency & Residential Plumbing',
            'target_audience': ['NJ residents and businesses needing plumbing'],
            'usps': [
                '24/7 emergency service',
                'On-time guarantee',
                '100% customer satisfaction guarantee',
                'Certified team',
            ],
            'marketing_channels': ['Website'],
            'tags': ['plumbing', 'emergency', 'new-jersey', '24-7'],
            'track_maps': True,
            'notes': 'Secondary phone: (347) 461-4856. Mobile service — no public storefront.',
        },
        'catalog': [
            {'name': 'Emergency Plumbing — 24/7', 'item_type': 'service'},
            {'name': 'Routine Plumbing Repairs', 'item_type': 'service'},
            {'name': 'Plumbing Installations', 'item_type': 'service'},
        ],
    },
    {
        'username': 'albros',
        'first_name': 'Albros', 'last_name': 'Premium Detailing',
        'email': 'info@albrosdetailing.com',
        'business': {
            'name': 'Albros Premium Car Detailing LLC',
            'business_phone': '(669) 253-0420',
            'website_url': 'https://www.albrosdetailing.com/',
            'business_address': 'Mobile service — Bay Area, CA',
            'city': 'San Jose', 'state': 'CA',
            'business_hours': 'Mon-Sun 8AM-9PM',
            'service_areas': [
                'San Jose CA', 'Santa Clara CA',
                'San Francisco Bay Area CA', 'San Benito County CA',
            ],
            'booking_url': 'https://clienthub.getjobber.com/booking/95ed8152-4e1d-43d8-9c01-3861ddcf8292/',
            'industry': 'Mobile Automotive Detailing',
            'target_audience': ['Bay Area vehicle owners', 'Fleet managers', 'Busy professionals'],
            'usps': [
                'High-end mobile service',
                'On-site convenience',
                'Showroom-quality results',
            ],
            'marketing_channels': ['Website', 'GMB'],
            'tags': ['car-detailing', 'mobile', 'california', 'bay-area'],
            'track_maps': True,
            'notes': 'Mobile service — no physical storefront. Description: '
                     '"Albros Premium LLC delivers high-end mobile detailing and hand-wash services '
                     'across the Bay Area and San Benito County."',
        },
        'catalog': [
            {'name': 'Albros Premium All-in Car Detailing', 'item_type': 'service',
             'price': Decimal('285'), 'price_unit': 'flat (4 hours)'},
            {'name': 'Deluxe Car Wash', 'item_type': 'service',
             'price': Decimal('125'), 'price_unit': 'flat (2 hours)'},
            {'name': 'Premium Exterior Detail', 'item_type': 'service',
             'price': Decimal('185'), 'price_unit': 'flat (2 hours)'},
            {'name': 'Premium Interior Detail', 'item_type': 'service',
             'price': Decimal('200'), 'price_unit': 'flat (2 hours)'},
        ],
    },
    {
        'username': 'aaaremodels',
        'first_name': 'AAA', 'last_name': 'Remodels',
        'email': 'aaaremodelsllc@gmail.com',
        'business': {
            'name': 'AAA Remodels LLC',
            'business_phone': '(904) 258-1619',
            'business_email': 'aaaremodelsllc@gmail.com',
            'website_url': 'https://www.aaaremodelsllc.com/',
            'business_address': '9505 Armelle Way, Unit 3, Jacksonville, FL',
            'city': 'Jacksonville', 'state': 'FL',
            'business_hours': 'Mon-Sat 8AM-5PM',
            'service_areas': ['Jacksonville FL (within 35 miles)'],
            'industry': 'Remodeling',
            'tags': ['remodeling', 'florida', 'jacksonville'],
            'track_maps': True,
        },
        'catalog': [],
    },
    {
        'username': 'zeloflooring',
        'first_name': 'Zelo', 'last_name': 'Flooring',
        'email': 'info@zeloflooring.com',
        'business': {
            'name': 'Zelo Flooring',
            'business_email': 'info@zeloflooring.com',
            'website_url': 'https://zeloflooring.com/',
            'business_address': '8017 Peach Point Ave, San Diego, CA 92126',
            'city': 'San Diego', 'state': 'CA', 'zip_code': '92126',
            'service_areas': [
                'San Diego CA', 'Del Mar CA', 'La Jolla CA', 'Carlsbad CA',
                'Chula Vista CA', 'El Cajon CA', 'Carmel Valley CA', 'Encinitas CA',
            ],
            'industry': 'Flooring',
            'tags': ['flooring', 'california', 'san-diego'],
            'track_maps': True,
        },
        'catalog': [
            {'name': 'Flooring Installation — All Types', 'item_type': 'service'},
        ],
    },
    {
        'username': 'torragips',
        'first_name': 'Torra', 'last_name': 'Gips',
        'email': 'torragips@gmail.com',
        'business': {
            'name': 'Torra Gips',
            'business_phone': '+355 68 858 0058',
            'business_email': 'torragips@gmail.com',
            'website_url': 'https://www.torragips.com/sq/',
            'business_address': 'Tiranë, Durrës, Albania',
            'city': 'Tiranë', 'state': '', 'country': 'Albania',
            'business_hours': 'Mon-Sat 08:00-18:00',
            'service_areas': ['Tiranë, Albania', 'Durrës, Albania'],
            'google_business_name': 'Punime Gipsi - Torra Gips',
            'industry': 'Drywall / Gips Works (Punime Gipsi)',
            'target_audience': ['Albanian homeowners and contractors needing drywall / gips work'],
            'tags': ['drywall', 'gips', 'albania', 'tirana', 'durres'],
            'language_code': 'sq',
            'track_maps': True,
        },
        'catalog': [
            {'name': 'Punime Gipsi (Drywall Works)', 'item_type': 'service'},
            {'name': 'Tavanë & Mure Gipsi (Ceiling & Wall Drywall)', 'item_type': 'service'},
        ],
    },
]


# --------------------------------------------------------------------------- #
# 2. Optional local test users (one per role/category)
# --------------------------------------------------------------------------- #

TEST_USERS = [
    {'username': 'testadmin', 'email': 'testadmin@webwise.local',
     'first_name': 'Test', 'last_name': 'Admin', 'role': 'admin'},
    {'username': 'testsupervisor', 'email': 'testsupervisor@webwise.local',
     'first_name': 'Test', 'last_name': 'Supervisor', 'role': 'employee',
     'employee_category': EmployeeProfile.Category.SUPERVISOR},
    {'username': 'testeconomist', 'email': 'testeconomist@webwise.local',
     'first_name': 'Test', 'last_name': 'Economist', 'role': 'employee',
     'employee_category': EmployeeProfile.Category.ECONOMIST},
    {'username': 'testemployee', 'email': 'testemployee@webwise.local',
     'first_name': 'Test', 'last_name': 'Employee', 'role': 'employee',
     'employee_category': EmployeeProfile.Category.ON_PAGE},
    {'username': 'testclient', 'email': 'testclient@webwise.local',
     'first_name': 'Test', 'last_name': 'Client', 'role': 'client'},
]


# --------------------------------------------------------------------------- #
# 3. Zelo Flooring — Month 1-3 SEO action plan
# --------------------------------------------------------------------------- #

ZELO_PLAN = [
    (
        dt.date(2026, 5, 1), 'in_progress',
        'Month 1 — Foundation. Structural phase: site live, NAP clean, Google indexing.',
        [
            ('development', 'Website launch (Next.js)',
             'Professional Next.js site, mobile-first, fast loading. Service pages for each offering '
             '(vinyl planks, hardwood, laminate, carpet, epoxy, tile, stairs, runners, rubber), plus about, '
             'contact, and gallery.'),
            ('keyword_research', 'Keyword research & mapping',
             'Runs from day 0 in parallel with the website build. Every page is built with its target '
             'keywords already assigned, not retrofitted later.'),
            ('gbp_setup', 'Google Business Profile optimization',
             'Full optimization, professional photos, complete services list, defined service areas '
             '(San Diego, Del Mar, La Jolla, Carlsbad, Chula Vista, El Cajon, Carmel Valley, Encinitas), '
             'regular Google Posts, Q&A.'),
            ('audit', 'NAP audit & fixes',
             'Audit Name/Address/Phone consistency across all existing listings (Yelp, Nextdoor, '
             'Thumbtack, BuildZoom, Alignable, Yahoo, etc.). Fix any mismatches. '
             'Foundational for local rankings.'),
            ('technical', 'Indexing & technical setup',
             'Submit sitemap to Google, set up Search Console and GA4, implement schema markup '
             '(LocalBusiness, Service). Domain consolidation: pick .com or .org and redirect the other.'),
        ],
    ),
    (
        dt.date(2026, 6, 1), 'planned',
        'Month 2 — Optimization. Foundation set; sharpen everything based on real data.',
        [
            ('competitor', 'Competitor analysis',
             'Identify who ranks for what in the San Diego flooring space, content gaps, '
             'and where Zelo can overtake them.'),
            ('on_page', 'On-page optimization',
             'Refine title tags, meta descriptions, headings, and internal linking based on the '
             'keyword map and competitor findings.'),
            ('content', 'Service area pages',
             'Geo-targeted pages for surrounding cities — "flooring installation Carlsbad", '
             '"hardwood flooring La Jolla", "epoxy flooring Chula Vista", etc.'),
            ('gbp_post', 'GMB posting cadence',
             'Regular Google Posts to keep the GBP active and signal recency.'),
            ('citation', 'Citation creation',
             'Build out new citations across local directories to strengthen the NAP graph.'),
        ],
    ),
    (
        dt.date(2026, 7, 1), 'planned',
        'Month 3+ — Growth. Organic traffic builds; compound it.',
        [
            ('blog_post', 'Content strategy — informational blog posts',
             'Blog posts targeting informational keywords that feed into service pages: types of flooring, '
             'LVP vs hardwood, best flooring for kitchens/bathrooms, epoxy garage flooring guides.'),
            ('content', 'Dedicated high-value pages',
             'Epoxy flooring, waterproof flooring, bathroom flooring, kitchen flooring, commercial flooring '
             '— each with its own optimized page.'),
            ('backlink', 'Local link building',
             'Partnerships, San Diego home improvement directories, contractor networks.'),
            ('reporting', 'Monthly reporting',
             'Rankings, traffic, leads tracked and shared. Strategy adjusted based on what is working.'),
        ],
    ),
]


# --------------------------------------------------------------------------- #
# Command
# --------------------------------------------------------------------------- #

class Command(BaseCommand):
    help = 'Seed real client accounts, Zelo Flooring SEO plan, and (optionally) test users.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--password',
            default=os.environ.get('WEBWISE_SEED_PASSWORD', DEFAULT_PASSWORD),
            help='Temp password for new users. Reads WEBWISE_SEED_PASSWORD env var if unset.',
        )
        parser.add_argument(
            '--with-test-users', action='store_true',
            help='Also create local test users (testadmin / testsupervisor / etc.).',
        )
        parser.add_argument(
            '--skip-zelo-plan', action='store_true',
            help='Skip seeding the Zelo Flooring monthly plan.',
        )

    @transaction.atomic
    def handle(self, *args, **opts):
        password = opts['password']

        self.stdout.write(self.style.HTTP_INFO('▸ Real clients'))
        self._seed_clients(password)

        if not opts['skip_zelo_plan']:
            self.stdout.write(self.style.HTTP_INFO('▸ Zelo Flooring monthly plan'))
            self._seed_zelo_plan()

        if opts['with_test_users']:
            self.stdout.write(self.style.HTTP_INFO('▸ Test users'))
            self._seed_test_users(password)

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS(
            f'Done. Temp password for newly-created users: {password}'
        ))

    # ------------------------------------------------------------------ #
    def _seed_clients(self, password):
        for spec in CLIENTS:
            user, was_new = User.objects.get_or_create(
                username=spec['username'],
                defaults={
                    'email': spec['email'],
                    'first_name': spec['first_name'],
                    'last_name': spec['last_name'],
                    'role': 'client',
                },
            )
            if was_new:
                user.set_password(password)
                user.save()

            profile, _ = ClientProfile.objects.get_or_create(
                user=user,
                defaults={
                    'business_name': spec['business']['name'],
                    'business_phone': spec['business'].get('business_phone', ''),
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

            BusinessCatalogItem.objects.filter(business=biz).delete()
            for idx, item in enumerate(spec['catalog']):
                BusinessCatalogItem.objects.create(business=biz, sort_order=idx, **item)

            Project.objects.get_or_create(
                business=biz, kind=Project.Kind.LOCAL_SEO,
                defaults={'name': 'Local SEO', 'status': Project.Status.ACTIVE},
            )

            self.stdout.write(f'  ✓ {biz.name} ({biz.city or "—"}, {biz.state or "—"})')

    # ------------------------------------------------------------------ #
    def _seed_test_users(self, password):
        for spec in TEST_USERS:
            user, was_new = User.objects.get_or_create(
                username=spec['username'],
                defaults={
                    'email': spec['email'],
                    'first_name': spec['first_name'],
                    'last_name': spec['last_name'],
                    'role': spec['role'],
                },
            )
            if was_new:
                user.set_password(password)
                user.save()

            if spec['role'] == 'employee':
                EmployeeProfile.objects.get_or_create(
                    user=user,
                    defaults={'category': spec['employee_category'], 'is_active': True},
                )
            elif spec['role'] == 'client':
                ClientProfile.objects.get_or_create(
                    user=user,
                    defaults={'business_name': 'Test Client Co'},
                )

            self.stdout.write(f'  ✓ {user.username} ({user.role})')

    # ------------------------------------------------------------------ #
    def _seed_zelo_plan(self):
        try:
            biz = Business.objects.get(slug='zelo-flooring')
        except Business.DoesNotExist:
            self.stdout.write(self.style.WARNING('  Zelo Flooring not found — skip plan.'))
            return

        project = Project.objects.get(business=biz, kind=Project.Kind.LOCAL_SEO)

        service, _ = ProjectService.objects.get_or_create(
            business=biz, project=project, name='Local SEO + Web Build',
            defaults={
                'description': 'Foundation → Optimization → Growth: full-funnel local SEO plus Next.js website build.',
                'status': ProjectService.Status.IN_PROGRESS,
            },
        )

        for month, status, plan_notes, deliverables in ZELO_PLAN:
            plan, plan_new = MonthlyPlan.objects.get_or_create(
                project_service=service, month=month,
                defaults={'status': status, 'notes': plan_notes},
            )
            if not plan_new and plan.deliverables.exists():
                # Don't clobber a plan that already has deliverables (someone may have edited it).
                self.stdout.write(f'  ↺ {month:%B %Y} already populated — skip.')
                continue

            for idx, (category, title, description) in enumerate(deliverables):
                Deliverable.objects.create(
                    monthly_plan=plan,
                    category=category,
                    title=title,
                    description=description,
                    status=Deliverable.Status.NOT_STARTED,
                    sort_order=idx,
                )
            self.stdout.write(f'  ✓ {month:%B %Y} ({status}) — {len(deliverables)} deliverables')
