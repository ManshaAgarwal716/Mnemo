import uuid
from datetime import datetime
from typing import List

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
)


class UserModel(BaseModel):
    uid: uuid.UUID
    username: str
    firstname: str
    lastname: str
    email: EmailStr
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


class UserCreate(BaseModel):
    username: str = Field(
        min_length=3,
        max_length=20,
        examples=["mansha"]
    )

    firstname: str = Field(
        min_length=1,
        max_length=50,
        examples=["Mansha"]
    )

    lastname: str = Field(
        min_length=1,
        max_length=50,
        examples=["Agarwal"]
    )

    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128,
        examples=["StrongPassword123"]
    )


class UserLogin(BaseModel):
    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128,
    )


class EmailModel(BaseModel):
    emails: List[EmailStr]


class MessageResponse(BaseModel):
    message: str


class SignupResponse(BaseModel):
    message: str
    user: UserModel


class LoginResponse(BaseModel):
    message: str
    access_token: str
    refresh_token: str
    user: UserModel


class RefreshTokenResponse(BaseModel):
    access_token: str