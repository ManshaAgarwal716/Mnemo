from uuid import UUID
from datetime import datetime
import re

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    field_validator
)


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        value = value.strip()

        if not re.fullmatch(r"[A-Za-z ]+", value):
            raise ValueError(
                "Name can only contain letters and spaces."
            )

        return value


class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleAuthRequest(BaseModel):
    token: str

class UserUpdate(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=100,
    )

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        value = value.strip()

        if not re.fullmatch(r"[A-Za-z ]+", value):
            raise ValueError(
                "Name can only contain letters and spaces."
            )

        return value


class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str = Field(
        min_length=6,
    )
class DeleteAccountRequest(BaseModel):
    password: str

class UserResponse(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    is_verified: bool
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


class TokenResponse(BaseModel):
    user: UserResponse
    token: str