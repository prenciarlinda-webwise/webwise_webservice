from datetime import date
from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from clients.models import ClientProfile, Project, ProjectService, MonthlyPlan
from .models import Payment, ProjectCost, BusinessExpense, ExchangeRate

User = get_user_model()


class BaseTestCase(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username='admin', password='Admin123!', role='admin')
        self.emp = User.objects.create_user(username='emp', password='Emp12345!', role='employee')
        self.cli_user = User.objects.create_user(username='cli', password='Client12!', role='client')

        self.profile = ClientProfile.objects.create(user=self.cli_user, business_name='Test Biz')
        self.project = Project.objects.create(client=self.profile, name='Test SEO')
        self.service = ProjectService.objects.create(
            project=self.project, name='Local SEO', monthly_price='500.00')
        self.plan = MonthlyPlan.objects.create(
            project_service=self.service, month=date(2026, 3, 1))

    def auth(self, username, password):
        api = APIClient()
        resp = api.post('/api/auth/token/', {'username': username, 'password': password})
        api.credentials(HTTP_AUTHORIZATION=f'Bearer {resp.data["access"]}')
        return api


class PaymentTest(BaseTestCase):
    def test_admin_create_payment(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.post('/api/payments/', {
            'project_service': self.service.id, 'amount': '500.00',
            'status': 'pending', 'due_date': '2026-03-31',
        }, format='json')
        self.assertEqual(resp.status_code, 201)

    def test_admin_update_payment_to_paid(self):
        payment = Payment.objects.create(
            project_service=self.service, amount='500.00', status='pending', due_date=date(2026, 3, 31))
        api = self.auth('admin', 'Admin123!')
        resp = api.patch(f'/api/payments/{payment.id}/', {
            'status': 'paid', 'paid_date': '2026-03-28',
        }, format='json')
        self.assertEqual(resp.status_code, 200)
        payment.refresh_from_db()
        self.assertEqual(payment.status, 'paid')
        self.assertEqual(str(payment.paid_date), '2026-03-28')

    def test_admin_delete_payment(self):
        payment = Payment.objects.create(
            project_service=self.service, amount='100.00', status='upcoming')
        api = self.auth('admin', 'Admin123!')
        resp = api.delete(f'/api/payments/{payment.id}/')
        self.assertEqual(resp.status_code, 204)

    def test_employee_cannot_see_payments(self):
        Payment.objects.create(project_service=self.service, amount='500.00', status='pending')
        api = self.auth('emp', 'Emp12345!')
        resp = api.get('/api/payments/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(len(resp.data['results']), 0)

    def test_client_sees_own_payments(self):
        Payment.objects.create(project_service=self.service, amount='500.00', status='pending')
        api = self.auth('cli', 'Client12!')
        resp = api.get('/api/payments/')
        self.assertEqual(len(resp.data['results']), 1)

    def test_filter_payments_by_status(self):
        Payment.objects.create(project_service=self.service, amount='500.00', status='paid')
        Payment.objects.create(project_service=self.service, amount='300.00', status='pending')
        api = self.auth('admin', 'Admin123!')
        resp = api.get('/api/payments/?status=paid')
        self.assertEqual(len(resp.data['results']), 1)


class ProjectCostTest(BaseTestCase):
    def test_admin_create_cost(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.post('/api/payments/costs/', {
            'project': self.project.id, 'description': 'Content writer', 'amount': '50.00', 'date': '2026-03-15',
        }, format='json')
        self.assertEqual(resp.status_code, 201)

    def test_admin_update_cost(self):
        cost = ProjectCost.objects.create(
            project=self.project, description='Tools', amount='30.00', date=date(2026, 3, 1))
        api = self.auth('admin', 'Admin123!')
        resp = api.patch(f'/api/payments/costs/{cost.id}/', {'amount': '45.00'}, format='json')
        self.assertEqual(resp.status_code, 200)
        cost.refresh_from_db()
        self.assertEqual(str(cost.amount), '45.00')

    def test_employee_cannot_access_costs(self):
        api = self.auth('emp', 'Emp12345!')
        resp = api.get('/api/payments/costs/')
        self.assertEqual(resp.status_code, 403)


class BusinessExpenseTest(BaseTestCase):
    def test_admin_create_expense(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.post('/api/payments/expenses/', {
            'name': 'Anthropic API', 'amount': '100.00', 'frequency': 'monthly',
            'category': 'AI Tools', 'start_date': '2026-01-01',
        }, format='json')
        self.assertEqual(resp.status_code, 201)

    def test_monthly_cost_calculation(self):
        monthly = BusinessExpense.objects.create(
            name='Ahrefs', amount=Decimal('29.00'), frequency='monthly', start_date=date(2026, 1, 1))
        yearly = BusinessExpense.objects.create(
            name='Domain', amount=Decimal('120.00'), frequency='yearly', start_date=date(2026, 1, 1))
        onetime = BusinessExpense.objects.create(
            name='Setup', amount=Decimal('500.00'), frequency='one_time', start_date=date(2026, 1, 1))
        self.assertEqual(monthly.monthly_cost, Decimal('29.00'))
        self.assertEqual(yearly.monthly_cost, Decimal('10.00'))
        self.assertEqual(onetime.monthly_cost, Decimal('0'))


class ExchangeRateTest(BaseTestCase):
    def test_create_exchange_rate(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.post('/api/payments/exchange-rates/', {
            'from_currency': 'USD', 'to_currency': 'LEK', 'rate': '100.5000',
        }, format='json')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(ExchangeRate.objects.count(), 1)

    def test_upsert_exchange_rate(self):
        api = self.auth('admin', 'Admin123!')
        api.post('/api/payments/exchange-rates/', {
            'from_currency': 'EUR', 'to_currency': 'LEK', 'rate': '110.0000',
        }, format='json')
        resp = api.post('/api/payments/exchange-rates/', {
            'from_currency': 'EUR', 'to_currency': 'LEK', 'rate': '115.0000',
        }, format='json')
        self.assertEqual(ExchangeRate.objects.filter(from_currency='EUR', to_currency='LEK').count(), 1)
        self.assertEqual(str(ExchangeRate.objects.get(from_currency='EUR').rate), '115.0000')


class DashboardSummaryTest(BaseTestCase):
    def test_admin_dashboard_summary(self):
        Payment.objects.create(project_service=self.service, amount='500.00', status='paid')
        Payment.objects.create(project_service=self.service, amount='300.00', status='pending')
        api = self.auth('admin', 'Admin123!')
        resp = api.get('/api/payments/summary/')
        self.assertEqual(resp.status_code, 200)
        self.assertIn('total_paid', resp.data)
        self.assertIn('net_profit', resp.data)
        self.assertEqual(str(resp.data['total_paid']), '500.00')

    def test_employee_cannot_access_summary(self):
        api = self.auth('emp', 'Emp12345!')
        resp = api.get('/api/payments/summary/')
        self.assertEqual(resp.status_code, 403)
