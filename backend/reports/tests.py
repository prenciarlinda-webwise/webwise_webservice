from datetime import date
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from clients.models import ClientProfile, Project, ProjectService, MonthlyPlan
from .models import Report, GBPMetrics, GA4Metrics, SearchTermSnapshot

User = get_user_model()


class BaseTestCase(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username='admin', password='Admin123!', role='admin')
        self.emp = User.objects.create_user(username='emp', password='Emp12345!', role='employee')
        self.cli = User.objects.create_user(username='cli', password='Client12!', role='client')

        self.profile = ClientProfile.objects.create(user=self.cli, business_name='Test Biz')
        self.project = Project.objects.create(client=self.profile, name='Test SEO')
        self.service = ProjectService.objects.create(project=self.project, name='Local SEO')
        self.plan = MonthlyPlan.objects.create(project_service=self.service, month=date(2026, 3, 1))

    def auth(self, username, password):
        api = APIClient()
        resp = api.post('/api/auth/token/', {'username': username, 'password': password})
        api.credentials(HTTP_AUTHORIZATION=f'Bearer {resp.data["access"]}')
        return api


class GBPMetricsTest(BaseTestCase):
    def test_admin_create_gbp_metrics(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.post('/api/reports/gbp/', {
            'project': self.project.id, 'month': '2026-03-01',
            'total_interactions': 150, 'profile_views': 500,
            'calls': 25, 'website_clicks': 40, 'review_count': 12,
        }, format='json')
        self.assertEqual(resp.status_code, 201)

    def test_admin_update_gbp_metrics(self):
        gbp = GBPMetrics.objects.create(
            project=self.project, month=date(2026, 3, 1),
            total_interactions=100, profile_views=400)
        api = self.auth('admin', 'Admin123!')
        resp = api.patch(f'/api/reports/gbp/{gbp.id}/', {
            'total_interactions': 200, 'profile_views': 600,
        }, format='json')
        self.assertEqual(resp.status_code, 200)
        gbp.refresh_from_db()
        self.assertEqual(gbp.total_interactions, 200)
        self.assertEqual(gbp.profile_views, 600)

    def test_unique_project_month(self):
        GBPMetrics.objects.create(project=self.project, month=date(2026, 3, 1))
        api = self.auth('admin', 'Admin123!')
        resp = api.post('/api/reports/gbp/', {
            'project': self.project.id, 'month': '2026-03-01',
        }, format='json')
        self.assertEqual(resp.status_code, 400)

    def test_filter_by_project(self):
        GBPMetrics.objects.create(project=self.project, month=date(2026, 3, 1))
        api = self.auth('admin', 'Admin123!')
        resp = api.get(f'/api/reports/gbp/?project={self.project.id}')
        self.assertEqual(len(resp.data['results']), 1)

    def test_employee_cannot_create(self):
        api = self.auth('emp', 'Emp12345!')
        resp = api.post('/api/reports/gbp/', {
            'project': self.project.id, 'month': '2026-03-01',
        }, format='json')
        self.assertEqual(resp.status_code, 403)


class GA4MetricsTest(BaseTestCase):
    def test_admin_create_ga4_metrics(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.post('/api/reports/ga4/', {
            'project': self.project.id, 'month': '2026-03-01',
            'active_users': 250, 'new_users': 180, 'total_sessions': 300,
            'page_views': 800, 'phone_clicks': 15,
        }, format='json')
        self.assertEqual(resp.status_code, 201)

    def test_admin_update_ga4_metrics(self):
        ga4 = GA4Metrics.objects.create(
            project=self.project, month=date(2026, 3, 1),
            active_users=200, page_views=500)
        api = self.auth('admin', 'Admin123!')
        resp = api.patch(f'/api/reports/ga4/{ga4.id}/', {
            'active_users': 300, 'phone_clicks': 20,
        }, format='json')
        self.assertEqual(resp.status_code, 200)
        ga4.refresh_from_db()
        self.assertEqual(ga4.active_users, 300)
        self.assertEqual(ga4.phone_clicks, 20)

    def test_ga4_json_fields(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.post('/api/reports/ga4/', {
            'project': self.project.id, 'month': '2026-04-01',
            'traffic_sources': [{'source': 'google', 'sessions': 200}],
            'top_pages': [{'path': '/', 'views': 100}],
        }, format='json')
        self.assertEqual(resp.status_code, 201)
        ga4 = GA4Metrics.objects.get(id=resp.data['id'])
        self.assertEqual(ga4.traffic_sources[0]['source'], 'google')


class SearchTermTest(BaseTestCase):
    def test_admin_create_search_term(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.post('/api/reports/search-terms/', {
            'project': self.project.id, 'month': '2026-03-01',
            'source': 'gbp', 'keyword': 'roofing contractor near me',
            'impressions': 500, 'clicks': 30, 'avg_position': '3.2',
            'local_pack': True,
        }, format='json')
        self.assertEqual(resp.status_code, 201)

    def test_admin_update_search_term(self):
        term = SearchTermSnapshot.objects.create(
            project=self.project, month=date(2026, 3, 1),
            source='gbp', keyword='roofer', impressions=100, clicks=10)
        api = self.auth('admin', 'Admin123!')
        resp = api.patch(f'/api/reports/search-terms/{term.id}/', {
            'impressions': 200, 'clicks': 25, 'avg_position': '2.5',
        }, format='json')
        self.assertEqual(resp.status_code, 200)
        term.refresh_from_db()
        self.assertEqual(term.impressions, 200)
        self.assertEqual(term.clicks, 25)

    def test_filter_by_source(self):
        SearchTermSnapshot.objects.create(
            project=self.project, month=date(2026, 3, 1),
            source='gbp', keyword='roofer', impressions=100, clicks=10)
        SearchTermSnapshot.objects.create(
            project=self.project, month=date(2026, 3, 1),
            source='gsc', keyword='roofing', impressions=50, clicks=5)
        api = self.auth('admin', 'Admin123!')
        resp = api.get('/api/reports/search-terms/?source=gbp')
        self.assertEqual(len(resp.data['results']), 1)


class ReportPDFTest(BaseTestCase):
    def test_admin_list_reports(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.get('/api/reports/')
        self.assertEqual(resp.status_code, 200)

    def test_client_sees_own_reports(self):
        Report.objects.create(
            client=self.profile, project=self.project, title='March Report',
            uploaded_by=self.admin)
        api = self.auth('cli', 'Client12!')
        resp = api.get('/api/reports/')
        self.assertEqual(len(resp.data['results']), 1)

    def test_client_cannot_see_other_reports(self):
        other_user = User.objects.create_user(username='other', password='Other123!', role='client')
        other_profile = ClientProfile.objects.create(user=other_user, business_name='Other')
        other_project = Project.objects.create(client=other_profile, name='Other SEO')
        Report.objects.create(
            client=other_profile, project=other_project, title='Other Report',
            uploaded_by=self.admin)

        api = self.auth('cli', 'Client12!')
        resp = api.get('/api/reports/')
        self.assertEqual(len(resp.data['results']), 0)
