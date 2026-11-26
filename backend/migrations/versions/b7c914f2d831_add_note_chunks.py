"""Add semantic chunks for notes.

Revision ID: b7c914f2d831
Revises: 70449e020b41
"""
from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector

revision = "b7c914f2d831"
down_revision = "70449e020b41"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("notes", sa.Column("indexed_at", sa.DateTime(), nullable=True))
    op.create_table(
        "note_chunks",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("note_id", sa.UUID(), sa.ForeignKey("notes.id", ondelete="CASCADE"), nullable=False),
        sa.Column("chunk_index", sa.Integer(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("embedding", Vector(3072), nullable=False),
    )
    op.create_index("ix_note_chunks_note_id", "note_chunks", ["note_id"])


def downgrade():
    op.drop_index("ix_note_chunks_note_id", table_name="note_chunks")
    op.drop_table("note_chunks")
    op.drop_column("notes", "indexed_at")
