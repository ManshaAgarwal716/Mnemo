from fastapi import FastAPI
from contextlib import asynccontextmanager
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up the application...")
    yield
    print("Shutting down the application...")
app=FastAPI()

