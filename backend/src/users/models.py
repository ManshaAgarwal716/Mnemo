from sqlmodel import SQLModel, Field,Column,Relationship
import sqlalchemy.dialects.postgresql as pg
import uuid
from datetime import datetime

class User(SQLModel, table=True):
    __tablename__ = "users"
    uid: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        sa_column=Column("uid", primary_key=True, default=uuid.uuid4,sa_column=Column(pg.UUID(as_uuid=True)))
    )
    username: str = Field(index=True, unique=True)
    email: str = Field(index=True, unique=True)
    firstname:str
    lastname:str
    password_hash:str=Field(exclude=True)
    is_verified:bool=Field(default=False)
    created_at:datetime=Field(sa_column=Column(pg.TIMESTAMP,default=datetime.now))
    updated_at:datetime=Field(sa_column=Column(pg.TIMESTAMP,default=datetime.now))
    def __repr__(self) -> str:
        return f"User(uid={self.uid}, username={self.username}, email={self.email})"