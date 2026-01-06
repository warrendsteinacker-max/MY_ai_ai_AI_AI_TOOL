import asyncio
import os
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from playwright.async_api import async_playwright
from directory_manager import dm

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
app.mount("/screenshots", StaticFiles(directory="screenshots"), name="screenshots")

state = {
    "page": None,
    "events": [],
    "current_task": "College_Book",
    "current_subfolder": "Chapter_1",
    "is_training": True
}

@app.post("/config")
async def update_config(config: dict):
    state["current_task"] = config.get("task", "General")
    state["current_subfolder"] = config.get("folder", "Default")
    return {"status": "Config Updated"}

async def handle_event(data):
    # Determine the target folder in File Explorer
    target_path = dm.get_target_path(state["current_task"], state["current_subfolder"])
    timestamp = int(time.time() * 1000)
    img_name = f"cap_{timestamp}.png"
    
    # Save for both the AI dataset and the Vite preview
    full_path = f"{target_path}/{img_name}"
    await state["page"].screenshot(path=full_path)
    await state["page"].screenshot(path=f"screenshots/{img_name}")
    
    event_entry = {
        "id": timestamp,
        "type": data['type'],
        "selector": data.get('selector', 'window'),
        "value": data.get('value', ''), # For Keyboard inputs
        "path": full_path,
        "screenshot": img_name
    }
    state["events"].append(event_entry)

async def start_browser():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        state["page"] = await browser.new_page()
        
        # Injected Script: Monitors Clicks, Scrolls, AND Keyboard
        await state["page"].add_init_script("""
            window.addEventListener('click', (e) => {
                window.sendToPy({type: 'click', selector: e.target.tagName + (e.target.id ? '#'+e.target.id : '')});
            });
            window.addEventListener('input', (e) => {
                window.sendToPy({type: 'type', selector: e.target.tagName, value: e.target.value});
            });
            window.addEventListener('scroll', () => {
                window.sendToPy({type: 'scroll', y: window.scrollY});
            });
        """)
        
        await state["page"].expose_function("sendToPy", lambda d: asyncio.create_task(handle_event(d)))
        await state["page"].goto("https://google.com")
        await asyncio.Event().wait()

@app.on_event("startup")
async def startup():
    if not os.path.exists("screenshots"): os.makedirs("screenshots")
    asyncio.create_task(start_browser())