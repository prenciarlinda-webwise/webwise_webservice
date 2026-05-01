"""Step 3 (data) of the Business/Project refactor.

For every existing Business, create one engagement-Project with kind='local_seo',
slug='local-seo', status='active'. Backfill the new project FK on
ProjectService, QuarterlyPlan, ProjectCost, and Report from each row's
existing business FK so post-migration code can rely on project.business
without manual cleanup.

This migration is idempotent — get_or_create on (business, slug=local-seo).
"""

from django.db import migrations


def seed_local_seo_projects(apps, schema_editor):
    Business = apps.get_model('clients', 'Business')
    Project = apps.get_model('clients', 'Project')
    ProjectService = apps.get_model('clients', 'ProjectService')
    QuarterlyPlan = apps.get_model('clients', 'QuarterlyPlan')
    ProjectCost = apps.get_model('payments', 'ProjectCost')
    Report = apps.get_model('reports', 'Report')

    for biz in Business.objects.all():
        proj, _ = Project.objects.get_or_create(
            business=biz,
            slug='local-seo',
            defaults={
                'kind': 'local_seo',
                'status': 'active',
                'start_date': biz.contract_start_date,
                'end_date': biz.contract_end_date,
                'monthly_budget_usd': biz.monthly_budget_usd,
                'notes': '',
            },
        )
        ProjectService.objects.filter(business=biz, project__isnull=True).update(project=proj)
        QuarterlyPlan.objects.filter(business=biz, project__isnull=True).update(project=proj)
        ProjectCost.objects.filter(business=biz, project__isnull=True).update(project=proj)
        Report.objects.filter(business=biz, project__isnull=True).update(project=proj)


def remove_local_seo_projects(apps, schema_editor):
    Project = apps.get_model('clients', 'Project')
    Project.objects.filter(slug='local-seo', kind='local_seo').delete()


class Migration(migrations.Migration):

    dependencies = [
        ('clients', '0022_retarget_project_side'),
        ('payments', '0011_retarget_projectcost'),
        ('reports', '0006_retarget_report'),
    ]

    operations = [
        migrations.RunPython(seed_local_seo_projects, remove_local_seo_projects),
    ]
