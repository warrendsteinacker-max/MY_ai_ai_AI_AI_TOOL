import express from 'express';
import cors from 'cors';
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { directoryManager } from './directoryManager.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/screenshots', express.static('screenshots'));

let state = {
    page: null,
    events: [],
    currentTask: "College_Book",
    currentSubfolder: "Chapter_1"
};

async function startBrowser() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    state.page = await context.newPage();

    // Inject JS to monitor interactions
    await state.page.addInitScript(() => {
        window.addEventListener('click', (e) => {
            window.sendToNode({ type: 'click', selector: e.target.tagName });
        });
    });

    await state.page.exposeFunction('sendToNode', (data) => handleEvent(data));
    await state.page.goto('https://google.com');
}

async function handleEvent(data) {
    const timestamp = Date.now();
    const targetDir = directoryManager.getTargetPath(state.currentTask, state.currentSubfolder);
    const imgName = `cap_${timestamp}.png`;

    await state.page.screenshot({ path: path.join(targetDir, imgName) });
    await state.page.screenshot({ path: path.join('screenshots', imgName) });

    state.events.push({ id: timestamp, ...data, screenshot: imgName });
}

app.get('/events', (req, res) => res.json(state.events));

app.listen(8000, () => {
    console.log("🚀 JS Backend running on http://localhost:8000");
    startBrowser();
});