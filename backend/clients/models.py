from django.conf import settings
from django.db import models


class ClientProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='client_profile')
    business_name = models.CharField(max_length=200)
    business_phone = models.CharField(max_length=20, blank=True)
    business_email = models.EmailField(blank=True)
    services = models.JSONField(default=list, blank=True, help_text='List of services offered')
    products = models.JSONField(default=list, blank=True, help_text='List of products offered')
    price_per_service = models.JSONField(default=dict, blank=True, help_text='{"service_name": price}')
    service_locations = models.JSONField(default=list, blank=True, help_text='List of service areas')
    social_links = models.JSONField(default=dict, blank=True, help_text='{"platform": "url"}')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.business_name


class Project(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        PAUSED = 'paused', 'Paused'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'

    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE, related_name='projects')
    name = models.CharField(max_length=200, help_text='e.g. "904 Dumpster", "Prenga Construction"')
    business_phone = models.CharField(max_length=30, blank=True)
    business_email = models.EmailField(blank=True)
    business_address = models.CharField(max_length=300, blank=True)
    website_url = models.URLField(blank=True)
    # Extended NAP / business info
    business_hours = models.TextField(blank=True, help_text='e.g. "Mon-Fri 8AM-6PM, Sat 9AM-2PM"')
    service_areas = models.JSONField(default=list, blank=True, help_text='["Jacksonville FL", "Orange Park FL"]')
    google_business_url = models.URLField(blank=True, help_text='GBP listing URL')
    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    google_drive_url = models.URLField(blank=True, help_text='Internal Google Drive folder')
    # Business intel
    industry = models.CharField(max_length=100, blank=True, help_text='e.g. "Waste Management", "Roofing"')
    target_audience = models.JSONField(default=list, blank=True, help_text='["General Contractors", "Homeowners"]')
    competitors = models.JSONField(default=list, blank=True, help_text='[{"name": "Competitor A", "notes": "..."}]')
    usps = models.JSONField(default=list, blank=True, help_text='["Same-day delivery", "Driveway friendly"]')
    marketing_channels = models.JSONField(default=list, blank=True, help_text='["GMB", "Facebook Ads", "Citations"]')
    nap_status = models.CharField(max_length=50, blank=True, help_text='e.g. "High", "Cleaning in progress"')
    # Meta
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.client.business_name} — {self.name}"


class BusinessCatalogItem(models.Model):
    """Products and services a client's business offers — used for GBP, website, citations."""
    class ItemType(models.TextChoices):
        PRODUCT = 'product', 'Product'
        SERVICE = 'service', 'Service'

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='catalog')
    item_type = models.CharField(max_length=10, choices=ItemType.choices, default=ItemType.SERVICE)
    name = models.CharField(max_length=200, help_text='e.g. "10 Yard Dumpster", "Interior Painting"')
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_unit = models.CharField(max_length=50, blank=True, help_text='e.g. "per rental", "per sqft", "per month", "flat rate"')
    duration_days = models.PositiveIntegerField(null=True, blank=True, help_text='Rental/service duration in days')
    specifications = models.JSONField(default=dict, blank=True, help_text='Flexible specs: {"capacity": "2 tons", "dimensions": "12x8x4 ft"}')
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project.name} — {self.name}"

    class Meta:
        ordering = ['sort_order', 'name']


class ProjectService(models.Model):
    class Status(models.TextChoices):
        NOT_STARTED = 'not_started', 'Not Started'
        IN_PROGRESS = 'in_progress', 'In Progress'
        COMPLETED = 'completed', 'Completed'

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='services')
    name = models.CharField(max_length=200, help_text='e.g. "Local SEO", "Website Redesign"')
    description = models.TextField(blank=True)
    monthly_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NOT_STARTED)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project} — {self.name}"

    class Meta:
        verbose_name_plural = 'Project services'


class MonthlyPlan(models.Model):
    class Status(models.TextChoices):
        PLANNED = 'planned', 'Planned'
        IN_PROGRESS = 'in_progress', 'In Progress'
        COMPLETED = 'completed', 'Completed'

    project_service = models.ForeignKey(ProjectService, on_delete=models.CASCADE, related_name='monthly_plans')
    month = models.DateField(help_text='First day of the month (e.g. 2026-03-01)')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PLANNED)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.project_service} — {self.month.strftime('%B %Y')}"

    class Meta:
        unique_together = ['project_service', 'month']
        ordering = ['-month']


class Deliverable(models.Model):
    class Category(models.TextChoices):
        AUDIT = 'audit', 'Audit'
        GBP_POST = 'gbp_post', 'GBP Post'
        GBP_SETUP = 'gbp_setup', 'GBP Setup'
        BLOG_POST = 'blog_post', 'Blog Post'
        CONTENT = 'content', 'Content'
        CITATION = 'citation', 'Citation'
        BACKLINK = 'backlink', 'Backlink'
        ON_PAGE = 'on_page', 'On-Page SEO'
        TECHNICAL = 'technical', 'Technical SEO'
        AEO = 'aeo', 'AEO'
        REVIEW = 'review', 'Review Management'
        REPORTING = 'reporting', 'Reporting'
        SOCIAL = 'social', 'Social Media'
        DESIGN = 'design', 'Design'
        DEVELOPMENT = 'development', 'Development'
        LOGO = 'logo', 'Logo'
        BRANDING = 'branding', 'Branding'
        ADS = 'ads', 'Google Ads'
        LEADS = 'leads', 'Lead Platforms'
        COMPETITOR = 'competitor', 'Competitor Analysis'
        ACCOUNT = 'account', 'Account Management'
        QA = 'qa', 'QA'
        OTHER = 'other', 'Other'

    class Status(models.TextChoices):
        NOT_STARTED = 'not_started', 'Not Started'
        IN_PROGRESS = 'in_progress', 'In Progress'
        COMPLETED = 'completed', 'Completed'
        SCHEDULED = 'scheduled', 'Scheduled'
        PUBLISHED = 'published', 'Published'

    class Frequency(models.TextChoices):
        ONCE = 'once', 'Once'
        WEEKLY = 'weekly', 'Weekly'
        BI_WEEKLY = 'bi_weekly', 'Bi-Weekly'
        MONTHLY = 'monthly', 'Monthly'
        ONGOING = 'ongoing', 'Ongoing'
        DAILY = 'daily', 'Daily'
        AS_NEEDED = 'as_needed', 'As Needed'

    monthly_plan = models.ForeignKey(MonthlyPlan, on_delete=models.CASCADE, related_name='deliverables')
    category = models.CharField(max_length=20, choices=Category.choices)
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True, help_text='Details / specs')
    target_keyword = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NOT_STARTED)
    frequency = models.CharField(max_length=15, choices=Frequency.choices, default=Frequency.ONCE)
    quantity = models.PositiveIntegerField(default=1)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='assigned_deliverables',
    )
    link = models.URLField(blank=True, help_text='Draft / Google Drive link')
    live_url = models.URLField(blank=True, help_text='Published / live URL')
    start_date = models.DateField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    completed_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.get_category_display()}: {self.title}"

    class Meta:
        ordering = ['due_date', 'sort_order']


# --- Service Templates (predefined deliverable lists per package) ---

class ServiceTemplate(models.Model):
    name = models.CharField(max_length=200, help_text='e.g. "Premium Local SEO", "Launch Package"')
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class TemplateDeliverable(models.Model):
    template = models.ForeignKey(ServiceTemplate, on_delete=models.CASCADE, related_name='deliverables')
    category = models.CharField(max_length=20, choices=Deliverable.Category.choices)
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    frequency = models.CharField(max_length=15, choices=Deliverable.Frequency.choices, default='once')
    quantity = models.PositiveIntegerField(default=1)
    week_due = models.CharField(max_length=20, blank=True, help_text='e.g. "Week 1", "Week 2", "Ongoing"')
    sort_order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.template.name}: {self.title}"

    class Meta:
        ordering = ['sort_order']


# --- Monthly Performance Metrics ---

class MonthlyMetrics(models.Model):
    monthly_plan = models.OneToOneField(MonthlyPlan, on_delete=models.CASCADE, related_name='metrics')
    # GBP metrics
    gbp_views = models.IntegerField(null=True, blank=True)
    gbp_searches = models.IntegerField(null=True, blank=True)
    gbp_calls = models.IntegerField(null=True, blank=True)
    gbp_direction_requests = models.IntegerField(null=True, blank=True)
    gbp_website_clicks = models.IntegerField(null=True, blank=True)
    # GA4
    organic_sessions = models.IntegerField(null=True, blank=True)
    organic_conversions = models.IntegerField(null=True, blank=True)
    # Rankings
    keywords_top_3 = models.IntegerField(null=True, blank=True)
    keywords_top_10 = models.IntegerField(null=True, blank=True)
    keywords_local_pack = models.IntegerField(null=True, blank=True)
    # Reviews
    total_reviews = models.IntegerField(null=True, blank=True)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    # Authority
    new_backlinks = models.IntegerField(null=True, blank=True)
    domain_authority = models.IntegerField(null=True, blank=True)
    # Financials
    monthly_retainer = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    content_writer_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    tool_costs = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    link_building_spend = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    other_costs = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    @property
    def total_costs(self):
        costs = [self.content_writer_cost, self.tool_costs, self.link_building_spend, self.other_costs]
        return sum(c for c in costs if c is not None)

    @property
    def profit_margin(self):
        if self.monthly_retainer and self.total_costs:
            return self.monthly_retainer - self.total_costs
        return None

    def __str__(self):
        return f"Metrics: {self.monthly_plan}"

    class Meta:
        verbose_name_plural = 'Monthly metrics'
