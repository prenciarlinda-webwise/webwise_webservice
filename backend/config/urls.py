from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/clients/', include('clients.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/employees/', include('employees.urls')),
    path('api/notifications/', include('notifications.urls')),
    # SEO module — DataForSEO-backed rankings only (plus keyword/competitor/discovery deps).
    path('api/seo/', include('apps.keywords.urls')),
    path('api/seo/', include('apps.rankings.urls')),
    path('api/seo/', include('apps.discovery.urls')),
    path('api/seo/', include('apps.competitors.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
