import os
import uuid
import shutil

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

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


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

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename,
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer,
        )

    file_size = os.path.getsize(file_path)

    document = await document_service.create_document(
        db=db,
        project_id=project_id,
        document_data=DocumentCreate(
            title=title,
        ),
        file_name=file.filename,
        file_path=file_path,
        file_type=file.content_type,
        file_size=file_size,
    )

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

        if os.path.exists(document.file_path):
            os.remove(document.file_path)

        await document_service.delete_document(
            db,
            document_id,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )