import Tesseract from 'tesseract.js';
import fs from 'fs';
import path from 'path';

async function aggregate(baseDir = 'book_data') {
    const outputFile = 'ai_knowledge_base.txt';
    let fullText = '';

    // Recursively find all PNGs in the book folders
    const getFiles = (dir) => {
        let results = [];
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat && stat.isDirectory()) results = results.concat(getFiles(filePath));
            else if (file.endsWith('.png')) results.push(filePath);
        });
        return results;
    };

    const images = getFiles(baseDir).sort();

    for (const img of images) {
        console.log(`📄 Reading: ${img}`);
        const { data: { text } } = await Tesseract.recognize(img, 'eng');
        fullText += `\n--- SOURCE: ${img} ---\n${text}\n`;
    }

    fs.writeFileSync(outputFile, fullText);
    console.log(`✅ Aggregation Complete! Data saved to ${outputFile}`);
}

aggregate();