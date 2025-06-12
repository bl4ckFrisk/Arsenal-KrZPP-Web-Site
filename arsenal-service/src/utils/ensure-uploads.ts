import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Logger } from '@nestjs/common';

const logger = new Logger('EnsureUploads');

export const ensureUploadDirectories = () => {
    const uploadPaths = {
        tracks: join(process.cwd(), 'uploads', 'tracks'),
        covers: join(process.cwd(), 'uploads', 'covers'),
        photos: join(process.cwd(), 'uploads', 'photos'),
        docs: join(process.cwd(), 'uploads', 'docs')
    };

    Object.entries(uploadPaths).forEach(([type, path]) => {
        if (!existsSync(path)) {
            logger.log(`Creating ${type} directory at ${path}`);
            mkdirSync(path, { recursive: true });
        } else {
            logger.log(`${type} directory exists at ${path}`);
        }
    });

    return uploadPaths;
}; 