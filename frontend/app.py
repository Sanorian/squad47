from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import aiofiles
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def index():
    async with aiofiles.open('index.html', mode='r') as f:
        contents = await f.read()
    return contents

@app.get("/main", response_class=HTMLResponse)
async def main():
    async with aiofiles.open('main.html', mode='r') as f:
        contents = await f.read()
    return contents
