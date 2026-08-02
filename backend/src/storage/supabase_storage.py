from supabase import create_client

from src.core.config import settings


class SupabaseStorage:
    def __init__(self):
        self.client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_KEY,
        )

        self.bucket = settings.SUPABASE_BUCKET

    def upload_file(
    self,
    local_path: str,
    storage_name: str,
) -> str:

     with open(local_path, "rb") as f:
        try:
            result = self.client.storage.from_(self.bucket).upload(
                storage_name,
                f,
                {
                    "content-type": "application/pdf",
                    "upsert": True,
                },
            )
            print(result)

        except Exception as e:
            print("SUPABASE ERROR:", repr(e))
            raise

     return (
        self.client.storage
        .from_(self.bucket)
        .get_public_url(storage_name)
    )

    def delete_file(
        self,
        storage_name: str,
    ):

        self.client.storage.from_(self.bucket).remove(
            [storage_name]
        )


supabase_storage = SupabaseStorage()