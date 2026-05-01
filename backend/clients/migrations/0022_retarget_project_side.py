"""Step 2 of the Business/Project refactor (DASHBOARD_REORG_PLAN.md §1).

Rename the `project` FK on ProjectService and QuarterlyPlan to `business`
(it currently points at clients.Business after step 1). Then add a new
nullable `project` FK pointing at the new clients.Project (engagement)
model. The new FK is populated in the data migration that follows.
"""

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clients', '0021_rename_project_businesscatalogitem_business'),
    ]

    operations = [
        # ProjectService: rename existing project FK → business, then add new project FK
        migrations.RenameField(
            model_name='projectservice',
            old_name='project',
            new_name='business',
        ),
        migrations.AddField(
            model_name='projectservice',
            name='project',
            field=models.ForeignKey(
                null=True, blank=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='services',
                help_text='The engagement (Project) this service belongs to. Null during migration; required after data backfill.',
                to='clients.project',
            ),
        ),

        # QuarterlyPlan: rename existing project FK → business
        migrations.AlterUniqueTogether(
            name='quarterlyplan',
            unique_together=set(),
        ),
        migrations.RenameField(
            model_name='quarterlyplan',
            old_name='project',
            new_name='business',
        ),
        migrations.AddField(
            model_name='quarterlyplan',
            name='project',
            field=models.ForeignKey(
                null=True, blank=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='quarterly_plans',
                to='clients.project',
            ),
        ),
        migrations.AlterUniqueTogether(
            name='quarterlyplan',
            unique_together={('business', 'quarter_start')},
        ),
    ]
