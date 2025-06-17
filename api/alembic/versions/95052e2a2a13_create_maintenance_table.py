"""create maintenances table

Revision ID: 95052e2a2a13
Revises: 
Create Date: 2025-06-16 11:40:00.000000
"""

from alembic import op
import sqlalchemy as sa

revision = '95052e2a2a13'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        "maintenances",  # Changed to plural to match model
        sa.Column("maintenance_id", sa.Integer(), nullable=False),
        sa.Column("truck_id", sa.Integer(), sa.ForeignKey("trucks.id", ondelete="CASCADE"), nullable=False),
        sa.Column("maintenance_mileage", sa.Integer(), nullable=False),
        sa.Column("maintenance_description", sa.String(), nullable=True),
        sa.Column("maintenance_type", sa.String(), nullable=False),  # Fixed spacing
        sa.Column("maintenance_date", sa.DateTime(), nullable=False),
        sa.Column("maintenance_next_scheduled", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id")
    )

def downgrade():
    op.drop_table("maintenances")