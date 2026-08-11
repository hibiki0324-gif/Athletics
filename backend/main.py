from fastapi import FastAPI

app = FastAPI(title="Athletics API")


@app.get("/")
def read_root():
    return {"message": "Athletics API is running"}