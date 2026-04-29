from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model

from clients.models import ClientProfile
from employees.models import EmployeeProfile

User = get_user_model()


class ClientProfileInline(admin.StackedInline):
    model = ClientProfile
    can_delete = False
    extra = 0
    min_num = 1
    max_num = 1
    fk_name = 'user'
    verbose_name = 'Client business info'
    verbose_name_plural = 'Client business info'
    fieldsets = (
        (None, {
            'fields': ('business_name', 'business_phone', 'business_email'),
        }),
        ('Catalog (JSON)', {
            'classes': ('collapse',),
            'fields': ('services', 'products', 'price_per_service', 'service_locations', 'social_links'),
        }),
        ('Notes', {
            'classes': ('collapse',),
            'fields': ('notes',),
        }),
    )


class EmployeeProfileInline(admin.StackedInline):
    model = EmployeeProfile
    can_delete = False
    extra = 0
    min_num = 1
    max_num = 1
    fk_name = 'user'
    verbose_name = 'Employee details'
    verbose_name_plural = 'Employee details'
    fields = ('category', 'hourly_rate', 'is_active')


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'is_active']
    list_filter = ['role', 'is_active']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Role', {'fields': ('role', 'phone')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Role', {'fields': ('role', 'phone', 'email', 'first_name', 'last_name')}),
    )

    def get_inline_instances(self, request, obj=None):
        # On the Add page (obj is None) we don't show role-specific inlines:
        # role gets set on save, then the change page shows the right inline.
        if obj is None:
            return []
        inlines = []
        if obj.role == 'client':
            inlines.append(ClientProfileInline(self.model, self.admin_site))
        elif obj.role == 'employee':
            inlines.append(EmployeeProfileInline(self.model, self.admin_site))
        return inlines

    def response_add(self, request, obj, post_url_continue=None):
        # After creating a User, send admin to the change page so they can
        # fill the role-specific inline (ClientProfile / EmployeeProfile).
        # The "save and add another" / "save" buttons would otherwise leave
        # business info blank — which is exactly the bug we're fixing.
        from django.urls import reverse
        from django.http import HttpResponseRedirect
        if '_addanother' in request.POST or '_continue' in request.POST:
            return super().response_add(request, obj, post_url_continue)
        url = reverse('admin:%s_%s_change' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])
        return HttpResponseRedirect(url)
