from django.urls import path
from . import views

urlpatterns = [
    path('', views.EmployeeListView.as_view(), name='employee_list'),
    path('<int:pk>/', views.EmployeeDetailView.as_view(), name='employee_detail'),
    path('tasks/', views.TaskLogListCreateView.as_view(), name='task_list'),
    path('tasks/<int:pk>/', views.TaskLogDetailView.as_view(), name='task_detail'),
]
