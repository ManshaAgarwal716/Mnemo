from src.core.redis import redis_client


class TokenBlocklist:

    async def block_token(
        self,
        jti: str,
        expires_in: int,
    ) -> None:

        await redis_client.setex(
            f"blocklist:{jti}",
            expires_in,
            "revoked",
        )

    async def is_token_blocked(
        self,
        jti: str,
    ) -> bool:

        return (
            await redis_client.exists(
                f"blocklist:{jti}"
            )
            == 1
        )


token_blocklist = TokenBlocklist()