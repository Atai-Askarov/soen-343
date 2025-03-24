"""empty message

Revision ID: 7694e956ec81
Revises: 
Create Date: 2025-03-24 06:39:03.182542

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '7694e956ec81'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_index('email')

    op.drop_table('user')
    with op.batch_alter_table('tickets', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_email', sa.String(length=100), nullable=True))
        batch_op.alter_column('userid',
               existing_type=mysql.INTEGER(display_width=11),
               nullable=True)
        batch_op.create_foreign_key(None, 'users', ['user_email'], ['email'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('tickets', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.alter_column('userid',
               existing_type=mysql.INTEGER(display_width=11),
               nullable=False)
        batch_op.drop_column('user_email')

    op.create_table('user',
    sa.Column('id', mysql.INTEGER(display_width=11), autoincrement=True, nullable=False),
    sa.Column('username', mysql.VARCHAR(length=50), nullable=False),
    sa.Column('email', mysql.VARCHAR(length=100), nullable=False),
    sa.Column('password', mysql.VARCHAR(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    mysql_default_charset='latin1',
    mysql_engine='InnoDB'
    )
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.create_index('email', ['email'], unique=True)

    # ### end Alembic commands ###
