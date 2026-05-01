"""Step 2 (reports side) of the Business/Project refactor.

Rename Report.project → Report.business; add new nullable Report.project
FK to clients.Project (engagement).
"""

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reports', '0005_rename_project_ga4metrics_business_and_more'),
        ('clients', '0022_retarget_project_side'),
    ]

    operations = [
        migrations.RenameField(
            model_name='report',
            old_name='project',
            new_name='business',
        ),
        migrations.AddField(
            model_name='report',
            name='project',
            field=models.ForeignKey(
                null=True, blank=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='reports',
                to='clients.project',
            ),
        ),
    ]
