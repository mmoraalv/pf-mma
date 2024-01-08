import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import { __dirname } from '../path.js';
import multer from 'multer';

//SWAGGER CONFIGURATION
const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Exactus Store - API Docs',
            description: 'Documentacion Oficial de Exactus Store',
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

export const specs = swaggerJsdoc(swaggerOptions)

//MULTER CONFIGURATION
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/documents');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/png', 'application/pdf', 'image/jpeg', 'image/jpg'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PNG, JPEG, JPG, and PDF files are allowed.'));
    }
};

export const upload = multer({ storage: storage, fileFilter: fileFilter });