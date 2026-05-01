import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    """Rename clients.Project model → clients.Business.

    Step 1 of the Business/Project refactor (DASHBOARD_REORG_PLAN.md §1).
    All FK references named 'project' on other models still point at the
    same table — Django updates them transparently because we use
    RenameModel rather than dropping/recreating.

    Subsequent migrations (Step 5) introduce a new Project model whose
    semantics are 'engagement under a Business' and retarget the
    project-side FKs (ProjectService, QuarterlyPlan, ProjectCost, Report)
    onto it.
    """

    dependencies = [
        ('clients', '0018_alter_clientprofile_options'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Project',
            new_name='Business',
        ),
        migrations.AlterModelOptions(
            name='business',
            options={
                'ordering': ['-created_at'],
                'verbose_name_plural': 'Businesses',
            },
        ),
        migrations.AlterField(
            model_name='business',
            name='client',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='businesses',
                to='clients.clientprofile',
            ),
        ),
    ]
