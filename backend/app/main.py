from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Mnemo API Running"}