import base64
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

async def get_ai_prediction(screenshot_path, user_goal, task_category):
    base64_image = encode_image(screenshot_path)

    # Specialized prompt for Document Scraping vs General Tasks
    system_instruction = (
        "You are an expert Automation Agent. Your goal is 100% completion.\n"
        "If the task is 'College_Book', look for text continuity. If the page is not "
        "at the bottom, generate code to scroll down: 'await page.mouse.wheel(0, 800)'.\n"
        "If you see the 'Next Page' button and the current page is finished, click it.\n"
        "Output ONLY the Python Playwright code."
    )

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_instruction},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": f"Current Task: {task_category}\nGoal: {user_goal}"},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/png;base64,{base64_image}"}
                    }
                ]
            }
        ]
    )
    
    return response.choices[0].message.content