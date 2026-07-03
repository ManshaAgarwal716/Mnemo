from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
class UserLogin(BaseModel):
    email: EmailStr
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