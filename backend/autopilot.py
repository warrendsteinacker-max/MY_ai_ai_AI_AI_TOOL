import asyncio
import time
from predict import get_ai_prediction
from main import state

async def run_autopilot(user_goal):
    page = state["page"]
    task_cat = state["current_task"]
    
    for step in range(15): # Max steps
        # 1. Capture current visual
        shot_path = f"screenshots/auto_{int(time.time())}.png"
        await page.screenshot(path=shot_path)
        
        # 2. AI decides next step based on screenshots and goal
        code = await get_ai_prediction(shot_path, user_goal, task_cat)
        
        if "DONE" in code.upper():
            break
            
        # 3. Execute Keyboard or Mouse commands
        try:
            exec_globals = {"page": page, "asyncio": asyncio}
            clean_code = code.replace("```python", "").replace("```", "").strip()
            exec(f"async def action():\n    {clean_code}", exec_globals)
            await exec_globals["action"]()
            await asyncio.sleep(2) # Let page settle
        except Exception as e:
            print(f"Error: {e}")
            break