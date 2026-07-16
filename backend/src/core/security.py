from datetime import datetime, timedelta, timezone
from typing import Any
import uuid

from jose import JWTError, jwt
from passlib.context import CryptContext

from src.core.config import settings

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    return pwd_context.verify(
        plain_password,
        hashed_password,
    )


def create_access_token(
    data: dict[str, Any],
    expires_delta: timedelta | None = None,
) -> str:

    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + (
        expires_delta
        or timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    to_encode.update(
        {
            "exp": expire,
            "jti": str(uuid.uuid4()),
        }
    )

    return jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )


def decode_access_token(
    token: str,
) -> dict | None:

    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[
                settings.JWT_ALGORITHM,
            ],
        )

        return payload

    except JWTError:
        return None


def get_token_remaining_seconds(
    payload: dict,
) -> int:

    exp = payload.get("exp")

    if exp is None:
        return 0

    if isinstance(exp, datetime):
        expire_time = exp
    else:
        expire_time = datetime.fromtimestamp(
            exp,
            tz=timezone.utc,
        )

    remaining = (
        expire_time
        - datetime.now(timezone.utc)
    ).total_seconds()

    return max(
        int(remaining),
        0,
    )