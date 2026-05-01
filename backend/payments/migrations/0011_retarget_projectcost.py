"""Step 2 (payments side) of the Business/Project refactor.

Rename ProjectCost.project → ProjectCost.business; add new nullable
ProjectCost.project FK to clients.Project (engagement).
"""

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0010_alter_projectcost_project'),
        ('clients', '0022_retarget_project_side'),
    ]

    operations = [
        migrations.RenameField(
            model_name='projectcost',
            old_name='project',
            new_name='business',
        ),
        migrations.AddField(
            model_name='projectcost',
            name='project',
            field=models.ForeignKey(
                null=True, blank=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='costs',
                to='clients.project',
            ),
        ),
    ]
