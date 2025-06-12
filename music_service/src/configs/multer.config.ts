import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { BadRequestException } from '@nestjs/common';
import { Options as MulterOptions } from 'multer';
// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

// Ensure upload directories exist
const uploadPaths = {
    tracks: join(process.cwd(), 'uploads', 'tracks'),
    covers: join(process.cwd(), 'uploads', 'covers')
};

Object.values(uploadPaths).forEach(path => {
    if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
    }
});

// Shared filename generation function
const generateFilename = (file: Express.Multer.File): string => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = extname(file.originalname);
    return `${uniqueSuffix}${ext}`;
};

// Separate configs for audio and cover files
const audioConfig: MulterOptions = {
    storage: diskStorage({
        destination: uploadPaths.tracks,
        filename: (req, file, cb) => {
            cb(null, generateFilename(file));
        }
    }),
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(mp3|wav|flac)$/)) {
            cb(null, false);
        } else {
            cb(null, true);
        }
    },
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB
    }
};

const coverConfig: MulterOptions = {
    storage: diskStorage({
        destination: uploadPaths.covers,
        filename: (req, file, cb) => {
            cb(null, generateFilename(file));
        }
    }),
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
            cb(null, false);
        } else {
            cb(null, true);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
};

// Export the config based on field name
export const multerConfig = (fieldName: string): MulterOptions => {
    switch (fieldName) {
        case 'audio':
            return audioConfig;
        case 'cover':
            return coverConfig;
        default:
            throw new BadRequestException(`Invalid field name: ${fieldName}`);
    }
};