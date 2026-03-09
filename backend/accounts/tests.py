from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


class TestHelpers:
    @staticmethod
    def create_admin():
        return User.objects.create_user(username='admin', password='Admin1234!', role='admin', first_name='Admin', last_name='User')

    @staticmethod
    def create_employee():
        return User.objects.create_user(username='employee', password='Emp12345!', role='employee', first_name='Emp', last_name='User')

    @staticmethod
    def create_client():
        return User.objects.create_user(username='clientuser', password='Client12!', role='client', first_name='Client', last_name='User')

    @staticmethod
    def get_auth_client(user):
        client = APIClient()
        resp = client.post('/api/auth/token/', {'username': user.username, 'password': user.username == 'admin' and 'Admin1234!' or user.username == 'employee' and 'Emp12345!' or 'Client12!'})
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {resp.data["access"]}')
        return client


class UserModelTest(TestCase):
    def test_role_properties(self):
        admin = User.objects.create_user(username='a', password='test1234', role='admin')
        emp = User.objects.create_user(username='e', password='test1234', role='employee')
        cli = User.objects.create_user(username='c', password='test1234', role='client')
        self.assertTrue(admin.is_admin_user)
        self.assertFalse(admin.is_employee)
        self.assertTrue(emp.is_employee)
        self.assertFalse(emp.is_admin_user)
        self.assertTrue(cli.is_client)
        self.assertFalse(cli.is_admin_user)

    def test_default_role_is_client(self):
        user = User.objects.create_user(username='x', password='test1234')
        self.assertEqual(user.role, 'client')


class RegisterTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_client(self):
        resp = self.client.post('/api/auth/register/', {
            'username': 'newuser', 'password': 'NewPass12!',
            'email': 'new@test.com', 'first_name': 'New', 'last_name': 'User',
        })
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data['role'], 'client')

    def test_register_employee_role(self):
        resp = self.client.post('/api/auth/register/', {
            'username': 'emp1', 'password': 'EmpPass12!',
            'email': 'emp@test.com', 'first_name': 'Emp', 'last_name': 'One', 'role': 'employee',
        })
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data['role'], 'employee')

    def test_register_short_password_fails(self):
        resp = self.client.post('/api/auth/register/', {
            'username': 'short', 'password': '1234567',
            'email': 'x@test.com', 'first_name': 'A', 'last_name': 'B',
        })
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_duplicate_username_fails(self):
        User.objects.create_user(username='taken', password='Pass1234!')
        resp = self.client.post('/api/auth/register/', {
            'username': 'taken', 'password': 'Pass1234!',
            'email': 'x@test.com', 'first_name': 'A', 'last_name': 'B',
        })
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)


class LoginTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='loginuser', password='Login123!')
        self.client = APIClient()

    def test_login_success(self):
        resp = self.client.post('/api/auth/token/', {'username': 'loginuser', 'password': 'Login123!'})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn('access', resp.data)
        self.assertIn('refresh', resp.data)

    def test_login_wrong_password(self):
        resp = self.client.post('/api/auth/token/', {'username': 'loginuser', 'password': 'wrong'})
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_refresh(self):
        resp = self.client.post('/api/auth/token/', {'username': 'loginuser', 'password': 'Login123!'})
        refresh = resp.data['refresh']
        resp2 = self.client.post('/api/auth/token/refresh/', {'refresh': refresh})
        self.assertEqual(resp2.status_code, status.HTTP_200_OK)
        self.assertIn('access', resp2.data)


class MeViewTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='meuser', password='MePass12!', role='admin',
            first_name='Me', last_name='User', phone='123456',
        )
        self.api = APIClient()
        resp = self.api.post('/api/auth/token/', {'username': 'meuser', 'password': 'MePass12!'})
        self.api.credentials(HTTP_AUTHORIZATION=f'Bearer {resp.data["access"]}')

    def test_get_me(self):
        resp = self.api.get('/api/auth/me/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['username'], 'meuser')
        self.assertEqual(resp.data['role'], 'admin')

    def test_update_me(self):
        resp = self.api.patch('/api/auth/me/', {'first_name': 'Updated'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['first_name'], 'Updated')

    def test_unauthenticated_rejected(self):
        client = APIClient()
        resp = client.get('/api/auth/me/')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)


class ChangePasswordTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='pwuser', password='OldPass12!')
        self.api = APIClient()
        resp = self.api.post('/api/auth/token/', {'username': 'pwuser', 'password': 'OldPass12!'})
        self.api.credentials(HTTP_AUTHORIZATION=f'Bearer {resp.data["access"]}')

    def test_change_password_success(self):
        resp = self.api.post('/api/auth/me/password/', {
            'old_password': 'OldPass12!', 'new_password': 'NewPass12!',
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('NewPass12!'))

    def test_change_password_wrong_old(self):
        resp = self.api.post('/api/auth/me/password/', {
            'old_password': 'WrongOld!', 'new_password': 'NewPass12!',
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)


class UserListTest(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username='adm', password='Admin123!', role='admin')
        self.emp = User.objects.create_user(username='emp', password='Emp12345!', role='employee')
        self.cli = User.objects.create_user(username='cli', password='Client12!', role='client')

    def _auth(self, user, pw):
        api = APIClient()
        resp = api.post('/api/auth/token/', {'username': user, 'password': pw})
        api.credentials(HTTP_AUTHORIZATION=f'Bearer {resp.data["access"]}')
        return api

    def test_admin_can_list_users(self):
        api = self._auth('adm', 'Admin123!')
        resp = api.get('/api/auth/users/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data['results']), 3)

    def test_admin_filter_by_role(self):
        api = self._auth('adm', 'Admin123!')
        resp = api.get('/api/auth/users/?role=employee')
        self.assertEqual(len(resp.data['results']), 1)
        self.assertEqual(resp.data['results'][0]['role'], 'employee')

    def test_employee_cannot_list_users(self):
        api = self._auth('emp', 'Emp12345!')
        resp = api.get('/api/auth/users/')
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_delete_user(self):
        api = self._auth('adm', 'Admin123!')
        resp = api.delete(f'/api/auth/users/{self.cli.id}/')
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(id=self.cli.id).exists())
