import os
import uuid
import shutil
from src.storage.supabase_storage import supabase_storage
from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
    status,
)
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.database import get_db
from src.documents.schema import (
    DocumentCreate,
    DocumentResponse,
    DocumentUpdate,
)
from src.documents.service import document_service
from src.users.dependencies import get_current_user
from src.users.model import User

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)

TEMP_DIR = "temp"

os.makedirs(TEMP_DIR, exist_ok=True)


@router.post(
    "/upload",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_document(
    project_id: uuid.UUID = Form(...),
    title: str = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    temp_path = os.path.join(
    TEMP_DIR,
    file.filename,
)

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer,
        )

    file_size = os.path.getsize(temp_path)
    extension = os.path.splitext(file.filename)[1]
    storage_name = f"{uuid.uuid4()}{extension}"

    public_url = supabase_storage.upload_file(
    temp_path,
    storage_name,
)
    document = await document_service.create_document(
        db=db,
        project_id=project_id,
        document_data=DocumentCreate(
            title=title,
        ),
        file_name=file.filename,
        file_path=public_url,
        temp_path=temp_path,
        file_type=file.content_type,
        file_size=file_size,
    )
    os.remove(temp_path)
    return document


@router.get(
    "/project/{project_id}",
    response_model=list[DocumentResponse],
)
async def get_project_documents(
    project_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return await document_service.get_documents(
        db,
        project_id,
    )


@router.get(
    "/{document_id}",
    response_model=DocumentResponse,
)
async def get_document(
    document_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):

    try:

        return await document_service.get_document(
            db,
            document_id,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.patch(
    "/{document_id}",
    response_model=DocumentResponse,
)
async def update_document(
    document_id: uuid.UUID,
    document_data: DocumentUpdate,
    db: AsyncSession = Depends(get_db),
):

    try:

        return await document_service.update_document(
            db,
            document_id,
            document_data,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.delete(
    "/{document_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_document(
    document_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):

    try:

        document = await document_service.get_document(
            db,
            document_id,
        )

        file_name = document.file_path.split("/")[-1]
        supabase_storage.delete_file(file_name)

        await document_service.delete_document(
            db,
            document_id,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )