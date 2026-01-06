import fs from 'fs';
import path from 'path';

export const directoryManager = {
    getTargetPath(task, subfolder) {
        const baseRoot = 'book_data';
        const targetPath = path.join(baseRoot, task, subfolder);
        if (!fs.existsSync(targetPath)) {
            fs.mkdirSync(targetPath, { recursive: true });
        }
        return targetPath;
    }
};