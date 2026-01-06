import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getAiPrediction(screenshotPath, userGoal, taskCategory) {
    // Convert image to base64 for the AI to "see"
    const imageBase64 = fs.readFileSync(screenshotPath, { encoding: 'base64' });

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: `You are an expert Automation Agent. 
                Output ONLY valid JavaScript Playwright code. 
                If the task is 'College_Book', ensure you scroll if text is cut off.
                When finished, include the string 'TASK_COMPLETE'.`
            },
            {
                role: "user",
                content: [
                    { type: "text", text: `Task: ${taskCategory}\nGoal: ${userGoal}` },
                    {
                        type: "image_url",
                        image_url: { url: `data:image/png;base64,${imageBase64}` }
                    }
                ]
            }
        ]
    });

    return response.choices[0].message.content;
}