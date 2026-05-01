from datetime import date
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import (
    ClientProfile, Business, ProjectService, MonthlyPlan, Deliverable,
    ServiceTemplate, TemplateDeliverable, MonthlyMetrics, BusinessCatalogItem,
)

User = get_user_model()


class BaseTestCase(TestCase):
    """Common setup: admin, employee, client users + auth helpers."""

    def setUp(self):
        self.admin_user = User.objects.create_user(
            username='admin', password='Admin123!', role='admin', first_name='Admin', last_name='Boss')
        self.emp_user = User.objects.create_user(
            username='employee', password='Emp12345!', role='employee', first_name='Rea', last_name='P')
        self.client_user = User.objects.create_user(
            username='clientuser', password='Client12!', role='client', first_name='John', last_name='Doe')

        # Create client profile + project + service + plan
        self.client_profile = ClientProfile.objects.create(
            user=self.client_user, business_name="Gimo's Roofing",
            business_phone='555-1234', business_email='gimo@test.com')
        self.project = Business.objects.create(
            client=self.client_profile, name="Gimo's Roofing SEO", status='active',
            industry='Roofing', website_url='https://gimos.com')
        self.service = ProjectService.objects.create(
            project=self.project, name='Local SEO', monthly_price='500.00', status='in_progress')
        self.plan = MonthlyPlan.objects.create(
            project_service=self.service, month=date(2026, 3, 1), status='planned')

    def auth(self, username, password):
        api = APIClient()
        resp = api.post('/api/auth/token/', {'username': username, 'password': password})
        api.credentials(HTTP_AUTHORIZATION=f'Bearer {resp.data["access"]}')
        return api


# ── Client Profile CRUD ──────────────────────────────

class ClientProfileTest(BaseTestCase):
    def test_admin_list_clients(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.get('/api/clients/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(len(resp.data['results']), 1)

    def test_admin_create_client(self):
        """ClientProfile.user is read_only — profile is created via model, not API user field."""
        new_user = User.objects.create_user(username='newcli', password='Pass1234!', role='client')
        # Create directly since user is read_only on serializer (set at model level)
        profile = ClientProfile.objects.create(user=new_user, business_name='New Biz')
        api = self.auth('admin', 'Admin123!')
        resp = api.get(f'/api/clients/{profile.id}/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data['business_name'], 'New Biz')

    def test_admin_update_client(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.patch(f'/api/clients/{self.client_profile.id}/',
                         {'business_name': 'Updated Roofing'}, format='json')
        self.assertEqual(resp.status_code, 200)
        self.client_profile.refresh_from_db()
        self.assertEqual(self.client_profile.business_name, 'Updated Roofing')

    def test_admin_delete_client(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.delete(f'/api/clients/{self.client_profile.id}/')
        self.assertEqual(resp.status_code, 204)
        self.assertFalse(ClientProfile.objects.filter(id=self.client_profile.id).exists())

    def test_employee_list_clients(self):
        api = self.auth('employee', 'Emp12345!')
        resp = api.get('/api/clients/')
        self.assertEqual(resp.status_code, 200)

    def test_employee_cannot_see_pricing(self):
        api = self.auth('employee', 'Emp12345!')
        resp = api.get(f'/api/clients/{self.client_profile.id}/')
        self.assertNotIn('price_per_service', resp.data)
        self.assertNotIn('user_email', resp.data)

    def test_client_cannot_list_clients(self):
        api = self.auth('clientuser', 'Client12!')
        resp = api.get('/api/clients/')
        self.assertEqual(resp.status_code, 403)

    def test_client_my_profile(self):
        api = self.auth('clientuser', 'Client12!')
        resp = api.get('/api/clients/me/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data['business_name'], "Gimo's Roofing")

    def test_client_update_own_profile(self):
        api = self.auth('clientuser', 'Client12!')
        resp = api.patch('/api/clients/me/', {'business_phone': '999-0000'}, format='json')
        self.assertEqual(resp.status_code, 200)
        self.client_profile.refresh_from_db()
        self.assertEqual(self.client_profile.business_phone, '999-0000')


# ── Business CRUD ──────────────────────────────────────

class ProjectTest(BaseTestCase):
    def test_admin_list_projects(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.get('/api/clients/projects/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(len(resp.data['results']), 1)

    def test_admin_create_project(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.post('/api/clients/projects/', {
            'client': self.client_profile.id, 'name': 'New Business', 'industry': 'Plumbing',
        }, format='json')
        self.assertEqual(resp.status_code, 201)

    def test_admin_update_project(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.patch(f'/api/clients/projects/{self.project.id}/',
                         {'name': 'Updated Name', 'industry': 'HVAC'}, format='json')
        self.assertEqual(resp.status_code, 200)
        self.project.refresh_from_db()
        self.assertEqual(self.project.name, 'Updated Name')
        self.assertEqual(self.project.industry, 'HVAC')

    def test_client_sees_only_own_projects(self):
        other_user = User.objects.create_user(username='other', password='Other123!', role='client')
        other_profile = ClientProfile.objects.create(user=other_user, business_name='Other Biz')
        Business.objects.create(client=other_profile, name='Other Business')

        api = self.auth('clientuser', 'Client12!')
        resp = api.get('/api/clients/projects/')
        self.assertEqual(len(resp.data['results']), 1)
        self.assertEqual(resp.data['results'][0]['name'], "Gimo's Roofing SEO")

    def test_project_detail_nested(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.get(f'/api/clients/projects/{self.project.id}/')
        self.assertEqual(resp.status_code, 200)
        self.assertIn('services', resp.data)
        self.assertEqual(len(resp.data['services']), 1)

    def test_filter_projects_by_client(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.get(f'/api/clients/projects/?client={self.client_profile.id}')
        self.assertEqual(len(resp.data['results']), 1)


# ── Service CRUD ──────────────────────────────────────

class ProjectServiceTest(BaseTestCase):
    def test_admin_create_service(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.post('/api/clients/services/', {
            'project': self.project.id, 'name': 'Website Redesign', 'monthly_price': '1000.00',
        }, format='json')
        self.assertEqual(resp.status_code, 201)

    def test_admin_update_service(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.patch(f'/api/clients/services/{self.service.id}/',
                         {'monthly_price': '750.00'}, format='json')
        self.assertEqual(resp.status_code, 200)
        self.service.refresh_from_db()
        self.assertEqual(str(self.service.monthly_price), '750.00')

    def test_employee_cannot_see_monthly_price(self):
        api = self.auth('employee', 'Emp12345!')
        resp = api.get(f'/api/clients/services/{self.service.id}/')
        self.assertNotIn('monthly_price', resp.data)


# ── Monthly Plan CRUD ─────────────────────────────────

class MonthlyPlanTest(BaseTestCase):
    def test_admin_create_plan(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.post('/api/clients/plans/', {
            'project_service': self.service.id, 'month': '2026-04-01', 'status': 'planned',
        }, format='json')
        self.assertEqual(resp.status_code, 201)

    def test_unique_plan_per_service_per_month(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.post('/api/clients/plans/', {
            'project_service': self.service.id, 'month': '2026-03-01',
        }, format='json')
        self.assertEqual(resp.status_code, 400)

    def test_admin_update_plan_status(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.patch(f'/api/clients/plans/{self.plan.id}/',
                         {'status': 'in_progress'}, format='json')
        self.assertEqual(resp.status_code, 200)
        self.plan.refresh_from_db()
        self.assertEqual(self.plan.status, 'in_progress')

    def test_plan_completion_creates_payment(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.patch(f'/api/clients/plans/{self.plan.id}/',
                         {'status': 'completed'}, format='json')
        self.assertEqual(resp.status_code, 200)
        from payments.models import Payment
        payment = Payment.objects.filter(monthly_plan=self.plan).first()
        self.assertIsNotNone(payment)
        self.assertEqual(str(payment.amount), '500.00')
        self.assertEqual(payment.status, 'pending')

    def test_plan_progress_calculation(self):
        Deliverable.objects.create(monthly_plan=self.plan, category='audit', title='T1', status='completed')
        Deliverable.objects.create(monthly_plan=self.plan, category='audit', title='T2', status='in_progress')
        Deliverable.objects.create(monthly_plan=self.plan, category='audit', title='T3', status='not_started')
        api = self.auth('admin', 'Admin123!')
        resp = api.get(f'/api/clients/plans/{self.plan.id}/')
        progress = resp.data['progress']
        self.assertEqual(progress['total'], 3)
        self.assertEqual(progress['completed'], 1)
        self.assertEqual(progress['in_progress'], 1)
        self.assertEqual(progress['not_started'], 1)
        self.assertEqual(progress['percent'], 33)

    def test_filter_plans_by_project(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.get(f'/api/clients/plans/?project={self.project.id}')
        self.assertEqual(len(resp.data['results']), 1)

    def test_filter_plans_by_month(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.get('/api/clients/plans/?month=2026-03-01')
        self.assertEqual(len(resp.data['results']), 1)
        resp2 = api.get('/api/clients/plans/?month=2026-05-01')
        self.assertEqual(len(resp2.data['results']), 0)


# ── Deliverable CRUD (THE CRITICAL BUG AREA) ─────────

class DeliverableTest(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.deliverable = Deliverable.objects.create(
            monthly_plan=self.plan, category='gbp_post', title='GMB Post #1',
            description='Initial description', status='not_started',
            assigned_to=self.emp_user, due_date=date(2026, 3, 5),
        )

    def test_admin_create_deliverable(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.post('/api/clients/deliverables/', {
            'monthly_plan': self.plan.id, 'category': 'citation',
            'title': 'Submit to Yelp', 'status': 'not_started',
        }, format='json')
        self.assertEqual(resp.status_code, 201)

    def test_admin_update_deliverable_status(self):
        """The core bug test: PATCH should persist status change."""
        api = self.auth('admin', 'Admin123!')
        resp = api.patch(f'/api/clients/deliverables/{self.deliverable.id}/',
                         {'status': 'in_progress'}, format='json')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data['status'], 'in_progress')
        self.deliverable.refresh_from_db()
        self.assertEqual(self.deliverable.status, 'in_progress')

    def test_admin_update_deliverable_description(self):
        """Verify description edit persists."""
        api = self.auth('admin', 'Admin123!')
        resp = api.patch(f'/api/clients/deliverables/{self.deliverable.id}/',
                         {'description': 'Updated description'}, format='json')
        self.assertEqual(resp.status_code, 200)
        self.deliverable.refresh_from_db()
        self.assertEqual(self.deliverable.description, 'Updated description')

    def test_admin_update_deliverable_title(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.patch(f'/api/clients/deliverables/{self.deliverable.id}/',
                         {'title': 'New Title'}, format='json')
        self.assertEqual(resp.status_code, 200)
        self.deliverable.refresh_from_db()
        self.assertEqual(self.deliverable.title, 'New Title')

    def test_admin_update_deliverable_notes(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.patch(f'/api/clients/deliverables/{self.deliverable.id}/',
                         {'notes': 'Added notes here'}, format='json')
        self.assertEqual(resp.status_code, 200)
        self.deliverable.refresh_from_db()
        self.assertEqual(self.deliverable.notes, 'Added notes here')

    def test_admin_update_deliverable_links(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.patch(f'/api/clients/deliverables/{self.deliverable.id}/', {
            'link': 'https://drive.google.com/test',
            'live_url': 'https://example.com/post1',
        }, format='json')
        self.assertEqual(resp.status_code, 200)
        self.deliverable.refresh_from_db()
        self.assertEqual(self.deliverable.link, 'https://drive.google.com/test')
        self.assertEqual(self.deliverable.live_url, 'https://example.com/post1')

    def test_admin_update_deliverable_dates(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.patch(f'/api/clients/deliverables/{self.deliverable.id}/', {
            'due_date': '2026-03-15', 'completed_date': '2026-03-14',
        }, format='json')
        self.assertEqual(resp.status_code, 200)
        self.deliverable.refresh_from_db()
        self.assertEqual(str(self.deliverable.due_date), '2026-03-15')
        self.assertEqual(str(self.deliverable.completed_date), '2026-03-14')

    def test_admin_update_multiple_fields_at_once(self):
        """Test updating status + description + notes in one PATCH."""
        api = self.auth('admin', 'Admin123!')
        resp = api.patch(f'/api/clients/deliverables/{self.deliverable.id}/', {
            'status': 'completed',
            'description': 'All done',
            'notes': 'Finished early',
            'completed_date': '2026-03-10',
        }, format='json')
        self.assertEqual(resp.status_code, 200)
        self.deliverable.refresh_from_db()
        self.assertEqual(self.deliverable.status, 'completed')
        self.assertEqual(self.deliverable.description, 'All done')
        self.assertEqual(self.deliverable.notes, 'Finished early')
        self.assertEqual(str(self.deliverable.completed_date), '2026-03-10')

    def test_admin_delete_deliverable(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.delete(f'/api/clients/deliverables/{self.deliverable.id}/')
        self.assertEqual(resp.status_code, 204)
        self.assertFalse(Deliverable.objects.filter(id=self.deliverable.id).exists())

    def test_employee_update_own_deliverable(self):
        """Employee can update deliverables assigned to them."""
        api = self.auth('employee', 'Emp12345!')
        resp = api.patch(f'/api/clients/deliverables/{self.deliverable.id}/',
                         {'status': 'in_progress'}, format='json')
        self.assertEqual(resp.status_code, 200)
        self.deliverable.refresh_from_db()
        self.assertEqual(self.deliverable.status, 'in_progress')

    def test_employee_add_link_to_deliverable(self):
        api = self.auth('employee', 'Emp12345!')
        resp = api.patch(f'/api/clients/deliverables/{self.deliverable.id}/',
                         {'link': 'https://drive.google.com/doc'}, format='json')
        self.assertEqual(resp.status_code, 200)
        self.deliverable.refresh_from_db()
        self.assertEqual(self.deliverable.link, 'https://drive.google.com/doc')

    def test_employee_cannot_see_unassigned_deliverables(self):
        unassigned = Deliverable.objects.create(
            monthly_plan=self.plan, category='audit', title='Not for employee', status='not_started')
        api = self.auth('employee', 'Emp12345!')
        resp = api.get(f'/api/clients/deliverables/{unassigned.id}/')
        self.assertEqual(resp.status_code, 404)

    def test_client_sees_own_deliverables(self):
        api = self.auth('clientuser', 'Client12!')
        resp = api.get('/api/clients/deliverables/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(len(resp.data['results']), 1)

    def test_filter_deliverables_by_plan(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.get(f'/api/clients/deliverables/?plan={self.plan.id}')
        self.assertEqual(len(resp.data['results']), 1)

    def test_filter_deliverables_by_status(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.get('/api/clients/deliverables/?status=not_started')
        self.assertEqual(len(resp.data['results']), 1)
        resp2 = api.get('/api/clients/deliverables/?status=completed')
        self.assertEqual(len(resp2.data['results']), 0)

    def test_deliverable_ordering_by_due_date(self):
        Deliverable.objects.create(
            monthly_plan=self.plan, category='citation', title='Earlier',
            status='not_started', due_date=date(2026, 3, 1))
        Deliverable.objects.create(
            monthly_plan=self.plan, category='citation', title='Later',
            status='not_started', due_date=date(2026, 3, 30))
        api = self.auth('admin', 'Admin123!')
        resp = api.get(f'/api/clients/deliverables/?plan={self.plan.id}')
        titles = [d['title'] for d in resp.data['results']]
        self.assertEqual(titles[0], 'Earlier')
        self.assertEqual(titles[-1], 'Later')


# ── Business Catalog ──────────────────────────────────

class BusinessCatalogTest(BaseTestCase):
    def test_admin_create_catalog_item(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.post('/api/clients/catalog/', {
            'project': self.project.id, 'name': 'Roof Repair',
            'item_type': 'service', 'price': '150.00', 'price_unit': 'per sqft',
        }, format='json')
        self.assertEqual(resp.status_code, 201)

    def test_admin_update_catalog_item(self):
        item = BusinessCatalogItem.objects.create(
            project=self.project, name='Gutter Install', item_type='service', price='200.00')
        api = self.auth('admin', 'Admin123!')
        resp = api.patch(f'/api/clients/catalog/{item.id}/', {'price': '250.00'}, format='json')
        self.assertEqual(resp.status_code, 200)
        item.refresh_from_db()
        self.assertEqual(str(item.price), '250.00')


# ── Service Templates ─────────────────────────────────

class TemplateTest(BaseTestCase):
    def test_admin_create_template(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.post('/api/clients/templates/', {
            'name': 'Premium Local SEO', 'description': 'Full package',
        }, format='json')
        self.assertEqual(resp.status_code, 201)

    def test_apply_template_creates_plan_with_deliverables(self):
        template = ServiceTemplate.objects.create(name='Starter')
        TemplateDeliverable.objects.create(
            template=template, category='audit', title='Site Audit', sort_order=0)
        TemplateDeliverable.objects.create(
            template=template, category='gbp_setup', title='GBP Setup', sort_order=1)

        api = self.auth('admin', 'Admin123!')
        resp = api.post('/api/clients/templates/apply/', {
            'template_id': template.id,
            'project_service_id': self.service.id,
            'month': '2026-05-01',
        }, format='json')
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(len(resp.data['deliverables']), 2)

    def test_employee_cannot_manage_templates(self):
        api = self.auth('employee', 'Emp12345!')
        resp = api.get('/api/clients/templates/')
        self.assertEqual(resp.status_code, 403)


# ── Monthly Metrics ───────────────────────────────────

class MonthlyMetricsTest(BaseTestCase):
    def test_admin_create_metrics(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.post('/api/clients/metrics/', {
            'monthly_plan': self.plan.id, 'gbp_views': 500, 'gbp_calls': 30,
            'organic_sessions': 200, 'monthly_retainer': '500.00',
            'tool_costs': '50.00',
        }, format='json')
        self.assertEqual(resp.status_code, 201)

    def test_admin_upsert_metrics(self):
        api = self.auth('admin', 'Admin123!')
        api.post('/api/clients/metrics/', {'monthly_plan': self.plan.id, 'gbp_views': 100}, format='json')
        resp = api.post('/api/clients/metrics/', {'monthly_plan': self.plan.id, 'gbp_views': 999}, format='json')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data['gbp_views'], 999)
        self.assertEqual(MonthlyMetrics.objects.filter(monthly_plan=self.plan).count(), 1)

    def test_employee_cannot_create_metrics(self):
        api = self.auth('employee', 'Emp12345!')
        resp = api.post('/api/clients/metrics/', {'monthly_plan': self.plan.id, 'gbp_views': 1}, format='json')
        self.assertEqual(resp.status_code, 403)
