from abc import ABC, abstractmethod


class AIProvider(ABC):

    @abstractmethod
    async def generate(
        self,
        history,
        prompt: str,
        context: str,
    ) -> str:
        pass

    @abstractmethod
    async def generate_title(
        self,
        first_message: str,
    ) -> str:
        pass