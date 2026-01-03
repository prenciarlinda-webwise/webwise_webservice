from django.urls import path
from .views import ClientKeywordListView

urlpatterns = [
    path('keywords/', ClientKeywordListView.as_view(), name='client-keywords'),
]
