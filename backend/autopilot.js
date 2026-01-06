import { getAiPrediction } from './predict.js';
import fs from 'fs';
import path from 'path';

export async function runAutopilot(page, userGoal, taskCategory) {
    console.log(`🚀 Starting Auto-Pilot: ${taskCategory}`);
    
    for (let step = 0; step < 15; step++) {
        const timestamp = Date.now();
        const shotPath = path.join('screenshots', `auto_${timestamp}.png`);
        
        // 1. Capture current visual
        await page.screenshot({ path: shotPath });
        
        // 2. Get AI suggestion
        const suggestion = await getAiPrediction(shotPath, userGoal, taskCategory);
        console.log(`🤖 AI Suggestion: ${suggestion}`);

        if (suggestion.includes('TASK_COMPLETE')) break;

        // 3. Execute the code string
        try {
            const cleanCode = suggestion.replace(/```javascript|```js|```/g, '').trim();
            // Using an AsyncFunction constructor to execute the string safely
            const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
            const executeAction = new AsyncFunction('page', cleanCode);
            await executeAction(page);
            
            // Wait for page to settle
            await new Promise(r => setTimeout(r, 2000));
        } catch (err) {
            console.error("❌ Execution Error:", err);
            break;
        }
    }
}