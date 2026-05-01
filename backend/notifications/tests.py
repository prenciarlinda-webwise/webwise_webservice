from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from clients.models import ClientProfile, Business
from .models import Notification

User = get_user_model()


class BaseTestCase(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username='admin', password='Admin123!', role='admin', first_name='Admin', last_name='Boss')
        self.emp = User.objects.create_user(
            username='rea', password='Rea12345!', role='employee', first_name='Rea', last_name='P')
        self.cli = User.objects.create_user(username='cli', password='Client12!', role='client')

        self.profile = ClientProfile.objects.create(user=self.cli, business_name='Test Biz')
        self.project = Business.objects.create(client=self.profile, name='Test SEO')

    def auth(self, username, password):
        api = APIClient()
        resp = api.post('/api/auth/token/', {'username': username, 'password': password})
        api.credentials(HTTP_AUTHORIZATION=f'Bearer {resp.data["access"]}')
        return api


class NotificationCreateTest(BaseTestCase):
    def test_employee_send_notification_to_admin(self):
        api = self.auth('rea', 'Rea12345!')
        resp = api.post('/api/notifications/', {
            'recipient': self.admin.id,
            'project': self.project.id,
            'category': 'photo_low',
            'priority': 'high',
            'title': 'Running low on photos',
            'message': 'Gimos Roofing has only 3 photos left.',
        }, format='json')
        self.assertEqual(resp.status_code, 201)
        notif = Notification.objects.get(id=resp.data['id'])
        self.assertEqual(notif.sender, self.emp)
        self.assertEqual(notif.recipient, self.admin)
        self.assertEqual(notif.category, 'photo_low')

    def test_client_cannot_create_notifications(self):
        api = self.auth('cli', 'Client12!')
        resp = api.post('/api/notifications/', {
            'recipient': self.admin.id, 'title': 'Hello', 'message': 'Test',
        }, format='json')
        self.assertEqual(resp.status_code, 403)


class NotificationListTest(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.notif = Notification.objects.create(
            sender=self.emp, recipient=self.admin, project=self.project,
            category='photo_low', priority='high',
            title='Low photos', message='Only 3 left.')

    def test_admin_sees_received_notifications(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.get('/api/notifications/')
        self.assertEqual(len(resp.data['results']), 1)
        self.assertEqual(resp.data['results'][0]['title'], 'Low photos')

    def test_employee_sees_sent_notifications(self):
        api = self.auth('rea', 'Rea12345!')
        resp = api.get('/api/notifications/')
        self.assertEqual(len(resp.data['results']), 1)


class NotificationReadTest(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.notif = Notification.objects.create(
            sender=self.emp, recipient=self.admin,
            title='Test', message='Test msg')

    def test_mark_single_read(self):
        api = self.auth('admin', 'Admin123!')
        resp = api.post(f'/api/notifications/{self.notif.id}/read/')
        self.assertEqual(resp.status_code, 200)
        self.notif.refresh_from_db()
        self.assertTrue(self.notif.is_read)

    def test_mark_all_read(self):
        Notification.objects.create(
            sender=self.emp, recipient=self.admin, title='T2', message='M2')
        api = self.auth('admin', 'Admin123!')
        resp = api.post('/api/notifications/mark-all-read/')
        self.assertEqual(resp.status_code, 200)
        unread = Notification.objects.filter(recipient=self.admin, is_read=False).count()
        self.assertEqual(unread, 0)

    def test_unread_count(self):
        Notification.objects.create(
            sender=self.emp, recipient=self.admin, title='T2', message='M2')
        api = self.auth('admin', 'Admin123!')
        resp = api.get('/api/notifications/unread-count/')
        self.assertEqual(resp.data['unread_count'], 2)

    def test_mark_read_wrong_user(self):
        """Employee cannot mark admin's notification as read."""
        api = self.auth('rea', 'Rea12345!')
        resp = api.post(f'/api/notifications/{self.notif.id}/read/')
        self.assertEqual(resp.status_code, 404)
        self.notif.refresh_from_db()
        self.assertFalse(self.notif.is_read)
