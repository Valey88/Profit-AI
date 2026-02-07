"""Sync schemas

Revision ID: d322ae002351
Revises: d24f93f3beaa
Create Date: 2026-02-05 20:04:47.225652

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd322ae002351'
down_revision: Union[str, Sequence[str], None] = 'd24f93f3beaa'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
