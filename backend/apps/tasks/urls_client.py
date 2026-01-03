from django.urls import path
from .views import ClientTaskListView

urlpatterns = [
    path('tasks/', ClientTaskListView.as_view(), name='client-tasks'),
]
