from datetime import date
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import (
    ClientProfile, Project, ProjectService, MonthlyPlan, Deliverable,
    ServiceTemplate, TemplateDeliverable, BusinessCatalogItem,
    QuarterlyPlan, Location,
)
from .serializers import (
    ClientProfileSerializer, ProjectSerializer, ProjectDetailSerializer,
    ProjectServiceSerializer, ProjectServiceDetailSerializer,
    MonthlyPlanSerializer, DeliverableSerializer,
    ServiceTemplateSerializer, TemplateDeliverableSerializer,
    BusinessCatalogItemSerializer,
    QuarterlyPlanSerializer, LocationSerializer,
)
from accounts.permissions import IsAdmin, IsAdminOrEmployee, IsClient


# --- Client profile ---

class ClientProfileListView(generics.ListCreateAPIView):
    serializer_class = ClientProfileSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        return ClientProfile.objects.select_related('user').prefetch_related('projects__services').all()

    def create(self, request, *args, **kwargs):
        # Upsert by user FK. RegisterSerializer auto-creates an empty profile
        # when role=client; the frontend's "Add client" flow follows up with
        # a POST /clients/ to fill the business fields. Treat that as an update
        # instead of a duplicate-insert error.
        user_id = request.data.get('user')
        if user_id:
            existing = ClientProfile.objects.filter(user_id=user_id).first()
            if existing:
                serializer = self.get_serializer(existing, data=request.data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
        return super().create(request, *args, **kwargs)


class ClientProfileDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ClientProfileSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def get_object(self):
        slug = self.kwargs.get('slug')
        if slug:
            self.lookup_field = 'slug'
            self.kwargs['slug'] = slug
        return super().get_object()

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return ClientProfile.objects.all()
        return ClientProfile.objects.filter(user=self.request.user)


class MyClientProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ClientProfileSerializer
    permission_classes = [IsClient]

    def get_object(self):
        profile, _ = ClientProfile.objects.get_or_create(
            user=self.request.user,
            defaults={'business_name': self.request.user.get_full_name() or self.request.user.username},
        )
        return profile


# --- Projects ---

class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role == 'client':
            profile, _ = ClientProfile.objects.get_or_create(
                user=self.request.user,
                defaults={
                    'business_name': self.request.user.get_full_name() or self.request.user.username,
                    'business_email': self.request.user.email,
                    'business_phone': self.request.user.phone,
                },
            )
            serializer.save(client=profile)
        else:
            serializer.save()

    def get_queryset(self):
        if self.request.user.role == 'admin':
            qs = Project.objects.all()
        elif self.request.user.role == 'employee':
            # Employees only see projects where they have assigned deliverables
            project_ids = Deliverable.objects.filter(
                assigned_to=self.request.user
            ).values_list(
                'monthly_plan__project_service__project_id', flat=True
            ).distinct()
            qs = Project.objects.filter(id__in=project_ids)
        else:
            qs = Project.objects.filter(client__user=self.request.user)
        client_id = self.request.query_params.get('client')
        if client_id:
            qs = qs.filter(client_id=client_id)
        return qs.select_related('client').prefetch_related('services')


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def get_object(self):
        slug = self.kwargs.get('slug')
        if slug:
            self.lookup_field = 'slug'
            self.kwargs['slug'] = slug
        return super().get_object()

    def perform_destroy(self, instance):
        if self.request.user.role == 'client':
            raise PermissionDenied('Clients cannot delete projects.')
        instance.delete()

    def get_queryset(self):
        qs = Project.objects.select_related('client').prefetch_related(
            'services__monthly_plans__deliverables__assigned_to',
            'services__monthly_plans__reports__uploaded_by',
        )
        if self.request.user.role == 'admin':
            return qs
        if self.request.user.role == 'employee':
            # Employees only see projects where they have assigned deliverables
            project_ids = Deliverable.objects.filter(
                assigned_to=self.request.user
            ).values_list(
                'monthly_plan__project_service__project_id', flat=True
            ).distinct()
            return qs.filter(id__in=project_ids)
        return qs.filter(client__user=self.request.user)


# --- Project Services ---

class ProjectServiceListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectServiceSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role == 'client':
            raise PermissionDenied('Clients cannot create services.')
        service = serializer.save()
        template_id = self.request.data.get('template_id')
        if template_id:
            try:
                template = ServiceTemplate.objects.get(id=template_id)
            except ServiceTemplate.DoesNotExist:
                return
            today = date.today()
            month = today.replace(day=1)
            plan = MonthlyPlan.objects.create(
                project_service=service,
                month=month,
                status='planned',
            )
            items = template.deliverables.all()
            deliverables = [
                Deliverable(
                    monthly_plan=plan,
                    category=item.category,
                    title=item.title,
                    description=item.description,
                    frequency=item.frequency,
                    quantity=item.quantity,
                    estimated_minutes=item.estimated_minutes,
                    sort_order=item.sort_order,
                )
                for item in items
            ]
            Deliverable.objects.bulk_create(deliverables)

    def get_queryset(self):
        if self.request.user.role in ('admin', 'employee'):
            qs = ProjectService.objects.all()
        else:
            qs = ProjectService.objects.filter(project__client__user=self.request.user)
        project_id = self.request.query_params.get('project')
        if project_id:
            qs = qs.filter(project_id=project_id)
        return qs


class ProjectServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectServiceSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        if self.request.user.role == 'client':
            raise PermissionDenied('Clients cannot modify services.')
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.role == 'client':
            raise PermissionDenied('Clients cannot delete services.')
        instance.delete()

    def get_queryset(self):
        if self.request.user.role in ('admin', 'employee'):
            return ProjectService.objects.all()
        return ProjectService.objects.filter(project__client__user=self.request.user)


# --- Monthly Plans ---

class MonthlyPlanListCreateView(generics.ListCreateAPIView):
    serializer_class = MonthlyPlanSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role == 'client':
            raise PermissionDenied('Clients cannot create monthly plans.')
        serializer.save()

    def get_queryset(self):
        if self.request.user.role in ('admin', 'employee'):
            qs = MonthlyPlan.objects.all()
        else:
            qs = MonthlyPlan.objects.filter(project_service__project__client__user=self.request.user)

        project_id = self.request.query_params.get('project')
        if project_id:
            qs = qs.filter(project_service__project_id=project_id)
        service_id = self.request.query_params.get('service')
        if service_id:
            qs = qs.filter(project_service_id=service_id)
        client_id = self.request.query_params.get('client')
        if client_id:
            qs = qs.filter(project_service__project__client_id=client_id)
        month = self.request.query_params.get('month')
        if month:
            qs = qs.filter(month=month)
        return qs.select_related(
            'project_service__project__client'
        ).prefetch_related('deliverables__assigned_to', 'reports__uploaded_by')


class MonthlyPlanDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MonthlyPlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role in ('admin', 'employee'):
            return MonthlyPlan.objects.all()
        return MonthlyPlan.objects.filter(project_service__project__client__user=self.request.user)

    def perform_destroy(self, instance):
        if self.request.user.role == 'client':
            raise PermissionDenied('Clients cannot delete monthly plans.')
        instance.delete()

    def perform_update(self, serializer):
        if self.request.user.role == 'client':
            raise PermissionDenied('Clients cannot modify monthly plans.')
        old_status = serializer.instance.status
        plan = serializer.save()
        # Auto-create payment when plan is completed and service has a monthly price
        if old_status != 'completed' and plan.status == 'completed':
            service = plan.project_service
            if service.monthly_price and not plan.payments.exists():
                from payments.models import Payment
                from calendar import monthrange
                last_day = monthrange(plan.month.year, plan.month.month)[1]
                Payment.objects.create(
                    project_service=service,
                    monthly_plan=plan,
                    amount=service.monthly_price,
                    payment_type='predetermined',
                    status='pending',
                    description=f'{service.name} — {plan.month.strftime("%B %Y")}',
                    due_date=plan.month.replace(day=last_day),
                )


# --- Deliverables ---

class DeliverableListCreateView(generics.ListCreateAPIView):
    serializer_class = DeliverableSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role == 'client':
            raise PermissionDenied('Clients cannot create deliverables.')
        # Employees auto-assign deliverables to themselves
        if self.request.user.role == 'employee':
            serializer.save(assigned_to=self.request.user)
        else:
            serializer.save()

    def get_queryset(self):
        if self.request.user.role == 'employee':
            qs = Deliverable.objects.filter(assigned_to=self.request.user)
        elif self.request.user.role == 'client':
            qs = Deliverable.objects.filter(
                monthly_plan__project_service__project__client__user=self.request.user
            )
        else:
            qs = Deliverable.objects.all()

        plan_id = self.request.query_params.get('plan')
        if plan_id:
            qs = qs.filter(monthly_plan_id=plan_id)
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        assigned = self.request.query_params.get('assigned_to')
        if assigned:
            qs = qs.filter(assigned_to_id=assigned)
        return qs.select_related('assigned_to', 'monthly_plan__project_service__project__client')


class DeliverableDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DeliverableSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        if self.request.user.role == 'client':
            raise PermissionDenied('Clients cannot modify deliverables.')
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.role == 'client':
            raise PermissionDenied('Clients cannot delete deliverables.')
        instance.delete()

    def get_queryset(self):
        if self.request.user.role == 'employee':
            return Deliverable.objects.filter(assigned_to=self.request.user)
        if self.request.user.role == 'client':
            return Deliverable.objects.filter(
                monthly_plan__project_service__project__client__user=self.request.user
            )
        return Deliverable.objects.all()


# --- Service Templates ---

class ServiceTemplateListCreateView(generics.ListCreateAPIView):
    serializer_class = ServiceTemplateSerializer
    permission_classes = [IsAdmin]
    queryset = ServiceTemplate.objects.prefetch_related('deliverables').all()


class ServiceTemplateDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ServiceTemplateSerializer
    permission_classes = [IsAdmin]
    queryset = ServiceTemplate.objects.all()


class TemplateDeliverableListCreateView(generics.ListCreateAPIView):
    serializer_class = TemplateDeliverableSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        template_id = self.request.query_params.get('template')
        qs = TemplateDeliverable.objects.all()
        if template_id:
            qs = qs.filter(template_id=template_id)
        return qs


class TemplateDeliverableDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TemplateDeliverableSerializer
    permission_classes = [IsAdmin]
    queryset = TemplateDeliverable.objects.all()


# --- Apply template to create a monthly plan ---

@api_view(['POST'])
@permission_classes([IsAdmin])
def apply_template(request):
    """Create a monthly plan from a template.

    POST body: { "template_id": 1, "project_service_id": 2, "month": "2026-03-01", "assigned_to": 5 }
    """
    template_id = request.data.get('template_id')
    service_id = request.data.get('project_service_id')
    month_str = request.data.get('month')
    default_assignee = request.data.get('assigned_to')

    try:
        template = ServiceTemplate.objects.get(id=template_id)
        service = ProjectService.objects.get(id=service_id)
    except (ServiceTemplate.DoesNotExist, ProjectService.DoesNotExist):
        return Response({'error': 'Template or service not found.'}, status=status.HTTP_404_NOT_FOUND)

    month = date.fromisoformat(month_str)
    plan, created = MonthlyPlan.objects.get_or_create(
        project_service=service,
        month=month,
        defaults={'status': 'planned'},
    )

    template_items = template.deliverables.all()
    deliverables = []
    for item in template_items:
        deliverables.append(Deliverable(
            monthly_plan=plan,
            category=item.category,
            title=item.title,
            description=item.description,
            frequency=item.frequency,
            quantity=item.quantity,
            estimated_minutes=item.estimated_minutes,
            sort_order=item.sort_order,
            assigned_to_id=default_assignee,
        ))
    Deliverable.objects.bulk_create(deliverables)

    plan.refresh_from_db()
    serializer = MonthlyPlanSerializer(plan)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


# --- Business Catalog ---

class BusinessCatalogListCreateView(generics.ListCreateAPIView):
    serializer_class = BusinessCatalogItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ('admin', 'employee'):
            qs = BusinessCatalogItem.objects.all()
        else:
            qs = BusinessCatalogItem.objects.filter(project__client__user=user)
        project = self.request.query_params.get('project')
        if project:
            qs = qs.filter(project_id=project)
        return qs


class BusinessCatalogDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BusinessCatalogItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ('admin', 'employee'):
            return BusinessCatalogItem.objects.all()
        return BusinessCatalogItem.objects.filter(project__client__user=user)


# --- Quarterly Plans ---

class QuarterlyPlanListCreateView(generics.ListCreateAPIView):
    serializer_class = QuarterlyPlanSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role == 'client':
            raise PermissionDenied('Clients cannot create quarterly plans.')
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if user.role in ('admin', 'employee'):
            qs = QuarterlyPlan.objects.all()
        else:
            qs = QuarterlyPlan.objects.filter(project__client__user=user)
        project = self.request.query_params.get('project')
        if project:
            qs = qs.filter(project_id=project)
        status_q = self.request.query_params.get('status')
        if status_q:
            qs = qs.filter(status=status_q)
        return qs.select_related('project__client', 'created_by').prefetch_related('monthly_plans')


class QuarterlyPlanDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuarterlyPlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ('admin', 'employee'):
            return QuarterlyPlan.objects.all()
        return QuarterlyPlan.objects.filter(project__client__user=user)

    def perform_update(self, serializer):
        if self.request.user.role == 'client':
            raise PermissionDenied('Clients cannot modify quarterly plans.')
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.role == 'client':
            raise PermissionDenied('Clients cannot delete quarterly plans.')
        instance.delete()


# --- DataForSEO Location picker (read-only lookup) ---

class LocationListView(generics.ListAPIView):
    """Search locations for the SERP / Maps targeting picker."""
    serializer_class = LocationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None  # picker is autocomplete-style; client paginates by query

    def get_queryset(self):
        qs = Location.objects.all()
        q = self.request.query_params.get('q')
        if q:
            qs = qs.filter(location_name__icontains=q)
        country = self.request.query_params.get('country')
        if country:
            qs = qs.filter(country_iso_code__iexact=country)
        return qs[:50]
