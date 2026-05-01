from datetime import date
from django.db import models
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import (
    ClientProfile, Business, Project, ProjectService, MonthlyPlan, Deliverable,
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
    EngagementSerializer,
)
from accounts.permissions import IsAdmin, IsAdminOrEmployee, IsClient, IsSupervisor, IsAdminOrSupervisor, IsSupervisorOrEconomist


# --- Client profile ---

class ClientProfileListView(generics.ListCreateAPIView):
    serializer_class = ClientProfileSerializer
    # Admin / supervisor / economist can read the client list; admin/supervisor
    # write. Per-method gating in perform_create.
    permission_classes = [IsSupervisorOrEconomist]

    def perform_create(self, serializer):
        u = self.request.user
        if not (u.role == 'admin' or u.is_supervisor):
            raise PermissionDenied('Only admins and supervisors can create clients.')
        serializer.save()

    def get_queryset(self):
        return ClientProfile.objects.select_related('user').prefetch_related('businesses__services').all()

    def create(self, request, *args, **kwargs):
        # Only admin / supervisor can create or upsert clients.
        u = request.user
        if not (u.role == 'admin' or u.is_supervisor):
            raise PermissionDenied('Only admins and supervisors can create clients.')
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
        # Supervisors share admin scope for client/business reads.
        if self.request.user.is_supervisor:
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
        u = self.request.user
        if u.is_supervisor:  # admin OR supervisor employee
            qs = Business.objects.all()
        elif u.role == 'employee':
            # Non-supervisor employees only see businesses they have assigned deliverables on
            project_ids = Deliverable.objects.filter(
                assigned_to=u
            ).values_list(
                'monthly_plan__project_service__business_id', flat=True
            ).distinct()
            qs = Business.objects.filter(id__in=project_ids)
        else:
            qs = Business.objects.filter(client__user=u)
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
        u = self.request.user
        qs = Business.objects.select_related('client').prefetch_related(
            'services__monthly_plans__deliverables__assigned_to',
            'services__monthly_plans__reports__uploaded_by',
        )
        if u.is_supervisor:  # admin OR supervisor employee
            return qs
        if u.role == 'employee':
            project_ids = Deliverable.objects.filter(
                assigned_to=u
            ).values_list(
                'monthly_plan__project_service__business_id', flat=True
            ).distinct()
            return qs.filter(id__in=project_ids)
        return qs.filter(client__user=u)


# --- Business Services ---

class ProjectServiceListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectServiceSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role == 'client':
            raise PermissionDenied('Clients cannot create services.')
        # Auto-fill engagement (project) FK if caller passed only business — defaults
        # to the active local-seo engagement under that business so legacy clients
        # don't leave services orphaned from an engagement.
        if not serializer.validated_data.get('project'):
            biz = serializer.validated_data.get('business')
            if biz is not None:
                default_project = (
                    Project.objects.filter(business=biz, status='active')
                    .order_by('id').first()
                    or Project.objects.filter(business=biz).order_by('id').first()
                )
                if default_project:
                    serializer.validated_data['project'] = default_project
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
            qs = ProjectService.objects.filter(business__client__user=self.request.user)
        business_id = self.request.query_params.get('business') or self.request.query_params.get('project')
        if business_id:
            qs = qs.filter(business_id=business_id)
        engagement_id = self.request.query_params.get('engagement')
        if engagement_id:
            qs = qs.filter(project_id=engagement_id)
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
        return ProjectService.objects.filter(business__client__user=self.request.user)


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
            qs = MonthlyPlan.objects.filter(project_service__business__client__user=self.request.user)

        business_id = self.request.query_params.get('business') or self.request.query_params.get('project')
        if business_id:
            qs = qs.filter(project_service__business_id=business_id)
        engagement_id = self.request.query_params.get('engagement')
        if engagement_id:
            qs = qs.filter(project_service__project_id=engagement_id)
        service_id = self.request.query_params.get('service')
        if service_id:
            qs = qs.filter(project_service_id=service_id)
        client_id = self.request.query_params.get('client')
        if client_id:
            qs = qs.filter(project_service__business__client_id=client_id)
        month = self.request.query_params.get('month')
        if month:
            qs = qs.filter(month=month)
        return qs.select_related(
            'project_service__business__client'
        ).prefetch_related('deliverables__assigned_to', 'reports__uploaded_by')


class MonthlyPlanDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MonthlyPlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role in ('admin', 'employee'):
            return MonthlyPlan.objects.all()
        return MonthlyPlan.objects.filter(project_service__business__client__user=self.request.user)

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
        u = self.request.user
        if u.is_supervisor:  # admin OR supervisor employee — full access for review queue
            qs = Deliverable.objects.all()
        elif u.role == 'employee':
            qs = Deliverable.objects.filter(assigned_to=u)
        elif u.role == 'client':
            # Approval gate: clients only see client_visible items that either
            # don't require approval or have been explicitly approved.
            qs = Deliverable.objects.filter(
                monthly_plan__project_service__business__client__user=u,
                client_visible=True,
            ).filter(
                models.Q(requires_approval=False) | models.Q(approved_at__isnull=False)
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
        approval = self.request.query_params.get('approval_state')
        if approval == 'submitted':
            qs = qs.filter(submitted_at__isnull=False, approved_at__isnull=True, rejection_reason='')
        elif approval == 'approved':
            qs = qs.filter(approved_at__isnull=False)
        elif approval == 'rejected':
            qs = qs.filter(submitted_at__isnull=False, approved_at__isnull=True).exclude(rejection_reason='')
        elif approval == 'draft':
            qs = qs.filter(submitted_at__isnull=True)
        return qs.select_related(
            'assigned_to', 'submitted_by', 'approved_by',
            'monthly_plan__project_service__business__client',
        )


class DeliverableDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DeliverableSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        u = self.request.user
        if u.role == 'client':
            raise PermissionDenied('Clients cannot modify deliverables.')
        if u.role == 'employee':
            instance = self.get_object()
            if instance.assigned_to_id != u.id:
                raise PermissionDenied('Employees can only modify their own assigned deliverables.')
        serializer.save()

    def perform_destroy(self, instance):
        u = self.request.user
        if u.role == 'client':
            raise PermissionDenied('Clients cannot delete deliverables.')
        if u.role == 'employee':
            raise PermissionDenied('Employees cannot delete deliverables.')
        instance.delete()

    def get_queryset(self):
        u = self.request.user
        if u.is_supervisor:
            return Deliverable.objects.all()
        if u.role == 'employee':
            return Deliverable.objects.filter(assigned_to=u)
        if u.role == 'client':
            return Deliverable.objects.filter(
                monthly_plan__project_service__business__client__user=u,
                client_visible=True,
            ).filter(
                models.Q(requires_approval=False) | models.Q(approved_at__isnull=False)
            )
        return Deliverable.objects.all()


# --- Deliverable approval workflow ---

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deliverable_submit(request, pk):
    """Employee (or admin/supervisor on their behalf) marks a deliverable
    as submitted for review."""
    u = request.user
    try:
        d = Deliverable.objects.get(pk=pk)
    except Deliverable.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    if u.role == 'client':
        raise PermissionDenied('Clients cannot submit deliverables.')
    if u.role == 'employee' and d.assigned_to_id != u.id:
        raise PermissionDenied('Employees can only submit their own assigned deliverables.')
    from django.utils import timezone
    d.submitted_at = timezone.now()
    d.submitted_by = u
    # Reopening: clear prior rejection so the supervisor sees this as a fresh
    # submission rather than a stale rejection.
    d.rejection_reason = ''
    d.approved_at = None
    d.approved_by = None
    d.save(update_fields=['submitted_at', 'submitted_by', 'rejection_reason', 'approved_at', 'approved_by', 'updated_at'])
    return Response(DeliverableSerializer(d, context={'request': request}).data)


@api_view(['POST'])
@permission_classes([IsAdminOrSupervisor])
def deliverable_approve(request, pk):
    """Supervisor / admin approves a submitted deliverable."""
    try:
        d = Deliverable.objects.get(pk=pk)
    except Deliverable.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    if not d.submitted_at:
        return Response({'detail': 'Deliverable has not been submitted for review.'}, status=status.HTTP_400_BAD_REQUEST)
    from django.utils import timezone
    d.approved_at = timezone.now()
    d.approved_by = request.user
    d.rejection_reason = ''
    d.save(update_fields=['approved_at', 'approved_by', 'rejection_reason', 'updated_at'])
    return Response(DeliverableSerializer(d, context={'request': request}).data)


@api_view(['POST'])
@permission_classes([IsAdminOrSupervisor])
def deliverable_reject(request, pk):
    """Supervisor / admin rejects a submitted deliverable with a reason."""
    reason = (request.data.get('rejection_reason') or '').strip()
    if not reason:
        return Response({'detail': 'rejection_reason is required.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        d = Deliverable.objects.get(pk=pk)
    except Deliverable.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    if not d.submitted_at:
        return Response({'detail': 'Deliverable has not been submitted for review.'}, status=status.HTTP_400_BAD_REQUEST)
    d.rejection_reason = reason
    d.approved_at = None
    d.approved_by = None
    d.save(update_fields=['rejection_reason', 'approved_at', 'approved_by', 'updated_at'])
    return Response(DeliverableSerializer(d, context={'request': request}).data)


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
            qs = BusinessCatalogItem.objects.filter(business__client__user=user)
        business = self.request.query_params.get('business') or self.request.query_params.get('project')
        if business:
            qs = qs.filter(business_id=business)
        return qs


class BusinessCatalogDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BusinessCatalogItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ('admin', 'employee'):
            return BusinessCatalogItem.objects.all()
        return BusinessCatalogItem.objects.filter(business__client__user=user)


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
            qs = QuarterlyPlan.objects.filter(business__client__user=user)
        business = self.request.query_params.get('business') or self.request.query_params.get('project')
        if business:
            qs = qs.filter(business_id=business)
        status_q = self.request.query_params.get('status')
        if status_q:
            qs = qs.filter(status=status_q)
        return qs.select_related('business__client', 'project', 'created_by').prefetch_related('monthly_plans')


class QuarterlyPlanDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuarterlyPlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ('admin', 'employee'):
            return QuarterlyPlan.objects.all()
        return QuarterlyPlan.objects.filter(business__client__user=user)

    def perform_update(self, serializer):
        if self.request.user.role == 'client':
            raise PermissionDenied('Clients cannot modify quarterly plans.')
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.role == 'client':
            raise PermissionDenied('Clients cannot delete quarterly plans.')
        instance.delete()


# --- Engagements (the new clients.Project model — sits under Business) ---

class EngagementListCreateView(generics.ListCreateAPIView):
    serializer_class = EngagementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Project.objects.select_related('business__client')
        if user.role == 'client':
            qs = qs.filter(business__client__user=user)
        elif user.role == 'employee' and not user.is_supervisor:
            # Non-supervisor employees: only engagements where they have assigned deliverables.
            engagement_ids = Deliverable.objects.filter(
                assigned_to=user,
            ).values_list('monthly_plan__project_service__project_id', flat=True).distinct()
            qs = qs.filter(id__in=engagement_ids)
        # ?business=<slug> or ?business=<id> filter
        business = self.request.query_params.get('business')
        if business:
            if business.isdigit():
                qs = qs.filter(business_id=business)
            else:
                qs = qs.filter(business__slug=business)
        # ?status= filter
        status_q = self.request.query_params.get('status')
        if status_q:
            qs = qs.filter(status=status_q)
        return qs.order_by('status', '-created_at')

    def perform_create(self, serializer):
        if self.request.user.role == 'client':
            raise PermissionDenied('Clients cannot create engagements.')
        if self.request.user.role == 'employee' and not self.request.user.is_supervisor:
            raise PermissionDenied('Only supervisors and admins can create engagements.')
        serializer.save(created_by=self.request.user)


class EngagementDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EngagementSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Support /engagements/by-slug/<business>/<engagement>/ lookups.
        # Use the role-scoped get_queryset so clients only see their own.
        if 'business_slug' in self.kwargs and 'project_slug' in self.kwargs:
            qs = self.get_queryset()
            obj = qs.filter(
                business__slug=self.kwargs['business_slug'],
                slug=self.kwargs['project_slug'],
            ).first()
            if not obj:
                from django.http import Http404
                raise Http404('Engagement not found.')
            self.check_object_permissions(self.request, obj)
            return obj
        return super().get_object()

    def get_queryset(self):
        user = self.request.user
        qs = Project.objects.select_related('business__client')
        if user.role == 'client':
            qs = qs.filter(business__client__user=user)
        return qs

    def perform_update(self, serializer):
        if self.request.user.role == 'client':
            raise PermissionDenied('Clients cannot modify engagements.')
        if self.request.user.role == 'employee' and not self.request.user.is_supervisor:
            raise PermissionDenied('Only supervisors and admins can modify engagements.')
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.role == 'client':
            raise PermissionDenied('Clients cannot delete engagements.')
        if self.request.user.role == 'employee' and not self.request.user.is_supervisor:
            raise PermissionDenied('Only supervisors and admins can delete engagements.')
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
